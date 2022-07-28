import React from 'react'
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import axios from "axios";
import { makeStyles } from '@mui/styles';
import { getImageURI, getTokenDetails, getTime } from '../api/getter';

const useStyles = makeStyles({
    swapOfferCtn: {
        "& .border": {
            padding: "23px 24px",
            border: "1px solid #E6E8EC",
            borderRadius: '14px',
            width: 'fit-content'
        }
    }
})

const SwapOffer = ({ offer, item, acceptOffer, index, acceptReserveOffer }) => {
    const { web3, account, getter } = useSelector((state) => state.web3Config);
    const [data, setData] = useState({ name: '', image: '' });
    const [tokenName, setTokenName] = useState();
    const swap = offer.token_addresses != undefined;

    const init = async () => {
        const _tokenDetails = await getTokenDetails(offer, getter, account);
        const data = await axios.get(_tokenDetails[0]);
        setData(data.data);
        setTokenName(_tokenDetails[1]);
    }
    useEffect(() => {
        if (swap)
            init();
    }, []);

    const classes = useStyles();

    const handleAcceptOffer = () => {
        if (offer.deposit != undefined) {
            acceptReserveOffer(
                getImageURI(data.image),
                data.name == undefined ? tokenName + " #" + item.tokenId : data.name,
                toETH(offer.deposit),
                toETH(offer.remaining_amount),
                offer.duration / 86400,
                index
            )
        } else {
            acceptOffer(
                getImageURI(data.image),
                data.name == undefined ? tokenName + " #" + item.tokenId : data.name,
                toETH(offer.amounts[0] == undefined ? '0' : offer.amounts[0]),
                index,
                swap)
        }
    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const getAddress = (acc) => {
        var acc = acc.substring(0, 8);
        acc = acc + '...';
        return acc;
    }

    if (offer.time_period < Math.floor(Date.now() / 1000))
        return <></>

    return (
        <div className={`flex-justify align-center padding-15 ${classes.swapOfferCtn}`} key={index}>
            <div style={{ flex: "1 1 30%" }}>
                {
                    offer.deposit != undefined ? <div className='display-flex align-center border'>
                        <div className='crypto-value'> <img src='../img/ethereum.png' className="eth-img" />{toETH(offer.deposit)} </div>
                        <div className="font-16 plus" style={{ margin: '0 15px' }}>+</div>
                        <div className='crypto-value'><img src='../img/ethereum.png' className="eth-img" />{toETH(offer.remaining_amount)} </div>
                        <div className='expire-text' style={{ marginLeft: '10px' }}>{`within ${offer.duration / 86400} days`}</div>
                    </div>
                        : null
                }
                {
                    swap == true ? <div className='display-flex align-center border'>
                        <div className='section-image-block margin-zero'>
                            <img src={swap ? getImageURI(data.image) : "../img/ethereum.png"} className="eth-img" alt="ethLogo" />
                            <div className='section-image-desc'>
                                <span>{
                                    data.name == undefined ? tokenName + " #" + item.tokenId : data.name
                                }</span>
                            </div>
                        </div>
                        {
                            swap && offer.amounts[0] > 0 ? <><div className="font-16 plus" style={{ margin: '0 15px' }}>+</div>
                                <div className='crypto-value display-flex align-center'><img src='../img/ethereum.png' className="eth-img" />{toETH(offer.amounts[0])} </div>
                            </> : null
                        }
                    </div>
                        : null
                }
                {
                    !swap && offer.amounts != undefined
                        ? <div className='display-flex align-center border'><div className='crypto-value'><img src='../img/ethereum.png' className="eth-img" />{toETH(offer.amounts[0])} </div></div>
                        : null
                }

            </div>
            <div className="primary-text font-16 center" style={{ flex: "1 1 20%" }}>{getAddress(offer.owner)}</div>
            <div style={{ flex: "1 1 20%" }} className="center font-16 t1-text">{getTime(offer.time_period)}</div>
            <div style={{ flex: "0 0 30%" }} className="center">
                <Button disableRipple variant='outlined' className={"btn bg-white primary-text primary-border margin-top-5"}>View</Button>
                {
                    item.owner == account ? <Button disableRipple variant='contained' className={"btn margin-top-5"} onClick={handleAcceptOffer}>
                        Accept
                    </Button> : null
                }
            </div>
        </div>
    )
}

export default SwapOffer