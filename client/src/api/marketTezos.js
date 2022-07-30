import Addresses from "../contracts/Contracts.json"
import { setLoading } from "../redux/popupSlice";
import { MichelsonMap } from "@taquito/taquito";


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