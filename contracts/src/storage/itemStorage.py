import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class ItemStorage(sp.Contract):
    def __init__(self, _admin):
        self.structures = structures()
        self.init(
            detailStorage = NULL_ADDRESS,
            listing = NULL_ADDRESS,
            swap = NULL_ADDRESS,
            reserve = NULL_ADDRESS,
            reserveUtils = NULL_ADDRESS,
            _items = sp.big_map(tkey = sp.TAddress,
                tvalue = sp.TMap(
                    sp.TNat,self.structures.getItemType()
                )
            ),
            admin = _admin         
        )
    
    # Access setter
    def _onlyAdmin(self):
        sp.verify(self.data.admin == sp.sender,"ItemStorage : Only Admin")

    @sp.entry_point
    def setSwap(self, _swap):
        sp.set_type(_swap, sp.TAddress)
        self._onlyAdmin()
        self.data.swap = _swap

    @sp.entry_point
    def setListing(self, _listing):
        sp.set_type(_listing, sp.TAddress)
        self._onlyAdmin()
        self.data.listing = _listing

    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self._onlyAdmin()
        self.data.detailStorage = _detailStorage

    @sp.entry_point
    def setReserve(self, _reserve):
        sp.set_type(_reserve, sp.TAddress)
        self._onlyAdmin()
        self.data.reserve = _reserve

    @sp.entry_point
    def setReserveUtils(self, _reserveUtils):
        sp.set_type(_reserveUtils, sp.TAddress)
        self._onlyAdmin()
        self.data.reserveUtils = _reserveUtils

    @sp.entry_point
    def setAdmin(self, _admin):
        sp.set_type(_admin, sp.TAddress)
        self._onlyAdmin()
        self.data.admin = _admin

    # INTERNAL FUNCTIONS
    def _onlyApproved(self):
        ok = (sp.sender == self.data.reserveUtils) | (self.data.detailStorage == sp.sender) | (self.data.listing == sp.sender) | (self.data.swap == sp.sender) | (self.data.reserve == sp.sender)
        sp.verify(ok, "ItemStorage : Only Approved Contract")

    def _resetItem(self, token, tokenId):
        sp.if self.data._items.contains(token) & self.data._items[token].contains(tokenId):
            self.data._items[token][tokenId].status = sp.nat(0)
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
    def setItemStatus(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            status = sp.TNat
        ))
        sp.for i in params.tokens.keys():
            self.data._items[params.tokens[i]][params.tokenIds[i]].status = params.status

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
    def swapListing(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, 
            swapTokens = sp.TMap(sp.TNat, sp.TAddress), swapPaymentTokens = sp.TMap(sp.TNat, sp.TAddress), swapAmounts = sp.TMap(sp.TNat, sp.TNat), swapAllowed = sp.TBool
        ))
        self.data._items[params.token][params.tokenId].listing.listingType[2] = True
        self.data._items[params.token][params.tokenId].listing.swapListing = sp.record(
            tokens = params.swapTokens, paymentTokens = params.swapPaymentTokens,
            amounts = params.swapAmounts, swapAllowed = params.swapAllowed
        )

    @sp.entry_point
    def reserveListing(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, 
            reserveTokens = sp.TMap(sp.TNat, sp.TAddress), 
            deposits = sp.TMap(sp.TNat, sp.TNat), 
            remainings = sp.TMap(sp.TNat, sp.TNat), 
            durations = sp.TMap(sp.TNat, sp.TInt)
        ))
        self.data._items[params.token][params.tokenId].listing.listingType[1] = True
        self.data._items[params.token][params.tokenId].listing.reserveListing = sp.record(
            reserveToken = params.reserveTokens, deposit = params.deposits, remaining = params.remainings, duration = params.durations, accepted = False, owner = sp.source, positionToken = 0, dueDate = sp.timestamp(0)
        )

    @sp.entry_point
    def reserveItem(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, positionToken = sp.TNat
        ))
        self.data._items[params.token][params.tokenId].status = sp.nat(3)
        self.data._items[params.token][params.tokenId].listing.reserveListing.accepted = True
        self.data._items[params.token][params.tokenId].listing.reserveListing.positionToken = params.positionToken

    @sp.entry_point
    def markListed(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, timePeriod = sp.TInt
        ))
        self.data._items[params.token][params.tokenId].status = sp.nat(1)
        self.data._items[params.token][params.tokenId].listing.timePeriod = sp.now.add_seconds(params.timePeriod)

    @sp.onchain_view()
    def getItemByAddress(self, params):
        sp.set_type(params, sp.TRecord(token = sp.TAddress, tokenId = sp.TNat))
        sp.if self.data._items.contains(params.token) & self.data._items[params.token].contains(params.tokenId):
            sp.result(self.data._items[params.token][params.tokenId])
        sp.else:
            sp.result(self.structures.getDefaultItem())

    @sp.onchain_view()
    def getItems(self, token):
        sp.set_type(token, sp.TAddress)
        sp.result(
            self.data._items.get(
                token, 
                sp.map({})
            )
        )