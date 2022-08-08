import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import SwapOfferRow from './SwapOfferRow';
import PopupContainer from '../../PopupContainer';
import PopupAcceptOffer from '../../PopupAcceptOffer';
import { getTime } from "../../../api/getter";
import OfferItem from './OfferItem';
import BuyNowPayLaterRow from './BuyNowPayLaterRow';
import Addresses from "../../../contracts/Contracts.json"
import { getImageURI, _getTokenMetadata, getReservationData } from '../../../api/getterTezos';
import { _confirmAcceptOffer, _confirmAcceptReserveOffer, _cancelSwapOffer, _cancelBnplOffer } from '../../../api/marketTezos';

const OfferCard = ({ item, index, made }) => {
    const [token, setToken] = useState({
        name: '',
        thumbnailUri: '',
    })

    const [offerPopup, setOfferPopup] = useState({
        open: false,
        image: '',
        name: '',
        value: '',
        swap: '',
        index: ''
    })

    const { market, account } = useSelector((state) => state.tezosConfig);
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
            if (item.token == Addresses.PositionToken) {
                const reservationData = await getReservationData(item.tokenId);
                const metadata = await _getTokenMetadata(reservationData.token, reservationData.tokenId);
                setToken({ name: "Reservation for " + metadata.name })
            } else {
                const token = await _getTokenMetadata(item.token, item.tokenId);
                setToken(token);
            }
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }
    }

    const getAddress = (account) => {
        var acc = account.substring(0, 11);
        acc = acc + '...';
        return acc;
    }

    const toTez = (amount) => {
        return amount / 1000000;
    }

    const acceptBnplOffer = async (id, index) => {
        setOfferPopup({
            open: true,
            image: getImageURI(token.thumbnailUri),
            name: token.name,
            deposit: toTez(item.reserveOffers[index].deposit.amounts[0]),
            remainingAmount: toTez(item.reserveOffers[index].remaining.amounts[0]),
            duration: (item.reserveOffers[index].duration / 86400),
            index: id,
            reserve: true
        })
    }

    const confirmBnplOffer = async () => {
        try {
            await _confirmAcceptReserveOffer(item, market, offerPopup.index, dispatch)
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
            await _confirmAcceptOffer(item, market, offerPopup.index, dispatch);
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
            await _cancelSwapOffer(market, index, item.token, item.tokenId, dispatch)
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error("error", error);
        }
    }

    const cancelBnplOffer = async (index) => {
        try {
            await _cancelBnplOffer(market, index, item.token, item.tokenId, dispatch);
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
                    made
                        ? item.swapOffers.map((offer, index) => {
                            if (offer.owner == account)
                                return <SwapOfferRow key={index} offer={offer} index={index} made={true} cancelSwapOffer={cancelSwapOffer} offerItem={<div className='flex-item-item'>
                                    <span className='offer-title'>Item</span>
                                    <OfferItem item={token} posToken={item.token == Addresses.PositionToken} />
                                </div>} />
                        })
                        : item.swapOffers.map((offer, index) => {
                            return <SwapOfferRow key={index} offer={offer} index={index} acceptSwapOffer={acceptSwapOffer} offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} posToken={item.token == Addresses.PositionToken} />
                            </div>} />
                        })
                }
                {
                    made
                        ? item.reserveOffers.map((offer, index) => {
                            if (offer.owner == account)
                                return <BuyNowPayLaterRow offerItem={<div className='flex-item-item'>
                                    <span className='offer-title'>Item</span>
                                    <OfferItem item={token} />
                                </div>} offer={offer} getAddress={getAddress} getTime={getTime} cancelBnplOffer={cancelBnplOffer} index={index} />
                        })
                        : item.reserveOffers.map((offer, index) => {
                            return <BuyNowPayLaterRow offerItem={<div className='flex-item-item'>
                                <span className='offer-title'>Item</span>
                                <OfferItem item={token} />
                            </div>} offer={offer} getAddress={getAddress} acceptBnplOffer={acceptBnplOffer} index={index} />
                        })
                }
            </div>
            <PopupContainer isOpen={offerPopup.open} popupTitle={"Accept Swap Offer"}>
                <PopupAcceptOffer token={token} confirmAcceptOffer={confirmAcceptOffer} offerPopup={offerPopup} resetOfferPopup={resetOfferPopup} confirmAcceptReserveOffer={confirmBnplOffer} isPosToken={item.token == Addresses.PositionToken} />
            </PopupContainer>
        </div>
    )
}

export default OfferCard