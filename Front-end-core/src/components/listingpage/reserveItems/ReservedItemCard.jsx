import React, { useEffect, useState } from 'react';
import ListingCardRefactor from '../../ListingCardRefactor';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import WalletViewCard from '../WalletViewCard';
import { _payRemainingAmount } from "../../../api/market";
import { _getToken } from '../../../api/getter';

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
            "bottom": "20px"
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
function ReservedItemCard({ cardType = 'to_pay', item }) {
    const classes = useStyles();
    const { web3, market, account } = useSelector((state) => state.web3Config);
    const dispatch = useDispatch();
    const [token, setToken] = useState({
        image_url: '',
        name: '',
        token_id: '',
        asset_contract: { name: '' }
    });
    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    const totalAmount = () => {
        var _deposit = toETH(item.bnplListings[0].deposit);
        var remainingAmount = toETH(item.bnplListings[0].remaining_amount);
        return Number(_deposit) + Number(remainingAmount);
    }

    const getTime = () => {
        const _expires = Number(item.bnplListings[0].nextPaymentDate);
        const curr = Math.floor(Date.now() / 1000);
        var diff = _expires - curr;
        const day = Math.floor(diff / 86400);
        diff = diff % 86400;
        const hour = Math.floor(diff / 3600);
        var ret = (day > 0 ? `${day} days ` : '') + (hour > 0 ? `${hour} hours ` : '');
        return ret;
    }

    const payRemainingAmount = async () => {
        try {
            await _payRemainingAmount(item, market, account, dispatch);
            window.location.reload();
        } catch (error) {
            window.alert(error.message);
            console.error(error);
        }
    }

    const getToken = async () => {
        try {
            const _tokenDetails = await _getToken(item.token, item.tokenId);
            setToken(_tokenDetails)
        } catch (err) {
            if (err.response.status == 429) {
                setTimeout(() => {
                    getToken();
                }, 500);
            } else {
                window.alert(err.message);
                console.error(err);
            }
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
                            {totalAmount() + "E"}
                        </div>
                        <div className="b-grey-text medium-title mt-30">
                            Amount Due
                        </div>
                        <div className="section-title primary-text font-16">
                            {toETH(item.bnplListings[0].remaining_amount) + "E"}
                        </div>
                    </div>
                    <div className="ml-36">
                        <div className="b-grey-text medium-title">
                            Paid To Seller
                        </div>
                        <div className="section-title font-16">
                            {toETH(item.bnplListings[0].deposit) + "E"}
                        </div>
                        <div className="b-grey-text medium-title mt-30">
                            Remaining Time
                        </div>
                        <div className="section-title primary-text font-16">
                            {getTime()}
                        </div>
                        <div className="btn-ctn">
                            {cardType === 'to_pay' && <Button disableRipple className="btn-pay fix-bottom" onClick={payRemainingAmount}>Pay</Button>}
                            {cardType === 'recieve_pending' && <span className="danger medium-weight fix-bottom">Payment Pending</span>}
                        </div>
                    </div>
                </React.Fragment>}
                {cardType === 'received' && <React.Fragment>
                    <div>
                        <div className="b-grey-text medium-title">
                            Total Amount
                        </div>
                        <div className="section-title font-16">
                            14E
                        </div>
                        <div className="b-grey-text medium-title mt-30">
                            Payment Received
                        </div>
                        <div className="section-title font-16">
                            14E
                        </div>
                        <div className="btn-ctn">
                            <div className="success medium-weight fix-bottom">Payment Recieved
                                <div className="link-icon">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.03986 10.9602C10.4067 12.327 12.6228 12.327 13.9896 10.9602L17.5251 7.42462C18.892 6.05779 18.892 3.84171 17.5251 2.47487C16.1583 1.10804 13.9422 1.10804 12.5754 2.47487L10.8076 4.24264" stroke="#45B26B" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M11.8683 8.13164C10.5015 6.76481 8.28538 6.76481 6.91854 8.13164L3.38301 11.6672C2.01617 13.034 2.01617 15.2501 3.38301 16.6169C4.74984 17.9838 6.96592 17.9838 8.33275 16.6169L10.1005 14.8492" stroke="#45B26B" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                    </div>
                </React.Fragment>}
            </div>
        </div>)
}

export default ReservedItemCard;