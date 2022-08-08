import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import OfferItem from './OfferItem';
import SwapOfferRow from './SwapOfferRow';
import BuyNowPayLaterRow from './BuyNowPayLaterRow';
import { _getTokenMetadata, _getToken } from '../../../api/getterTezos';
import { _claimRejectedReserveOffer, _claimRejectedSwapOffer } from '../../../api/marketTezos';
const RejectedOfferCard = ({ item, index, swap, reserve }) => {
    const [token, setToken] = useState({
        name: '',
        thumbnailUri: '',
    })
    const { market, account } = useSelector((state) => state.tezosConfig);

    const dispatch = useDispatch();

    const getToken = async () => {
        try {
            const token = await _getTokenMetadata(item.token, item.tokenId.toNumber());
            setToken(token);
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }
    }

    const toTez = (amount) => {
        return amount / 1000000;
    }

    const getAddress = (account) => {
        var acc = account.substring(0, 11);
        acc = acc + '...';
        return acc;
    }

    const claimRejectedBuyNowPayLater = async (index) => {
        try {
            await _claimRejectedReserveOffer(market, index, dispatch)
            window.location.reload();
        } catch (error) {
            console.log(error);
            window.alert(error.message)
        }
    }

    const claimRejectedSwap = async (index) => {
        try {
            await _claimRejectedSwapOffer(market, index, dispatch)
            window.location.reload();
        } catch (error) {
            console.log(error);
            window.alert(error.message)
        }
    }

    useEffect(() => {
        getToken();
    }, []);

    return (
        <div className='outline-border radius-15 offer-block ' key={index}>
            <div className='offer-item-list inline-block'>
                <div className='offer-list-flex flex-justify b-grey-text font-16 desktop1000'>
                    <span className='b-grey-text font-16 flex-item-item medium-weight'>Item</span>
                    <span className='flex-item-offer center block-elem medium-weight'>Offer</span>
                    <span className='flex-item-by center medium-weight'>Offered By</span>
                    <span className='flex-item-expires center medium-weight'>Expires In</span>
                    <span className="flex-item-action center medium-weight">&nbsp;</span>
                </div>

                {
                    swap
                        ? <SwapOfferRow key={index} offer={item} index={index} made={true} claimRejected={claimRejectedSwap} offerItem={<div className='flex-item-item'>
                            <span className='offer-title'>Item</span>
                            <OfferItem item={token} /></div>} />
                        : null
                }
                {
                    reserve
                        ? <BuyNowPayLaterRow offerItem={<div className='flex-item-item'>
                            <span className='offer-title'>Item</span>
                            <OfferItem item={token} />
                        </div>} offer={item} getAddress={getAddress} claimRejected={claimRejectedBuyNowPayLater} index={index} />
                        : null
                }

            </div>
        </div>
    )
}

export default RejectedOfferCard