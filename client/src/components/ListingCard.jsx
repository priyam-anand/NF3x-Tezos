import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Card, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Contracts from "../contracts/Contracts.json";
import { _getTokenMetadata, getImageURI } from '../api/getterTezos';
import { _handleCancelListing } from '../api/marketTezos';
import { getTezLogo } from '../utils';
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png"

const useStyles = makeStyles({

});

const ListingCard = ({ item, isActive, isCustomLabel }) => {
    const navigate = useNavigate();
    const cardImg = useRef({});
    const { market } = useSelector((state) => state.tezosConfig);
    const [data, setData] = useState({
        name: "",
        displayUri: ""
    });
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const token = item.token;
            const tokenId = item.tokenId.toNumber();

            const metadata = await _getTokenMetadata(token, tokenId);

            setData(metadata);
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }
    }

    const toTez = (amount) => {
        return amount / 1000000;
    }

    const claimBackNFT = async (e) => {
        e.stopPropagation();
        try {
            await _handleCancelListing(market, item, dispatch);
            window.location.reload();
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const chips = () => {
        var listings = [];
        for (var i = 0; i < item.listing.swapListing.tokens.size; i++) {
            listings[i] = {
                token: item.listing.swapListing.tokens.get((i + "")),
                paymentToken: item.listing.swapListing.paymentTokens.get((i + "")),
                amount: item.listing.swapListing.amounts.get((i + "")),
            }
        }
        return listings.map((listing, index) => {
            return <>
                <Chip className='chip-block chip' key={index}
                    label={listing.amount > 0 ?
                        `${Contracts.addressToName[listing.token]} + ${toTez(listing.amount)}`
                        : `${Contracts.addressToName[listing.token]}`
                    }
                    variant="outlined" />
            </>
        });
    }

    const getBnplChips = () => {
        var listings = [];
        for (var i = 0; i < item.listing.reserveListing.deposit.size; i++) {
            listings[i] = {
                deposit: item.listing.reserveListing.deposit.get((i + "")),
                remaining: item.listing.reserveListing.remaining.get((i + "")),
                duration: item.listing.reserveListing.duration.get((i + "")),
            }
        }
        return listings.map((listing, index) => {
            return <>
                <Chip className='chip-block chip' label={<Fragment>
                    <img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                    <span style={{ marginRight: "3px" }}>{toTez(listing.deposit.toNumber())}</span>
                    <span style={{ marginRight: "3px" }}>+</span>
                    <img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                    <span style={{ marginRight: "3px" }} >{toTez(listing.remaining.toNumber())}</span>
                    <span style={{ marginRight: "3px" }}>in</span>
                    {(listing.duration / 86400).toFixed()} Days</Fragment>}
                    variant="outlined" /></>
        });
    }

    return (
        <div>
            <Card className={`no-shadow padding-10 width-100`}>
                <div style={{ display: "flex", flexDirection: "column" }} className={`generic-card medium-card radius-20 pointer relative overflow-hidden ${(isActive && "active-box") ?? ""}`} onClick={() => navigate(`/listdetail/${item.token}/${item.tokenId.toNumber()}`)}>
                    <img ref={cardImg} className='radius-20' src={getImageURI(data.displayUri)} alt='img' onLoadedDataCapture={(e) => console.log(e)} />
                    <div className='card-footer'>
                        <div className='flex-justify'>
                            <span className='font-14 medium-weight t2-text ellipsis'>{
                                data.name
                            }</span>
                            <span className='primary-text medium-weight font-14 card-detail'>See Details &gt;</span>
                        </div>
                        <div className='flex-justify-start column-direction card-chip-block'>
                            {
                                item.listing.listingType.get('0') ? <div className='green-block flex-justify-start'>
                                    <span className='font-11 light-grey-text chip-title'>Swap Now : </span>{<Chip className='chip-block chip' label={<span>                              <img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                                        {toTez(item.listing.directListing.amount.toNumber())} </span>} variant="outlined" />}
                                </div> : null
                            }
                            {
                                item.listing.listingType.get('1') ? <div className='blue-block flex-justify-start'>
                                    <span className='font-11 light-grey-text chip-title'>Reserve : </span><span>{getBnplChips()}</span>
                                </div> : null
                            }
                            {
                                item.listing.listingType.get('2') ? <div className='purple-block flex-justify-start'>
                                    <span className='font-11 light-grey-text chip-title'>Exchange : </span><span>{chips()}</span>
                                </div> : null
                            }
                        </div>
                    </div>
                    {isCustomLabel && <Button disableRipple onClick={(e) => claimBackNFT(e)} className={"btn btn-edit font-14 absolute padding-zero"} variant="contained">claim back</Button>}
                </div>
            </Card>
        </div>
    )
}

export default ListingCard