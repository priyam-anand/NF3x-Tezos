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
    swap = Swap.Swap()
    scenario += swap

    detailStorage.setWhitelist(whitelist.address)
    detailStorage.setListing(listing.address)
    detailStorage.setItemStorage(itemStorage.address)
    detailStorage.setSwap(swap.address)

    itemStorage.setListing(listing.address)
    itemStorage.setDetailStorage(detailStorage.address)
    itemStorage.setSwap(swap.address)

    listing.setItemStorage(itemStorage.address)
    listing.setDetailStorage(detailStorage.address)
    listing.setMarket(market.address)
    listing.setVault(vault.address)

    market.setWhitelist(whitelist.address)
    market.setListing(listing.address)
    market.setVault(vault.address)
    market.setSwap(swap.address)

    vault.setListing(listing.address)
    vault.setMarket(market.address)
    vault.setSwap(swap.address)

    whitelist.setDetailStorage(detailStorage.address)
    whitelist.setMarket(market.address)
    
    swap.setMarket(market.address)
    swap.setVault(vault.address)
    swap.setItemStorage(itemStorage.address)
    swap.setDetailStorage(detailStorage.address)

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


