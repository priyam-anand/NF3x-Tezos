import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class ItemStorage(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            detailStorage = NULL_ADDRESS,
            listing = NULL_ADDRESS,
            _items = sp.big_map(tkey = sp.TAddress,
                tvalue = sp.TMap(
                    sp.TNat,self.structures.getItemType()
                )
            )            
        )
    
    # Access setter
    @sp.entry_point
    def setListing(self, _listing):
        sp.set_type(_listing, sp.TAddress)
        self.data.listing = _listing

    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage


    # INTERNAL FUNCTIONS
    def _onlyApproved(self):
        ok = (self.data.detailStorage == sp.sender) | (self.data.listing == sp.sender)
        sp.verify(ok, "ItemStorage : Only Approved Contract")

    def _resetItem(self, token, tokenId):
        sp.if self.data._items.contains(token) & self.data._items[token].contains(tokenId):
            self.data._items[token][tokenId].status = 0
            self.data._items[token][tokenId].listing = self.structures.getDefaultListing()
        sp.else:
            sp.if ~self.data._items.contains(token):
                self.data._items[token] = sp.map({}, tkey = sp.TNat, tvalue = self.structures.getItemType())
            self.data._items[token][tokenId] = self.structures.getDefaultItem()
            self.data._items[token][tokenId].token = token
            self.data._items[token][tokenId].tokenId = tokenId    


    # CORE FUNCTIONS
    @sp.entry_point
    def setItemOwners(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            owner = sp.TAddress
        ))
        sp.for i in params.tokens.keys() :
            self.data._items[params.tokens[i]][params.tokenIds[i]].owner = params.owner

    
    @sp.entry_point
    def resetItems(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat)
        ))
        sp.for i in params.tokens.keys() :
            self._resetItem(params.tokens[i], params.tokenIds[i])

    @sp.entry_point
    def directListing(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            directSwapToken = sp.TAddress, directSwapAmount = sp.TNat
        ))
        self.data._items[params.token][params.tokenId].listing.listingType[0] = True
        self.data._items[params.token][params.tokenId].listing.directListing = sp.record(
            paymentToken = params.directSwapToken, 
            amount = params.directSwapAmount
        )

    @sp.entry_point
    def markListed(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, timePeriod = sp.TInt
        ))
        self.data._items[params.token][params.tokenId].status = 1
        self.data._items[params.token][params.tokenId].listing.timePeriod = sp.now.add_seconds(params.timePeriod)

    @sp.onchain_view()
    def getItemByAddress(self, params):
        sp.set_type(params, sp.TRecord(token = sp.TAddress, tokenId = sp.TNat))
        sp.if self.data._items.contains(params.token) & self.data._items[params.token].contains(params.tokenId):
            sp.result(self.data._items[params.token][params.tokenId])
        sp.else:
            sp.result(self.structures.getDefaultItem())