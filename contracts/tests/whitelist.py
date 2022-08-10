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
        [token1.address]
    ).run(sender = admin, valid = False)

    # it should whitelist the FT contract when valid contract is called by the admin
    market.whitelistFTContract(
        [token1.address]
    ).run(sender = admin)