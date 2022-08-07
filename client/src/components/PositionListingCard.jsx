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
import { _getTokenMetadata, getReservationData } from '../api/getterTezos';
import { _handleCancelListing } from '../api/marketTezos';
import { getPositionImage } from "../utils"

const useStyles = makeStyles({

});

const PositionListingCard = ({ item, isEditable, onHandleSelectedItem, itemIndex, isActive, isCustomLabel }) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const cardImg = useRef({});
    const { market } = useSelector((state) => state.tezosConfig);
    const [data, setData] = useState({
        name: "Position Token for",
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

            const reservationData = await getReservationData(item.tokenId.toNumber())
            const metadata = await _getTokenMetadata(reservationData.token, reservationData.tokenId);

            setData({ name: "Reservation for " + metadata.name })
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

    return (
        <div>
            <Card className={`no-shadow padding-10 width-100`}>
                <div style={{ display: "flex", flexDirection: "column" }} className={`generic-card medium-card radius-20 pointer relative overflow-hidden ${(isActive && "active-box") ?? ""}`} onClick={() => navigate(`/listdetail/${item.token}/${item.tokenId.toNumber()}`)}>
                    {/* <div style={{height: "100%"}}> */}
                    <img ref={cardImg} className='radius-20' src={getPositionImage()} alt='img' onLoadedDataCapture={(e) => console.log(e)} />
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
                        </div>
                    </div>
                    {/* {isEditable && <Button disableRipple onClick={(e) => onHandleSelectedItem(e, item, itemIndex)} startIcon={<EditOutlinedIcon className='font-14' />}
                        className={"btn btn-edit font-14 absolute"} variant="contained">edit</Button>} */}
                    {isCustomLabel && <Button disableRipple onClick={(e) => claimBackNFT(e)} className={"btn btn-edit font-14 absolute padding-zero"} variant="contained">claim back</Button>}
                </div>
            </Card>
        </div>
    )
}

export default PositionListingCard