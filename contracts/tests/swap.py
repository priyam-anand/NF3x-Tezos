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
    
    ''' ------------------------------- TESTS ----------------------------------------- '''

    market.whitelistNFTCollection(
        [nft1.address]
    ).run(sender = admin)

    market.whitelistFTContract(
        [NULL_ADDRESS]
    ).run(sender = admin)

    # Mint NFTs
    mintNFT(nft1, 0, admin.address, admin)
    mintNFT(nft1, 1, user1.address, admin)
    
    # ---------------- DIRECT SWAP --------------

    # it should not perform direct swap if item not listed
    market.directSwap(sp.record(
        token = nft1.address, tokenId = 1
    )).run(sender = user1,amount = sp.mutez(1000), valid = False)

    # it should not perform direct swap if listing has expired


    # it should not perfomr direct swap if called by the item owner
    setOperator(nft1, admin, vault, 0)
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
    market.directSwap(sp.record(
        token = nft1.address, tokenId = 0
    )).run(sender = admin, amount = sp.mutez(10000000), valid = False)

    # it should not perform direct swap if not listed for it


    # it should not perform direct swap if insufficient funds provided
    market.directSwap(sp.record(
        token = nft1.address, tokenId = 0
    )).run(sender = user1, amount = sp.mutez(1000000), valid = False)

    # it should perform direct swap
    market.directSwap(sp.record(
        token = nft1.address, tokenId = 0
    )).run(sender = user1, amount = sp.mutez(10000000))

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 0)].balance == 0)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(user1.address, 0)].balance == 1)

    # ------------------ DIRECT SWAP OFFER --------------------

    setOperator(nft1, user1, vault, 0)
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = user1, amount = sp.mutez(PLATFORM_FEES))

    # it should not make offer if called by item owner
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({}), amounts = sp.map({})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user1, amount = sp.mutez(100), valid = False)

    # it should not make offer if invalid time period
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({}), amounts = sp.map({})
        ), timePeriod = sp.int(0), 
    )).run(sender = user2, amount = sp.mutez(100), valid = False)

    # it should not make offer if empty assets
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({}), amounts = sp.map({})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(0), valid = False)

    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:0})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(0), valid = False)

    # it should not make offer if FTs not supported
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({0:token1.address}), amounts = sp.map({0:1000})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(0), valid = False)

    # it should not make offer if NFTs not supported
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({0:nft2.address}), tokenIds = sp.map({0:0}), paymentTokens = sp.map({}), amounts = sp.map({})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(0), valid = False)

    # it should not make offer if insufficient funds
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(10), valid = False)
    
    # it should make offer with only FTs
    market.whitelistFTContract(
        [token1.address]
    ).run(sender = admin)
    
    mintFT(token1, user2, 1000000, admin)
    approveFT(token1, vault, 100000, user2)
    mintFT(token1, admin, 1000000, admin)
    approveFT(token1, vault, 100000, admin)

    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({0:NULL_ADDRESS}), amounts = sp.map({0:1000})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(1000))
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({}), tokenIds = sp.map({}), paymentTokens = sp.map({0:token1.address}), amounts = sp.map({0:10000})
        ), timePeriod = sp.int(1000), 
    )).run(sender = user2, amount = sp.mutez(0))

    scenario.verify(token1.data.balances[vault.address].balance == 10000)

    # it should make offer with only NFTs
    mintNFT(nft1, 2, admin.address, admin)
    mintNFT(nft1, 3, admin.address, admin)
    mintNFT(nft1, 4, admin.address, admin)
    setOperator(nft1, admin, vault, 2)
    setOperator(nft1, admin, vault, 3)
    setOperator(nft1, admin, vault, 4)

    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
            tokens = sp.map({0:nft1.address}), tokenIds = sp.map({0:2}), paymentTokens = sp.map({}), amounts = sp.map({})
        ), timePeriod = sp.int(1000), 
    )).run(sender = admin)

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 2)].balance == 1)

    # it should make offer with FTs + NFTs
    market.newSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, 
        offerAssets = sp.record(
                tokens = sp.map({0:nft1.address, 1:nft1.address}), tokenIds = sp.map({0:3, 1:4}), 
                paymentTokens = sp.map({0:token1.address, 1:NULL_ADDRESS}), amounts = sp.map({0:10000, 1:10000})
            ), 
        timePeriod = sp.int(1000), 
    )).run(sender = admin, amount = sp.mutez(10000))

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 3)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 4)].balance == 1)

    # ------------------ CANCEL DIRECT SWAP OFFER -------------

    # it should not cancel offer if it does not exist
    market.cancelSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 9
    )).run(sender = admin, valid = False)    

    # it should not cancel offer if not called by the offer owner
    market.cancelSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 0
    )).run(sender = user1, valid = False)

    # it should cancel offer, return the amount, and remove the entry from the array
    market.cancelSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 0
    )).run(sender = user2)

    # ------------------ ACCEPT DIRECT SWAP OFFER -------------

    # it should not accept offer if it does not exist
    market.acceptSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 500   
    )).run(sender = admin, valid = False)

    # it should not accept offer if not called by the item owner
    market.acceptSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 1   
    )).run(sender = user2, valid = False)

    # it should not accept offer if offer has expired
    market.acceptSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 1
    )).run(sender = user1, now = sp.timestamp(100000), valid = False)

    # it should accept offer, exchange the assets, remove this offer and set rejected offers 
    market.acceptSwapOffer(sp.record(
        token = nft1.address, tokenId = 0, offerId = 3
    )).run(sender = user1)
    fnlBal = token1.data.balances[user1.address].balance
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(user1.address, 3)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(user1.address, 4)].balance == 1)
    
    scenario.verify(fnlBal == 10000)

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 0)].balance == 1)
    
    # ------------------ CLAIM REJECTED DIRECT SWAP OFFER ----------

    # it should not claim rejected offer if it does not exist
    market.claimRejectedSwapOffer(2).run(sender = user1, valid = False)

    # it should claim rejected offer, return the assets and remove this entry from the map
    market.claimRejectedSwapOffer(0).run(sender = admin)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 2)].balance == 1)

    market.claimRejectedSwapOffer(0).run(sender = user2)

