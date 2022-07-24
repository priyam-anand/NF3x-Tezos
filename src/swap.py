import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Swap(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            market = NULL_ADDRESS,
            itemStorage = NULL_ADDRESS,
            vault = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            offerStorage = NULL_ADDRESS
        )

    # Access Setter functions
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage

    @sp.entry_point
    def setOfferStorage(self, _offerStorage):
        sp.set_type(_offerStorage, sp.TAddress)
        self.data.offerStorage = _offerStorage
    
    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        self.data.market = _market
    
    @sp.entry_point
    def setVault(self, _vault):
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault


    # Utility funcstion
    def _onlyMarket(self):
        sp.verify(self.data.market == sp.sender,"Swap : Only Approved Contract")

    def _itemNotExpired(self, timePeriod):
        sp.verify(sp.now < timePeriod, "Swap : Item Expired")

    def _notItemOwner(self, add1, add2):
        sp.verify(~(add1 == add2),"Swap : Not Item Owner")

    def _itemOwnerOnly(self, add1, add2):
        sp.verify(add1 == add2,"Swap : Item Owner only")

    def _checkPayment(self, token, amount, _value):
        total = sp.local('total',sp.nat(0))
        sp.for i in token.keys():
            sp.if token[i] == NULL_ADDRESS:
                total.value += amount[i]
        sp.verify(total.value <= sp.utils.mutez_to_nat(_value),"Swap : Insufficient Funds")

    def _itemReset(self, tokens, tokenIds, owner):
        c1 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat)),
            self.data.itemStorage,
            entry_point = "resetItems"
        ).open_some()
        sp.transfer(
            sp.record(tokens=tokens, tokenIds=tokenIds),
            sp.mutez(0),
            c1
        )
        c2 = sp.contract(
            sp.TRecord(tokens=sp.TMap(sp.TNat,sp.TAddress), tokenIds=sp.TMap(sp.TNat,sp.TNat), owner = sp.TAddress),
            self.data.itemStorage,
            entry_point = 'setItemOwners'
        ).open_some()
        sp.transfer(sp.record(tokens=tokens, tokenIds=tokenIds, owner = owner),sp.mutez(0),c2)

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
        self._itemReset(tokens, tokenIds, sp.source)
        c = sp.contract(
                sp.TRecord(
                    tokens = sp.TMap(sp.TNat, sp.TAddress),
                    tokenIds = sp.TMap(sp.TNat, sp.TNat),
                    status = sp.TNat
                ),
                self.data.itemStorage,
                entry_point = 'setItemStatus'
        ).open_some()
        sp.transfer(sp.record(
            tokens = tokens, 
            tokenIds = tokenIds, 
            status = 2
        ), sp.mutez(0), c)

    def _sendNFTs(self, tokens, tokenIds, to):
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(tokens)):
            sp.transfer(
                sp.record(token = tokens[i], to_ = to, tokenId = tokenIds[i]),
                sp.mutez(0),
                c
            )
        self._itemReset(tokens, tokenIds, NULL_ADDRESS)

    def _receiveFTs(self, tokens, amounts):
        c1 = sp.contract(
                sp.TRecord(token = sp.TAddress, _from= sp.TAddress, amount = sp.TNat),
                self.data.vault,
                entry_point = 'recieveFA12'
        ).open_some()
        sp.for i in tokens.keys():
            sp.if ~(tokens[i] == NULL_ADDRESS) : 
                sp.transfer(
                    sp.record(token = tokens[i], _from = sp.source, amount = amounts[i]),
                    sp.mutez(0),
                    c1
                )

    def _sendTez(self, amount, to):
        c = sp.contract(
            sp.TRecord(to = sp.TAddress, amount = sp.TMutez),
            self.data.vault,
            entry_point = 'sendTez'
        ).open_some()
        sp.transfer(
            sp.record(to = to, amount = sp.utils.nat_to_mutez(amount)),
            sp.mutez(0),
            c
        )

    def _sendFTs(self, tokens, amounts, to_):
        c2 = sp.contract(
                sp.TRecord(token = sp.TAddress, to=sp.TAddress, amount = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA12'
        ).open_some()
        sp.for i in tokens.keys():
            sp.if ~(tokens[i] == NULL_ADDRESS) :
                sp.transfer(
                    sp.record(token = tokens[i], to = to_, amount = amounts[i]),
                    sp.mutez(0),
                    c2
                )
            sp.else : 
                self._sendTez(amounts[i], to_)

    def _setRejectedOffer(self, token, tokenId):
        c = sp.contract(
            sp.TRecord(token=sp.TAddress, tokenId=sp.TNat),
            self.data.detailStorage,
            entry_point = 'setRejectedOffer',
        ).open_some()
        sp.transfer(
            sp.record(token = token, tokenId = tokenId),
            sp.mutez(0),
            c
        )

    def _assetSupported(self, offerAssets):
        sp.for i in offerAssets.tokens.keys():
            sp.verify(sp.view(
                'isNFTSupported',
                self.data.detailStorage,
                offerAssets.tokens[i],
                t = sp.TBool
            ).open_some(),"Swap : Not Supported")
        sp.for i in offerAssets.paymentTokens.keys():
            sp.verify(sp.view(
                'isFTSupported',
                self.data.detailStorage,
                offerAssets.paymentTokens[i],
                t = sp.TBool
            ).open_some(),"Swap : Not Supported")

    def _checkEmptyAssets(self, offerAssets):
        sp.verify((sp.len(offerAssets.tokens.keys()) > 0) | (sp.len(offerAssets.paymentTokens.keys()) > 0), "Swap : Empty Asset")
        sp.if sp.len(offerAssets.tokens.keys()) == 0:
            ttl = sp.local('value', sp.nat(0))
            sp.for i in offerAssets.paymentTokens.keys():
                ttl.value += offerAssets.amounts[i]
            sp.verify(ttl.value > 0, "Swap : Empty Asset")

    def _checkSwapOfferRequirements(self, item, timePeriod, offerAssets, _value):
        self._notItemOwner(sp.source, item.owner)
        sp.verify(timePeriod > 0,"Swap : Invalid Time Period")
        self._assetSupported(offerAssets)
        self._checkEmptyAssets(offerAssets)
        self._checkPayment(
            offerAssets.paymentTokens, 
            offerAssets.amounts, 
            _value
        )

    def _receiveAssets(self, offerAssets):
        self._receiveNFTs(offerAssets.tokens, offerAssets.tokenIds)
        self._receiveFTs(offerAssets.paymentTokens, offerAssets.amounts)

    def _sendAssets(self, offerAssets, to):
        self._sendNFTs(offerAssets.tokens, offerAssets.tokenIds, to)
        self._sendFTs(offerAssets.paymentTokens, offerAssets.amounts, to)

    def _transferAssets(self,tokens, tokenIds, paymentTokens, amounts, to):
        self._receiveNFTs(tokens, tokenIds)
        self._receiveFTs(paymentTokens, amounts)

        self._sendNFTs(tokens, tokenIds, to)
        self._sendFTs(paymentTokens, amounts, to)

    @sp.private_lambda(with_storage="read-write")
    def _getItem(self,params): 
        item = sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some()
        sp.result(item)

    @sp.private_lambda(with_storage="read-only")
    def _offerExist(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        offers = sp.view(
            'getOffers', self.data.offerStorage,
            sp.record(token = params.token, tokenId = params.tokenId),
            t = self.structures.getOfferType()
        ).open_some()
        sp.verify(offers.swapOffers.contains(params.offerId),"Swap : Offer does not exist")
        sp.result(offers.swapOffers[params.offerId])
        

    # Core functions
    @sp.entry_point
    def directSwap(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            value = sp.TMutez
        ))

        item = self._getItem(sp.record(token = params.token, tokenId = params.tokenId))        

        sp.verify(item.status == 1,"Swap : Invalid Status")
        self._itemNotExpired(item.listing.timePeriod)
        self._notItemOwner(item.owner, sp.source)

        sp.verify(item.listing.listingType[0] == True,"Swap : Item Now listed for Direct Swap")

        self._checkPayment(
            sp.map({0:item.listing.directListing.paymentToken}),
            sp.map({0:item.listing.directListing.amount}),
            params.value
        )
        self._transferAssets(
            sp.map({}), sp.map({}), sp.map({0:item.listing.directListing.paymentToken}), sp.map({0:item.listing.directListing.amount}),
            item.owner
        )
        self._setRejectedOffer(
            params.token,
            params.tokenId
        )

        self._sendNFTs(
            sp.map({0:params.token}),
            sp.map({0:params.tokenId}),
            sp.source
        )

    @sp.entry_point 
    def nftSwap(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            offerToken = sp.TAddress, offerTokenId = sp.TNat,
            swapId = sp.TNat, value = sp.TMutez
        ))
        item = self._getItem(sp.record(token = params.token, tokenId = params.tokenId))

        sp.verify(item.status == 1,"Swap : Invalid Status")
        self._itemNotExpired(item.listing.timePeriod)
        self._notItemOwner(item.owner, sp.source)
        sp.verify(
            (item.listing.listingType[2] == True) & (item.listing.swapListing.swapAllowed == True) ,
            "Swap : Item Now listed for NFT swap"
        )
        sp.verify(item.listing.swapListing.tokens.contains(params.swapId),"Swap : Offer does not exist")
        sp.verify(item.listing.swapListing.tokens[params.swapId] == params.offerToken, "Swap : Invalid Swap")

        self._checkPayment(
            sp.map({0:item.listing.swapListing.paymentTokens[params.swapId]}),
            sp.map({0:item.listing.swapListing.amounts[params.swapId]}),
            params.value
        )

        self._transferAssets(
            sp.map({0:params.offerToken}), sp.map({0:params.offerTokenId}), 
            sp.map({0:item.listing.swapListing.paymentTokens[params.swapId]}), sp.map({0:item.listing.swapListing.amounts[params.swapId]}),
            item.owner
        )

        self._setRejectedOffer(
            params.token,
            params.tokenId
        )
        self._sendNFTs(
            sp.map({0:params.token}),
            sp.map({0:params.tokenId}),
            sp.source
        )


    @sp.entry_point
    def newSwapOffer(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            offerAssets = self.structures.getAssetsType(),
            timePeriod = sp.TInt, value = sp.TMutez 
        ))

        item = self._getItem(sp.record(token = params.token, tokenId = params.tokenId))

        self._checkSwapOfferRequirements(item, params.timePeriod, params.offerAssets, params.value)

        self._receiveAssets(params.offerAssets)

        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat,offerAssets = self.structures.getAssetsType(), timePeriod = sp.TInt),
            self.data.offerStorage, 
            entry_point = 'addNewSwapOffer'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, offerAssets = params.offerAssets, timePeriod = params.timePeriod),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def cancelSwapOffer(self, params):
        self._onlyMarket()
        sp.set_type(params,sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        
        offer = sp.local('offer',self._offerExist(params))
        self._itemOwnerOnly(offer.value.owner, sp.source)
        self._sendAssets(offer.value.assets, sp.source)

        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat),
            self.data.offerStorage,
            entry_point = 'removeSwapOffer'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, offerId = params.offerId),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def acceptSwapOffer(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        offer = sp.local('offer',self._offerExist(params))
        
        item = self._getItem(sp.record(token = params.token, tokenId = params.tokenId))
        
        self._itemOwnerOnly(item.owner, sp.source)
        self._itemNotExpired(offer.value.timePeriod)

        self._sendAssets(offer.value.assets, item.owner)
        self._sendNFTs(
            sp.map({0:params.token}),
            sp.map({0:params.tokenId}),
            offer.value.owner
        )
        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat),
            self.data.offerStorage,
            entry_point = 'removeSwapOffer'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, offerId = params.offerId),
            sp.mutez(0),
            c
        )
        self._setRejectedOffer(
            params.token,
            params.tokenId
        )

    @sp.entry_point
    def claimRejectedSwapOffer(self, offerId):
        self._onlyMarket()
        sp.set_type(offerId, sp.TNat)
        offers = sp.view(
            'getRejectedSwapOffers',
            self.data.detailStorage,
            sp.source,
            t = sp.TMap(sp.TNat, self.structures.getSwapOfferType())
        ).open_some()

        sp.verify(offers.contains(offerId),"Swap : Offer does not exist")
        self._sendAssets(offers[offerId].assets, sp.source)

        c = sp.contract(
            sp.TRecord(from_ = sp.TAddress, _offerId = sp.TNat),
            self.data.detailStorage,
            entry_point = 'deleteSwapOffer'
        ).open_some()
        sp.transfer(
            sp.record(from_ = sp.source , _offerId = offerId),
            sp.mutez(0),
            c
        )

