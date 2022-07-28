import Addresses from "../contracts/Addresses.json";
import { setLoading } from "../redux/popupSlice";

export const _confirmSwapNow = (item, market, account, popupState, setPopupState, toETH, toWei, dispatch) => {
    return new Promise(async (resolve, reject) => {
        var amount = Number(toETH(item.directListing.amounts[0])) + Number(toETH('10000000000000000'));
        amount = amount + "";
        amount = toWei(amount);
        await market.methods.directSale(item.token, item.tokenId).send({ from: account, value: amount })
            .on('transactionHash', (hash) => {
                dispatch(setLoading({ loading: true }));
                setPopupState({
                    ...popupState,
                    swapNow: { open: false, value: '' },
                    processing: { open: true, value: toETH(item.directListing.amounts[0]) }
                })
                console.log("hash", hash)
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
                return;
            });
        dispatch(setLoading({ loading: false }));
        resolve();
    })
}

export const _confirmPayLater = (item, market, account, popupState, setPopupState, toETH, toWei, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        var amount = Number(toETH(item.bnplListings[index].deposit)) + Number(toETH('10000000000000000'));
        amount = amount + "";
        amount = toWei(amount);
        await market.methods.buyNowPayLater(item.token, item.tokenId, index).send({ from: account, value: amount })
            .on('transactionHash', (hash) => {
                dispatch(setLoading({ loading: true }));
                setPopupState({
                    ...popupState,
                    reserverNow: {
                        ...popupState.reserverNow,
                        open: false
                    },
                    processing: {
                        open: true,
                        value: toETH(item.bnplListings[index].deposit)
                    }
                });
                console.log(hash);
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
                return;
            });
        dispatch(setLoading({ loading: false }));
        resolve();
    })
}

export const _confirmSwapNowOffer = (item, market, account, toWei, swapNowOffer, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 3
            }
        });
        var amount = swapNowOffer.amount;
        const eth = Addresses.ETH;
        const fee = '0.01'
        var totalAmt = Number(amount) + Number(fee);
        amount = toWei(amount + "")
        totalAmt = toWei(totalAmt + '');
        const timePeriod = swapNowOffer.time_period * 86400;

        await market.methods.newDirectSaleOffer(
            item.token,
            item.tokenId,
            [eth],
            [amount],
            timePeriod
        ).send({ from: account, value: totalAmt })
            .on('transactionHash', (hash) => {
                dispatch(setLoading({ loading: true }));
                console.log('hash', hash);
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
                return;
            })
        dispatch(setLoading({ loading: false }));
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 4
            }
        });
        resolve();
    })
}

export const _confirmReserveOffer = (item, market, account, toWei, reserveOffer, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 3
            }
        });

        const fee = '0.01'
        var totalAmt = Number(reserveOffer.deposit) + Number(fee);
        totalAmt = toWei(totalAmt + '');
        var deposit = toWei(reserveOffer.deposit + "");
        var remainingAmount = toWei(reserveOffer.remainingAmount + "");
        var duration = reserveOffer.duration * 86400;
        var timePeriod = reserveOffer.time_period * 86400;

        const eth = Addresses.ETH;
        await market.methods.newBuyNowPayLaterOffer(
            item.token,
            item.tokenId,
            eth,
            deposit,
            remainingAmount,
            duration,
            timePeriod
        ).send({ from: account, value: totalAmt })
            .on('transactionHash', (hash) => {
                console.log('hash', hash);
                dispatch(setLoading({ loading: true }));
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
                return;
            })
        dispatch(setLoading({ loading: false }));
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 4
            }
        });
        resolve();
    })
}

export const _confirmSwapOffer = (item, market, account, nfts, toWei, swapOffer, popupState, setPopupState, dispatch) => {
    return new Promise(async (resolve, reject) => {
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 2
            }
        });

        const { tokenAddress, tokenId, amount, time_period } = swapOffer;
        const _tokenAddress = tokenAddress == undefined ? '' : tokenAddress;
        const _tokenId = tokenId == undefined ? '' : tokenId;
        var _amount = amount == undefined || amount == '' ? 0 : amount;
        const timePeriod = time_period * 86400;

        const eth = Addresses.ETH;
        const fee = '0.01'
        var totalAmt = Number(_amount) + Number(fee);
        _amount = toWei(_amount + "")
        totalAmt = toWei(totalAmt + '');

        for (let i = 0; i < nfts.length; i++) {
            if (nfts[i]._address.toLowerCase() == _tokenAddress.toLowerCase()) {
                await nfts[i].methods.approve(Addresses.Vault, _tokenId).send({ from: account })
                    .on('transactionHash', (hash) => {
                        dispatch(setLoading({ loading: true }));
                        console.log(hash);
                    })
                    .on('error', (error, receipt) => {
                        dispatch(setLoading({ loading: false }));
                        reject(error);
                        return;
                    })
                break;
            }
        }
        dispatch(setLoading({ loading: false }));
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 3
            }
        })

        await market.methods.newSwapOffer(
            item.token,
            item.tokenId,
            [_tokenAddress],
            [_tokenId],
            [eth],
            [_amount],
            timePeriod
        ).send({ from: account, value: totalAmt })
            .on('transactionHash', (hash) => {
                console.log("hash", hash);
                dispatch(setLoading({ loading: true }));
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
                return;
            });
        dispatch(setLoading({ loading: false }));
        setPopupState({
            ...popupState,
            offer: {
                ...popupState.offer,
                open: 4
            }
        })
        resolve();
    })
}

export const _confirmAcceptOffer = (item, market, account, offerPopup, dispatch) => {
    console.log(market.methods.acceptDirectSaleOffer)
    return new Promise(async (resolve, reject) => {
        try {
            if (offerPopup.swap) {
                await market.methods.acceptSwapOffer(
                    item.token,
                    item.tokenId,
                    offerPopup.index
                ).send({ from: account })
                    .on('transactionHash', (hash) => {
                        console.log(hash);
                        dispatch(setLoading({ loading: true }));
                    });
            } else {
                await market.methods.acceptDirectSaleOffer(
                    item.token,
                    item.tokenId,
                    offerPopup.index
                ).send({ from: account }).send({ from: account })
                    .on('transactionHash', (hash) => {
                        console.log(hash);
                        dispatch(setLoading({ loading: true }));
                    });
            }
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _confirmAcceptReserveOffer = (item, market, account, offerPopup, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.acceptBuyNowPayLaterOffer(
                item.token,
                item.tokenId,
                offerPopup.index
            ).send({ from: account })
                .on('transactionHash', (hash) => {
                    console.log(hash);
                    dispatch(setLoading({ loading: true }));
                });

            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _handleCancelListing = (item, market, account, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.cancelListing(item.token, item.tokenId).send({ from: account })
                .on("transactionHash", (hash) => {
                    console.log(hash);
                    dispatch(setLoading({ loading: true }));
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _completeListing = (selected, market, account, toWei, bnplListings, interestedToSwap, setPopupState, nfts, dispatch) => {
    return new Promise(async (resolve, reject) => {
        const { token, tokenId, sale, bnpl, swap, directSalePrice, offerToken, timePeriod } = selected;
        const _timePeriod = Number(timePeriod) * 86400;
        const eth = Addresses.ETH;
        const fee = '10000000000000000'
        const _directSalePrice = directSalePrice[0] == undefined || directSalePrice[0] == '' ? 0 : toWei(directSalePrice[0]);

        var _deposit = [];
        var _remainingAmt = [];
        var _duration = [];
        var bnplPaymentTokens = [];
        for (let i = 0; i < bnplListings.length; i++) {
            const tempDeposit = bnplListings[i].deposit == undefined || bnplListings[i].deposit == '' ? 0 : toWei(bnplListings[i].deposit + "");
            const tempRemainingAmt = bnplListings[i].remainingAmt == undefined || bnplListings[i].remainingAmt == '' ? 0 : toWei(bnplListings[i].remainingAmt + "");
            const tempDuration = Number(bnplListings[i].duration) * 86400;
            if (bnpl && (tempDeposit == 0 || tempRemainingAmt == 0 || tempDuration == 0)) {
                reject("Invalid arguments");
            }
            _deposit.push(tempDeposit);
            _remainingAmt.push(tempRemainingAmt);
            _duration.push(tempDuration);
            bnplPaymentTokens.push(eth);
        }

        var _offerAmt = [];
        var _offerToken = [];
        var swapOfferPaymentToken = [];
        for (let i = 0; i < interestedToSwap.length; i++) {
            const tempOfferAmt = interestedToSwap[i].swapAmount == undefined || interestedToSwap[i].swapAmount == '' ? 0 : toWei(interestedToSwap[i].swapAmount + "");
            const tempOfferToken = Addresses.nameToAddress[interestedToSwap[i].swapToken];
            if (swap && tempOfferToken == undefined) {
                reject({ message: "Invalid arguments" });
                return;
            }
            _offerAmt.push(tempOfferAmt);
            _offerToken.push(tempOfferToken);
            swapOfferPaymentToken.push(eth);
        }

        if (token == '') {
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

        setPopupState({
            completeListing: {
                open: true,
                state: 0,
            },
            listed: false,
            isLoading: true
        });

        setPopupState({
            completeListing: {
                open: true,
                state: 1
            },
            listed: false,
            isLoading: true
        });


        for (let i = 0; i < nfts.length; i++) {
            if (nfts[i]._address.toLowerCase() == token) {
                await nfts[i].methods.approve(Addresses.Vault, tokenId).send({ from: account })
                    .on('transactionHash', (hash) => {
                        dispatch(setLoading({ loading: true }));
                        console.log("hash", hash)
                    })
                    .on('error', (error, receipt) => {
                        dispatch(setLoading({ loading: false }));
                        reject(error);
                        return;
                    })
                break;
            }
        }
        dispatch(setLoading({ loading: false }));
        setPopupState({
            completeListing: {
                open: true,
                state: 2,
            },
            listed: false,
            isLoading: true
        });

        await market.methods.createListing(
            token,
            tokenId,
            sale ? [eth] : [],
            sale ? [_directSalePrice] : [],
            bnpl ? bnplPaymentTokens : [],
            bnpl ? _deposit : [],
            bnpl ? _remainingAmt : [],
            bnpl ? _duration : [],
            swap ? _offerToken : [],
            swap ? swapOfferPaymentToken : [],
            swap ? _offerAmt : [],
            _timePeriod
        ).send({ from: account, value: fee })
            .on('transactionHash', (hash) => {
                dispatch(setLoading({ loading: true }));
                console.log("hash", hash)
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
                return;
            })
        dispatch(setLoading({ loading: false }));
        resolve();
    })
}

export const _claimBackNFT = (item, market, account, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.claimExpiredListing(
                item.token,
                item.tokenId
            ).send({ from: account })
                .on("transactionHash", (hash) => {
                    dispatch(setLoading({ loading: true }));
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
            return;
        }
    })
}

export const _completeEditListing = (market, account, selected, toWei, bnplListings, interestedToSwap, dispatch) => {
    return new Promise(async (resolve, reject) => {
        const { token, tokenId, sale, bnpl, swap, directSalePrice, timePeriod } = selected;
        const _timePeriod = Number(timePeriod) * 86400;
        const eth = Addresses.ETH;
        const _directSalePrice = directSalePrice == undefined || directSalePrice == '' ? 0 : toWei(directSalePrice);

        var _deposit = [];
        var _remainingAmt = [];
        var _duration = [];
        var bnplPaymentTokens = [];
        for (let i = 0; i < bnplListings.length; i++) {
            const tempDeposit = bnplListings[i].deposit == undefined || bnplListings[i].deposit == '' ? 0 : toWei(bnplListings[i].deposit + "");
            const tempRemainingAmt = bnplListings[i].remainingAmt == undefined || bnplListings[i].remainingAmt == '' ? 0 : toWei(bnplListings[i].remainingAmt + "");
            const tempDuration = Number(bnplListings[i].duration) * 86400;
            if (bnpl && (tempDeposit == 0 || tempRemainingAmt == 0 || tempDuration == 0)) {
                reject({ message: 'Invalid arguments' });
            }
            _deposit.push(tempDeposit);
            _remainingAmt.push(tempRemainingAmt);
            _duration.push(tempDuration);
            bnplPaymentTokens.push(eth);
        }

        var _offerAmt = [];
        var _offerToken = [];
        var swapOfferPaymentToken = [];
        for (let i = 0; i < interestedToSwap.length; i++) {
            const tempOfferAmt = interestedToSwap[i].swapAmount == undefined || interestedToSwap[i].swapAmount == '' ? 0 : toWei(interestedToSwap[i].swapAmount + "");
            const tempOfferToken = Addresses.nameToAddress[interestedToSwap[i].swapToken];

            _offerAmt.push(tempOfferAmt);
            _offerToken.push(tempOfferToken);
            swapOfferPaymentToken.push(eth);
        }

        if (!sale && !bnpl && !swap)
            reject({ message: 'Invalid arguments' });
        if (token == '')
            reject({ message: 'Invalid arguments' });
        if (sale && (_directSalePrice == '' || _directSalePrice == 0))
            reject({ message: 'Invalid arguments' });
        if (swap && _offerToken.length == 0 && _offerAmt.length == 0)
            reject({ message: 'Invalid arguments' });


        await market.methods.editListing(
            token,
            tokenId,
            sale ? [eth] : [],
            sale ? [_directSalePrice] : [],
            bnpl ? bnplPaymentTokens : [],
            bnpl ? _deposit : [],
            bnpl ? _remainingAmt : [],
            bnpl ? _duration : [],
            swap ? _offerToken : [],
            swap ? swapOfferPaymentToken : [],
            swap ? _offerAmt : [],
            _timePeriod
        ).send({ from: account })
            .on('transactionHash', (hash) => {
                console.log("txn hash", hash);
                dispatch(setLoading({ loading: true }));
            })
            .on('error', (error, receipt) => {
                dispatch(setLoading({ loading: false }));
                reject(error);
            })
        dispatch(setLoading({ loading: false }));
        resolve();
    })
}

export const _payRemainingAmount = (item, market, account, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.payRemainingAmount(item.token, item.tokenId).send({ from: account, value: item.bnplListings[0].remaining_amount })
                .on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                });
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}

export const _cancelSwapOffer = (item, market, account, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await await market.methods.cancelSwap(
                item.token,
                item.tokenId,
                index
            ).send({ from: account })
                .on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}

export const _cancelBnplOffer = (item, market, account, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.cancelBuyNowPayLaterOffer(
                item.token,
                item.tokenId,
                index
            ).send({ from: account })
                .on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}

export const _cancelDirectSaleOffer = (item, market, account, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.cancelDirectSaleOffer(
                item.token,
                item.tokenId,
                index
            ).send({ from: account })
                .on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}

export const _claimRejectedDirectSaleOffer = (market, account, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.claimRejectedDirectSaleOffer(index)
                .send({
                    from: account
                }).on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}

export const _claimRejectedBuyNowPayLater = (market, account, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.claimRejectedBuyNowPayLaterOffer(index)
                .send({
                    from: account
                }).on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}

export const _claimRejectedSwapOffer = (market, account, index, dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            await market.methods.claimRejectedSwapOffer(index)
                .send({
                    from: account
                }).on('transactionHash', (hash) => {
                    dispatch(setLoading({ loading: true }));
                    console.log(hash);
                })
            dispatch(setLoading({ loading: false }));
            resolve();
        } catch (error) {
            dispatch(setLoading({ loading: false }));
            reject(error);
        }
    })
}
