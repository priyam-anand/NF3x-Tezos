import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Swap(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            market = NULL_ADDRESS,
            itemStorage = NULL_ADDRESS,
            vault = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS
        )

    # Access Setter functions
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage
    
    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        self.data.market = _market
    
    @sp.entry_point
    def setVault(self, _vault):
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault


    # Utility funcstion
    def _onlyMarket(self):
        sp.verify(self.data.market == sp.sender,"Swap : Only Approved Contract")

    def _itemNotExpired(self, timePeriod):
        sp.verify(sp.now < timePeriod, "Swap : Item Expired")

    def _notItemOwner(self, add1, add2):
        sp.verify(~(add1 == add2),"Swap : Not Item Owner")

    def _checkPayment(self, token, amount, _value):
        total = sp.local('total',sp.nat(0))
        sp.for i in token.keys():
            sp.if token[i] == NULL_ADDRESS:
                total.value += amount[i]
        sp.verify(total.value <= sp.utils.mutez_to_nat(_value),"Swap : Insufficient Funds")

    def _transferAssets(self, payment_token, amount, to):
        sp.if payment_token == NULL_ADDRESS:
            c = sp.contract(
                sp.TRecord(to = sp.TAddress, amount = sp.TMutez),
                self.data.vault,
                entry_point = 'sendTez'
            ).open_some()
            sp.transfer(
                sp.record(to = to, amount = sp.utils.nat_to_mutez(amount)),
                sp.mutez(0),
                c
            )
        sp.else :
            c1 = sp.contract(
                sp.TRecord(token = sp.TAddress, _from= sp.TAddress, amount = sp.TNat),
                self.data.vault,
                entry_point = 'recieveFA12'
            ).open_some()
            sp.transfer(
                sp.record(token = payment_token, _from = sp.source, amount = amount),
                sp.mutez(0),
                c1
            )
            c2 = sp.contract(
                sp.TRecord(token = sp.TAddress, to=sp.TAddress, amount = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA12'
            ).open_some()
            sp.transfer(
                sp.record(token = payment_token, to = to, amount = amount),
                sp.mutez(0),
                c2
            )

    def _sendFA2(self, token, tokenId):
        c = sp.contract(
            sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat),
            self.data.vault,
            entry_point = 'sendFA2'
        ).open_some()
        sp.transfer(
            sp.record(token = token, to_ = sp.source, tokenId = tokenId),
            sp.mutez(0),
            c
        )

    def _postSaleReset(self, tokens, tokenIds):
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(
            sp.record(tokens=tokens, tokenIds=tokenIds),
            sp.mutez(0),
            c1
        )
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds, owner = NULL_ADDRESS),sp.mutez(0),c2)

    def _setRejectedOffers(self, tokens, tokenIds):
        c = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.detailStorage,
            entry_point = 'setRejectedOffers',
        ).open_some()
        sp.transfer(
            sp.record(tokens = tokens, tokenIds = tokenIds),
            sp.mutez(0),
            c
        )

    # Core functions
    @sp.entry_point
    def directSwap(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            value = sp.TMutez
        ))

        item = sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some()

        sp.verify(item.status == 1,"Swap : Invalid Status")
        self._itemNotExpired(item.listing.timePeriod)
        self._notItemOwner(item.owner, sp.source)

        sp.verify(item.listing.listingType[0] == True,"Swap : Item Now listed for Direct Swap")

        self._checkPayment(
            sp.map({0:item.listing.directListing.paymentToken}),
            sp.map({0:item.listing.directListing.amount}),
            params.value
        )
        self._transferAssets(
            item.listing.directListing.paymentToken,
            item.listing.directListing.amount,
            item.owner
        )
        self._setRejectedOffers(
            sp.map({0:params.token}),
            sp.map({0:params.tokenId})
        )

        self._sendFA2(params.token, params.tokenId)
        self._postSaleReset(sp.map({0:params.token}) ,sp.map({0:params.tokenId}))

