import React, { Fragment, useEffect, useState } from 'react'
import { ArrowForwardIos } from '@mui/icons-material';
import { Card, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DoubleArrowIcon } from './DoubleArrowIcon';
import axios from "axios";
import Addresses from "../contracts/Addresses.json";
import { useSelector } from "react-redux";
import { ReactComponent as EthGreen } from '../SVG/green-eth.svg';
import { ReactComponent as EthBlue } from '../SVG/blue-eth.svg';
import { ReactComponent as Slash } from '../SVG/slash.svg';
import { getTokenDetails, getImageURI, _getToken } from '../api/getter';

const useStyles = makeStyles({
    maincard: {
        minHeight: '300px',
        display: "inline-block",
        verticalAlign: "top",
        minWidth: '240px',
        maxWidth: "240px",
        padding: '10px',
        margin: "0 40px 0 0px",
        borderRadius: "15px",
        width: 'auto',
        position: "relative",
        border: "1px solid transparent",
        boxShadow: '0px 0px 16.0897px rgba(37, 97, 186, 0.12)',
        "& .btn-edit > span:first-child": {
            marginRight: "3px"
        },
        '& > div': {
            background: "rgba(230, 232, 236, 0.22)",
            width: '240px'
        },
        "& h3": {
            fontSize: "13px",
            fontWeight: "500",
            color: "#23262F"
        },
        "& .swap-card": {
            position: "relative",
            border: "0.668067px solid #E6E8EC !important",
            width: "calc(100% - 20px)",
            "& .double-arrow svg": {
                width: "10px",
                height: "10px"
            },
            "& .double-arrow > span": {
                top: "-7px",
            }
        },
        "& .swap-card .caption": {
            marginBottom: "20px"
        },
        "&:hover": {
            boxShadow: "0px 0px 25px rgba(37, 97, 186, 0.16)"
        }
    }
});

const ListingCardRefactor = ({ size, item, dummyData }) => {

    const [data, setData] = useState({
        name: "",
        image: ""
    });
    const [tokenName, setTokenName] = useState();

    const { web3, getter, account } = useSelector((state) => state.web3Config);

    const getItem = async () => {
        try {
            if (item.token.toLowerCase() == Addresses.nameToAddress["World of Women"].toLowerCase()) {
                const _tokenDetails = await _getToken(item.token, item.tokenId);
                setData({ name: _tokenDetails.name, image: _tokenDetails.image_url })
            }
            else {
                const _tokenDetails = await getTokenDetails({ token_addresses: [item.token], tokenIds: [item.tokenId] }, getter, account);
                const data = await axios.get(_tokenDetails[0]);
                setData(data.data);
                setTokenName(_tokenDetails[1]);
            }
        } catch (err) {
            if (err.response.status == 429) {
                setTimeout(() => {
                    getItem();
                }, 500);
            } else {
                window.alert(err.message);
                console.error(err);
            }
        }
    }

    useEffect(() => {
        getItem();
    }, [])

    const chips = () => {
        return item.swapListing.token_addresses.map((address, index) => {
            return <Chip className='chip-block chip' label={item.swapListing.amounts[index] > 0 ?
                `${Addresses.addressToName[address.toLowerCase()]} + ${toETH(item.swapListing.amounts[index])}`
                : `${Addresses.addressToName[address.toLowerCase()]}`
            } variant="outlined" />
        });
    }

    const getBnplChips = () => {
        return item.bnplListings.map((listing, index) => {
            return <>
                {/* {index > 0 ? <Slash style={{ margin: "0 3px" }} /> : null} */}
                <Chip className='chip-block chip' label={
                    <span className="flex-justify align-center">
                        <EthBlue style={{ marginRight: "2px" }} />
                        <span style={{ marginRight: "3px" }}>{toETH(listing.deposit)}</span>

                        <span style={{ marginRight: "3px" }}>+</span>

                        <EthBlue style={{ marginRight: "2px" }} />
                        <span style={{ marginRight: "3px" }}>{toETH(listing.remaining_amount)}</span>
                        {`${(listing.duration / 86400).toFixed()} Days`}
                    </span>
                } variant="outlined" />
            </>
        });
    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const classes = useStyles();

    if (dummyData) {
        return <Card className={`no-shadow padding-10`}>
            <div className={`generic-card small-card radius-20 pointer relative`}>
                <img className='radius-20' src={getImageURI(data.image)} alt='img' />
                <div className='card-footer'>
                    <div className='flex-justify'>
                        <span className='font-14 medium-weight t2-text ellipsis'>{
                            data.name == undefined ? tokenName + " #" + item.tokenId : data.name
                        }</span>
                        <span className='primary-text medium-weight font-14 card-detail'>See Details &gt;</span>
                    </div>
                    <div className='flex-justify-start column-direction card-chip-block'>
                        {
                            item.directListing.payment_tokens.length == 0 ? <></> : <div className='green-block flex-justify-start'>
                                <span className='font-11 light-grey-text'>Swap Now : </span>
                                <Chip className='chip-block chip' label={toETH(item.directListing.amounts[0])}
                                    variant="outlined" />
                            </div>
                        }
                        {item.bnplListings.length == 0 ? <></> :
                            <div className='blue-block flex-justify-start align-center'>
                                <span className='font-11 light-grey-text'>Reserve : </span>
                                <span>
                                    {getBnplChips()}
                                </span>
                            </div>
                        }
                        {item.swapListing.payment_tokens.length == 0 ? <></> :
                            <div className='purple-block flex-justify-start align-center'>
                                <span className='font-11 light-grey-text'>Exchange : </span>
                                {
                                    chips()
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Card>
    }


    return (
        <div className={`${classes.maincard} ${size && "card-" + size} medium-weight`}>
            <img src={getImageURI(data.image)} style={{ borderRadius: "15px" }} alt='img' />
            <span className='card-title t2-text margin-tb-10 block-elem medium-weight'>{
                data.name == undefined ? tokenName + " #" + item.tokenId : data.name
            }<ArrowForwardIos className='t2-text' sx={{ verticalAlign: "middle", marginLeft: "4px" }} /></span>
            <div className='section-btn-block swap-card'>
                <div className='caption '>Looking For</div>
                <span className='double-arrow'><DoubleArrowIcon /></span>
                {item.directListing.payment_tokens.length == 0 ? <></> : <Chip className='chip-block chip' label={toETH(item.directListing.amounts[0])} variant="outlined" />}
                {item.bnplListings.length == 0 ? <></> : getBnplChips()}
                {item.swapListing.payment_tokens.length == 0 ? <></> : chips()
                }
            </div>
        </div>
    )
}

export default ListingCardRefactor