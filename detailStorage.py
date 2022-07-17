import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class DetailStorage(sp.Contract):
    def __init__(self, _platformFee):
        self.structures = structures()
        self.init(
            whitelist = NULL_ADDRESS,
            listing = NULL_ADDRESS,
            itemStorage = NULL_ADDRESS,
            swap = NULL_ADDRESS,
            whitelistedNFTs = sp.map(tkey = sp.TAddress, tvalue = sp.TBool),
            whitelistedFTs = sp.map(tkey = sp.TAddress, tvalue = sp.TBool),
            rejectedSwapOffers = sp.map(tkey = sp.TAddress, tvalue = sp.TList(self.structures.getSwapOfferType())),
            rejectedReserveOffers = sp.map(tkey = sp.TAddress, tvalue = sp.TList(self.structures.getReserveOfferType())),
            platformFees = _platformFee
        )

     # Access setter functions
    @sp.entry_point
    def setSwap(self, _swap):
        sp.set_type(_swap, sp.TAddress)
        # verify that the function caller is the admin
        self.data.swap = _swap

    @sp.entry_point
    def setWhitelist(self, _whitelist):
        sp.set_type(_whitelist, sp.TAddress)
        # verify that the function caller is the admin
        self.data.whitelist = _whitelist

    @sp.entry_point
    def setListing(self, _listing):
        sp.set_type(_listing, sp.TAddress)
        self.data.listing = _listing

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage

    # Utility functions/ internal functions
    def _onlyApprovedContracts(self):
        ok = (sp.sender == self.data.whitelist) | (sp.sender == self.data.listing) | (sp.sender == self.data.itemStorage) | (sp.sender == self.data.swap)
        sp.verify(ok
        , "DetailStorage : Only Approved Contract")

    # Core functions 
    @sp.entry_point
    def setWhitelistedNFT(self, token):
        sp.set_type(token, sp.TAddress)
        self._onlyApprovedContracts()
        self.data.whitelistedNFTs[token] = True

    @sp.entry_point
    def setWhitelistedFT(self, token):
        sp.set_type(token, sp.TAddress)
        self._onlyApprovedContracts()
        self.data.whitelistedFTs[token] = True

    @sp.entry_point
    def setRejectedOffers(self, params):
        sp.set_type(params, sp.TRecord(tokens = sp.TMap(sp.TNat, sp.TAddress), tokenIds = sp.TMap(sp.TNat, sp.TNat)))
        self._onlyApprovedContracts()
        # process rejected offers


    @sp.onchain_view()
    def isNFTSupported(self, token):
        sp.set_type(token, sp.TAddress)
        sp.result(self.data.whitelistedNFTs.contains(token))
            
    @sp.onchain_view()
    def isFTSupported(self, token):
        sp.set_type(token, sp.TAddress)
        sp.result(self.data.whitelistedFTs.contains(token))

    
    @sp.onchain_view()
    def checkListingRequirements(self, params):
        self._onlyApprovedContracts()
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            timePeriod = sp.TInt,
            edit = sp.TBool
        ))
        sp.verify(params.timePeriod > 0,"DetailStorage : Invalid timePeriod")
        sp.for i in sp.range(0,sp.len(params.tokens)):
            sp.verify(self.data.whitelistedNFTs.contains(params.tokens[i]), "DetailStorage : Not Supported")
            sp.if ~params.edit:
                item = sp.view(
                    'getItemByAddress',
                    self.data.itemStorage,
                    sp.record(token = params.tokens[i], tokenId = params.tokenIds[i]),
                    t = self.structures.getItemType()
                ).open_some()
                sp.verify(item.status == 0,"DetailStorage : Invalid Status")
        sp.result(True)

    # Getter functions
    @sp.onchain_view()
    def getPlatformFee(self):
        sp.result(self.data.platformFees)

    @sp.onchain_view()
    def getSupportedTokens(self):
        sp.result(self.data.whitelistedNFTs.keys())

    @sp.onchain_view()
    def getPaymentTokens(self):
        sp.result(self.data.whitelistedFTs.keys())
