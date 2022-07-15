import smartpy as sp

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Market(sp.Contract):
    def __init__(self):
        self.init(
            whitelist = NULL_ADDRESS,
            listing = NULL_ADDRESS,
            vault = NULL_ADDRESS
        )

    # Access setters
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
        c = sp.contract(
            sp.TUnit,
            self.data.vault,
            entry_point = 'recieveTez'
        ).open_some()
        sp.transfer(sp.unit, sp.amount, c)

        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,
            tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat,sp.TAddress),
            directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
            timePeriod = sp.TInt,
        ))
        c1 = sp.contract(
            sp.TRecord(
                token = sp.TAddress,tokenId = sp.TNat,directSwapToken = sp.TMap(sp.TNat,sp.TAddress),directSwapPrice = sp.TMap(sp.TNat,sp.TNat),timePeriod = sp.TInt,value = sp.TMutez
            ), self.data.listing,
            entry_point = 'createListing'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, directSwapToken= params.directSwapToken, directSwapPrice = params.directSwapPrice, timePeriod = params.timePeriod, value = sp.amount),
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
            timePeriod = sp.TInt,
        ))
        c1 = sp.contract(
            sp.TRecord(
                token = sp.TAddress,tokenId = sp.TNat,directSwapToken = sp.TMap(sp.TNat,sp.TAddress),directSwapPrice = sp.TMap(sp.TNat,sp.TNat),timePeriod = sp.TInt
            ), self.data.listing,
            entry_point = 'editListing'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, directSwapToken= params.directSwapToken, directSwapPrice = params.directSwapPrice, timePeriod = params.timePeriod),
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
