import smartpy as sp

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Whitelist(sp.Contract) :
    def __init__(self, _admin):
        self.init(
            detailStorage = NULL_ADDRESS,
            market = NULL_ADDRESS,
            admin = _admin
        )

    # Access setter functions 
    def _onlyAdmin(self):
        sp.verify(self.data.admin == sp.sender,"Whitelist : Only Admin")

    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self._onlyAdmin()
        self.data.detailStorage = _detailStorage
    

    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        self._onlyAdmin()
        self.data.market = _market

    @sp.entry_point
    def setAdmin(self, _admin):
        sp.set_type(_admin, sp.TAddress)
        self._onlyAdmin()
        self.data.admin = _admin

    # Utility functions
    def _onlyApprovedContracts(self):
        sp.verify(self.data.market == sp.sender, "Whitelist : Only Approved Contract")


    # Core functions 
    @sp.entry_point
    def whitelistNFTCollection(self, params):
        sp.set_type(params, sp.TList(
            sp.TAddress
        ))
        self._onlyApprovedContracts()

        detailStorageContract = sp.contract(
            sp.TAddress,
            self.data.detailStorage,
            entry_point = "setWhitelistedNFT"
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
        
        detailStorageContract = sp.contract(
            sp.TAddress,
            self.data.detailStorage,
            entry_point = "setWhitelistedFT"
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
