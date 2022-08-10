const { TezosToolkit, MichelsonMap } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');
const fs = require('fs');

const key = fs.readFileSync(".secret").toString().trim();
const itemStorageCode = require("./nf3Contracts/itemStorage.json");
const detailStorageCode = require("./nf3Contracts/detailStorage.json");
const offerStorageCode = require("./nf3Contracts/offerStorage.json");
const listingCode = require("./nf3Contracts/listing.json");
const marketCode = require("./nf3Contracts/market.json");
const reserveCode = require("./nf3Contracts/reserve.json");
const reserveUtilCode = require("./nf3Contracts/reserveUtils.json")
const swapCode = require("./nf3Contracts/swap.json");
const vaultCode = require("./nf3Contracts/vault.json");
const whitelistCode = require("./nf3Contracts/whitelist.json");
const gettersCode = require("./nf3Contracts/getters.json");

const Tezos = new TezosToolkit('https://jakartanet.tezos.marigold.dev/');
Tezos.setProvider({
  signer: new InMemorySigner(key),
});

const NULL_ADDRESS = 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU'
const admin = 'tz1g7Tv9nnr55Hz9AoAwEiAJ63LNonKNzMoj'

const deployContract = async (_code, _storage) => {
  const contractDeployment = await Tezos.wallet.originate({
    code: _code,
    storage: _storage
  }).send()

  const contract = await contractDeployment.contract();
  return contract.address;
}

var addresses = {
  positionToken: 'KT1PjNEzCq2mCUUdify7iCbDFyvNTe6b1sdQ',
}

const deployment = async () => {
  const itemStorageAddress = await deployContract(
    itemStorageCode,
    {
      _items: new MichelsonMap(),
      detailStorage: NULL_ADDRESS,
      listing: NULL_ADDRESS,
      swap: NULL_ADDRESS,
      reserve: NULL_ADDRESS,
      reserveUtils: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, itemStorage: itemStorageAddress }

  const detailStorageAddress = await deployContract(
    detailStorageCode,
    {
      platformFees: Number(500000),
      itemStorage: NULL_ADDRESS,
      listing: NULL_ADDRESS,
      offerStorage: NULL_ADDRESS,
      rejectedReserveOffers: new MichelsonMap(),
      rejectedSwapOffers: new MichelsonMap(),
      reserve: NULL_ADDRESS,
      swap: NULL_ADDRESS,
      whitelist: NULL_ADDRESS,
      reserveUtils: NULL_ADDRESS,
      whitelistedFTs: new MichelsonMap(),
      whitelistedNFTs: new MichelsonMap(),
      admin : admin
    }
  )
  addresses = { ...addresses, detailStorage: detailStorageAddress }

  const offerStorageAddress = await deployContract(
    offerStorageCode,
    {
      detailStorage: NULL_ADDRESS,
      offers: new MichelsonMap(),
      reserve: NULL_ADDRESS,
      swap: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, offerStorage: offerStorageAddress }

  const listingAddress = await deployContract(
    listingCode,
    {
      itemStorage: NULL_ADDRESS,
      detailStorage: NULL_ADDRESS,
      market: NULL_ADDRESS,
      vault: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, listing: listingAddress }

  const marketAddress = await deployContract(
    marketCode,
    {
      whitelist: NULL_ADDRESS,
      listing: NULL_ADDRESS,
      vault: NULL_ADDRESS,
      swap: NULL_ADDRESS,
      reserve: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, market: marketAddress }

  const reserveAddress = await deployContract(
    reserveCode,
    {
      market: NULL_ADDRESS,
      itemStorage: NULL_ADDRESS,
      vault: NULL_ADDRESS,
      positionToken: NULL_ADDRESS,
      detailStorage: NULL_ADDRESS,
      offerStorage: NULL_ADDRESS,
      reserveUtils: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, reserve: reserveAddress }

  const swapAddress = await deployContract(
    swapCode,
    {
      market: NULL_ADDRESS,
      itemStorage: NULL_ADDRESS,
      vault: NULL_ADDRESS,
      detailStorage: NULL_ADDRESS,
      offerStorage: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, swap: swapAddress }

  const vaultAddress = await deployContract(
    vaultCode,
    {
      market: NULL_ADDRESS,
      reserve: NULL_ADDRESS,
      listing: NULL_ADDRESS,
      swap: NULL_ADDRESS,
      collectionOffer: NULL_ADDRESS,
      reserveUtils: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, vault: vaultAddress }

  const whitelistAddress = await deployContract(
    whitelistCode,
    {
      detailStorage: NULL_ADDRESS,
      market: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, whitelist: whitelistAddress }

  const gettersAddress = await deployContract(
    gettersCode,
    {
      whitelist: NULL_ADDRESS,
      itemStorage: NULL_ADDRESS,
      detailStorage: NULL_ADDRESS,
      offerStorage: NULL_ADDRESS
    }
  )
  addresses = { ...addresses, getters: gettersAddress }

  const reserveUtilsAddress = await deployContract(
    reserveUtilCode,
    {
      itemStorage: NULL_ADDRESS,
      vault: NULL_ADDRESS,
      detailStorage: NULL_ADDRESS,
      reserve: NULL_ADDRESS,
      admin : admin
    }
  )
  addresses = { ...addresses, reserveUtils: reserveUtilsAddress }
}

const setWhitelist = async (c) => {
  const op = await c.methods.setWhitelist(addresses.whitelist).send();
  await op.confirmation();
}

const setListing = async (c) => {
  const op = await c.methods.setListing(addresses.listing).send();
  await op.confirmation()
}

const setItemStorage = async (c) => {
  const op = await c.methods.setItemStorage(addresses.itemStorage).send();
  await op.confirmation();
}

const setSwap = async (c) => {
  const op = await c.methods.setSwap(addresses.swap).send();
  await op.confirmation();
}

const setReserve = async (c) => {
  const op = await c.methods.setReserve(addresses.reserve).send();
  await op.confirmation();
}

const setOfferStorage = async (c) => {
  const op = await c.methods.setOfferStorage(addresses.offerStorage).send();
  await op.confirmation();
}

const setDetailStorage = async (c) => {
  const op = await c.methods.setDetailStorage(addresses.detailStorage).send();
  await op.confirmation();
}

const setMarket = async (c) => {
  const op = await c.methods.setMarket(addresses.market).send();
  await op.confirmation();
}

const setVault = async (c) => {
  const op = await c.methods.setVault(addresses.vault).send();
  await op.confirmation()
}

const setAdmin = async (c, admin) => {
  const op = await c.methods.set_administrator(admin).send();
  await op.confirmation();
}

const setPositionToken = async (c) => {
  const op = await c.methods.setPositionToken(addresses.positionToken).send();
  await op.confirmation();
}

const setReserveUtils = async (c) => {
  const op = await c.methods.setReserveUtils(addresses.reserveUtils).send();
  await op.confirmation();
}

const initialization = async () => {
  const detailStorage = await Tezos.wallet.at(addresses.detailStorage);
  const itemStorage = await Tezos.wallet.at(addresses.itemStorage);
  const listing = await Tezos.wallet.at(addresses.listing);
  const market = await Tezos.wallet.at(addresses.market);
  const vault = await Tezos.wallet.at(addresses.vault);
  const whitelist = await Tezos.wallet.at(addresses.whitelist);
  const swap = await Tezos.wallet.at(addresses.swap);
  const getters = await Tezos.wallet.at(addresses.getters);
  const offerStorage = await Tezos.wallet.at(addresses.offerStorage);
  const reserve = await Tezos.wallet.at(addresses.reserve);
  const positionToken = await Tezos.wallet.at(addresses.positionToken);
  const reserveUtils = await Tezos.wallet.at(addresses.reserveUtils);

  await setWhitelist(detailStorage);
  await setListing(detailStorage);
  await setItemStorage(detailStorage);
  await setSwap(detailStorage);
  await setReserve(detailStorage);
  await setOfferStorage(detailStorage);
  await setReserveUtils(detailStorage)

  await setListing(itemStorage);
  await setDetailStorage(itemStorage);
  await setSwap(itemStorage);
  await setReserve(itemStorage);
  await setReserveUtils(itemStorage)

  await setItemStorage(listing);
  await setDetailStorage(listing);
  await setMarket(listing);
  await setVault(listing);

  await setWhitelist(market);
  await setListing(market);
  await setVault(market);
  await setSwap(market);
  await setReserve(market);

  await setListing(vault);
  await setMarket(vault);
  await setSwap(vault);
  await setReserve(vault);
  await setReserveUtils(vault);

  await setDetailStorage(whitelist);
  await setMarket(whitelist);

  await setMarket(swap)
  await setVault(swap)
  await setItemStorage(swap)
  await setDetailStorage(swap)
  await setOfferStorage(swap)

  await setWhitelist(getters)
  await setItemStorage(getters)
  await setDetailStorage(getters)
  await setOfferStorage(getters)

  await setSwap(offerStorage)
  await setDetailStorage(offerStorage)
  await setReserve(offerStorage);

  await setMarket(reserve)
  await setItemStorage(reserve)
  await setVault(reserve)
  await setPositionToken(reserve)
  await setDetailStorage(reserve)
  await setOfferStorage(reserve)
  await setReserveUtils(reserve)

  await setReserve(reserveUtils);
  await setItemStorage(reserveUtils);
  await setVault(reserveUtils);
  await setDetailStorage(reserveUtils);

  await setAdmin(positionToken, addresses.reserve)

}

const main = async () => {
  await deployment();
  console.log(addresses);
  await initialization();
}

main()
