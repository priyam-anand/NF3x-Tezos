import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class OfferStorage(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            swap = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            reserve = NULL_ADDRESS,
            offers = sp.big_map(tkey = sp.TAddress, 
                tvalue = sp.TMap(
                    sp.TNat, self.structures.getOfferType()
                )
            )
        )

    # Access setter
    @sp.entry_point
    def setSwap(self, _swap):
        sp.set_type(_swap, sp.TAddress)
        self.data.swap = _swap

    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage

    @sp.entry_point
    def setReserve(self, _reserve):
        sp.set_type(_reserve, sp.TAddress)
        self.data.reserve = _reserve

    # UTILITY FUNCTIONS
    def _onlyApproved(self):
        ok = (self.data.swap == sp.sender) | (self.data.detailStorage == sp.sender) | (self.data.reserve == sp.sender)
        sp.verify(ok, "OfferStorage : Only Approved Contract")

    # CORE FUNCTIONS
    @sp.entry_point
    def addNewSwapOffer(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            offerAssets = self.structures.getAssetsType(), timePeriod = sp.TInt  
        ))

        sp.if (self.data.offers.contains(params.token) & self.data.offers[params.token].contains(params.tokenId)):
            currId = sp.len(self.data.offers[params.token][params.tokenId].swapOffers.keys())
            self.data.offers[params.token][params.tokenId].swapOffers[currId] = sp.record(
                id = currId, token = params.token, tokenId = params.tokenId, owner = sp.source, assets = params.offerAssets, timePeriod = sp.now.add_seconds(params.timePeriod)
            )
        sp.else:
            sp.if ~self.data.offers.contains(params.token):
                self.data.offers[params.token] = sp.map({}, tkey = sp.TNat, tvalue = self.structures.getOfferType())

            self.data.offers[params.token][params.tokenId] = self.structures.getDefaultOffer()
            self.data.offers[params.token][params.tokenId].swapOffers[0] = sp.record(
                id = 0, token = params.token, tokenId = params.tokenId, owner = sp.source, assets = params.offerAssets, timePeriod = sp.now.add_seconds(params.timePeriod)
            )

    @sp.entry_point
    def addNewReserveOffer(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, 
            deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, 
            timePeriod = sp.TInt
        ))
        sp.if (self.data.offers.contains(params.token) & self.data.offers[params.token].contains(params.tokenId)):
            currId = sp.len(self.data.offers[params.token][params.tokenId].reserveOffers.keys())
            self.data.offers[params.token][params.tokenId].reserveOffers[currId] = sp.record(
                id = currId, token = params.token, tokenId = params.tokenId, 
                owner = sp.source, deposit = params.deposit, remaining = params.remaining, duration = params.duration, timePeriod = sp.now.add_seconds(params.timePeriod)
            )
        sp.else:
            sp.if ~self.data.offers.contains(params.token):
                self.data.offers[params.token] = sp.map({}, tkey = sp.TNat, tvalue = self.structures.getOfferType())
            self.data.offers[params.token][params.tokenId] = self.structures.getDefaultOffer()
            self.data.offers[params.token][params.tokenId].reserveOffers[0] = sp.record(
                id = 0, token = params.token, tokenId = params.tokenId, 
                owner = sp.source, deposit = params.deposit, remaining = params.remaining, duration = params.duration, timePeriod = sp.now.add_seconds(params.timePeriod)
            )

    
    
    @sp.onchain_view()
    def getOffers(self, params):
        sp.set_type(params, sp.TRecord(token = sp.TAddress, tokenId = sp.TNat))
        sp.if self.data.offers.contains(params.token) & self.data.offers[params.token].contains(params.tokenId):
            sp.result(self.data.offers[params.token][params.tokenId])
        sp.else:
            sp.result(self.structures.getDefaultOffer())

    @sp.entry_point
    def removeSwapOffer(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            offerId = sp.TNat
        ))
        del self.data.offers[params.token][params.tokenId].swapOffers[params.offerId]
