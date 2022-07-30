import React from 'react'
import { Button } from '@mui/material';

const BuyNowPayLaterRow = ({ offerItem, offer, toETH, getAddress, getTime, cancelBnplOffer, acceptBnplOffer, index, claimRejected }) => {
    return (
        <div className='offer-list-flex display-flex align-center t2-text font-16 margin-bottom-10 mobile1000'>
            {offerItem}
            <div className='flex-item-offer'>
                <span className='offer-title'>Offer</span>
                <div className='outline-border flex-justify-start align-center radius-10 padding-10 flex-wrap'>
                    <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src='../img/ethereum.png' className="eth-img" />
                    <span className='font-14 t2-text'>{`${toETH(offer.deposit)}`}</span>
                    {/* </div> */}
                    <span className='t2-text font-16 plus'>+</span>
                    {/* <div className='relative section-image-block inline-block outline-border display-flex flex-justify align-center radius-10 padding-10'> */}
                    <span className="flex-justify-start align-center">
                        <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src='../img/ethereum.png' className="eth-img" />
                        <span className='font-14 t2-text'>{`${toETH(offer.remaining_amount)}`}</span>
                    </span>
                    <span className='font-14 t2-text margin-left-10'>within {`${offer.duration / 86400} days`}</span>
                </div>
            </div>
            <label className='flex-item-by'>
                <span className='offer-title'>Offered By</span>
                <span className='primary-text'>{getAddress(offer.owner)}</span>
            </label>
            <label className='flex-item-expires'>
                <span className='offer-title'>Offered By</span>
                <span className='t2-text'>{
                    claimRejected == undefined ? getTime(offer.time_period) : "Expired"
                }</span>
            </label>
            <div className='flex-item-action'>
                {
                    claimRejected != undefined ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14 btn-cancel"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => claimRejected(offer.idx)}>Claim Back</Button> : acceptBnplOffer != undefined ? <Button disableRipple className={"btn bg-white green-text bg-green-border font-14 btn-success"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => acceptBnplOffer(index)}>
                        Accept
                    </Button> : <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14 btn-cancel"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => cancelBnplOffer(index)}>Cancel</Button>
                }
            </div>
        </div>
    )
}

export default BuyNowPayLaterRow