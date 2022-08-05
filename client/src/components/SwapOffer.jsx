import React from 'react'
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import axios from "axios";
import { makeStyles } from '@mui/styles';
import { getTokenDetails, getTime } from '../api/getter';
import { _getTokenMetadata, getImageURI } from '../api/getterTezos';

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
    const [metadata, setMetadata] = useState({
        thumbnailUri: '',
        name: ''
    });
    const swap = offer.token != undefined;

    const toTez = (value) => {
        return Number(value) / 1000000;
    }

    const { account } = useSelector((state) => state.tezosConfig);

    const init = async () => {
        const metadata = await _getTokenMetadata(offer.token, offer.tokenId);
        setMetadata(metadata);
    }
    useEffect(() => {
        if (swap)
            init();
    }, []);

    const classes = useStyles();

    const handleAcceptOffer = () => {
        if (offer.deposit != undefined) {
            acceptReserveOffer(
                getImageURI(metadata.thumbnailUri),
                metadata.name,
                toTez(offer.deposit),
                toTez(offer.remainingAmount),
                offer.duration / 86400,
                offer.index
            )
        } else {
            acceptOffer(
                getImageURI(metadata.thumbnailUri),
                metadata.name,
                toTez(offer.amount),
                offer.index,
                swap
            )
        }
    }

    const getAddress = (acc) => {
        var acc = acc.substring(0, 8);
        acc = acc + '...';
        return acc;
    }

    // if (offer.timePeriod < Math.floor(Date.now() / 1000))
    //     return <></>

    return (
        <div className={`flex-justify align-center padding-15 ${classes.swapOfferCtn}`} key={index}>
            <div style={{ flex: "1 1 30%" }}>
                {
                    offer.deposit != undefined ? <div className='display-flex align-center border'>
                        <div className='crypto-value'> <img src='../img/ethereum.png' className="eth-img" />{toTez(offer.deposit)} </div>
                        <div className="font-16 plus" style={{ margin: '0 15px' }}>+</div>
                        <div className='crypto-value'><img src='../img/ethereum.png' className="eth-img" />{toTez(offer.remainingAmount)} </div>
                        <div className='expire-text' style={{ marginLeft: '10px' }}>{`within ${offer.duration / 86400} days`}</div>
                    </div>
                        : null
                }
                {
                    swap == true ? <div className='display-flex align-center border'>
                        <div className='section-image-block margin-zero'>
                            <img src={swap ? getImageURI(metadata.thumbnailUri) : "../img/ethereum.png"} className="eth-img" alt="ethLogo" />
                            <div className='section-image-desc'>
                                <span>{
                                    metadata.name
                                }</span>
                            </div>
                        </div>
                        {
                            swap && offer.amount > 0 ? <><div className="font-16 plus" style={{ margin: '0 15px' }}>+</div>
                                <div className='crypto-value display-flex align-center'><img src='../img/ethereum.png' className="eth-img" />{toTez(offer.amount)} </div>
                            </> : null
                        }
                    </div>
                        : null
                }
                {
                    !swap && offer.amount > 0 ? <>
                        <div className='crypto-value display-flex align-center'><img src='../img/ethereum.png' className="eth-img" />{toTez(offer.amount)} </div>
                    </> : null
                }

            </div>
            <div className="primary-text font-16 center" style={{ flex: "1 1 20%" }}>{getAddress(offer.owner)}</div>
            <div style={{ flex: "1 1 20%" }} className="center font-16 t1-text">{getTime(offer.timePeriod)}</div>
            <div style={{ flex: "0 0 30%" }} className="center">
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