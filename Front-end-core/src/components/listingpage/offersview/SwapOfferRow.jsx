import React, { useState, useEffect } from 'react'
import { Button, IconButton, InputBase, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import Addresses from "../../../contracts/Addresses.json";
import axios from "axios";
import { getTokenDetails, getImageURI, getTime, _getToken } from '../../../api/getter';

const SwapOfferRow = ({ acceptSwapOffer, offer, index, made, cancelSwapOffer, offerItem, claimRejected }) => {

    const [data, setData] = useState({
        name: "",
        image: ""
    });
    const [tokenName, setTokenName] = useState();

    const { web3, getter, account } = useSelector((state) => state.web3Config);

    const getAddress = (account) => {
        var acc = account.substring(0, 11);
        acc = acc + '...';
        return acc;
    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const getData = async () => {
        try {
            if (offer.token_addresses[0].toLowerCase() == Addresses.nameToAddress["World of Women"].toLowerCase()) {
                const _tokenDetails = await _getToken(offer.token_addresses[0], offer.tokenIds[0]);
                setData({ name: _tokenDetails.name, image: _tokenDetails.image_url })
            }
            else {
                const _tokenDetails = await getTokenDetails(offer, getter, account);
                const data = await axios.get(_tokenDetails[0]);
                setData(data.data);
                setTokenName(_tokenDetails[1]);
            }
        } catch (err) {
            if (err.response.status == 429) {
                setTimeout(() => {
                    getData();
                }, 500);
            } else {
                window.alert(err.message);
                console.error(err);
            }
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className='offer-list-flex flex-justify t2-text font-16 margin-bottom-20 align-center margin-top-10 mobile1000'>
            {offerItem}
            <div className='flex-item-offer'>
                <span className='offer-title'>Offer</span>
                <div className='outline-border radius-10 padding-10 flex-justify-start align-center flex-wrap'>
                    <img className="small-card-img radius-5 margin-right-5" src={getImageURI(data.image)} />
                    <div className='flex-justify-start column-direction'>
                        <span className='t2-text font-14 ellipsis'>{data.name == undefined ? tokenName + " #" + offer.tokenIds[0] : data.name}</span>
                        <span className='b-grey-text font-14 left'>Any</span>
                    </div>

                    {
                        offer.amounts.length == 0 || offer.amounts[0] == 0 ? null : <><span className='t2-text font-16 plus'>+</span>
                            {/* <div className='relative section-image-block inline-block outline-border display-flex align-center radius-10 padding-10'> */}
                            <div className="display-flex align-center">
                                <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src='../img/ethereum.png' className="eth-img" />
                                <span className='font-14 t2-text'>{`${toETH(offer.amounts[0])}`}</span>
                            </div>
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
                    claimRejected == undefined ? getTime(offer.time_period) : "Expired"
                }</span>
            </label>
            <div className='flex-item-action'>
                {
                    claimRejected != undefined ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => claimRejected(offer.idx)}>Claim Back</Button> : made ? <Button disableRipple className={"btn bg-white t2-text bg-t2-border font-14"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => cancelSwapOffer(index)}>Cancel</Button>
                        : <Button className={"btn bg-white green-text bg-green-border font-14 btn-success"} sx={{ borderRadius: "10px !important" }} variant="contained" onClick={e => acceptSwapOffer(
                            getImageURI(data.image),
                            data.name == undefined ? tokenName + " #" + offer.tokenIds[0] : data.name,
                            offer.amounts.length != 0 ? toETH(offer.amounts[0]) : 0, index)}>
                            Accept
                        </Button>
                }
            </div>
        </div >
    )
}

export default SwapOfferRow