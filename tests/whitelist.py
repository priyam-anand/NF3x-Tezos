import smartpy as sp

DetailStorage = sp.io.import_stored_contract("detailStorage")
Whitelist = sp.io.import_stored_contract("whitelist")
Market = sp.io.import_stored_contract("market")
# Getter = sp.io.import_stored_contract("getters.py")
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

    detailStorage = DetailStorage.DetailStorage(_platformFee = 500000)
    scenario += detailStorage
    whitelist = Whitelist.Whitelist(_detailStorage = detailStorage.address)
    scenario += whitelist
    market = Market.Market()
    scenario += market

    detailStorage.setWhitelist(whitelist.address)

    whitelist.setMarket(market.address)

    market.setWhitelist(whitelist.address)
    
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
    Y_Token = fa12.FA12(
            admin.address,
            config              = fa12.FA12_config(support_upgradable_metadata = True),
            token_metadata      = '',
            contract_metadata   = ''
        )

    scenario += X_Token
    scenario += nft1
    scenario += nft2
    scenario += nft3
    
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


    
