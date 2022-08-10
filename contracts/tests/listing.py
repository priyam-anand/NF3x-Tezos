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
    mintNFT(nft1, 1, admin.address, admin)
    mintNFT(nft1, 2, admin.address, admin)
    mintNFT(nft1, 3, admin.address, admin)

    # --------- CREATE DIRECT SWAP LISTING --------- #

    # it should not list if directly called the listing contract
    listing.createListing(sp.record(
        token = nft1.address, tokenId = 0, 
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:0}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = 10, value = sp.mutez(PLATFORM_FEES)
    )).run(sender = admin, valid = False) 

    # it should not list nft if enough fees not sent
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = 100
    )).run(sender = admin, amount = sp.mutez(0), valid = False)

    # it should not list nft if time period is 0
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(0)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list nft if collection is not supported
    market.createListing(sp.record(
        token = nft2.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list nft if not approved by owner
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    setOperator(nft1, admin, vault, 0)
    # it should not list if no type of listing params are passed
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list if asking FT is not supported
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:token1.address}), directSwapPrice = sp.map({0:10000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}),swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list if asking price is 0
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:0}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should transfer NFT to the vault, initialize item, set item's owner as sp.sender, set direct swap details to the item listing, mark the item as listed ie status = 2 
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({}), deposits = sp.map({}), remainings = sp.map({}),
        durations = sp.map({}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False, timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
    
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 0)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 0)].balance == 0)

    setOperator(nft1, admin, vault, 1)
    setOperator(nft1, admin, vault, 2)

    #------------------- Reserve Listing ------------------

    # it should not list for reserve if asking FT is not supported
    market.createListing(sp.record(
        token = nft1.address, tokenId = 1,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:token1.address}), deposits = sp.map({0:100, 1:100}), 
        remainings = sp.map({0:100, 1:100}), durations = sp.map({0:100, 1:100}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list for reserve if params are invalid
    market.createListing(sp.record(
        token = nft1.address, tokenId = 1,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({0:NULL_ADDRESS}), deposits = sp.map({0:0}), 
        remainings = sp.map({0:100}), durations = sp.map({0:100}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)
    market.createListing(sp.record(
        token = nft1.address, tokenId = 1,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({0:NULL_ADDRESS}), deposits = sp.map({0:100}), 
        remainings = sp.map({0:0}), durations = sp.map({0:100}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)
    market.createListing(sp.record(
        token = nft1.address, tokenId = 1,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({0:NULL_ADDRESS}), deposits = sp.map({0:100}), 
        remainings = sp.map({0:0}), durations = sp.map({0:100}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should list nft for reserve
    market.createListing(sp.record(
        token = nft1.address, tokenId = 1,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 1)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 1)].balance == 0)

    # it should list nft for reserve  + direct swap
    market.createListing(sp.record(
        token = nft1.address, tokenId = 2,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:9000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 2)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 2)].balance == 0)

    # it should not list nft if invalid status
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)
    
    # --------------- NFT Swap listing ------------------

    mintNFT(nft1, 4, admin.address, admin)
    mintNFT(nft1, 5, admin.address, admin)
    setOperator(nft1, admin, vault, 4)
    setOperator(nft1, admin, vault, 5)

    # it should not list if FT is not supported
    market.createListing(sp.record(
        token = nft1.address, tokenId = 4,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({}), deposits = sp.map({}), 
        remainings = sp.map({}), durations = sp.map({}), 
        swapTokens = sp.map({0:nft1.address}), swapPaymentTokens = sp.map({0:nft1.address}), 
        swapAmounts = sp.map({0:10000}), swapAllowed = True,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)


    # it should not list if NFT is not supported
    market.createListing(sp.record(
        token = nft1.address, tokenId = 4,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({}), deposits = sp.map({}), 
        remainings = sp.map({}), durations = sp.map({}), 
        swapTokens = sp.map({0:nft2.address}), swapPaymentTokens = sp.map({0:NULL_ADDRESS}), 
        swapAmounts = sp.map({0:10000}), swapAllowed = True,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)


    # it should list NFT for nft swap but allow only offers
    market.createListing(sp.record(
        token = nft1.address, tokenId = 4,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({}), deposits = sp.map({}), 
        remainings = sp.map({}), durations = sp.map({}), 
        swapTokens = sp.map({0:nft1.address}), swapPaymentTokens = sp.map({0:NULL_ADDRESS}), 
        swapAmounts = sp.map({0:10000}), swapAllowed = False,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))

    # it shoult list NFT and allow direct nft swap
    market.createListing(sp.record(
        token = nft1.address, tokenId = 5,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        reserveToken = sp.map({}), deposits = sp.map({}), 
        remainings = sp.map({}), durations = sp.map({}), 
        swapTokens = sp.map({0:nft1.address}), swapPaymentTokens = sp.map({0:NULL_ADDRESS}), 
        swapAmounts = sp.map({0:10000}), swapAllowed = True,
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))

    # -------------- EDIT LISTING -------------

    # it should not edit listing if it is not listed
    market.editListing(sp.record(
        token = nft1.address, tokenId = 3,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(8000)
    )).run(sender = admin, valid = False)

    # should not edit listin if not called by the item owner
    market.editListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(8000)
    )).run(sender = user1, valid = False)

    # should edit listing to the new details
    market.editListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:50000}),
        reserveToken = sp.map({0:NULL_ADDRESS, 1:NULL_ADDRESS}), deposits = sp.map({0:1000,1:2000}), 
        remainings = sp.map({0:10000, 1:7500}), durations = sp.map({0:864000, 1:864000}), swapTokens = sp.map({}), swapPaymentTokens = sp.map({}), 
        swapAmounts = sp.map({}), swapAllowed = False,
        timePeriod = sp.int(80000)
    )).run(sender = admin)

    # # ------------- CANCEL LISTING ------------

    # it should not cancel listing if not listed
    market.cancelListing(sp.record(
        token = nft1.address, tokenId = 3
    )).run(sender = admin, valid = False)

    # it should not cancel listing if not called by the listing owner
    market.cancelListing(sp.record(
        token = nft1.address, tokenId = 0
    )).run(sender = user1, valid = False)

    # it should cancel listing, transfer item back to the owner, remove this listing
    market.cancelListing(sp.record(
        token = nft1.address, tokenId = 0
    )).run(sender = admin)

    item = getters.getItem(sp.record(token = nft1.address, tokenId = 0))
    scenario.show(item)

    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 0)].balance == 0)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 0)].balance == 1)


