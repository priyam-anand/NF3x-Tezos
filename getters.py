import smartpy as sp
structures = sp.io.import_stored_contract("structures").structures 

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Getters(sp.Contract):
    def __init__(self):
        self.structures = structures()
        self.init(
            whitelist = NULL_ADDRESS,
            itemStorage = NULL_ADDRESS,
            detailStorage = NULL_ADDRESS
        )

    @sp.entry_point
    def setWhitelist(self, _whitelist):
        sp.set_type(_whitelist, sp.TAddress)
        self.data.whitelist = _whitelist

    @sp.entry_point
    def setItemStorage(self, _itemStorage):
        sp.set_type(_itemStorage, sp.TAddress)
        self.data.itemStorage = _itemStorage
    
    @sp.entry_point
    def setDetailStorage(self, _detailStorage):
        sp.set_type(_detailStorage, sp.TAddress)
        self.data.detailStorage = _detailStorage

    @sp.offchain_view()
    def getItem(self, params):
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress, tokenId = sp.TNat
        ))
        sp.result(sp.view(
            'getItemByAddress',
            self.data.itemStorage,
            params,
            t = self.structures.getItemType()
        ).open_some())