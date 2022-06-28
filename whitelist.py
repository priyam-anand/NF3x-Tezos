import smartpy as sp

class Whitelist(sp.Contract) :
    def __init__(self, _detailStorage):
        self.init(
            detailStorage = _detailStorage,
            market = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")
        )
    
    ################# Utility functions/ internal functions ######################
    def _onlyApprovedContracts(self):
        sp.verify(self.data.market == sp.sender, "Whitelist : Only Approved Contract")

    def nftWhitelisteCondition(self, address):
        condition = sp.view(
            "getWhitelistedToken",
            self.data.detailStorage,
            address,
            t = sp.TBool
        ).open_some()
        sp.result(condition)

    def ftWhitelistCondition(self, address):
        condition = sp.view(
            'getPlatformFees',
            self.data.detailStorage,
            address,
            sp.TBool
        ).open_some()
        sp.result(condition)

    ####################### Access setter functions ############################
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        # verify that the function caller is the admin
        self.data.detailStorage = _detailStorage
    

    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        # verify that the function caller is the admin
        self.data.market = _market

    ############################## Core functions #############################
    @sp.entry_point
    def whitelistNFTCollection(self, params):
        sp.set_type(params, sp.TList(
            sp.TAddress
        ))
        self._onlyApprovedContracts()

        ok = sp.local("ok", sp.bool(True))
        sp.for address in params:
            sp.if self.nftWhitelisteCondition(address) == True:
                ok.value = False
        sp.verify(ok.value,'Already Whitelisted')

        detailStorageContract = sp.contract(
            sp.TAddress,
            self.data.detailStorage,
            entry_point = "setWhitelistedToken"
        ).open_some()
        sp.for address in params:
            sp.transfer(
                address,
                sp.mutez(0),
                detailStorageContract
            )

    @sp.entry_point
    def whitelistFTContract(self, params):
        sp.set_type(params, sp.TList(
            sp.TAddress
        ))
        self._onlyApprovedContracts()

        ok = sp.local("ok", sp.bool(True))
        sp.for address in params:
            sp.if self.ftWhitelistCondition(address) == True:
                ok.value = False
        sp.verify(ok.value,'Already Whitelisted')
        
        detailStorageContract = sp.contract(
            sp.TAddress,
            self.data.detailStorage,
            entry_point = "setPlatformFees"
        ).open_some()
        sp.for address in params:
            sp.transfer(
                address,
                sp.mutez(0),
                detailStorageContract
            ) 

    @sp.onchain_view()
    def getSupportedNFTCollections(self):
        sp.result(
            sp.view(
                'getSupportedTokens',
                self.data.detailStorage,
                sp.unit,
                t = sp.TList(sp.TAddress)
            )
        )

    @sp.onchain_view()
    def getSupportedFTContracts(self):
        sp.result(
            sp.view(
                'getPaymentTokens',
                self.data.detailStorage,
                sp.unit,
                t = sp.TList(sp.TAddress)
            )
        )
