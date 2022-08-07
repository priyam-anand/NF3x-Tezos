import React, { useEffect, useState } from 'react';
import ListingCardRefactor from '../../ListingCardRefactor';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import WalletViewCard from '../WalletViewCard';
import { _getToken } from '../../../api/getter';
import { _getTokenMetadata } from '../../../api/getterTezos';
import { getReservationData } from '../../../api/getterTezos';
import { _claimDefaulted, _payRemaining } from '../../../api/marketTezos';
const useStyles = makeStyles({
    root: {
        display: "flex",
        margin: "0 30px 30px 0",
        "& .reserve-item": {
            padding: "19px"
        },
        "& .medium-title": {
            "font-family": "poppins",
            "font-size": "16px"
        },
        "& .mt-30": {
            "margin-top": "30px"
        },
        "& .ml-36": {
            "margin-left": "36px",
            "width": "143px"
        },
        "& .btn-pay": {
            "background-color": "#45B26B",
            "color": "white",
            "border-radius": "10px",
            width: "141px",
            height: "44px",
        },
        "& .fix-bottom": {
            "position": "absolute",
            "bottom": "-30px"
        },
        "& .fix-bottom1": {
            "position": "absolute",
            "bottom": "40px"
        },
        "& .btn-ctn": {
            position: "relative",
            height: "190px",
            "min-width": "160px"
        },
        "& .btn-pay:hover": {
            "background-color": "#45B26B",
        },
        "& .danger": {
            color: '#FF0000',
            "font-size": "16px"
        },
        "& .success": {
            color: "#45B26B",
            "font-size": "14px",
            display: "flex"
        },
        "& .link-icon": {
            "margin-left": "5px",
            "& svg": {
                "width": "16px"
            }
        }
    }
});

// cardType is of 3 types 
//  1. recieve_pending - when someone needs to pay
//  2. received - when someone paid you
//  3. to_pay - when current user need to pay
function ReservedItemCard({ cardType = 'to_pay', item, setSwapNowOffer, setSwapOfferModal }) {
    const classes = useStyles();
    const { tezos, market, account } = useSelector((state) => state.tezosConfig);
    const dispatch = useDispatch();
    const [token, setToken] = useState({
        metadata: {
            name: '',
            displayUri: ''
        }
    });
    const [reservation, setReservation] = useState({
        deposit: '', remaining: '', time: ''
    });

    const toTez = (amount) => {
        return amount / 1000000;
    }

    const totalAmount = () => {
        var _deposit = toTez(reservation.deposit);
        var remainingAmount = toTez(reservation.remaining);
        return Number(_deposit) + Number(remainingAmount);
    }

    const getTime = (_expires) => {
        const curr = Date.now();
        var diff = Math.floor((_expires - curr) / 1000);
        const day = Math.floor(diff / 86400);
        diff = diff % 86400;
        const hour = Math.floor(diff / 3600);
        var ret = (day > 0 ? `${day} days ` : '') + (hour > 0 ? `${hour} hours ` : '');
        return ret;
    }

    const hasExpired = (_expires) => {
        const curr = Date.now();
        var diff = Math.floor((_expires - curr) / 1000);
        return !(diff > 0);
    }

    const payRemainingAmount = async () => {
        try {
            await _payRemaining(item, reservation.remaining, market, dispatch);
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error(error);
        }
    }

    const claimDefaulted = async () => {
        try {
            await _claimDefaulted(item, market, dispatch);
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error(error);
        }
    }

    const listPosition = () => {
        setSwapNowOffer({ tokenId: item.listing.reserveListing.positionToken.toNumber(), amount: '', time_period: 1 });
        setSwapOfferModal(true);
    }

    const getToken = async () => {
        try {
            const metadata = await _getTokenMetadata(item.token, item.tokenId.toNumber());
            const reservationData = await getReservationData(item.listing.reserveListing.positionToken.toNumber());

            setReservation({
                deposit: reservationData.deposit.amounts[0],
                remaining: reservationData.remaining.amounts[0],
                time: (new Date(reservationData.dueDate)).getTime()
            })
            setToken({ metadata: metadata })
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }
    }

    useEffect(() => {
        getToken();
    }, []);

    return (
        <div className={classes.root}>
            <div className="outline-border reserve-item display-flex radius-15">
                <div className='inline-block'>
                    <WalletViewCard token={token} />
                    {/* <ListingCardRefactor size={"small"} dummyData={true} /> */}
                </div>
                {cardType !== 'received' && <React.Fragment>
                    <div>
                        <div className="b-grey-text medium-title">
                            Total Amount Agreed
                        </div>
                        <div className="section-title font-16">
                            {totalAmount() + "XTZ"}
                        </div>
                        <div className="b-grey-text medium-title mt-30">
                            Amount Due
                        </div>
                        <div className="section-title primary-text font-16">
                            {toTez(reservation.remaining) + "XTZ"}
                        </div>
                    </div>
                    <div className="ml-36">
                        <div className="b-grey-text medium-title">
                            Paid To Seller
                        </div>
                        <div className="section-title font-16">
                            {toTez(reservation.deposit) + "XTZ"}
                        </div>
                        <div className="b-grey-text medium-title mt-30">
                            Remaining Time
                        </div>
                        <div className="section-title primary-text font-16">
                            {getTime(reservation.time)}
                        </div>
                        <div className="btn-ctn">
                            {cardType === 'to_pay' ? hasExpired(reservation.time) ? <span className="danger medium-weight fix-bottom">Payment has been defaulted !</span> : <>
                                <Button disableRipple className="btn-pay fix-bottom1" onClick={payRemainingAmount}>Pay</Button>
                                <Button disableRipple className="btn-pay fix-bottom" onClick={listPosition}>List Position</Button>
                            </> : null}
                            {cardType === 'recieve_pending' ? !hasExpired(reservation.time) ? <span className="danger medium-weight fix-bottom">Payment Pending</span>
                                : <Button disableRipple className="btn-pay fix-bottom" onClick={claimDefaulted}>Claim Defaulted Payment</Button>
                                : null}
                        </div>
                    </div>
                </React.Fragment>}
            </div>
        </div>)
}

export default ReservedItemCard;