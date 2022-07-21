import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Market(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            whitelist = NULL_ADDRESS,
            listing = NULL_ADDRESS,
            vault = NULL_ADDRESS,
            swap = NULL_ADDRESS,
            reserve = NULL_ADDRESS
        )

    # Access setters
    @sp.entry_point
    def setSwap(self, _swap):
        # verify that the function caller is the admin
        sp.set_type(_swap, sp.TAddress)
        self.data.swap = _swap

    @sp.entry_point
    def setWhitelist(self, _whitelist):
        # verify that the function caller is the admin
        sp.set_type(_whitelist, sp.TAddress)
        self.data.whitelist = _whitelist

    @sp.entry_point
    def setListing(self, _listing):
        # verify that the function caller is the admin
        sp.set_type(_listing, sp.TAddress)
        self.data.listing = _listing

    @sp.entry_point
    def setVault(self, _vault):
        # verify that the function caller is the admin
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault

    @sp.entry_point
    def setReserve(self, _reserve):
        # verify that the function caller is the admin
        sp.set_type(_reserve, sp.TAddress)
        self.data.reserve = _reserve

    # Utility Functions
    def _recieveTez(self):
        c = sp.contract(
            sp.TUnit,
            self.data.vault,
            entry_point = 'recieveTez'
        ).open_some()
        sp.transfer(sp.unit, sp.amount, c)

    # public facing functions
    @sp.entry_point
    def whitelistNFTCollection(self, params):
        sp.set_type(params, sp.TList(sp.TAddress))
        contract = sp.contract(
            sp.TList(sp.TAddress),
            self.data.whitelist,
            entry_point = 'whitelistNFTCollection'
        ).open_some()
        sp.transfer(
            params,
            sp.mutez(0),
            contract
        )
    
    @sp.entry_point
    def whitelistFTContract(self, params):
        sp.set_type(params, sp.TList(sp.TAddress))
        contract = sp.contract(
            sp.TList(sp.TAddress),
            self.data.whitelist,
            entry_point = 'whitelistFTContract'
        ).open_some()
        sp.transfer(
            params,
            sp.mutez(0),
            contract
        )

    @sp.entry_point
    def createListing(self, params):
        self._recieveTez()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,
            tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat,sp.TAddress),
            directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
            reserveToken = sp.TMap(sp.TNat, sp.TAddress),
            deposits = sp.TMap(sp.TNat, sp.TNat),
            remainings = sp.TMap(sp.TNat, sp.TNat),
            durations = sp.TMap(sp.TNat, sp.TInt),
            timePeriod = sp.TInt,
        ))
        c1 = sp.contract(
            sp.TRecord(
                token = sp.TAddress,tokenId = sp.TNat,
                directSwapToken = sp.TMap(sp.TNat,sp.TAddress),directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
                reserveToken = sp.TMap(sp.TNat, sp.TAddress), deposits = sp.TMap(sp.TNat, sp.TNat),
                remainings = sp.TMap(sp.TNat, sp.TNat), durations = sp.TMap(sp.TNat, sp.TInt),
                timePeriod = sp.TInt,value = sp.TMutez
            ), self.data.listing,
            entry_point = 'createListing'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, 
                directSwapToken= params.directSwapToken, directSwapPrice = params.directSwapPrice, 
                reserveToken = params.reserveToken, deposits = params.deposits,
                remainings = params.remainings,durations = params.durations,
                timePeriod = params.timePeriod, value = sp.amount),
            sp.mutez(0),
            c1
        )

    @sp.entry_point
    def editListing(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,
            tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat,sp.TAddress),
            directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
            reserveToken = sp.TMap(sp.TNat, sp.TAddress),
            deposits = sp.TMap(sp.TNat, sp.TNat),
            remainings = sp.TMap(sp.TNat, sp.TNat),
            durations = sp.TMap(sp.TNat, sp.TInt),
            timePeriod = sp.TInt,
        ))
        c1 = sp.contract(
            sp.TRecord(
                token = sp.TAddress,tokenId = sp.TNat,
                directSwapToken = sp.TMap(sp.TNat,sp.TAddress),directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
                reserveToken = sp.TMap(sp.TNat, sp.TAddress), deposits = sp.TMap(sp.TNat, sp.TNat),
                remainings = sp.TMap(sp.TNat, sp.TNat), durations = sp.TMap(sp.TNat, sp.TInt),
                timePeriod = sp.TInt
            ), self.data.listing,
            entry_point = 'editListing'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, 
                directSwapToken= params.directSwapToken, directSwapPrice = params.directSwapPrice, 
                reserveToken = params.reserveToken, deposits = params.deposits,
                remainings = params.remainings,durations = params.durations,
                timePeriod = params.timePeriod),
            sp.mutez(0),
            c1
        )

    @sp.entry_point
    def cancelListing(self, params):
        sp.set_type(params, sp.TRecord(token = sp.TAddress, tokenId = sp.TNat))
        
        c1 = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat),
            self.data.listing,
            entry_point = 'cancelListing'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId),
            sp.mutez(0),
            c1
        )

    @sp.entry_point
    def directSwap(self, params):
        self._recieveTez()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat
        ))
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat, value = sp.TMutez
            ),self.data.swap,
            entry_point = 'directSwap' 
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, value = sp.amount),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def newSwapOffer(self, params):
        self._recieveTez()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            offerAssets = self.structures.getAssetsType(),
            timePeriod = sp.TInt
        ))

        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat,
                offerAssets = self.structures.getAssetsType(),
                timePeriod = sp.TInt, value = sp.TMutez 
            ),self.data.swap
            ,entry_point = 'newSwapOffer' 
        ).open_some()
        sp.transfer(
            sp.record(
                token = params.token, tokenId = params.tokenId, offerAssets = params.offerAssets, 
                timePeriod = params.timePeriod ,value = sp.amount
            ),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def cancelSwapOffer(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat,
                offerId = sp.TNat
            ),self.data.swap
            ,entry_point = 'cancelSwapOffer' 
        ).open_some()
        sp.transfer(
            sp.record(
                token = params.token, tokenId = params.tokenId, offerId = params.offerId
            ),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def acceptSwapOffer(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat,
                offerId = sp.TNat
            ),self.data.swap
            ,entry_point = 'acceptSwapOffer' 
        ).open_some()
        sp.transfer(
            sp.record(
                token = params.token, tokenId = params.tokenId, offerId = params.offerId
            ),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def claimRejectedSwapOffer(self, offerId):
        sp.set_type(offerId, sp.TNat)
        c = sp.contract(
            sp.TNat,
            self.data.swap,
            entry_point = 'claimRejectedSwapOffer' 
        ).open_some()
        sp.transfer(
            offerId,
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def reserve(self, params):
        self._recieveTez()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            reservationId = sp.TNat
        ))
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat,
                reservationId = sp.TNat, value = sp.TMutez
            ),
            self.data.reserve,
            entry_point = 'reserve' 
        ).open_some()
        sp.transfer(
            sp.record(
                token = params.token, tokenId = params.tokenId,
                reservationId = params.reservationId, value = sp.amount 
            ),sp.mutez(0),
            c
        )

    @sp.entry_point
    def newReserveOffer(self, params):
        self._recieveTez()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, 
            deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, 
            timePeriod = sp.TInt
        ))
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat, 
                deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, 
                timePeriod = sp.TInt, value = sp.TMutez
            ),
            self.data.reserve,
            entry_point = 'newReserveOffer' 
        ).open_some()
        sp.transfer(
            sp.record(
                token = params.token, tokenId = params.tokenId,
                deposit = params.deposit, remaining = params.remaining,
                duration = params.duration, timePeriod = params.timePeriod, value = sp.amount
            ),sp.mutez(0),
            c
        )
        
