import smartpy as sp

class DetailStorage(sp.Contract):
    def __init__(self, _platformFee):
        self.init(
            whitelist = sp.address('tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU'),
            whitelistedNFTs = sp.map(tkey = sp.TAddress, tvalue = sp.TBool),
            whitelistedFTs = sp.map(tkey = sp.TAddress, tvalue = sp.TBool),
            platformFees = _platformFee
        )

    # Utility functions/ internal functions
    def onlyApprovedContracts(self):
        sp.verify(self.data.whitelist == sp.sender, "DetailStorage : Only Approved Contract")

    # Access setter functions
    @sp.entry_point
    def setWhitelist(self, _whitelist):
        sp.set_type(_whitelist, sp.TAddress)
        # verify that the function caller is the admin
        self.data.whitelist = _whitelist

    # Core functions
    @sp.onchain_view()
    def getWhitelistedToken(self, token):
        sp.set_type(token, sp.TAddress)
        sp.result(self.data.whitelistedNFTs.contains(token))
    
    @sp.entry_point
    def setWhitelistedToken(self, token):
        sp.set_type(token, sp.TAddress)
        self.onlyApprovedContracts()
        self.data.whitelistedNFTs[token] = True

    @sp.onchain_view()
    def getPlatformFees(self, token):
        sp.set_type(token, sp.TAddress)
        sp.result(self.data.whitelistedFTs.contains(token))
    
    @sp.entry_point
    def setPlatformFees(self, token):
        sp.set_type(token, sp.TAddress)
        self.onlyApprovedContracts()
        self.data.whitelistedFTs[token] = True

    @sp.onchain_view()
    def getSupportedTokens(self):
        sp.result(self.data.whitelistedNFTs.keys())

    @sp.onchain_view()
    def getPaymentTokens(self):
        sp.result(self.data.whitelistedFTs.keys())
        
