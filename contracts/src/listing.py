import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Listing(sp.Contract):
    def __init__(self, _admin):
        self.structures = structures()
        self.init(
            itemStorage = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            market = NULL_ADDRESS,
            vault = NULL_ADDRESS,
            admin = _admin
        )

    def _onlyAdmin(self):
        sp.verify(self.data.admin == sp.sender,"Listing : Only Admin")

    # Access setter functions
    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        self._onlyAdmin()
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage
    
    @sp.entry_point
    def setMarket(self, _market):
        self._onlyAdmin()
        sp.set_type(_market, sp.TAddress)
        self.data.market = _market
    
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        self._onlyAdmin()
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage
    
    @sp.entry_point
    def setVault(self, _vault):
        self._onlyAdmin()
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault
    
    @sp.entry_point
    def setAdmin(self, _admin):
        sp.set_type(_admin, sp.TAddress)
        self._onlyAdmin()
        self.data.admin = _admin

    # Utility functions
    def _onlyMarket(self):
        sp.verify(self.data.market == sp.sender,"Listing : Only Approved Contract")

    def _itemOwnerOnly(self, add1, add2):
        sp.verify(add1 == add2, "Listing : Item owner only")

    def _checkFees(self, value):
        fees = sp.view(
            'getPlatformFee',
            self.data.detailStorage,
            sp.unit,
            t = sp.TNat
        ).open_some()
        sp.verify(sp.utils.mutez_to_nat(value) >= fees, "Listing : Insufficient Funds")

    def _receiveNFTs(self, tokens, tokenIds):
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, from_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'recieveFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(tokens)):
            sp.transfer(
                sp.record(token = tokens[i], from_ = sp.source, tokenId = tokenIds[i]),
                sp.mutez(0),
                c
            )
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds),sp.mutez(0),c1)
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds, owner = sp.source),sp.mutez(0),c2)

    def _sendNFTs(self, tokens, tokenIds):
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(tokens)):
            sp.transfer(
                sp.record(token = tokens[i], to_ = sp.source, tokenId = tokenIds[i]),
                sp.mutez(0),
                c
            )
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds),sp.mutez(0),c1)
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds, owner = NULL_ADDRESS),sp.mutez(0),c2)

    def _listDirectSwap(self, token, tokenId, directSwapToken, directSwapPrice):
        sp.verify(sp.view("isFTSupported", self.data.detailStorage, directSwapToken, t = sp.TBool).open_some(), "Listing : Not supported")
        sp.verify(directSwapPrice > 0,"Listing : Invalid Price")

        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, directSwapToken = sp.TAddress, directSwapAmount = sp.TNat),
            self.data.itemStorage,
            entry_point = 'directListing'
        ).open_some()
        sp.transfer(sp.record(token = token, tokenId = tokenId, directSwapToken = directSwapToken, directSwapAmount = directSwapPrice), sp.mutez(0), c)

    def _listReserve(self, token, tokenId, reserveTokens, deposits, remainings, durations):
        sp.for i in reserveTokens.keys():
            sp.verify(sp.view("isFTSupported", self.data.detailStorage, reserveTokens[i], t = sp.TBool).open_some(), "Listing : Not supported")
        ok = sp.local('ok', True)
        sp.for i in deposits.keys():
            sp.if (deposits[i] == 0) | (remainings[i] == 0) | (durations[i] == 0):
                ok.value = False
        sp.verify(ok.value, "Listing : Invalid Params")
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat, reserveTokens = sp.TMap(sp.TNat, sp.TAddress), deposits = sp.TMap(sp.TNat, sp.TNat), remainings = sp.TMap(sp.TNat, sp.TNat), durations = sp.TMap(sp.TNat, sp.TInt)),
            self.data.itemStorage,
            entry_point = 'reserveListing'
        ).open_some()
        sp.transfer(sp.record(token = token, tokenId = tokenId, reserveTokens = reserveTokens, deposits = deposits, remainings = remainings, durations = durations), sp.mutez(0), c)

    def _listNFTSwap(self,token, tokenId, swapTokens, swapPaymentTokens, swapAmounts, swapAllowed):
        sp.for i in swapPaymentTokens.keys():
            sp.verify(sp.view("isFTSupported", self.data.detailStorage, swapPaymentTokens[i], t = sp.TBool).open_some(), "Listing : Not supported")
        sp.for i in swapTokens.keys():
            sp.verify(sp.view(
                'isNFTSupported',self.data.detailStorage,swapTokens[i],t = sp.TBool
                ).open_some()
                ,"Swap : Not Supported"
            )
        c = sp.contract(
            sp.TRecord(
                token = sp.TAddress, tokenId = sp.TNat, swapTokens = sp.TMap(sp.TNat, sp.TAddress), swapPaymentTokens = sp.TMap(sp.TNat, sp.TAddress), swapAmounts = sp.TMap(sp.TNat, sp.TNat), swapAllowed = sp.TBool),
            self.data.itemStorage,
            entry_point = 'swapListing'
        ).open_some()
        sp.transfer(sp.record(token = token, tokenId = tokenId, swapTokens = swapTokens, swapPaymentTokens = swapPaymentTokens, swapAmounts = swapAmounts, swapAllowed = swapAllowed), sp.mutez(0), c)
        

    def _performListing(self, token, tokenId, directSwapToken, directSwapPrice, reserveTokens, deposits, remainings, durations, swapTokens, swapPaymentTokens, swapAmounts, swapAllowed, timePeriod):
        sp.verify((directSwapToken.contains(0)) | (sp.len(reserveTokens.keys()) > 0 ) | (sp.len(swapTokens.keys()) > 0), "Listing : Invalid Listing")
        
        sp.if directSwapToken.contains(0):
            self._listDirectSwap(token, tokenId, directSwapToken[0], directSwapPrice[0])

        sp.if sp.len(reserveTokens.keys()) > 0:
            self._listReserve(token, tokenId, reserveTokens, deposits, remainings, durations)

        sp.if sp.len(swapTokens.keys()) > 0:
            self._listNFTSwap(token, tokenId, swapTokens, swapPaymentTokens, swapAmounts, swapAllowed)
            
        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, timePeriod = sp.TInt),
            self.data.itemStorage,
            entry_point = 'markListed'
        ).open_some()
        sp.transfer(
            sp.record(token = token, tokenId = tokenId, timePeriod = timePeriod),
            sp.mutez(0),
            c
        )

    # Core functions
    @sp.entry_point
    def createListing(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,
            tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat,sp.TAddress),
            directSwapPrice = sp.TMap(sp.TNat,sp.TNat),
            reserveToken = sp.TMap(sp.TNat, sp.TAddress),
            deposits = sp.TMap(sp.TNat, sp.TNat),
            remainings = sp.TMap(sp.TNat, sp.TNat),
            durations = sp.TMap(sp.TNat, sp.TInt),
            swapTokens = sp.TMap(sp.TNat, sp.TAddress),
            swapPaymentTokens = sp.TMap(sp.TNat, sp.TAddress),
            swapAmounts = sp.TMap(sp.TNat, sp.TNat),
            swapAllowed = sp.TBool,
            timePeriod = sp.TInt,
            value = sp.TMutez
        ))
        self._onlyMarket()
        self._checkFees(params.value)

        sp.verify(sp.view(
            'checkListingRequirements',
            self.data.detailStorage,
            sp.record(tokens = sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) , tokenIds = sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat), timePeriod = params.timePeriod, edit = False),
            t = sp.TBool
        ).open_some())
        self._receiveNFTs(sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) ,sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat))
        self._performListing(
            params.token, 
            params.tokenId, 
            params.directSwapToken, 
            params.directSwapPrice, 
            params.reserveToken,
            params.deposits,
            params.remainings,
            params.durations,
            params.swapTokens,
            params.swapPaymentTokens,
            params.swapAmounts,
            params.swapAllowed,
            params.timePeriod
        )
    

    @sp.entry_point
    def editListing(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            directSwapToken = sp.TMap(sp.TNat, sp.TAddress), 
            directSwapPrice = sp.TMap(sp.TNat, sp.TNat),
            reserveToken = sp.TMap(sp.TNat, sp.TAddress),
            deposits = sp.TMap(sp.TNat, sp.TNat),
            remainings = sp.TMap(sp.TNat, sp.TNat),
            durations = sp.TMap(sp.TNat, sp.TInt),
            swapTokens = sp.TMap(sp.TNat, sp.TAddress),
            swapPaymentTokens = sp.TMap(sp.TNat, sp.TAddress),
            swapAmounts = sp.TMap(sp.TNat, sp.TNat),
            swapAllowed = sp.TBool,
            timePeriod = sp.TInt
        ))
        self._onlyMarket()

        item = sp.view(
                'getItemByAddress',
                self.data.itemStorage,
                sp.record(token = params.token, tokenId = params.tokenId),
                t = self.structures.getItemType()
            ).open_some()
        sp.verify(item.status == 1,"Listing : Invalid Status")
        self._itemOwnerOnly(item.owner, sp.source)

        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(sp.record(tokens=sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress), tokenIds=sp.map({0:params.tokenId},tkey = sp.TNat, tvalue = sp.TNat)),sp.mutez(0),c1)

        sp.verify(sp.view(
            'checkListingRequirements',
            self.data.detailStorage,
            sp.record(tokens = sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) , tokenIds = sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat), timePeriod = params.timePeriod, edit = True),
            t = sp.TBool
        ).open_some())

        self._performListing(
            params.token, 
            params.tokenId, 
            params.directSwapToken, 
            params.directSwapPrice, 
            params.reserveToken,
            params.deposits,
            params.remainings,
            params.durations,
            params.swapTokens,
            params.swapPaymentTokens,
            params.swapAmounts,
            params.swapAllowed,
            params.timePeriod
        )

    @sp.entry_point
    def cancelListing(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,tokenId = sp.TNat
        ))
        item = sp.view(
            'getItemByAddress',
            self.data.itemStorage,
            sp.record(token = params.token, tokenId = params.tokenId),
            t = self.structures.getItemType()
        ).open_some()
        sp.verify(item.status == 1,"Listing : Invalid Status")
        self._itemOwnerOnly(item.owner, sp.source)

        c = sp.contract(
            sp.TRecord(token=sp.TAddress, tokenId=sp.TNat),
            self.data.detailStorage,
            entry_point = 'setRejectedOffer',
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId),
            sp.mutez(0),
            c
        )
        self._sendNFTs(sp.map({0:params.token},tkey = sp.TNat, tvalue = sp.TAddress) ,sp.map({0:params.tokenId}, tkey = sp.TNat, tvalue = sp.TNat))

