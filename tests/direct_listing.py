import smartpy as sp

DetailStorage = sp.io.import_stored_contract("detailStorage")
ItemStorage = sp.io.import_stored_contract("itemStorage")
Whitelist = sp.io.import_stored_contract("whitelist")
Market = sp.io.import_stored_contract("market")
Listing = sp.io.import_stored_contract("listing")
Vault = sp.io.import_stored_contract("vault")

fa12 = sp.io.import_stored_contract("fa12")
fa2 = sp.io.import_stored_contract("fa2")

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

    detailStorage = DetailStorage.DetailStorage(_platformFee = sp.nat(PLATFORM_FEES))
    scenario += detailStorage
    itemStorage = ItemStorage.ItemStorage()
    scenario += itemStorage
    listing = Listing.Listing()
    scenario += listing
    market = Market.Market()
    scenario += market
    vault = Vault.Vault()
    scenario += vault
    whitelist = Whitelist.Whitelist()
    scenario += whitelist

    detailStorage.setWhitelist(whitelist.address)
    detailStorage.setListing(listing.address)
    detailStorage.setItemStorage(itemStorage.address)

    itemStorage.setListing(listing.address)
    itemStorage.setDetailStorage(detailStorage.address)

    listing.setItemStorage(itemStorage.address)
    listing.setDetailStorage(detailStorage.address)
    listing.setMarket(market.address)
    listing.setVault(vault.address)

    market.setWhitelist(whitelist.address)
    market.setListing(listing.address)
    market.setVault(vault.address)

    vault.setListing(listing.address)
    vault.setMarket(market.address)

    whitelist.setDetailStorage(detailStorage.address)
    whitelist.setMarket(market.address)
    
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
    
    ''' -------------------------------TESTS----------------------------------------- '''

    market.whitelistNFTCollection(
        [nft1.address]
    ).run(sender = admin)

    market.whitelistFTContract(
        [NULL_ADDRESS]
    ).run(sender = admin)

    # Mint NFTs
    mintNFT(nft1, 0, admin.address, admin)
    mintNFT(nft1, 1, user1.address, admin)

    # it should not list if directly called the listing contract
    listing.createListing(sp.record(
        token = nft1.address, tokenId = 0, 
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:0}),
        timePeriod = 10, value = sp.mutez(PLATFORM_FEES)
    )).run(sender = admin, valid = False) 

    # it should not list nft if enough fees not sent
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        timePeriod = 100
    )).run(sender = admin, amount = sp.mutez(0), valid = False)

    # it should not list nft if time period is 0
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        timePeriod = sp.int(0)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list nft if collection is not supported
    market.createListing(sp.record(
        token = nft2.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list nft if not approved by owner
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000}),
        timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    setOperator(nft1, admin, vault, 0)
    # it should not list if no type of listing params are passed
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({}), directSwapPrice = sp.map({}),
        timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list if asking FT is not supported
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:token1.address}), directSwapPrice = sp.map({0:10000}),
        timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should not list if asking price is 0
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:0}),
        timePeriod = sp.int(100)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)

    # it should transfer NFT to the vault, initialize item, set item's owner as sp.sender, set direct swap details to the item listing, mark the item as listed ie status = 2 
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES))
    
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(vault.address, 0)].balance == 1)
    scenario.verify(nft1.data.ledger[nft1.ledger_key.make(admin.address, 0)].balance == 0)

    # it should not list nft if invalid status
    market.createListing(sp.record(
        token = nft1.address, tokenId = 0,
        directSwapToken = sp.map({0:NULL_ADDRESS}), directSwapPrice = sp.map({0:10000000}),
        timePeriod = sp.int(86400)
    )).run(sender = admin, amount = sp.mutez(PLATFORM_FEES), valid = False)
    
