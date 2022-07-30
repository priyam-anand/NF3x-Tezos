import React, { Fragment, useEffect, useState, useRef } from 'react'
import { ArrowForwardIos } from '@mui/icons-material';
import { Button, Card, Chip } from '@mui/material';
import axios from "axios";
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAccount } from '../redux/web3ConfigSlice';
import { DoubleArrowIcon } from './DoubleArrowIcon';
import Addresses from "../contracts/Addresses.json";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ReactComponent as EthGreen } from '../SVG/green-eth.svg';
import { ReactComponent as EthBlue } from '../SVG/blue-eth.svg';
import { ReactComponent as Slash } from '../SVG/slash.svg';
import { useNavigate } from 'react-router-dom';
import { getImageURI, getTokenDetails, _getToken } from "../api/getter"
import { _claimBackNFT } from '../api/market';
import Contracts from "../contracts/Contracts.json";

const useStyles = makeStyles({

});

const ListingCard = ({ item, isEditable, onHandleSelectedItem, itemIndex, isActive, isCustomLabel }) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const cardImg = useRef({});
    // const { market, getter, account, web3 } = useSelector((state) => state.web3Config);
    const [data, setData] = useState({
        name: "",
        thumbnailUri: ""
    });
    const dispatch = useDispatch();

    useEffect(() => {
        // window?.ethereum?.on("accountsChanged", accounts => {
        //     dispatch(setAccount({ account: accounts[0] }));
        // });
        cardImg.current.onerror = (e) => {
            // console.log(e.target.src);
        }

    }, [])

    const getData = async () => {
        try {
            // get data from tzkt
            const token = item.token;
            const tokenId = item.tokenId.toNumber();

            const metadata = (await axios.get(`https://api.ghostnet.tzkt.io/v1/tokens?contract=${token}&tokenId=${tokenId}`)).data[0].metadata;

            setData(metadata);
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }
    }

    const toTez = (amount) => {
        return amount / 1000000;
    }

    // const claimBackNFT = async (e) => {
    //     e.stopPropagation();
    //     try {
    //         await _claimBackNFT(item, market, account, dispatch);
    //         window.location.reload();
    //     } catch (error) {
    //         console.error(error);
    //         window.alert(error.message);
    //     }
    // }

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
                {/* <span className='no-hover'>{index > 0 && <Slash style={{ margin: "0 3px" }} />}</span> */}
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
                {/* <span className='no-hover'>{index > 0 && <Slash style={{ margin: "0 3px" }} />}</span> */}
                <Chip className='chip-block chip' label={<Fragment>
                    <EthBlue style={{ marginRight: "2px" }} />
                    <span style={{ marginRight: "3px" }}>{toTez(listing.deposit.toNumber())}</span>
                    <span style={{ marginRight: "3px" }}>+</span>
                    <EthBlue style={{ marginRight: "2px" }} />
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
                    {/* <div style={{height: "100%"}}> */}
                    <img ref={cardImg} className='radius-20' src={getImageURI(data.thumbnailUri)} alt='img' onLoadedDataCapture={(e) => console.log(e)} />
                    {/* </div> */}
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
                                    <span className='font-11 light-grey-text chip-title'>Swap Now : </span>{<Chip className='chip-block chip' label={<span><EthGreen /> {toTez(item.listing.directListing.amount.toNumber())} </span>} variant="outlined" />}
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
                    {/* {isEditable && <Button disableRipple onClick={(e) => onHandleSelectedItem(e, item, itemIndex)} startIcon={<EditOutlinedIcon className='font-14' />}
                        className={"btn btn-edit font-14 absolute"} variant="contained">edit</Button>}
                    {isCustomLabel && <Button disableRipple onClick={(e) => claimBackNFT(e)} className={"btn btn-edit font-14 absolute padding-zero"} variant="contained">claim back</Button>} */}
                </div>
            </Card>
        </div>
    )
}

export default ListingCard