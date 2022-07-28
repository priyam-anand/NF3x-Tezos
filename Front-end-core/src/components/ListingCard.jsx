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

const useStyles = makeStyles({

});

const ListingCard = ({ item, isEditable, onHandleSelectedItem, itemIndex, isActive, isCustomLabel }) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const cardImg = useRef({});
    const { market, getter, account, web3 } = useSelector((state) => state.web3Config);
    const [data, setData] = useState({
        name: "",
        image: ""
    });
    const [tokenName, setTokenName] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        window?.ethereum?.on("accountsChanged", accounts => {
            dispatch(setAccount({ account: accounts[0] }));
        });
        cardImg.current.onerror = (e) => {
            // console.log(e.target.src);
        }

    }, [])

    const getData = async () => {
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
                    getData();
                }, 500);
            } else {
                window.alert(err.message);
                console.error(err);
            }
        }
    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const claimBackNFT = async (e) => {
        e.stopPropagation();
        try {
            await _claimBackNFT(item, market, account, dispatch);
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
        return item.swapListing.token_addresses.map((address, index) => {
            return <>
                {/* <span className='no-hover'>{index > 0 && <Slash style={{ margin: "0 3px" }} />}</span> */}
                <Chip className='chip-block chip' key={index}
                    label={item.swapListing.amounts[index] > 0 ?
                        `${Addresses.addressToName[address.toLowerCase()]} + ${toETH(item.swapListing.amounts[index])}`
                        : `${Addresses.addressToName[address.toLowerCase()]}`
                    }
                    variant="outlined" />
            </>
        });
    }

    const getBnplChips = () => {
        return item.bnplListings.map((listing, index) => {
            return <>
                {/* <span className='no-hover'>{index > 0 && <Slash style={{ margin: "0 3px" }} />}</span> */}
                <Chip className='chip-block chip' label={<Fragment>
                    <EthBlue style={{ marginRight: "2px" }} />
                    <span style={{ marginRight: "3px" }}>{toETH(listing.deposit)}</span>
                    <span style={{ marginRight: "3px" }}>+</span>
                    <EthBlue style={{ marginRight: "2px" }} />
                    <span style={{ marginRight: "3px" }} >{toETH(listing.remaining_amount)}</span>
                    {(listing.duration / 86400).toFixed()} Days</Fragment>}
                    variant="outlined" /></>
        });
    }

    return (
        <div>
            <Card className={`no-shadow padding-10 width-100`}>
                <div style={{ display: "flex", flexDirection: "column" }} className={`generic-card medium-card radius-20 pointer relative overflow-hidden ${(isActive && "active-box") ?? ""}`} onClick={() => navigate(`/listdetail/${item.id}`)}>
                    {/* <div style={{height: "100%"}}> */}
                        <img ref={cardImg} className='radius-20' src={getImageURI(data.image)} alt='img' onLoadedDataCapture={(e)=>console.log(e)}/>
                    {/* </div> */}
                    <div className='card-footer'>
                        <div className='flex-justify'>
                            <span className='font-14 medium-weight t2-text ellipsis'>{
                                data.name == undefined ? tokenName + " #" + item.tokenId : data.name
                            }</span>
                            <span className='primary-text medium-weight font-14 card-detail'>See Details &gt;</span>
                        </div>
                        <div className='flex-justify-start column-direction card-chip-block'>
                            {
                                item.directListing.payment_tokens.length != 0 ? <div className='green-block flex-justify-start'>
                                    <span className='font-11 light-grey-text chip-title'>Swap Now : </span>{<Chip className='chip-block chip' label={<span><EthGreen /> {toETH(item.directListing.amounts[0])} </span>} variant="outlined" />}
                                </div> : null
                            }
                            {
                                item.bnplListings.length != 0 ? <div className='blue-block flex-justify-start'>
                                    <span className='font-11 light-grey-text chip-title'>Reserve : </span><span>{getBnplChips()}</span>
                                </div> : null
                            }
                            {
                                item.swapListing.payment_tokens.length != 0 ? <div className='purple-block flex-justify-start'>
                                    <span className='font-11 light-grey-text chip-title'>Exchange : </span><span>{chips()}</span>
                                </div> : null
                            }
                        </div>
                    </div>
                    {isEditable && <Button disableRipple onClick={(e) => onHandleSelectedItem(e, item, itemIndex)} startIcon={<EditOutlinedIcon className='font-14' />}
                        className={"btn btn-edit font-14 absolute"} variant="contained">edit</Button>}
                    {isCustomLabel && <Button disableRipple onClick={(e) => claimBackNFT(e)} className={"btn btn-edit font-14 absolute padding-zero"} variant="contained">claim back</Button>}
                </div>
            </Card>
        </div>
    )
}

export default ListingCard