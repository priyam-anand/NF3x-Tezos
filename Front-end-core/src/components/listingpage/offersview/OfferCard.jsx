import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import SwapOfferRow from './SwapOfferRow';
import PopupContainer from '../../PopupContainer';
import PopupAcceptOffer from '../../PopupAcceptOffer';
import { _cancelBnplOffer, _cancelDirectSaleOffer, _cancelSwapOffer, _confirmAcceptOffer, _confirmAcceptReserveOffer } from '../../../api/market';
import { _getToken, getTime } from "../../../api/getter";
import OfferItem from './OfferItem';
import BuyNowPayLaterRow from './BuyNowPayLaterRow';
import DirectSaleRow from './DirectSaleRow';

const OfferCard = ({ item, index, made }) => {

    const [token, setToken] = useState({
        name: '',
        image_url: '',
        token_id: '',
        asset_contract: { name: '' }
    })

    const [offerPopup, setOfferPopup] = useState({
        open: false,
        image: '',
        name: '',
        value: '',
        swap: '',
        index: ''
    })

    const { web3, market, account } = useSelector((state) => state.web3Config);
    const dispatch = useDispatch();
    const resetOfferPopup = () => {
        setOfferPopup({
            open: false,
            image: '',
            name: '',
            value: '',
            swap: '',
            index: ''
        })
    }

    const getToken = async () => {
        try {
            const token = await _getToken(item.token, item.tokenId);
            setToken(token);
        } catch (err) {
            if (err.response.status == 429) {
                setTimeout(() => {
                    getToken();
                }, 500);
            } else {
                window.alert(err.message);
                console.error(err);
            }

        }
    }

    const getAddress = (account) => {
        var acc = account.substring(0, 11);
        acc = acc + '...';
        return acc;
    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const acceptDirectSaleOffer = async (index) => {
        setOfferPopup({
            ...offerPopup,
            open: true,
            value: toETH(item.directSaleOffers[index].amounts[0]),
            swap: false,
            index: index
        });
    }

    const acceptBnplOffer = async (index) => {
        setOfferPopup({
            open: true,
            image: token.image_url,
            name: token.name != null ? token.name : token.asset_contract.name + " #" + token.token_id,
            deposit: toETH(item.bnplOffers[index].deposit),
            remainingAmount: toETH(item.bnplOffers[index].remaining_amount),
            duration: (item.bnplOffers[index].duration / 86400),
            index: index,
            reserve: true
        })
    }

    const confirmBnplOffer = async () => {
        try {
            await _confirmAcceptReserveOffer(item, market, account, offerPopup, dispatch);
            resetOfferPopup();
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error("error", error);
        }
    }

    const acceptSwapOffer = async (image, name, value, index) => {
        setOfferPopup({
            open: true,
            image: image,
            name: name,
            index: index,
            swap: true,
            value: value
        });
    }

    const confirmAcceptOffer = async () => {
        try {
            await _confirmAcceptOffer(item, market, account, offerPopup, dispatch);
            resetOfferPopup();
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error("error", error);
            resetOfferPopup();
        }
    }

    const cancelSwapOffer = async (index) => {
        try {
            await _cancelSwapOffer(item, market, account, index, dispatch);
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error("error", error);
        }
    }

    const cancelBnplOffer = async (index) => {
        try {
            await _cancelBnplOffer(item, market, account, index, dispatch);
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error("error", error);
        }
    }

    const cancelDirectSaleOffer = async (index) => {
        try {
            await _cancelDirectSaleOffer(item, market, account, index, dispatch);
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error("error", error);
        }
    }

    useEffect(() => {
        getToken();
    }, [])
    return (
        <div className='outline-border radius-15 offer-block ' key={index}>
            <div className='offer-item-list inline-block'>
                <div className='offer-list-flex display-flex align-center b-grey-text font-16 desktop1000'>
                    <span className='b-grey-text font-16 flex-item-item medium-weight'>Item</span>
                    <span className='flex-item-offer center block-elem medium-weight'>Offer</span>
                    <span className='flex-item-by center medium-weight'>Offered By</span>
                    <span className='flex-item-expires center medium-weight'>Expires In</span>
                    <span className="flex-item-action center medium-weight">&nbsp;</span>
                </div>
                {
                    made ? item.swapOffers.map((offer, index) => {
                        if (offer.owner.toLowerCase() == account)
                            return <SwapOfferRow key={index} offer={offer} index={index} made={true} cancelSwapOffer={cancelSwapOffer} offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} />
                    })
                        : item.swapOffers.map((offer, index) => {
                            return <SwapOfferRow key={index} offer={offer} index={index} acceptSwapOffer={acceptSwapOffer} offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} />
                        })
                }
                {
                    made ? item.bnplOffers.map((offer, index) => {
                        if (offer.owner.toLowerCase() == account)
                            return <BuyNowPayLaterRow offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} offer={offer} toETH={toETH} getAddress={getAddress} getTime={getTime} cancelBnplOffer={cancelBnplOffer} index={index} />
                    })
                        : item.bnplOffers.map((offer, index) => {
                            return <BuyNowPayLaterRow offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} offer={offer} toETH={toETH} getAddress={getAddress} getTime={getTime} acceptBnplOffer={acceptBnplOffer} index={index} />
                        })
                }
                {
                    made ? item.directSaleOffers.map((offer, index) => {
                        if (offer.owner.toLowerCase() == account)
                            return <DirectSaleRow offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} offer={offer} toETH={toETH} getAddress={getAddress} getTime={getTime} cancelDirectSaleOffer={cancelDirectSaleOffer} index={index} />
                    }) :
                        item.directSaleOffers.map((offer, index) => {
                            return <DirectSaleRow offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} offer={offer} toETH={toETH} getAddress={getAddress} getTime={getTime} acceptDirectSaleOffer={acceptDirectSaleOffer} index={index} />
                        })
                }
            </div>
            <PopupContainer isOpen={offerPopup.open} popupTitle={"Accept Swap Offer"}>
                <PopupAcceptOffer token={token} confirmAcceptOffer={confirmAcceptOffer} offerPopup={offerPopup} resetOfferPopup={resetOfferPopup} confirmAcceptReserveOffer={confirmBnplOffer} />
            </PopupContainer>
        </div>
    )
}

export default OfferCard