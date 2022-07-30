import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getItemWIthId, _getToken, getTime } from "../../../api/getter";
import OfferItem from './OfferItem';
import SwapOfferRow from './SwapOfferRow';
import BuyNowPayLaterRow from './BuyNowPayLaterRow';
import DirectSaleRow from './DirectSaleRow';
import { _claimRejectedBuyNowPayLater, _claimRejectedDirectSaleOffer, _claimRejectedSwapOffer } from '../../../api/market';

const RejectedOfferCard = ({ item, index }) => {
    const [token, setToken] = useState({
        name: '',
        image_url: '',
        token_id: '',
        asset_contract: { name: '' }
    })
    const { getter, account, web3, market } = useSelector(state => state.web3Config);

    const dispatch = useDispatch();

    const getToken = async () => {
        try {
            const token = await getItemWIthId(item.id, getter, account);
            const data = await _getToken(token.token, token.tokenId);

            setToken(data);
        } catch (error) {
            if (error.response.status == 429) {
                setTimeout(() => {
                    getToken();
                }, 500);
            } else {
                console.log(error);
                window.alert(error.message);
                window.location.reload();
            }
        }
    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const getAddress = (account) => {
        var acc = account.substring(0, 11);
        acc = acc + '...';
        return acc;
    }

    const claimRejectedDirectSale = async (index) => {
        try {
            await _claimRejectedDirectSaleOffer(market, account, index, dispatch);
            window.location.reload();
        } catch (error) {
            console.log(error);
            window.alert(error.message)
        }
    }

    const claimRejectedBuyNowPayLater = async (index) => {
        try {
            await _claimRejectedBuyNowPayLater(market, account, index, dispatch);
            window.location.reload();
        } catch (error) {
            console.log(error);
            window.alert(error.message)
        }
    }

    const claimRejectedSwap = async (index) => {
        try {
            await _claimRejectedSwapOffer(market, account, index, dispatch);
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
                    item.swap.map((offer, index) => {
                        return <SwapOfferRow key={index} offer={offer} index={index} made={true} claimRejected={claimRejectedSwap} offerItem={<div className='flex-item-item'>
                        <span className='offer-title'>Item</span>
                        <OfferItem item={token} />
                    </div>} />
                    })
                }
                {
                    item.direct.map((offer, index) => {
                        return <DirectSaleRow offerItem={<div className='flex-item-item'>
                        <span className='offer-title'>Item</span>
                        <OfferItem item={token} />
                    </div>} offer={offer} toETH={toETH} getAddress={getAddress} getTime={getTime} claimRejected={claimRejectedDirectSale} index={index} />
                    })
                }
                {
                    item.bnpl.map((offer, index) => {
                        return <BuyNowPayLaterRow offerItem={<div className='flex-item-item'>
                        <span className='offer-title'>Item</span>
                        <OfferItem item={token} />
                    </div>} offer={offer} toETH={toETH} getAddress={getAddress} getTime={getTime} claimRejected={claimRejectedBuyNowPayLater} index={index} />
                    })
                }
            </div>
        </div>
    )
}

export default RejectedOfferCard