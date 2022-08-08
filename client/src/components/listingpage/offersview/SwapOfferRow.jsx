import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material';
import { _getTokenMetadata, getImageURI, getTimeStamp } from "../../../api/getterTezos";
import { getTezLogo } from '../../../utils';
import TezLogo from "../../../SVG/TezosLogo_Icon_Blue.png";

const SwapOfferRow = ({ acceptSwapOffer, offer, made, cancelSwapOffer, offerItem, claimRejected }) => {
    const [metadata, setMetadata] = useState({
        name: "",
        thumbnailUri: "",
    });

    const getTime = (timeStamp) => {
        const time = getTimeStamp(timeStamp);
        var diff = time - Date.now() / 1000;
        const day = Math.floor(diff / 86400);
        diff = diff % 86400;
        const hour = Math.floor(diff / 3600);
        diff = diff % 3600;
        const mins = Math.floor(diff / 60);
        var ret = (day > 0 ? `${day} days ` : '') + (hour > 0 ? `${hour} hours ` : '') + (mins > 0 ? `${mins} mins` : '');
        return ret;
    }

    const getAddress = (account) => {
        var acc = account.substring(0, 11);
        acc = acc + '...';
        return acc;
    }

    const toTez = (amount) => {
        return amount / 1000000;
    }

    const getData = async (token, tokenId) => {
        try {
            const _metadata = await _getTokenMetadata(token, tokenId);
            setMetadata(_metadata)
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }
    }

    useEffect(() => {
        if (claimRejected && offer.assets.tokens.get(0) != undefined)
            getData(offer.assets.tokens.get(0), offer.assets.tokenIds.get(0))
        if (offer.assets.tokens[0] != undefined)
            getData(offer.assets.tokens[0], offer.assets.tokenIds[0]);
    }, [])

    return (
        <div className='offer-list-flex flex-justify t2-text font-16 margin-bottom-20 align-center margin-top-10 mobile1000'>
            {offerItem}
            <div className='flex-item-offer'>
                <span className='offer-title'>Offer</span>
                <div className='outline-border radius-10 padding-10 flex-justify-start align-center flex-wrap'>
                    {
                        claimRejected != undefined
                            ? <>
                                {
                                    offer.assets.tokens.get('0') != undefined
                                        ? <>
                                            <img className="small-card-img radius-5 margin-right-5" src={getImageURI(metadata.thumbnailUri)} />
                                            <div className='flex-justify-start column-direction'>
                                                <span className='t2-text font-14 ellipsis'>{metadata.name}</span>
                                            </div>
                                        </>
                                        : null
                                }
                                {
                                    offer.assets.tokens.get('0') != undefined && offer.assets.amounts.get('0') != undefined && offer.assets.amounts.get('0').toNumber() != 0 ? <span className='t2-text font-16 plus'>+</span> : null
                                }
                                {
                                    offer.assets.amounts.get('0') != undefined && offer.assets.amounts.get('0').toNumber() != 0
                                        ? <div className="display-flex align-center">
                                            <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src={TezLogo} className="eth-img" />
                                            <span className='font-14 t2-text'>{`${toTez(offer.assets.amounts.get('0').toNumber())}`}</span>
                                        </div>
                                        : null
                                }
                            </>
                            : <>
                                {
                                    offer.assets.tokens[0] != undefined
                                        ? <>
                                            <img className="small-card-img radius-5 margin-right-5" src={getImageURI(metadata.thumbnailUri)} />
                                            <div className='flex-justify-start column-direction'>
                                                <span className='t2-text font-14 ellipsis'>{metadata.name}</span>
                                            </div>
                                        </>
                                        : null
                                }
                                {
                                    offer.assets.tokens[0] != undefined && offer.assets.amounts[0] != undefined && offer.assets.amounts[0] != 0 ? <span className='t2-text font-16 plus'>+</span> : null
                                }
                                {
                                    offer.assets.amounts[0] != undefined && offer.assets.amounts[0] != 0
                                        ? <div className="display-flex align-center">
                                            <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src={TezLogo} className="eth-img" />
                                            <span className='font-14 t2-text'>{`${toTez(offer.assets.amounts[0])}`}</span>
                                        </div>
                                        : null
                                }
                            </>
                    }
                </div>
            </div>
            <label className='flex-item-by'>
                <span className='offer-title'>Offered By</span>
                <span className='primary-text'>{getAddress(offer.owner)}</span>
            </label>
            <label className='flex-item-expires'>
                <span className='offer-title'>Offered By</span>
                <span className='t2-text'>{
                    claimRejected == undefined ? getTime(offer.timePeriod) : "Expired"
                }</span>
            </label>
            <div className='flex-item-action'>
                {
                    claimRejected != undefined
                        ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => claimRejected(offer.id.toNumber())}>Claim Back</Button>
                        : made
                            ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => cancelSwapOffer(offer.id)}>Cancel</Button>
                            : <Button className={"btn bg-white green-text bg-green-border font-14 btn-success"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => acceptSwapOffer(
                                offer.assets.tokens[0] != undefined ? getImageURI(metadata.thumbnailUri) : '',
                                offer.assets.tokens[0] != undefined ? metadata.name : '',
                                offer.assets.amounts[0] != undefined && offer.assets.amounts[0] != 0 ? toTez(offer.assets.amounts[0]) : '',
                                offer.id
                            )}>
                                Accept
                            </Button>
                }
            </div>
        </div >
    )
}

export default SwapOfferRow