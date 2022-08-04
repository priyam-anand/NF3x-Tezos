import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Reserve(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            market = NULL_ADDRESS,
            itemStorage = NULL_ADDRESS,
            vault = NULL_ADDRESS,
            positionToken = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS,
            offerStorage = NULL_ADDRESS,
            reserveUtils = NULL_ADDRESS
        )

    # Access Setter Functions
    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        self.data.market = _market

    @sp.entry_point
    def setReserveUtils(self, _reserveUtils):
        sp.set_type(_reserveUtils, sp.TAddress)
        self.data.reserveUtils = _reserveUtils

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage

    @sp.entry_point
    def setVault(self, _vault):
        sp.set_type(_vault, sp.TAddress)
        self.data.vault = _vault
    
    @sp.entry_point
    def setPositionToken(self, _positionToken):
        sp.set_type(_positionToken, sp.TAddress)
        self.data.positionToken = _positionToken
        
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage

    @sp.entry_point
    def setOfferStorage(self, _offerStorage):
        sp.set_type(_offerStorage, sp.TAddress)
        self.data.offerStorage = _offerStorage

    # Utility Functions
    def _itemNotExpired(self, timePeriod):
        sp.verify(sp.now < timePeriod, "Reserve : Item Expired")
    
    def _notItemOwner(self,params):
        sp.set_type(params, sp.TRecord(add1 = sp.TAddress, add2 = sp.TAddress))
        sp.verify(~(params.add1 == params.add2),"Reserve : Not Item Owner")

    def _itemOwnerOnly(self, params):
        sp.set_type(params, sp.TRecord(add1 = sp.TAddress, add2 = sp.TAddress))
        sp.verify(params.add1 == params.add2,"Reserve : Item Owner only")

    def _onlyMarket(self, params):
        sp.set_type(params, sp.TUnit) 
        sp.verify(self.data.market == sp.sender, "Reserve : Only Approved Contract")

    def _transferAssets(self, paymentToken, amount, to):
        c = sp.contract(
            sp.TRecord(
                paymentToken = sp.TAddress, 
                amount = sp.TNat, 
                to = sp.TAddress
            ),self.data.reserveUtils,
            entry_point = 'transferAssets'
        ).open_some()
        sp.transfer(
            sp.record(paymentToken = paymentToken, amount = amount, to = to),
            sp.mutez(0),
            c
        )
        
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

    def _reserveItem(self, token, tokenId, positionTokenId):
        c = sp.contract(
            sp.TRecord(token=sp.TAddress, tokenId=sp.TNat, positionToken = sp.TNat),
            self.data.itemStorage,
            entry_point = 'reserveItem',
        ).open_some()
        sp.transfer(
            sp.record(token = token, tokenId = tokenId, positionToken = positionTokenId),
            sp.mutez(0),
            c
        )

    def _itemReset(self, params):
        sp.set_type(
            params, sp.TRecord(
                tokens = sp.TMap(sp.TNat, sp.TAddress),
                tokenIds = sp.TMap(sp.TNat, sp.TNat),
                owner = sp.TAddress
            ))
        c = sp.contract(
                sp.TRecord(
                    tokens = sp.TMap(sp.TNat, sp.TAddress),
                    tokenIds = sp.TMap(sp.TNat, sp.TNat),
                    owner = sp.TAddress
                ), self.data.reserveUtils,
                entry_point = 'itemReset' 
        ).open_some()
        sp.transfer(
            params,
            sp.mutez(0),
            c
        )

    def _receiveAssets(self, offerAssets):
        c = sp.contract(
            self.structures.getAssetsType(),
            self.data.reserveUtils,
            entry_point = 'receiveAssets'
        ).open_some()
        sp.transfer(
            offerAssets,
            sp.mutez(0),
            c
        )

    def _sendAssets(self, offerAssets, to):
        c = sp.contract(
            sp.TRecord(
                offerAssets = self.structures.getAssetsType(),
                to = sp.TAddress
            ), self.data.reserveUtils,
            entry_point = 'sendAssets'
        ).open_some()
        sp.transfer(
            sp.record(
                offerAssets = offerAssets,
                to = to
            ), sp.mutez(0),
            c
        )

    def _sendNFTs(self, params):
        sp.set_type(params, sp.TRecord(
            tokens = sp.TMap(sp.TNat, sp.TAddress),
            tokenIds = sp.TMap(sp.TNat, sp.TNat),
            to = sp.TAddress
        ))
        c = sp.contract(
                sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat),
                self.data.vault,
                entry_point = 'sendFA2'
            ).open_some()
        sp.for i in sp.range(0, sp.len(params.tokens)):
            sp.transfer(
                sp.record(token = params.tokens[i], to_ = params.to, tokenId = params.tokenIds[i]),
                sp.mutez(0),
                c
            )
        self._itemReset(sp.record(
            tokens = params.tokens,    
            tokenIds = params.tokenIds, 
            owner = NULL_ADDRESS
        ))
        
    def _removeReserveOffer(self, token, tokenId, offerId):
        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat),
            self.data.offerStorage,
            entry_point = 'removeReserveOffer'
        ).open_some()
        sp.transfer(
            sp.record(token = token, tokenId = tokenId, offerId = offerId),
            sp.mutez(0),
            c
        )

    def _mintPositionToken(self, positionTokenId, reservationDetails, to):
        c = sp.contract(
            sp.TRecord(token_id = sp.TNat, amount = sp.TNat, address = sp.TAddress, reservationDetails = self.structures.getReservationDetailType()),
            self.data.positionToken,
            entry_point = 'mint'
        ).open_some()
        sp.transfer(
            sp.record(
                token_id = positionTokenId, amount = 1, address = to, reservationDetails = reservationDetails
            ), sp.mutez(0),
            c
        )        

    def _burnPositionToken(self, positionTokenId):
        item_ = sp.local('item_',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = self.data.positionToken, tokenId = positionTokenId), t = self.structures.getItemType() 
        ).open_some())
         
        sp.if item_.value.status == 1:
            self._setRejectedOffer(
                self.data.positionToken,
                positionTokenId
            )
            self._itemReset(sp.record(
                tokens = sp.map({0:self.data.positionToken}), 
                tokenIds = sp.map({0:positionTokenId}),
                owner = NULL_ADDRESS
            )) 
        
    def _isAccepted(self, item):
        sp.verify(item.listing.reserveListing.accepted,"Reserve : Invalid Status")
        

    # Core Functions
    @sp.entry_point
    def reserve(self, params):
        self._onlyMarket(sp.unit)
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            reservationId = sp.TNat, value = sp.TMutez
        ))

        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())

        sp.verify(item.value.status == 1,"Reserve : Invalid Status")
        self._itemNotExpired(item.value.listing.timePeriod)
        self._notItemOwner(sp.record(add1 = item.value.owner, add2 = sp.source))

        sp.verify(item.value.listing.listingType[1] == True,"Reserve : Item Now listed for reservation")
        sp.verify(item.value.listing.reserveListing.deposit.contains(params.reservationId),"Reserve : Offer does not exist")

        sp.verify(sp.view(
            'checkPayment', self.data.reserveUtils, sp.record(
                    token = sp.map({sp.nat(0):item.value.listing.reserveListing.reserveToken[params.reservationId]}),
                    amount = sp.map({sp.nat(0):item.value.listing.reserveListing.deposit[params.reservationId]}),
                    _value = params.value
                ), t = sp.TBool
            ).open_some() == True, "Reserve : Insufficient Funds")

        self._transferAssets(
            item.value.listing.reserveListing.reserveToken[params.reservationId],
            item.value.listing.reserveListing.deposit[params.reservationId],
            item.value.owner
        )
        self._setRejectedOffer(
            params.token,
            params.tokenId
        )

        positionTokenId = sp.local('positionTokenId', 
            sp.view(
                'getTotalTokens',
                self.data.positionToken,
                sp.unit, t = sp.TNat
            ).open_some()
        )

        _deposit = sp.local('_deposit',self.structures.getDefaultAsset())
        _deposit.value.paymentTokens[0] = item.value.listing.reserveListing.reserveToken[params.reservationId]
        _deposit.value.amounts[0] = item.value.listing.reserveListing.deposit[params.reservationId]

        _remaining = sp.local('_remaining',self.structures.getDefaultAsset())
        _remaining.value.paymentTokens[0] = item.value.listing.reserveListing.reserveToken[params.reservationId]
        _remaining.value.amounts[0] = item.value.listing.reserveListing.remaining[params.reservationId]

        _reservationDetails = sp.record(
            token = params.token, tokenId = params.tokenId,
            owner = item.value.owner, deposit = _deposit.value, remaining = _remaining.value,
            duration = item.value.listing.reserveListing.duration[params.reservationId], dueDate = sp.now.add_seconds(item.value.listing.reserveListing.duration[params.reservationId])
        )

        self._mintPositionToken(positionTokenId.value, _reservationDetails, sp.source)
        self._reserveItem(params.token, params.tokenId, positionTokenId.value)

    @sp.entry_point
    def newReserveOffer(self, params):
        self._onlyMarket(sp.unit)
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, 
            deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, 
            timePeriod = sp.TInt, value = sp.TMutez
        ))
        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())

        sp.verify(
            sp.view(
                'checkReserveOfferRequirements', self.data.reserveUtils ,
                sp.record(
                    item = item.value,
                    timePeriod = params.timePeriod,
                    deposit = params.deposit, 
                    remaining = params.remaining, 
                    duration = params.duration, 
                    value = params.value
                ), t = sp.TBool
            ).open_some() == True
            ,"Reserve : Invalid Offer"
        )

        self._receiveAssets(params.deposit)
        c = sp.contract(
            sp.TRecord(token = sp.TAddress, tokenId = sp.TNat, deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, timePeriod = sp.TInt),
            self.data.offerStorage, 
            entry_point = 'addNewReserveOffer'
        ).open_some()
        sp.transfer(
            sp.record(token = params.token, tokenId = params.tokenId, deposit = params.deposit, remaining = params.remaining, duration = params.duration, timePeriod = params.timePeriod),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def cancelReserveOffer(self, params):
        self._onlyMarket(sp.unit)
        sp.set_type(params,sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        offers = sp.view(
            'getOffers', self.data.offerStorage,
            sp.record(token = params.token, tokenId = params.tokenId),
            t = self.structures.getOfferType()
        ).open_some()
        sp.verify(offers.reserveOffers.contains(params.offerId),"Reserve : Offer does not exist")
        offer = offers.reserveOffers[params.offerId]

        self._itemOwnerOnly(sp.record(add1 = offer.owner, add2 = sp.source))
        self._sendAssets(offer.deposit, sp.source)
        self._removeReserveOffer(params.token, params.tokenId, params.offerId)

    @sp.entry_point
    def acceptReserveOffer(self, params):
        self._onlyMarket(sp.unit)
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, offerId = sp.TNat
        ))
        offers = sp.view(
            'getOffers', self.data.offerStorage,
            sp.record(token = params.token, tokenId = params.tokenId),
            t = self.structures.getOfferType()
        ).open_some()
        sp.verify(offers.reserveOffers.contains(params.offerId),"Reserve : Offer does not exist")
        offer = offers.reserveOffers[params.offerId]

        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())

        self._itemOwnerOnly(sp.record(add1 = item.value.owner, add2 = sp.source))
        self._itemNotExpired(offer.timePeriod)

        self._sendAssets(offer.deposit, sp.source)
        self._removeReserveOffer(params.token, params.tokenId, params.offerId)

        self._setRejectedOffer(
            params.token,
            params.tokenId
        )

        positionTokenId = sp.local('positionTokenId', 
            sp.view(
                'getTotalTokens',
                self.data.positionToken,
                sp.unit, t = sp.TNat
            ).open_some()
        )
        _reservationDetails = sp.record(
            token = params.token, tokenId = params.tokenId,
            owner = item.value.owner, deposit = offer.deposit, remaining = offer.remaining,
            duration = offer.duration, dueDate = sp.now.add_seconds(offer.duration)
        )
        self._mintPositionToken(positionTokenId.value, _reservationDetails, offer.owner)
        self._reserveItem(params.token, params.tokenId, positionTokenId.value)

    @sp.entry_point
    def payRemaining(self, params):
        self._onlyMarket(sp.unit)
        sp.set_type(params,sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, value = sp.TMutez
        ))
        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())

        self._isAccepted(item.value)
        positionTokenId = sp.local('positionTokenId',item.value.listing.reserveListing.positionToken)

        bal = sp.view(
            'get_balance_onchain',
            self.data.positionToken,
            sp.record(owner = sp.source, token_id = positionTokenId.value),
            t = sp.TNat
        ).open_some()

        sp.verify(bal > 0, "Reserve : Item owner only")

        details = sp.view(
            'getReservationDetails', 
            self.data.positionToken, 
            positionTokenId.value,
            t = self.structures.getReservationDetailType()
        ).open_some()

        self._itemNotExpired(details.dueDate)
        sp.verify(sp.view(
            'checkPayment', self.data.reserveUtils, sp.record(
                    token = details.remaining.paymentTokens,
                    amount = details.remaining.amounts,
                    _value = params.value
                ), t = sp.TBool
            ).open_some() == True, "Reserve : Insufficient Funds")

        self._receiveAssets(details.remaining)
        self._sendAssets(details.remaining, item.value.owner)

        self._sendNFTs(sp.record(
            tokens = sp.map({0:params.token}),
            tokenIds = sp.map({0:params.tokenId}),
            to = sp.source
        ))
        self._burnPositionToken(positionTokenId.value)

    @sp.entry_point
    def claimDefaultedPayment(self, params):
        self._onlyMarket(sp.unit)
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, 
            tokenId = sp.TNat
        ))
        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())        
        self._isAccepted(item.value)
        self._itemOwnerOnly(sp.record(add1 = item.value.owner, add2 = sp.source))
        positionTokenId = item.value.listing.reserveListing.positionToken
        details = sp.view(
            'getReservationDetails', 
            self.data.positionToken, 
            positionTokenId,
            t = self.structures.getReservationDetailType()
        ).open_some()

        sp.verify(details.dueDate < sp.now,"Reserve : Not Defaulted")

        self._sendNFTs(sp.record(
            tokens = sp.map({0:params.token}),
            tokenIds = sp.map({0:params.tokenId}),
            to = sp.source
        ))
        self._burnPositionToken(positionTokenId)

    @sp.entry_point
    def claimRejectedReserveOffer(self, offerId):
        self._onlyMarket(sp.unit)
        sp.set_type(offerId, sp.TNat)

        offers = sp.view(
            'getRejectedReserveOffers',
            self.data.detailStorage,
            sp.source,
            t = sp.TMap(sp.TNat, self.structures.getReserveOfferType())
        ).open_some()

        sp.verify(offers.contains(offerId),"Reserve : Offer does not exist")
        self._sendAssets(offers[offerId].deposit, sp.source)
        c = sp.contract(
            sp.TRecord(from_ = sp.TAddress, _offerId = sp.TNat),
            self.data.detailStorage,
            entry_point = 'deleteReserveOffer'
        ).open_some()
        sp.transfer(
            sp.record(from_ = sp.source , _offerId = offerId),
            sp.mutez(0),
            c
        )
