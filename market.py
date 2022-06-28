import smartpy as sp

class Market(sp.Contract):
    def __init__(self):
        self.init(
            whitelist = sp.address('tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU')
        )

    @sp.entry_point
    def setWhitelist(self, _whitelist):
        # verify that the function caller is the admin
        sp.set_type(_whitelist, sp.TAddress)
        self.data.whitelist = _whitelist

    @sp.entry_point
    def whitelistNFTCollection(self, params):
        sp.set_type(params, sp.TList(sp.TAddress))
        # verify that the function caller is the admin
        contract = sp.contract(
            sp.TList(sp.TAddress),
            self.data.whitelist,
            entry_point = 'whitelistNFTCollection'
        ).open_some()
        sp.transfer(
            params,
            sp.mutez(0),
            contract
        )
    
    @sp.entry_point
    def whitelistFTContract(self, params):
        sp.set_type(params, sp.TList(sp.TAddress))
        # verify that the function caller is the admin
        contract = sp.contract(
            sp.TList(sp.TAddress),
            self.data.whitelist,
            entry_point = 'whitelistFTContract'
        ).open_some()
        sp.transfer(
            params,
            sp.mutez(0),
            contract
        )

    
