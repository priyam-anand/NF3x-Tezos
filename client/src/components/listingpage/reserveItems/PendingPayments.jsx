import React, { useState, useEffect } from 'react';
import ReservedItemCard from './ReservedItemCard';
import { makeStyles } from '@mui/styles';
import Util from '../../../common/Util';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { Button, IconButton, InputBase, Paper, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { _listPositionToken } from '../../../api/marketTezos';
import { useSelector, useDispatch } from 'react-redux';
import { getTezLogo } from '../../../utils';

const useStyles = makeStyles({
    root: {
        display: "flex",
        "flex-flow": "row wrap"
    },
    makeOffer: {
        borderRadius: "14px",
        padding: "20px",
        display: "inline-block",
        width: "calc(100% - 40px)",
        '& .offer-section': {
            "border-bottom": "1px solid #E6E8EC",
            "padding-bottom": "12px"
        }
    },
    offerList: {
        width: "100%",
        display: "flex",
        overflow: "auto"
    },
    offerListItem: {
        display: "inline-block",
        padding: "10px !important",
        "& nth-child(odd)": {
            marginRight: "10px"
        },
        "& img": {
            width: "200px",
            height: "200px"
        },
        "& span": {
            display: "block",
            color: "#23262F",
            fontSize: "13px"
        }
    },
    offersReceived: {
        "& .div-table-row-header .div-table-col": {
            color: "#777E90",
            fontSize: "13px"
        },
        "& .section-image-block": {
            width: "100%",
        },
        "& Button": {
            marginRight: "10px"
        }
    },
    dropdown: {
        height: "55px",
        paddingLeft: "10px",
        "& > fieldset": {
            border: "none"
        }
    },
    modal: {
        width: 'fit-content',
        "& .bottom-section": {
            display: "flex",
            "justify-content": "space-between",
            "align-items": "end",
            "& .center": {
                margin: "0  0 10px 15px",
            },
            "& .label-text": {
                color: '#23262F',
                "font-weight": 500,
                opacity: 1
            }
        },
        "& .label-text": {
            marginBottom: 3,
            fontSize: 14,
            fontWeight: 600,
            color: '#878D9D',
            opacity: 0.7
        },
        "& .total": {
            marginTop: 0,
            color: '#FF0083',
            "& h3": {
                margin: '34px 0 0'
            },
            "& p": {
                margin: 0
            }
        }
    }
});


function PendingPayments({ itemsBuyer }) {

    const [swapOfferModal, setSwapOfferModal] = useState(false);
    const [swapNowOffer, setSwapNowOffer] = useState({
        tokenId: '',
        amount: '',
        time_period: 1
    });

    const { tezos, account, market } = useSelector((state) => state.tezosConfig);
    const dispatch = useDispatch();


    const handleClose = () => {
        setSwapOfferModal(false)
        setSwapNowOffer({
            tokenId: '',
            amount: '',
            time_period: 1
        });
    }

    const makeSwapNowOffer = async () => {
        try {
            await _listPositionToken(tezos, market, account, swapNowOffer.tokenId, swapNowOffer.amount, swapNowOffer.time_period, dispatch)
        } catch (error) {
            console.log(error);
            window.alert(error.message);
        }
        console.log(swapNowOffer);
    }

    const classes = useStyles();
    return <div className={classes.root}>
        {
            itemsBuyer.map((item, index) => {
                return <ReservedItemCard cardType='to_pay' item={item} setSwapNowOffer={setSwapNowOffer} setSwapOfferModal={setSwapOfferModal} />
            })
        }
        <div className={`section-block ${classes.makeOffer}`}>
            <Modal
                keepMounted
                open={swapOfferModal}
                onClose={() => handleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={`modal ${classes.modal}`}>
                    <div className={"display-flex flex-justify"}>
                        <h3 className="section-title font-16">List Reservation Position</h3>
                        <CloseIcon className="pointer" onClick={() => handleClose()} />
                    </div>
                    <div className={`section-block margin-tb-10`}>
                        <div className={`section-block margin-tb-10 offer-section`}>
                            <div className={`section-block margin-tb-10 display-flex`}>
                                <FormControl sx={{ m: 0 }}>
                                    <Select
                                        className='input-text'
                                        value={""}
                                        onChange={() => { }}
                                        displayEmpty
                                        sx={{ height: "57px", width: "250px", background: "#ffffff", marginLeft: 0 }}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="">XTZ</MenuItem>
                                    </Select>
                                </FormControl>
                                <OutlinedInput
                                    onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                                    className='input-text'
                                    id="outlined-adornment-weight"
                                    type="text"
                                    InputProps={{ min: 0 }}
                                    placeholder='Enter Amount'
                                    value={swapNowOffer.amount}
                                    onChange={(e) => { setSwapNowOffer({ ...swapNowOffer, amount: e.target.value }) }}
                                    sx={{ width: "250px", height: "57px", margin: "8px", background: "#ffffff", marginTop: 0 }}
                                    startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={getTezLogo()} /></InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`section-block margin-top-20 bottom-section`}>
                        <div>
                            <div className={"label-text font-16"}>Listing Duration</div>
                            <div className={`section-block margin-tb-10`}>
                                <Paper
                                    component="form"
                                    className={"outline-border radius-10"}
                                    sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200, color: "#23262F" }}
                                >
                                    <InputBase
                                        onInput={(e) => e.target.value = Math.abs(e.target.value)}
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="0"
                                        type="number"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                        value={swapNowOffer.time_period}
                                        onChange={(e) => setSwapNowOffer({ ...swapNowOffer, time_period: e.target.value })}
                                    />
                                    <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                                        Days
                                    </IconButton>
                                </Paper>
                            </div>
                        </div>
                        <div className="center">
                            <Button disableRipple className={"btn btn-grey"} onClick={() => handleClose()}>Cancel</Button>
                            <Button disableRipple className={"btn white-text text-center margin-left-10"} onClick={makeSwapNowOffer}>Confirm</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    </div>
}

export default PendingPayments;