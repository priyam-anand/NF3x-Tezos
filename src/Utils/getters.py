import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

structs = structures()

class Getters(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            whitelist = NULL_ADDRESS,
            itemStorage = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            offerStorage = NULL_ADDRESS,
        )

    @sp.entry_point
    def setOfferStorage(self, _offerStorage):
        self.data.offerStorage = _offerStorage

    @sp.entry_point
    def setWhitelist(self, _whitelist):
        sp.set_type(_whitelist, sp.TAddress)
        self.data.whitelist = _whitelist

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage
    
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage

    @sp.private_lambda(with_storage = 'read-only')
    def _getNFTs(self, params):
        sp.set_type(params, sp.TUnit)
        sp.result(
            sp.view(
                'getSupportedTokens',
                self.data.detailStorage,
                sp.unit,
                t = sp.TList(sp.TAddress)
            ).open_some()
        )

    @sp.private_lambda(with_storage = 'read-only')
    def _getItems(self, token):
        sp.set_type(token, sp.TAddress)
        sp.result(sp.view(
                'getItems',
                self.data.itemStorage,
                token,
                t = sp.TMap(sp.TNat, self.structures.getItemType())
            ).open_some()
        )

    @sp.utils.view(sp.TList(sp.TAddress))
    def getSupportedNFTs(self, params):
        sp.set_type(params, sp.TUnit)
        sp.result(self._getNFTs())

    @sp.utils.view(sp.TList(sp.TAddress))
    def getSupportedFTs(self,params):
        sp.set_type(params, sp.TUnit)
        sp.result(
            sp.view(
                'getPaymentTokens',
                self.data.detailStorage,
                sp.unit,
                t = sp.TList(sp.TAddress)
            ).open_some()
        )

    @sp.utils.view(structs.getItemType())
    def getItem(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat
        ))
        sp.result(sp.view(
            'getItemByAddress',
            self.data.itemStorage,
            params,
            t = self.structures.getItemType()
        ).open_some())


    @sp.utils.view(sp.TList(structs.getItemType()))
    def getListedItems(self, params):
        sp.set_type(params, sp.TUnit)
        whitelisted = sp.local('whitelisted',self._getNFTs())
        ans = sp.local('ans', sp.list([],t = self.structures.getItemType()))
        
        sp.for addr in whitelisted.value:
            items_ = self._getItems(addr)
            sp.for i in items_.keys():
                sp.if items_[i].status == 1:
                    ans.value.push(items_[i])
        sp.result(ans.value)

    @sp.utils.view(sp.TList(structs.getItemType()))
    def getMyListedItems(self, params):
        sp.set_type(params, sp.TUnit)
        whitelisted = sp.local('whitelisted',self._getNFTs())
        ans = sp.local('ans', sp.list([],t = self.structures.getItemType()))
        
        sp.for addr in whitelisted.value:
            items_ = self._getItems(addr)
            sp.for i in items_.keys():
                sp.if (items_[i].status == 1) & (items_[i].owner == sp.sender):
                    ans.value.push(items_[i])
        sp.result(ans.value)

    @sp.utils.view(sp.TList(structs.getItemType()))
    def getReservedItems(self, params):
        sp.set_type(params, sp.TUnit)
        whitelisted = sp.local('whitelisted',self._getNFTs())
        ans = sp.local('ans', sp.list([],t = self.structures.getItemType()))
        
        sp.for addr in whitelisted.value:
            items_ = self._getItems(addr)
            sp.for i in items_.keys():
                sp.if (items_[i].status == 3):
                    ans.value.push(items_[i])
        sp.result(ans.value)
    
    @sp.utils.view(structs.getOfferType())
    def getActiveOffers(self, params):
        sp.set_type(params, sp.TRecord(token = sp.TAddress, tokenId = sp.TNat))
        sp.result(sp.view(
            'getOffers',
            self.data.offerStorage,
            params,
            t = self.structures.getOfferType()
        ).open_some())

    @sp.utils.view(sp.TMap(sp.TNat, structs.getSwapOfferType()))
    def getRejectedSwapOffers(self, params):
        sp.set_type(params, sp.TUnit)
        sp.result(sp.view(
            'getRejectedSwapOffers',
            self.data.detailStorage,
            sp.sender,
            t = sp.TMap(sp.TNat, self.structures.getSwapOfferType())
        ).open_some())

    @sp.utils.view(sp.TMap(sp.TNat, structs.getReserveOfferType()))
    def getRejectedReserveOffers(self, params):
        sp.set_type(params, sp.TUnit)
        sp.result(sp.view(
            'getRejectedReserveOffers',
            self.data.detailStorage,
            sp.sender,
            t = sp.TMap(sp.TNat, self.structures.getReserveOfferType())
        ).open_some())

