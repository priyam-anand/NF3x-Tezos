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
            offerStorage = NULL_ADDRESS
        )

    # Access Setter Functions
    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        self.data.market = _market

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

    def _notItemOwner(self, add1, add2):
        sp.verify(~(add1 == add2),"Reserve : Not Item Owner")

    def _itemOwnerOnly(self, add1, add2):
        sp.verify(add1 == add2,"Reserve : Item Owner only")

    def _onlyMarket(self): 
        sp.verify(self.data.market == sp.sender, "Reserve : Only Approved Contract")

    def _checkPayment(self, token, amount, _value):
        total = sp.local('total',sp.nat(0))
        sp.for i in token.keys():
            sp.if token[i] == NULL_ADDRESS:
                total.value += amount[i]
        sp.verify(total.value <= sp.utils.mutez_to_nat(_value),"Reserve : Insufficient Funds")

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

    def _transferAssets(self, paymentToken, amount, to):
        sp.if ~(paymentToken == NULL_ADDRESS):
            self._receiveFTs(
                sp.map({0:paymentToken}), 
                sp.map({0:amount})
            )
        self._sendFTs(
            sp.map({0:paymentToken}), 
            sp.map({0:amount}),
            to
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

    def _assetSupported(self, offerAssets):
        sp.for i in offerAssets.tokens.keys():
            sp.verify(sp.view(
                'isNFTSupported',
                self.data.detailStorage,
                offerAssets.tokens[i],
                t = sp.TBool
            ).open_some(),"Reserve : Not Supported")
        sp.for i in offerAssets.paymentTokens.keys():
            sp.verify(sp.view(
                'isFTSupported',
                self.data.detailStorage,
                offerAssets.paymentTokens[i],
                t = sp.TBool
            ).open_some(),"Reserve : Not Supported")

    def _checkEmptyAssets(self, offerAssets):
        sp.verify((sp.len(offerAssets.tokens.keys()) > 0) | (sp.len(offerAssets.paymentTokens.keys()) > 0), "Reserve : Empty Asset")
        sp.if sp.len(offerAssets.tokens.keys()) == 0:
            ttl = sp.local('value', sp.nat(0))
            sp.for i in offerAssets.paymentTokens.keys():
                ttl.value += offerAssets.amounts[i]
            sp.verify(ttl.value > 0, "Reserve : Empty Asset")

    def _checkReserveOfferRequirements(self, item, timePeriod, deposit, remaining, duration, value):
        self._notItemOwner(sp.source, item.owner)
        sp.verify(timePeriod > 0,"Reserve : Invalid Time Period")
        self._assetSupported(deposit)
        self._assetSupported(remaining)

        self._checkEmptyAssets(deposit)
        self._checkEmptyAssets(remaining)

        sp.verify(duration > 0,"Reserve : Invalid Params")

        self._checkPayment(
            deposit.paymentTokens, 
            deposit.amounts, 
            value
        )

    def _receiveAssets(self, offerAssets):
        self._receiveNFTs(offerAssets.tokens, offerAssets.tokenIds)
        self._receiveFTs(offerAssets.paymentTokens, offerAssets.amounts)

    def _sendAssets(self, offerAssets, to):
        self._sendNFTs(offerAssets.tokens, offerAssets.tokenIds, to)
        self._sendFTs(offerAssets.paymentTokens, offerAssets.amounts, to)

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
            self._itemReset(sp.map({0:self.data.positionToken}), sp.map({0:positionTokenId}),NULL_ADDRESS) 
        
    def _isAccepted(self, item):
        sp.verify(item.listing.reserveListing.accepted,"Reserve : Invalid Status")
        

    # Core Functions
    @sp.entry_point
    def reserve(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat,
            reservationId = sp.TNat, value = sp.TMutez
        ))

        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())

        sp.verify(item.value.status == 1,"Reserve : Invalid Status")
        self._itemNotExpired(item.value.listing.timePeriod)
        self._notItemOwner(item.value.owner, sp.source)

        sp.verify(item.value.listing.listingType[1] == True,"Reserve : Item Now listed for reservation")
        sp.verify(item.value.listing.reserveListing.deposit.contains(params.reservationId),"Reserve : Offer does not exist")

        self._checkPayment(
            sp.map({0:item.value.listing.reserveListing.reserveToken[params.reservationId]}),
            sp.map({0:item.value.listing.reserveListing.deposit[params.reservationId]}),
            params.value
        )
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
                'count_tokens',
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
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat, 
            deposit = self.structures.getAssetsType(), remaining = self.structures.getAssetsType(), duration = sp.TInt, 
            timePeriod = sp.TInt, value = sp.TMutez
        ))
        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())

        self._checkReserveOfferRequirements(item.value, params.timePeriod, params.deposit, params.remaining, params.duration, params.value)
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
        self._onlyMarket()
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

        self._itemOwnerOnly(offer.owner, sp.source)
        self._sendAssets(offer.deposit, sp.source)
        self._removeReserveOffer(params.token, params.tokenId, params.offerId)

    @sp.entry_point
    def acceptReserveOffer(self, params):
        self._onlyMarket()
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

        self._itemOwnerOnly(item.value.owner, sp.source)
        self._itemNotExpired(offer.timePeriod)

        self._sendAssets(offer.deposit, sp.source)
        self._removeReserveOffer(params.token, params.tokenId, params.offerId)

        self._setRejectedOffer(
            params.token,
            params.tokenId
        )

        positionTokenId = sp.local('positionTokenId', 
            sp.view(
                'count_tokens',
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
        self._onlyMarket()
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
        self._checkPayment(
            details.remaining.paymentTokens,
            details.remaining.amounts,
            params.value
        )
        self._receiveAssets(details.remaining)
        self._sendAssets(details.remaining, item.value.owner)

        self._sendNFTs(
            sp.map({0:params.token}),
            sp.map({0:params.tokenId}),
            sp.source
        )
        self._burnPositionToken(positionTokenId.value)

    @sp.entry_point
    def claimDefaultedPayment(self, params):
        self._onlyMarket()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, 
            tokenId = sp.TNat
        ))
        item = sp.local('item',sp.view(
            'getItemByAddress', self.data.itemStorage, sp.record(token = params.token, tokenId = params.tokenId), t = self.structures.getItemType() 
        ).open_some())        
        self._isAccepted(item.value)
        self._itemOwnerOnly(item.value.owner, sp.source)
        positionTokenId = item.value.listing.reserveListing.positionToken
        details = sp.view(
            'getReservationDetails', 
            self.data.positionToken, 
            positionTokenId,
            t = self.structures.getReservationDetailType()
        ).open_some()

        sp.verify(details.dueDate < sp.now,"Reserve : Not Defaulted")

        self._sendNFTs(
            sp.map({0:params.token}),
            sp.map({0:params.tokenId}),
            sp.source
        )
        self._burnPositionToken(positionTokenId)

    @sp.entry_point
    def claimRejectedReserveOffer(self, offerId):
        self._onlyMarket()
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


