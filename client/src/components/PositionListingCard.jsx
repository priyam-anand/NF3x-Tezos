import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Card, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { _claimBackNFT } from '../api/market';
import { _getTokenMetadata, getReservationData } from '../api/getterTezos';
import { _handleCancelListing } from '../api/marketTezos';
import { getPositionImage, getTezLogo } from "../utils"
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png"
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
        cardImg.current.onerror = (e) => {
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
                                    <span className='font-11 light-grey-text chip-title'>Swap Now : </span>{<Chip className='chip-block chip' label={<span><img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                                        {toTez(item.listing.directListing.amount.toNumber())} </span>} variant="outlined" />}
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

export default PositionListingCard