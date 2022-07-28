import smartpy as sp

DetailStorage = sp.io.import_stored_contract("detailStorage")
ItemStorage = sp.io.import_stored_contract("itemStorage")
Whitelist = sp.io.import_stored_contract("whitelist")
Market = sp.io.import_stored_contract("market")
Listing = sp.io.import_stored_contract("listing")
Vault = sp.io.import_stored_contract("vault")

fa12 = sp.io.import_stored_contract("fa12")
fa2 = sp.io.import_stored_contract("fa2")

@sp.add_test(name = "NF3x Whitelisting")
def test():
    scenario = sp.test_scenario()
    scenario.h1("NF3x Whitelisting")

    admin = sp.test_account("Admin")
    user1 = sp.test_account("user1")
    user2 = sp.test_account("user2")
    user3 = sp.test_account("user3")

    ''' ------------------------- DEPLOYMENT + INIT ----------------------------------- '''

    detailStorage = DetailStorage.DetailStorage(_platformFee = 500000)
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
    
    X_Token = fa12.FA12(
            admin.address,
            config              = fa12.FA12_config(support_upgradable_metadata = True),
            token_metadata      = token_metadata,
            contract_metadata   = contract_metadata
        )
    nft1 = fa2.FA2(
            config = fa2.FA2_config(single_asset = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = admin.address
        )
    nft2 = fa2.FA2(
            config = fa2.FA2_config(single_asset = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = admin.address
        )
    nft3 = fa2.FA2(
            config = fa2.FA2_config(single_asset = True),
            metadata = sp.utils.metadata_of_url("https://example.com"),
            admin = admin.address
        )

    scenario += X_Token
    scenario += nft1
    scenario += nft2
    scenario += nft3
    
    ''' -------------------------------TESTS----------------------------------------- '''

    #it should not whitelist NFT collection when invalid contract called
    whitelist.whitelistNFTCollection(
        [nft1.address]
    ).run(sender = admin,valid = False)

    # it should whitelist NFT collection when called by the admin
    market.whitelistNFTCollection(
        [nft1.address]
    ).run(sender = admin)

    # it should not whitelist the FT contract when invlid contract called
    whitelist.whitelistFTContract(
        [X_Token.address]
    ).run(sender = admin, valid = False)

    # it should whitelist the FT contract when valid contract is called by the admin
    market.whitelistFTContract(
        [X_Token.address]
    ).run(sender = admin)


    
