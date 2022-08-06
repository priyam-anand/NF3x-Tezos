import Addresses from "../contracts/Contracts.json"
import { setLoading } from "../redux/popupSlice";

export const _approveNFT = async (tezos, account, nft, tokenId, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await tezos.wallet.at(nft);
            const operator_params = [
                {
                    add_operator: {
                        owner: account,
                        operator: Addresses.Vault,
                        token_id: Number(tokenId)
                    }
                }
            ]
            const op = await contract.methods.update_operators(operator_params).send();
            dispatch(setLoading({ loading: true }))
            await op.confirmation();
            dispatch(setLoading({ loading: false }))
            resolve();
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })

}

const toMutez = (value) => {
    const ans = Number(value) * 1000000;
    return ans;
}

const toTez = (value) => {
    return Number(value) / 1000000;
}

export const _completeListing = (tezos, selected, market, account, bnplListings, interestedToSwap, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        const { token, tokenId, sale, bnpl, swap, directSwap, directSalePrice, offerToken, timePeriod } = selected;
        const _timePeriod = Number(timePeriod) * 86400;
        const xtz = Addresses.XTZ;
        const fee = '0.5'
        const _directSalePrice = directSalePrice[0] == undefined || directSalePrice[0] == '' ? 0 : toMutez(directSalePrice[0]);

        const saleTokenMap = {};
        const salePrice = {};
        const _deposit = {};
        const _remainingAmt = {};
        const _duration = {};
        const bnplPaymentTokens = {};
        const _offerAmt = {};
        const _offerToken = {};
        const swapOfferPaymentToken = {};

        if (sale) {
            saleTokenMap[0] = Addresses.XTZ;
            salePrice[0] = _directSalePrice;
        }

        if (bnpl) {
            for (let i = 0; i < bnplListings.length; i++) {
                const tempDeposit = bnplListings[i].deposit == undefined || bnplListings[i].deposit == '' ? 0 : toMutez(bnplListings[i].deposit + "");
                const tempRemainingAmt = bnplListings[i].remainingAmt == undefined || bnplListings[i].remainingAmt == '' ? 0 : toMutez(bnplListings[i].remainingAmt + "");
                const tempDuration = Number(bnplListings[i].duration) * 86400;
                if (bnpl && (tempDeposit == 0 || tempRemainingAmt == 0 || tempDuration == 0)) {
                    reject("Invalid arguments");
                }
                _deposit[i] = tempDeposit;
                _remainingAmt[i] = tempRemainingAmt;
                _duration[i] = tempDuration
                bnplPaymentTokens[i] = xtz
            }
        }

        if (swap) {
            for (let i = 0; i < interestedToSwap.length; i++) {
                const tempOfferAmt = interestedToSwap[i].swapAmount == undefined || interestedToSwap[i].swapAmount == '' ? 0 : toMutez(interestedToSwap[i].swapAmount + "");
                const tempOfferToken = Addresses.nameToAddress[interestedToSwap[i].swapToken];
                if (swap && tempOfferToken == undefined) {
                    reject({ message: "Invalid arguments" });
                    return;
                }
                _offerAmt[i] = tempOfferAmt;
                _offerToken[i] = tempOfferToken;
                swapOfferPaymentToken[i] = xtz;
            }
        }

        if (token == '' || _timePeriod == 0) {
            reject({ message: "Invalid arguments" });
            return;
        }
        if (!sale && !bnpl && !swap) {
            reject({ message: "Invalid arguments" });
            return;
        }
        if (sale && (_directSalePrice == '' || _directSalePrice == 0)) {
            reject({ message: "Invalid arguments" });
            return;
        }
        if (swap && offerToken == '' && _offerAmt == '') {
            reject({ message: "Invalid arguments" });
            return;
        }

        // setPopupState({
        //     completeListing: {
        //         open: true,
        //         state: 0,
        //     },
        //     listed: false,
        //     isLoading: true
        // });

        // setPopupState({
        //     completeListing: {
        //         open: true,
        //         state: 1
        //     },
        //     listed: false,
        //     isLoading: true
        // });

        try {
            await _approveNFT(tezos, account, token, tokenId, dispatch);

            dispatch(setLoading({ loading: false }));
            // setPopupState({
            //     completeListing: {
            //         open: true,
            //         state: 2,
            //     },
            //     listed: false,
            //     isLoading: true
            // });

            const op = await market.methods.createListing(
                _deposit, salePrice, saleTokenMap, _duration, _remainingAmt, bnplPaymentTokens, directSwap, _offerAmt, swapOfferPaymentToken, _offerToken, _timePeriod, token, tokenId
            ).send({ amount: fee });

            console.log("txn sent");
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            console.log("txn done");
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            console.log(error);
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _handleCancelListing = (market, item, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const op = await market.methods.cancelListing(item.token, item.tokenId.toNumber()).send();
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
        } catch (e) {
            dispatch(setLoading({ loading: false }));
            reject(e);
            return;
        }
    })
}

export const _confirmSwapNow = async (item, market, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const op = await market.methods.directSwap(item.token, item.tokenId.toNumber()).send({ amount: toTez(item.listing.directListing.amount) });
            dispatch(setLoading({ loading: true }));
            // setPopupState({
            //     ...popupState,
            //     swapNow: { open: false, value: '' },
            //     processing: { open: true, value: toETH(item.listing.directListing.amount) }
            // })
            await op.confirmation();

            dispatch(setLoading({ loading: false }));
        } catch (e) {
            dispatch(setLoading({ loading: false }));
            reject(e);
            return;
        }
        dispatch(setLoading({ loading: false }));
        resolve();
    })
}

export const _confirmPayLater = async (item, listing, market, popupState, setPopupState, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            var amount = toTez(listing.deposit);
            const op = await market.methods.reserve(index, item.token, item.tokenId.toNumber()).send({ amount: amount });
            dispatch(setLoading({ loading: true }));
            // setPopupState({
            //     ...popupState,
            //     reserverNow: {
            //         ...popupState.reserverNow,
            //         open: false
            //     },
            //     processing: {
            //         open: true,
            //         value: toETH(item.bnplListings[index].deposit)
            //     }
            // });
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
        } catch (e) {
            dispatch(setLoading({ loading: false }));
            reject(e);
            return;
        }
    })
}

export const _directNftSwap = async (tezos, account, item, nftSwap, swapOffer, market, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await _approveNFT(tezos, account, swapOffer.tokenAddress, swapOffer.tokenId, dispatch);
            console.log(swapOffer);
            const op = await market.methods.nftSwap(swapOffer.tokenAddress, swapOffer.tokenId, nftSwap.index, item.token, item.tokenId.toNumber()).send({ amount: nftSwap.amount });
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _confirmSwapNowOffer = async (item, market, swapNowOffer, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("swapNowOffer", swapNowOffer)
            const op = await market.methods.newSwapOffer(
                { 0: toMutez(swapNowOffer.amount) },
                { 0: Addresses.XTZ },
                {},
                {},
                swapNowOffer.time_period * 86400,
                item.token,
                item.tokenId.toNumber()
            ).send({ amount: swapNowOffer.amount })
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _confirmReserveOffer = async (item, market, reserveOffer, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("reserveOffer ", reserveOffer);
            const op = await market.methods.newReserveOffer(

                { 0: toMutez(reserveOffer.deposit) },
                { 0: Addresses.XTZ },
                {},
                {},
                reserveOffer.duration * 86400,
                { 0: toMutez(reserveOffer.remainingAmount) },
                { 0: Addresses.XTZ },
                {},
                {},
                reserveOffer.time_period * 86400,
                item.token,
                item.tokenId.toNumber()
            ).send({ amount: reserveOffer.deposit });
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _confirmSwapOffer = async (tezos, account, item, market, swapOffer, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await _approveNFT(tezos, account, swapOffer.tokenAddress, swapOffer.tokenId, dispatch);

            const op = await market.methods.newSwapOffer(
                { 0: toMutez(swapOffer.amount) },
                { 0: Addresses.XTZ },
                { 0: swapOffer.tokenId },
                { 0: swapOffer.tokenAddress },
                swapOffer.time_period * 86400,
                item.token,
                item.tokenId.toNumber()
            ).send({ amount: swapOffer.amount })
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _confirmAcceptOffer = async (item, market, offerId, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const op = await market.methods.acceptSwapOffer(
                offerId,
                item.token,
                item.tokenId.toNumber()
            ).send();
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _confirmAcceptReserveOffer = async (item, market, offerId, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const op = await market.methods.acceptReserveOffer(
                offerId,
                item.token,
                item.tokenId.toNumber()
            ).send();
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _payRemaining = async (item, remaining, market, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            const op = await market.methods.payRemaining(item.token, item.tokenId.toNumber()).send({ amount: toTez(remaining) });
            dispatch(setLoading({ loading: true }));
            await op.confirmation();
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}
