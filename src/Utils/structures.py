import smartpy as sp

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class structures:
    def getAssetsType(self):
        assets = sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            paymentTokens = sp.TMap(sp.TNat, sp.TAddress),
            amounts = sp.TMap(sp.TNat, sp.TNat)
        )
        return assets

    def getDefaultAsset(self):
        asset = sp.record(
            tokens = sp.map({},tkey = sp.TNat, tvalue = sp.TAddress),
            tokenIds = sp.map({},tkey = sp.TNat, tvalue=sp.TNat),
            paymentTokens = sp.map({},tkey = sp.TNat, tvalue = sp.TAddress),
            amounts = sp.map({},tkey = sp.TNat, tvalue=sp.TNat)
        )
        return asset

    def getDirectListingType(self):
        listing = sp.TRecord(
            paymentToken = sp.TAddress,
            amount = sp.TNat
        )
        return listing

    def getDefaultDirectListing(self):
        listing = sp.record(
            paymentToken = NULL_ADDRESS,
            amount = sp.nat(0)
        )
        return listing

    def getReserveListingType(self):
        listing = sp.TRecord(
            reserveToken = sp.TMap(sp.TNat, sp.TAddress),
            deposit = sp.TMap(sp.TNat,sp.TNat),
            remaining = sp.TMap(sp.TNat,sp.TNat),
            duration = sp.TMap(sp.TNat,sp.TInt),
            accepted = sp.TBool,
            owner = sp.TAddress,
            positionToken = sp.TNat,
            dueDate = sp.TTimestamp
        )      
        return listing

    def getDefaultReserveListing(self):
        listing = sp.record(
            reserveToken = sp.map({}, tkey = sp.TNat, tvalue = sp.TAddress),
            deposit = sp.map({}, tkey = sp.TNat, tvalue = sp.TNat),
            remaining = sp.map({}, tkey = sp.TNat, tvalue = sp.TNat),
            duration = sp.map({}, tkey = sp.TNat, tvalue = sp.TInt),
            accepted = False,
            owner = NULL_ADDRESS,
            positionToken = sp.nat(0),
            dueDate = sp.timestamp(0)
        )
        return listing

    def getSwapListingType(self):
        listing = sp.TRecord(
            tokens = sp.TList(sp.TAddress),
            paymentTokens = sp.TList(sp.TAddress),
            amounts = sp.TList(sp.TNat)
        )
        return listing

    def getDefaultSwapListing(self):
        listing = sp.record(
            tokens = sp.list(t=sp.TAddress),
            paymentTokens = sp.list(t=sp.TAddress),
            amounts = sp.list(t=sp.TNat)
        )
        return listing

    def getListingType(self):
        Listing = sp.TRecord(
            timePeriod = sp.TTimestamp,
            listingType = sp.TMap(sp.TNat, sp.TBool),
            directListing = self.getDirectListingType(),
            reserveListing = self.getReserveListingType(),
            swapListing = self.getSwapListingType()
        )
        return Listing

    def getDefaultListing(self):
        listing = sp.record(
            timePeriod = sp.timestamp(0),
            listingType =  sp.map({0:False, 1:False, 2:False}, tkey = sp.TNat, tvalue = sp.TBool),
            directListing = self.getDefaultDirectListing(),
            reserveListing = self.getDefaultReserveListing(),
            swapListing = self.getDefaultSwapListing()
        )
        return listing

    def getItemType(self):
        Item = sp.TRecord(
            token = sp.TAddress,
            tokenId = sp.TNat,
            owner = sp.TAddress,
            status = sp.TNat,
            listing = self.getListingType()
        )
        return Item

    '''
        Item Status
        0 : Unlisted
        1 : Listed
        2 : Locked
        3 : On Hold
        4 : Bundle
    '''
    def getDefaultItem(self):
        item = sp.record(
            token = NULL_ADDRESS,
            tokenId = sp.nat(0),
            owner = NULL_ADDRESS,
            status = 0,
            listing = self.getDefaultListing()
        )
        return item

    def getSwapOfferType(self):
        offer = sp.TRecord(
            id = sp.TNat,
            token = sp.TAddress,
            tokenId = sp.TNat,
            owner = sp.TAddress,
            assets = self.getAssetsType(),
            timePeriod = sp.TTimestamp
        )
        return offer

    def getReserveOfferType(self):
        offer = sp.TRecord(
            id = sp.TNat,
            token = sp.TAddress,
            tokenId = sp.TNat,
            owner = sp.TAddress,
            deposit = self.getAssetsType(),
            remaining = self.getAssetsType(),
            duration = sp.TInt,
            timePeriod = sp.TTimestamp
        )
        return offer

    def getOfferType(self):
        offer = sp.TRecord(
            swapOffers = sp.TMap(sp.TNat, self.getSwapOfferType()),
            reserveOffers = sp.TMap(sp.TNat, self.getReserveOfferType())
        )
        return offer

    def getDefaultOffer(self):
        offer = sp.record(
            swapOffers = sp.map({}, tkey = sp.TNat, tvalue = self.getSwapOfferType()),
            reserveOffers = sp.map({}, tkey = sp.TNat, tvalue = self.getReserveOfferType())
        )
        return offer

    def getReservationDetailType(self):
        reservation = sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            owner = sp.TAddress, 
            deposit = self.getAssetsType(), 
            remaining = self.getAssetsType(),
            duration = sp.TInt,
            dueDate = sp.TTimestamp
        )   
        return reservation

    def getDefaultReservationDetails(self) :
        reservation = sp.record(
            token = NULL_ADDRESS, tokenId = 0,
            owner = NULL_ADDRESS, deposit = self.getDefaultAsset(),
            remaining = self.getDefaultAsset(), duration = sp.int(0),
            dueDate = sp.timestamp(0)
        )
        return reservation