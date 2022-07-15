import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Listing(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            itemStorage = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            market = NULL_ADDRESS,
            vault = NULL_ADDRESS
        )

    # Access setter functions
    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage
    
    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        self.data.market = _market
    
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage
    
    @sp.entry_point
    def setVault(self, _vault):
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault
    

    # Utility functions
    def _onlyMarket(self):
        sp.verify(self.data.market == sp.sender,"Listing : Only Approved Contract")

    def _itemOwnerOnly(self, add1, add2):
        sp.verify(add1 == add2, "Listing : Item owner only")

    def _checkFees(self, value):
        fees = sp.view(
            'getPlatformFee',
            self.data.detailStorage,
            sp.unit,
            t = sp.TNat
        ).open_some()
        sp.verify(sp.utils.mutez_to_nat(value) >= fees, "Listing : Insufficient Funds")

    def _receiveNFTs(self, tokens, tokenIds):
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, from_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'recieveFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(tokens)):
            sp.transfer(
                sp.record(token = tokens[i], from_ = sp.source, tokenId = tokenIds[i]),
                sp.mutez(0),
                c
            )
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds),sp.mutez(0),c1)
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds, owner = sp.source),sp.mutez(0),c2)

    def _sendNFTs(self, tokens, tokenIds):
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(tokens)):
            sp.transfer(
                sp.record(token = tokens[i], to_ = sp.source, tokenId = tokenIds[i]),
                sp.mutez(0),
                c
            )
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds),sp.mutez(0),c1)
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds, owner = NULL_ADDRESS),sp.mutez(0),c2)

    def _listDirectSwap(self, token, tokenId, directSwapToken, directSwapPrice):
        sp.verify(sp.view("isFTSupported", self.data.detailStorage, directSwapToken, t = sp.TBool).open_some(), "Listing : Not supported")
        sp.verify(directSwapPrice > 0,"Listing : Invalid Price")

        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, directSwapToken = sp.TAddress, directSwapAmount = sp.TNat),
            self.data.itemStorage,
            entry_point = 'directListing'
        ).open_some()
        sp.transfer(sp.record(token = token, tokenId = tokenId, directSwapToken = directSwapToken, directSwapAmount = directSwapPrice), sp.mutez(0), c)

    def _performListing(self, token, tokenId, directSwapToken, directSwapPrice, timePeriod):
        sp.verify(directSwapToken.contains(0), "Listing : Invalid Listing")
        
        sp.if directSwapToken.contains(0):
            self._listDirectSwap(token, tokenId, directSwapToken[0], directSwapPrice[0])

        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, timePeriod = sp.TInt),
            self.data.itemStorage,
            entry_point = 'markListed'
        ).open_some()
        sp.transfer(
            sp.record(token = token, tokenId = tokenId, timePeriod = timePeriod),
            sp.mutez(0),
            c
        )

    # Core functions
    @sp.entry_point
    def createListing(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,
            tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat,sp.TAddress),
            directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
            timePeriod = sp.TInt,
            value = sp.TMutez
        ))
        self._onlyMarket()
        self._checkFees(params.value)

        sp.verify(sp.view(
            'checkListingRequirements',
            self.data.detailStorage,
            sp.record(tokens = sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) , tokenIds = sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat), timePeriod = params.timePeriod, edit = False),
            t = sp.TBool
        ).open_some())
        self._receiveNFTs(sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) ,sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat))
        self._performListing(
            params.token, 
            params.tokenId, 
            params.directSwapToken, 
            params.directSwapPrice, 
            params.timePeriod
        )
    

    @sp.entry_point
    def editListing(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat, sp.TAddress), directSwapPrice = sp.TMap(sp.TNat, sp.TNat),
            timePeriod = sp.TInt
        ))
        self._onlyMarket()

        item = sp.view(
                'getItemByAddress',
                self.data.itemStorage,
                sp.record(token = params.token, tokenId = params.tokenId),
                t = self.structures.getItemType()
            ).open_some()
        sp.verify(item.status == 1,"Listing : Invalid Status")
        self._itemOwnerOnly(item.owner, sp.source)

        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(sp.record(tokens=sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress), tokenIds=sp.map({0:params.tokenId},tkey = sp.TNat, tvalue = sp.TNat)),sp.mutez(0),c1)

        sp.verify(sp.view(
            'checkListingRequirements',
            self.data.detailStorage,
            sp.record(tokens = sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) , tokenIds = sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat), timePeriod = params.timePeriod, edit = True),
            t = sp.TBool
        ).open_some())

        self._performListing(
            params.token, 
            params.tokenId, 
            params.directSwapToken, 
            params.directSwapPrice, 
            params.timePeriod
        )

    @sp.entry_point
    def cancelListing(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,tokenId = sp.TNat
        ))
        item = sp.view(
            'getItemByAddress',
            self.data.itemStorage,
            sp.record(token = params.token, tokenId = params.tokenId),
            t = self.structures.getItemType()
        ).open_some()
        sp.verify(item.status == 1,"Listing : Invalid Status")
        self._itemOwnerOnly(item.owner, sp.source)

        c = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.detailStorage,
            entry_point = 'setRejectedOffers',
        ).open_some()
        sp.transfer(
            sp.record(tokens = sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress), tokenIds = sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat)),
            sp.mutez(0),
            c
        )
        
        self._sendNFTs(sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) ,sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat))

