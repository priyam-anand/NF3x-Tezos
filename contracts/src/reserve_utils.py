import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class ReserveUtils(sp.Contract):
    def __init__(self, _admin):
        self.structures = structures()
        self.init(
            itemStorage = NULL_ADDRESS,
            vault = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            reserve = NULL_ADDRESS, 
            admin = _admin
        )

    # Access Setter Functions
    def _onlyAdmin(self):
        sp.verify(self.data.admin == sp.sender,"Reserve Utils : Only Admin")

    @sp.entry_point
    def setReserve(self, _reserve):
        self._onlyAdmin()
        sp.set_type(_reserve, sp.TAddress)
        self.data.reserve = _reserve

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        self._onlyAdmin()
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage

    @sp.entry_point
    def setVault(self, _vault):
        self._onlyAdmin()
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault
        
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        self._onlyAdmin()
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage
    
    @sp.entry_point
    def setAdmin(self, _admin):
        sp.set_type(_admin, sp.TAddress)
        self._onlyAdmin()
        self.data.admin = _admin

    # Utility functions
    def _onlyReserve(self):
        sp.verify(self.data.reserve == sp.sender, "Reserve : Reserve only")

    def _notItemOwner(self,params):
        sp.set_type(params, sp.TRecord(add1 = sp.TAddress, add2 = sp.TAddress))
        sp.verify(~(params.add1 == params.add2),"Reserve : Not Item Owner")

    def _checkPayment(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TMap(sp.TNat, sp.TAddress), 
            amount = sp.TMap(sp.TNat,sp.TNat),
            _value = sp.TMutez  
        ))
        total = sp.local('total',sp.nat(0))
        sp.for i in params.token.keys():
            sp.if params.token[i] == NULL_ADDRESS:
                total.value += params.amount[i]
        sp.verify(total.value <= sp.utils.mutez_to_nat(params._value), "Reserve : Insufficient Funds")

    def _itemReset(self, params):
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            owner = sp.TAddress
        ))
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(
            sp.record(tokens=params.tokens, tokenIds=params.tokenIds),
            sp.mutez(0),
            c1
        )
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=params.tokens, tokenIds=params.tokenIds, owner = params.owner),sp.mutez(0),c2)


    def _receiveNFTs(self, params):
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress), 
            tokenIds = sp.TMap(sp.TNat, sp.TNat)
        )) 
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, from_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'recieveFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(params.tokens)):
            sp.transfer(
                sp.record(token = params.tokens[i], from_ = sp.source, tokenId = params.tokenIds[i]),
                sp.mutez(0),
                c
            )
        self._itemReset(sp.record(
            tokens = params.tokens, 
            tokenIds = params.tokenIds, 
            owner = sp.source
        
        ))
        c = sp.contract(
                sp.TRecord(
                    tokens = sp.TMap(sp.TNat, sp.TAddress),
                    tokenIds = sp.TMap(sp.TNat, sp.TNat),
                    status = sp.TNat
                ),
                self.data.itemStorage,
                entry_point = 'setItemStatus'
        ).open_some()
        sp.transfer(sp.record(
            tokens = params.tokens, 
            tokenIds = params.tokenIds, 
            status = 2
        ), sp.mutez(0), c)


    def _sendNFTs(self, params):
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            to = sp.TAddress
        ))
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(params.tokens)):
            sp.transfer(
                sp.record(token = params.tokens[i], to_ = params.to, tokenId = params.tokenIds[i]),
                sp.mutez(0),
                c
            )
        self._itemReset(sp.record(
            tokens = params.tokens,    
            tokenIds = params.tokenIds, 
            owner = NULL_ADDRESS
        ))

    def _receiveFTs(self, params):
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            amounts = sp.TMap(sp.TNat, sp.TNat)
        )) 
        c1 = sp.contract(
                sp.TRecord(token = sp.TAddress, _from= sp.TAddress, amount = sp.TNat),
                self.data.vault,
                entry_point = 'recieveFA12'
        ).open_some()
        sp.for i in params.tokens.keys():
            sp.if ~(params.tokens[i] == NULL_ADDRESS) : 
                sp.transfer(
                    sp.record(token = params.tokens[i], _from = sp.source, amount = params.amounts[i]),
                    sp.mutez(0),
                    c1
                )

    def _sendTez(self, params):
        sp.set_type(params, sp.TRecord(
            amount = sp.TNat,
            to = sp.TAddress
        ))
        c = sp.contract(
            sp.TRecord(to = sp.TAddress, amount = sp.TMutez),
            self.data.vault,
            entry_point = 'sendTez'
        ).open_some()
        sp.transfer(
            sp.record(to = params.to, amount = sp.utils.nat_to_mutez(params.amount)),
            sp.mutez(0),
            c
        )

    def _sendFTs(self, params): 
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            amounts = sp.TMap(sp.TNat, sp.TNat),
            to_ = sp.TAddress
        ))
        c2 = sp.contract(
                sp.TRecord(token = sp.TAddress, to=sp.TAddress, amount = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA12'
        ).open_some()
        sp.for i in params.tokens.keys():
            sp.if ~(params.tokens[i] == NULL_ADDRESS) :
                sp.transfer(
                    sp.record(token = params.tokens[i], to = params.to_, amount = params.amounts[i]),
                    sp.mutez(0),
                    c2
                )
            sp.else : 
                self._sendTez(sp.record(
                    amount = params.amounts[i], 
                    to = params.to_
                ))

    def _assetSupported(self, offerAssets):
        sp.for i in offerAssets.tokens.keys():
            sp.verify(sp.view(
                'isNFTSupported',
                self.data.detailStorage,
                offerAssets.tokens[i],
                t = sp.TBool
            ).open_some(),"Reserve : Not Supported")
        sp.for i in offerAssets.paymentTokens.keys():
            sp.verify(sp.view(
                'isFTSupported',
                self.data.detailStorage,
                offerAssets.paymentTokens[i],
                t = sp.TBool
            ).open_some(),"Reserve : Not Supported")

    def _checkEmptyAssets(self, offerAssets):
        sp.verify((sp.len(offerAssets.tokens.keys()) > 0) | (sp.len(offerAssets.paymentTokens.keys()) > 0), "Reserve : Empty Asset")
        sp.if sp.len(offerAssets.tokens.keys()) == 0:
            ttl = sp.local('value', sp.nat(0))
            sp.for i in offerAssets.paymentTokens.keys():
                ttl.value += offerAssets.amounts[i]
            sp.verify(ttl.value > 0, "Reserve : Empty Asset")

    # Core Function
    @sp.entry_point
    def itemReset(self, params):
        self._onlyReserve()
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            owner = sp.TAddress
        ))
        self._itemReset(params)

    @sp.entry_point()
    def transferAssets(self, params):
        self._onlyReserve()
        sp.set_type(params, sp.TRecord(paymentToken = sp.TAddress, amount = sp.TNat, to = sp.TAddress))
        sp.if ~(params.paymentToken == NULL_ADDRESS):
            self._receiveFTs(sp.record(
                tokens = sp.map({0:params.paymentToken}), 
                amounts = sp.map({0:params.amount})
            ))
        self._sendFTs(sp.record(
            tokens = sp.map({0:params.paymentToken}), 
            amounts = sp.map({0:params.amount}),
            to_ = params.to
        ))

    @sp.entry_point()
    def receiveAssets(self, offerAssets):
        self._onlyReserve()
        self._receiveNFTs(sp.record(
            tokens = offerAssets.tokens,
            tokenIds = offerAssets.tokenIds
        ))
        self._receiveFTs(sp.record(
            tokens = offerAssets.paymentTokens, 
            amounts = offerAssets.amounts
        ))

    @sp.entry_point()
    def sendAssets(self, offerAssets, to):
        self._onlyReserve()
        self._sendNFTs(sp.record(
            tokens = offerAssets.tokens, 
            tokenIds = offerAssets.tokenIds,
            to = to
        ))
        self._sendFTs(sp.record(
            tokens = offerAssets.paymentTokens, 
            amounts = offerAssets.amounts, 
            to_ = to
        ))

    # Views
    @sp.onchain_view()
    def checkReserveOfferRequirements(self, params):
        sp.set_type(params, sp.TRecord(
            item = self.structures.getItemType(), timePeriod = sp.TInt,
            deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, value = sp.TMutez
        ))
        self._notItemOwner(sp.record(add1 = sp.source,add2 = params.item.owner))
        sp.verify(params.timePeriod > 0,"Reserve : Invalid Time Period")
        self._assetSupported(params.deposit)
        self._assetSupported(params.remaining)

        self._checkEmptyAssets(params.deposit)
        self._checkEmptyAssets(params.remaining)

        sp.verify(params.duration > 0,"Reserve : Invalid Params")

        self._checkPayment(sp.record(
            token = params.deposit.paymentTokens, 
            amount = params.deposit.amounts, 
            _value = params.value
        ))
        sp.result(True)

    @sp.onchain_view()
    def checkPayment(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TMap(sp.TNat, sp.TAddress), 
            amount = sp.TMap(sp.TNat,sp.TNat),
            _value = sp.TMutez  
        ))
        self._checkPayment(params)
        sp.result(True)

