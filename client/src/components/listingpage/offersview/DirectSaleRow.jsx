import React from 'react'
import { Button } from '@mui/material'
const DirectSaleRow = ({ offerItem, offer, toETH, getAddress, getTime, cancelDirectSaleOffer, acceptDirectSaleOffer, index, claimRejected }) => {
    return (
        <div className='offer-list-flex flex-justify t2-text font-16 margin-bottom-20 align-center mobile1000'>
            {offerItem}
            <div className='flex-item-offer'>
                <span className='offer-title'>Offer</span>
                <div className='outline-border flex-justify-start align-center radius-10 padding-10 flex-wrap'>
                    <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src='../img/ethereum.png' className="eth-img" />
                    <span className='font-14 t2-text'>{`${toETH(offer.amounts[0])}`}</span>
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
                    claimRejected != undefined ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => claimRejected(offer.idx)}>Claim Back</Button>
                        : cancelDirectSaleOffer != undefined ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => cancelDirectSaleOffer(index)}>Cancel</Button>
                            : <Button disableRipple className={"btn bg-white green-text bg-green-border font-14 btn-success"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => acceptDirectSaleOffer(index)}>
                                Accept
                            </Button>
                }
            </div>
        </div>
    )
}

export default DirectSaleRow