import smartpy as sp

DetailStorage = sp.io.import_stored_contract("detailStorage")
ItemStorage = sp.io.import_stored_contract("itemStorage")
Whitelist = sp.io.import_stored_contract("whitelist")
Market = sp.io.import_stored_contract("market")
Vault = sp.io.import_stored_contract("vault")
fa12 = sp.io.import_stored_contract("fa12")
fa2 = sp.io.import_stored_contract("fa2")
Listing = sp.io.import_stored_contract("listing")
Swap = sp.io.import_stored_contract('swap')
Getters = sp.io.import_stored_contract('getters')
OfferStorage = sp.io.import_stored_contract('offerStorage')
PositionToken = sp.io.import_stored_contract('positionToken')
Reserve = sp.io.import_stored_contract('reserve')
ReserveUtils = sp.io.import_stored_contract('reserve_utils')

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")
PLATFORM_FEES = 500000

def mintNFT(nft, id, to, admin):
    tok0_md = fa2.FA2.make_metadata(
            name = "The Token One",
            decimals = 0,
            symbol= "TK0" )
    nft.mint(address = to,
                            amount = 1,
                            metadata = tok0_md,
                            token_id = id).run(sender = admin)

def mintFT(ft, to, amount, admin):
    ft.mint(address = to.address, value = amount).run(sender = admin)

def approveFT(ft, spender, amount, owner):
    ft.approve(spender = spender.address, value = amount).run(sender = owner)

def setOperator(nft1, owner, operator, id):
        nft1.update_operators([
                sp.variant("add_operator", nft1.operator_param.make(
                    owner = owner.address,
                    operator = operator.address,
                    token_id = id)),
            ]).run(sender = owner)

@sp.add_test(name = "NF3x Whitelisting")
def test():
    scenario = sp.test_scenario()
    scenario.h1("NF3x Whitelisting")

    admin = sp.test_account("Admin")
    user1 = sp.test_account("user1")
    user2 = sp.test_account("user2")
    user3 = sp.test_account("user3")

    ''' ------------------------- DEPLOYMENT + INIT ----------------------------------- '''

    detailStorage = DetailStorage.DetailStorage(_platformFee = sp.nat(PLATFORM_FEES), _admin = admin.address)
    scenario += detailStorage
    itemStorage = ItemStorage.ItemStorage(_admin = admin.address)
    scenario += itemStorage
    listing = Listing.Listing(_admin = admin.address)
    scenario += listing
    market = Market.Market(_admin = admin.address)
    scenario += market
    vault = Vault.Vault(_admin = admin.address)
    scenario += vault
    whitelist = Whitelist.Whitelist(_admin = admin.address)
    scenario += whitelist
    swap = Swap.Swap(_admin = admin.address)
    scenario += swap
    getters = Getters.Getters()
    scenario += getters
    offerStorage = OfferStorage.OfferStorage(_admin = admin.address)
    scenario += offerStorage
    reserve = Reserve.Reserve(_admin = admin.address)
    reserveUtils = ReserveUtils.ReserveUtils(_admin = admin.address)
    scenario += reserveUtils
    scenario += reserve
    positionToken = PositionToken.PositionToken(
            config = PositionToken.FA2_config(non_fungible = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = reserve.address
        )
    scenario += positionToken



    detailStorage.setWhitelist(whitelist.address).run(sender = admin.address)
    detailStorage.setListing(listing.address).run(sender = admin.address)
    detailStorage.setItemStorage(itemStorage.address).run(sender = admin.address)
    detailStorage.setSwap(swap.address).run(sender = admin.address)
    detailStorage.setReserve(reserve.address).run(sender = admin.address)
    detailStorage.setOfferStorage(offerStorage.address).run(sender = admin.address)
    detailStorage.setReserveUtils(reserveUtils.address).run(sender = admin.address)

    itemStorage.setListing(listing.address).run(sender = admin.address)
    itemStorage.setDetailStorage(detailStorage.address).run(sender = admin.address)
    itemStorage.setSwap(swap.address).run(sender = admin.address)
    itemStorage.setReserve(reserve.address).run(sender = admin.address)
    itemStorage.setReserveUtils(reserveUtils.address).run(sender = admin.address)

    listing.setItemStorage(itemStorage.address).run(sender = admin.address)
    listing.setDetailStorage(detailStorage.address).run(sender = admin.address)
    listing.setMarket(market.address).run(sender = admin.address)
    listing.setVault(vault.address).run(sender = admin.address)

    market.setWhitelist(whitelist.address).run(sender = admin.address)
    market.setListing(listing.address).run(sender = admin.address)
    market.setVault(vault.address).run(sender = admin.address)
    market.setSwap(swap.address).run(sender = admin.address)
    market.setReserve(reserve.address).run(sender = admin.address)

    vault.setListing(listing.address).run(sender = admin.address)
    vault.setMarket(market.address).run(sender = admin.address)
    vault.setSwap(swap.address).run(sender = admin.address)
    vault.setReserve(reserve.address).run(sender = admin.address)
    vault.setReserveUtils(reserveUtils.address).run(sender = admin.address)

    whitelist.setDetailStorage(detailStorage.address).run(sender = admin.address)
    whitelist.setMarket(market.address).run(sender = admin.address)
    
    swap.setMarket(market.address).run(sender = admin.address)
    swap.setVault(vault.address).run(sender = admin.address)
    swap.setItemStorage(itemStorage.address).run(sender = admin.address)
    swap.setDetailStorage(detailStorage.address).run(sender = admin.address)
    swap.setOfferStorage(offerStorage.address).run(sender = admin.address)

    getters.setWhitelist(whitelist.address).run(sender = admin.address)
    getters.setItemStorage(itemStorage.address).run(sender = admin.address)
    getters.setDetailStorage(detailStorage.address).run(sender = admin.address)
    getters.setOfferStorage(offerStorage.address).run(sender = admin.address)

    offerStorage.setSwap(swap.address).run(sender = admin.address)
    offerStorage.setDetailStorage(detailStorage.address).run(sender = admin.address)
    offerStorage.setReserve(reserve.address).run(sender = admin.address)

    reserve.setMarket(market.address).run(sender = admin.address)
    reserve.setItemStorage(itemStorage.address).run(sender = admin.address)
    reserve.setVault(vault.address).run(sender = admin.address)
    reserve.setPositionToken(positionToken.address).run(sender = admin.address)
    reserve.setDetailStorage(detailStorage.address).run(sender = admin.address)
    reserve.setOfferStorage(offerStorage.address).run(sender = admin.address)
    reserve.setReserveUtils(reserveUtils.address).run(sender = admin.address)

    reserveUtils.setReserve(reserve.address).run(sender = admin.address)
    reserveUtils.setItemStorage(itemStorage.address).run(sender = admin.address)
    reserveUtils.setVault(vault.address).run(sender = admin.address)
    reserveUtils.setDetailStorage(detailStorage.address).run(sender = admin.address)

    token_metadata = {
            "decimals"    : "18",               # Mandatory by the spec
            "name"        : "My Great Token",   # Recommended
            "symbol"      : "MGT",              # Recommended
            # Extra fields
            "icon"        : 'https://smartpy.io/static/img/logo-only.svg'
        }
    contract_metadata = {
            "" : "ipfs://QmaiAUj1FFNGYTu8rLBjc3eeN9cSKwaF8EGMBNDmhzPNFd",
        }
    
    token1 = fa12.FA12(
            admin.address,
            config              = fa12.FA12_config(support_upgradable_metadata = True),
            token_metadata      = token_metadata,
            contract_metadata   = contract_metadata
        )
    nft1 = fa2.FA2(
            config = fa2.FA2_config(non_fungible = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = admin.address
        )
    nft2 = fa2.FA2(
            config = fa2.FA2_config(non_fungible = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = admin.address
        )
    nft3 = fa2.FA2(
            config = fa2.FA2_config(non_fungible = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = admin.address
        )

    scenario += token1
    scenario += nft1
    scenario += nft2
    scenario += nft3
    
    # ''' ------------------------------- TESTS ----------------------------------------- '''

    market.whitelistNFTCollection(
        [nft1.address]
    ).run(sender = admin)

    market.whitelistFTContract(
        [NULL_ADDRESS]
    ).run(sender = admin)

    # Mint NFTs
    mintNFT(nft1, 0, admin.address, admin)
    mintNFT(nft1, 1, admin.address, admin)
    mintNFT(nft1, 2, admin.address, admin)
    mintNFT(nft1, 3, user2.address, admin)

    setOperator(nft1, admin, vault, 0)
    setOperator(nft1, admin, vault, 1)
    setOperator(nft1, admin, vault, 2)
    
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
  

    market.createListing(sp.record(
        token = nft1.address, tokenId = 1,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))

    market.createListing(sp.record(
        token = nft1.address, tokenId = 2,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:9000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
    

    # ----------------- Reserve ----------------

    # it should not reserve nft if not listed
    market.reserve(sp.record(
        token = nft1.address, tokenId = 3, reservationId = 1
    )).run(sender = admin, amount = sp.mutez(2000), valid = False)

    # # it should not reserve if item is expired
    market.reserve(sp.record(
        token = nft1.address, tokenId = 1, reservationId = 0
    )).run(sender = admin, amount = sp.mutez(2000), now = sp.timestamp(1000000) , valid = False)

    # # it should not reserve if called by the item owner
    market.reserve(sp.record(
        token = nft1.address, tokenId = 1, reservationId = 0
    )).run(sender = admin, amount = sp.mutez(2000), valid = False)

    # # it should not reserve if not listed for reservation
    market.reserve(sp.record(
        token = nft1.address, tokenId = 0, reservationId = 0
    )).run(sender = user1, amount = sp.mutez(2000), valid = False)

    # # it should not reserve if offer does not exist
    market.reserve(sp.record(
        token = nft1.address, tokenId = 1, reservationId = 5
    )).run(sender = user1, amount = sp.mutez(2000), valid = False)

    # # it should not reserve if insufficient funds provided
    market.reserve(sp.record(
        token = nft1.address, tokenId = 1, reservationId = 0
    )).run(sender = user1, amount = sp.mutez(100), valid = False)

    # it should reserve the nft, transfer deposit to the seller and mint position token with the required params
    market.reserve(sp.record(
        token = nft1.address, tokenId = 1, reservationId = 0
    )).run(sender = user1, amount = sp.mutez(1000))
    item = getters.getItem(sp.record(token = nft1.address, tokenId = 1))
    scenario.verify(item.listing.reserveListing.accepted == True)
    scenario.verify(item.listing.reserveListing.positionToken == 0)
    scenario.verify(positionToken.data.ledger[positionToken.ledger_key.make(user1.address, 0)].balance == 1)

    # it should not reserve if item is already reserved
    market.reserve(sp.record(
        token = nft1.address, tokenId = 1, reservationId = 0
    )).run(sender = user2, amount = sp.mutez(1000), valid = False) 

    # ----------------- New Reserve Offer ----------------

    # it should not make offer if called by the item owner
    market.newReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, 
        deposit = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({}), amounts = sp.map({})
        ),
        remaining = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({}), amounts = sp.map({})
        ),
        duration = sp.int(1000), timePeriod = sp.int(100000)
    )).run(sender = admin, amount = sp.mutez(1000), valid = False)

    # it should not make offer if time period is 0
    market.newReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, 
        deposit = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:10000})
        ),
        remaining = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000000})
        ),
        duration = sp.int(1000), timePeriod = sp.int(0)
    )).run(sender = user1, amount = sp.mutez(1000), valid = False)

    # it shoudl not make offer if duration is 0
    market.newReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, 
        deposit = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:10000})
        ),
        remaining = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000000})
        ),
        duration = sp.int(0), timePeriod = sp.int(100000)
    )).run(sender = user1, amount = sp.mutez(10000), valid = False)

    # it should make reservation offer using only FTs
    market.newReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, 
        deposit = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:10000})
        ),
        remaining = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000000})
        ),
        duration = sp.int(10000), timePeriod = sp.int(100000)
    )).run(sender = user1, amount = sp.mutez(10000))

    # it should make reservation offer using NFTs + FTs
    market.whitelistFTContract(
        [token1.address]
    ).run(sender = admin)

    mintNFT(nft1, 4, user1.address, admin)
    mintNFT(nft1, 5, user1.address, admin)
    mintNFT(nft1, 6, user2.address, admin)
    mintNFT(nft1, 7, user2.address, admin)

    setOperator(nft1, user1, vault, 4)
    setOperator(nft1, user1, vault, 5)
    setOperator(nft1, user2, vault, 6)
    setOperator(nft1, user2, vault, 7)

    mintFT(token1, user1, 1000000, admin)
    approveFT(token1, vault, 10000, user1)

    market.createListing(sp.record(
        token = nft1.address, tokenId = 6,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:9000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = user2, amount = sp.mutez(PLATFORM_FEES))

    market.newReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, 
        deposit = sp.record(
            tokens = sp.map({0:nft1.address, 1:nft1.address}), tokenIds = sp.map({0:4, 1:5}),
            paymentTokens = sp.map({0:NULL_ADDRESS, 1:token1.address}), amounts = sp.map({0:10000, 1:10000})
        ),
        remaining = sp.record(
            tokens = sp.map({0:nft1.address}), tokenIds = sp.map({0:7}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000000})
        ),
        duration = sp.int(10000), timePeriod = sp.int(100000)
    )).run(sender = user1, amount = sp.mutez(10000))

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 4)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 5)].balance == 1)
    scenario.verify(token1.data.balances[vault.address].balance == 10000)

    market.newReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, 
        deposit = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:10000})
        ),
        remaining = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}),
            paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000000})
        ),
        duration = sp.int(10000), timePeriod = sp.int(100000)
    )).run(sender = user2, amount = sp.mutez(10000))

    # --------------- Cancel Reserve Offer ----------------

    # it should not cancel offer if it does not exist
    market.cancelReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, offerId = 10
    )).run(sender = user2, valid = False)

    scenario.show(vault.balance)

    # it should cancel offer, return the locked assets and remove this entry from the mapping
    market.cancelReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, offerId = 2
    )).run(sender = user2)

    scenario.show(vault.balance)

    # --------------- Accept Reserve Offer -----------------

    # it should accept reserve offer, transfer deposit to the seller and mint position token with the required params
    market.acceptReserveOffer(sp.record(
        token = nft1.address, tokenId = 2, offerId = 1
    )).run(sender = admin)
    scenario.verify(positionToken.data.ledger[positionToken.ledger_key.make(user1.address, 1)].balance == 1)

    item = getters.getItem(sp.record(token = nft1.address, tokenId = 2))
    scenario.show(item)

    # ----------------- Pay Remaining -------------------

    # it should not pay remainig if not yet reserved
    market.payRemaining(sp.record(
        token = nft1.address, tokenId = 6
    )).run(sender = user2, valid = False)

    # it should not pay remaining if not called by the position token owner
    market.payRemaining(sp.record(
        token = nft1.address, tokenId = 2
    )).run(sender = user2, valid = False)

    # it should send the remainig to the seller, transfer the NFT to the buyer and burn the position token
    positionToken.transfer(
        sp.list([sp.record(
            from_=user1.address, 
            txs=sp.list([sp.record(
                amount=1, 
                to_=user2.address, 
                token_id=1)
            ]))
        ])
    ).run(sender = user1)
    market.payRemaining(sp.record(
        token = nft1.address, tokenId = 2
    )).run(sender = user2, amount = sp.mutez(1000000))

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 7)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(user2.address, 2)].balance == 1)

    item = getters.getItem(sp.record(token = nft1.address, tokenId = 2))
    scenario.show(item)

    # ------------------- Claim defaulted payment -------------------

    # it should not claim if item is not reserved
    market.claimDefaultedPayment(sp.record(
        token = nft1.address, tokenId = 6
    )).run(sender = user2, valid = False)

    # it should not claim if not yet defaulted
    market.claimDefaultedPayment(sp.record(
        token = nft1.address, tokenId = 1
    )).run(sender = admin, now = sp.timestamp(10000), valid = False)

    # it should claim defaulted payment and burn the position token
    market.claimDefaultedPayment(sp.record(
        token = nft1.address, tokenId = 1
    )).run(sender = admin, now = sp.timestamp(964000))

    item = getters.getItem(sp.record(token = nft1.address, tokenId = 1))
    scenario.show(item)

    # it should not pay remaining if claimed by seller
    market.payRemaining(sp.record(
        token = nft1.address, tokenId = 1
    )).run(sender = user1, amount = sp.mutez(100000), valid = False)


    # --------------- Claim rejected reserve offer ---------------------

    # it should not claim if offer does not exist
    market.claimRejectedReserveOffer(10).run(sender = user1, valid = False)

    # it should claim rejected offer, refund the owner and delte this entry form the map
    market.claimRejectedReserveOffer(0).run(sender = user1)




