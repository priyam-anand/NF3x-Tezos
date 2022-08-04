import smartpy as sp

NULL_ADDRESS = sp.address("tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU")

class Vault(sp.Contract):
    def __init__(self):
        self.init(
            market = NULL_ADDRESS,
            reserve = NULL_ADDRESS,
            listing = NULL_ADDRESS,
            swap = NULL_ADDRESS,
            collectionOffer = NULL_ADDRESS,
            reserveUtils = NULL_ADDRESS
        )

    # Access setter
    @sp.entry_point
    def setListing(self, _listing):
        sp.set_type(_listing, sp.TAddress)
        # verify that the function caller is the admin
        self.data.listing = _listing
    
    @sp.entry_point
    def setMarket(self, _market):
        sp.set_type(_market, sp.TAddress)
        # verify that the function caller is the admin
        self.data.market = _market

    @sp.entry_point
    def setSwap(self, _swap):
        sp.set_type(_swap, sp.TAddress)
        # verify that the function caller is the admin
        self.data.swap = _swap

    @sp.entry_point
    def setReserve(self, _reserve):
        sp.set_type(_reserve, sp.TAddress)
        # verify that the function caller is the admin
        self.data.reserve = _reserve

    @sp.entry_point
    def setReserveUtils(self, _reserveUtils):
        sp.set_type(_reserveUtils, sp.TAddress)
        self.data.reserveUtils = _reserveUtils

    # Utility Functions
    def _onlyApproved(self):
        ok = (sp.sender == self.data.reserveUtils) | (sp.sender == self.data.market) | (sp.sender == self.data.reserve) | (sp.sender == self.data.listing) | (sp.sender == self.data.swap) | (sp.sender == self.data.collectionOffer)
        sp.verify(ok, "Vault : only approved contracts")

    @sp.entry_point
    def recieveTez(self):
        pass

    @sp.entry_point
    def sendTez(self, params):
        sp.set_type(params, sp.TRecord(
            to = sp.TAddress,
            amount = sp.TMutez
        ))
        self._onlyApproved()
        sp.send(params.to, params.amount)

    @sp.entry_point
    def recieveFA12(self, params):
        self._onlyApproved()
        sp.set_type(params, sp.TRecord(
            token = sp.TAddress,
            _from = sp.TAddress,
            amount = sp.TNat
        ))
        c = sp.contract(
                sp.TRecord(
                    from_ = sp.TAddress, 
                    to_ = sp.TAddress, 
                    value = sp.TNat).layout(("from_ as from", ("to_ as to", "value"))), 
                params.token, 
                entry_point = "transfer"
            ).open_some()
        sp.transfer(
            sp.record(
                from_ = params._from,
                to_ = sp.self_address,
                value = params.amount
            ),
            sp.mutez(0),
            c
        )
    
    @sp.entry_point
    def sendFA12(self, params):
        self._onlyApproved()
        sp.set_type(params,sp.TRecord(
            token = sp.TAddress,
            to = sp.TAddress,
            amount = sp.TNat
        ))
        c = sp.contract(
                sp.TRecord(
                    from_ = sp.TAddress, 
                    to_ = sp.TAddress, 
                    value = sp.TNat).layout(("from_ as from", ("to_ as to", "value"))), 
                params.token, 
                entry_point = "transfer"
            ).open_some()
        sp.transfer(
            sp.record(
                from_ = sp.self_address,
                to_ = params.to,
                value = params.amount 
            ),
            sp.mutez(0),
            c
        )

    @sp.entry_point
    def recieveFA2(self, params):
        self._onlyApproved()
        sp.set_type(
            params,
            sp.TRecord(token = sp.TAddress, from_ = sp.TAddress, tokenId = sp.TNat)
        )
        c = sp.contract(
                sp.TList(
                    sp.TRecord(
                        from_=sp.TAddress, 
                        txs=sp.TList(
                            sp.TRecord(
                                amount=sp.TNat, 
                                to_=sp.TAddress, 
                                token_id=sp.TNat).layout(("to_", ("token_id", "amount"))
                            )
                        )
                    )
                ), 
                params.token, 
                entry_point='transfer'
            ).open_some()
        sp.transfer(sp.list([sp.record(from_=params.from_, txs=sp.list([sp.record(amount=1, to_=sp.self_address, token_id=params.tokenId)]))]), sp.mutez(0), c)

    @sp.entry_point
    def sendFA2(self, params):
        self._onlyApproved()
        sp.set_type(
            params,
            sp.TRecord(token = sp.TAddress, to_ = sp.TAddress, tokenId = sp.TNat)
        )
        c = sp.contract(
                sp.TList(
                    sp.TRecord(
                        from_=sp.TAddress, 
                        txs=sp.TList(
                            sp.TRecord(
                                amount=sp.TNat, 
                                to_=sp.TAddress, 
                                token_id=sp.TNat).layout(("to_", ("token_id", "amount"))
                                )
                            )
                        )
                    ), 
                params.token, 
                entry_point='transfer'
            ).open_some()
        sp.transfer(sp.list([sp.record(from_=sp.self_address, txs=sp.list([sp.record(amount=1, to_=params.to_, token_id=params.tokenId)]))]), sp.mutez(0), c)
