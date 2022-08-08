import { makeStyles } from '@mui/styles';
import { Box, Checkbox, Chip, CircularProgress, MenuItem, Select } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from 'react';
import { getTezLogo } from "../utils";
import { ReactComponent as DoubleHeaderArrow } from '../SVG/double-headed.svg';
import Addresses from "../contracts/Contracts.json";
import { _getTokenMetadata, getImageURI } from "../api/getterTezos"
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        color: "#777E90",
        width: "600px",
        "& .icon-block": {
            width: "calc(100% - 20px)"
        },
        "& .btn-block": {
            width: "calc(100% - 10px)",
            display: "inline-block",
            "& .btn": {
                marginRight: "10px"
            }
        },
        "& .section-image-block": {
            width: "calc(50% - 40px) !important",
            marginLeft: "0",
            marginRight: "0",
            "& .section-image-desc": {
                marginTop: "10px"
            }
        },
        "& .accordion-block": {
            marginBottom: "20px"
        },
        "& h2": {
            fontSize: "14px",
            color: "#777E90",
            clear: "both",
            float: "right",
            marginTop: 0,
            marginRight: "20px"
        },
        "& .custom-dropdown": {
            marginLeft: "0px",
            color: "#777E90 !important",
            padding: "5px 0px 5px 0px",
            fontSize: "14px",
            fontWeight: "500",
            float: "right",
            border: "none",
            "& img": {
                width: "14px",
                height: "25px"
            }
        },
        "& .deposit-block": {
            "& .deposit-block-text": {
                fontSize: "16px",
                fontWeight: 500,
                padding: "20px",
                boxSizing: "border-box",
                color: "#23262F",
                textAlign: "center",
                "& img": {
                    verticalAlign: "middle"
                },
                "& label": {
                    marginLeft: "10px"
                }
            }
        }
    },
    dropdown: {
        height: "20px",
        // width: "calc(100% - 18px)",
        verticalAlign: "super",
        "& > fieldset": {
            border: "none"
        }
    },
    accordion: {
        background: "transparent !important",
        boxShadow: "none !important",

        "& h3": {
            margin: "0"
        },
    },
    accordionSummary: {
        paddingLeft: "0 !important"
    },
    accordionDetails: {
        background: "#E6E8EC",
        borderRadius: "10px",
        padding: "15px !important",
        "& a": {
            fontWeight: 500,
            marginTop: "5px"
        }
    }
});

const PopupCompleteListing = ({ popupState, selected, bnplListings, interestedToSwap }) => {
    const classes = useStyles();

    const [token, setToken] = useState({
        name: '',
        thumbnailUri: ""
    });

    const getItem = async () => {
        try {
            const token = await _getTokenMetadata(selected.token, selected.tokenId);
            setToken(token);
        } catch (err) {
            window.alert(err.message);
            console.error(err);
        }

    }

    useEffect(() => {
        getItem();
    }, []);

    return (
        <div className={classes.root}>
            <div className='flex-justify align-baseline margin-top-20'>
                <div className='relative flex-justify-start height-fit width-auto outline-border radius-10 padding-10'>
                    <img className="small-card-img radius-5 margin-right-10" src={getImageURI(token.thumbnailUri)} />
                    <div className='width-auto flex-justify-start column-direction'>
                        <span className='t2-text font-12 ellipsis'>{token.name
                        }</span>
                        <span className='b-grey-text font-12'>Quantity - 01</span>
                    </div>
                </div>
                <DoubleHeaderArrow />
                <div style={{ minWidth: "300px" }}>
                    {!selected.sale ? null : <div className='radius-tlr-14 outline-border padding-tb-20 padding-lr-10'>
                        <span className='flex-justify-start align-center'><img src={TezLogo} className="eth-img" /> <span className='t2-text font-12'>{selected.directSalePrice}</span></span>
                    </div>}
                    {
                        selected.swap && interestedToSwap.map((listing, index) => {
                            return <div className='outline-border padding-tb-20 padding-lr-10 flex-justify align-center relative' index={index}>
                                <span className='absolute popup-or outline-text font-12'>or</span>
                                <div className='flex-justify-start align-center'>
                                    <img className="small-card-img radius-5 margin-right-10" src={getImageURI(Addresses.nameToImageUri[listing.swapToken])} />
                                    <div className='width-auto flex-justify-start column-direction'>
                                        <span className='t2-text font-12 ellipsis'>{listing.swapToken}</span>
                                        <span className='b-grey-text font-12'>Any</span>
                                    </div>
                                </div>
                                {
                                    listing.swapAmount == 0 || listing.swapAmount == '' || listing.swapAmount == undefined ? null : <><span className='old1-text'>+</span>
                                        <span className='flex-justify-start align-center'><img src={TezLogo} className="eth-img" /> <span className='t2-text font-12'>{listing.swapAmount}</span></span>
                                    </>
                                }

                            </div>
                        })
                    }
                    {
                        selected.bnpl && bnplListings.map((listing, index) => {
                            return <div className='radius-blr-14 outline-border padding-tb-20 padding-lr-10 flex-justify align-center relative' index={index}>
                                <span className='absolute popup-or outline-text font-12'>or</span>
                                <span className='flex-justify-start align-center'><img src={TezLogo} className="eth-img" /> <span className='t2-text font-12'>{listing.deposit}</span></span>
                                <span className='old1-text'>+</span>
                                <span className='flex-justify-start align-center'><img src={TezLogo} className="eth-img" /> <span className='t2-text font-12'>{listing.remainingAmt}</span></span>
                                <span className='t2-text font-12'>{`within ${listing.duration} days`}</span>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className='margin-top-30'>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion} expanded={popupState.completeListing.state == 0}>
                        <AccordionSummary className={`${classes.accordionSummary} flex-justify align-center`}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                <h3 className={`flex-justify-start align-center`}>
                                    {
                                        popupState.completeListing.state == 0 && popupState.isLoading == true ? <Box className='chip-block' sx={{ position: 'relative', display: 'inline-flex', padding: "9px" }}>
                                            <CircularProgress size={30} sx={{ color: "#42D68D" }} />
                                            <Box
                                                sx={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="caption" className='neutral2-text' component="div" sx={{ fonSize: "14px" }} color="text.secondary">1</Typography>
                                            </Box>
                                        </Box> : <Checkbox {...label} defaultChecked icon={<Chip className='chip-block' sx={{ fontSize: "14px", color: "#23262F", background: "#E6E8EC", border: "none" }} label="1" variant="outlined" />} checkedIcon={<CheckCircleIcon sx={{ fontSize: "31px" }} className='primary-text' />} />
                                    }
                                    <span>Initialize your wallet</span>
                                </h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Select the NFT you want to SWAP or Sell for XTZ select NFT you want to SWAP or Sell for XTZ
                                <a className='primary-text block-elem'>View on tzkt</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion} expanded={popupState.completeListing.state == 1}>
                        <AccordionSummary className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                <h3 className={`flex-justify-start align-center`}>
                                    {
                                        popupState.completeListing.state == 1 && popupState.isLoading == true ? <Box className='chip-block' sx={{ position: 'relative', display: 'inline-flex', padding: "9px" }}>
                                            <CircularProgress size={30} sx={{ color: "#42D68D" }} />
                                            <Box
                                                sx={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="caption" className='neutral2-text' component="div" sx={{ fonSize: "14px" }} color="text.secondary">2</Typography>
                                            </Box>
                                        </Box> : <Checkbox {...label} defaultChecked icon={<Chip className='chip-block' sx={{ fontSize: "14px", color: "#23262F", background: "#E6E8EC", border: "none" }} label="2" variant="outlined" />} checkedIcon={<CheckCircleIcon sx={{ fontSize: "31px" }} className='primary-text' />} />
                                    }
                                    <span>Approve this item for sale</span>
                                </h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                To get set up for listings, you must approve this item for sale, which requires a one-time gas fee.
                                <a className='primary-text block-elem'>View on tzkt</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion} expanded={popupState.completeListing.state == 2}>
                        <AccordionSummary className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                <h3 className={`flex-justify-start align-center`}>
                                    {
                                        popupState.completeListing.state == 2 && popupState.isLoading == true ? <Box className='chip-block' sx={{ position: 'relative', display: 'inline-flex', padding: "9px" }}>
                                            <CircularProgress size={30} sx={{ color: "#42D68D" }} />
                                            <Box
                                                sx={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="caption" className='neutral2-text' component="div" sx={{ fonSize: "14px" }} color="text.secondary">3</Typography>
                                            </Box>
                                        </Box> : <Checkbox {...label} defaultChecked icon={<Chip className='chip-block' sx={{ fontSize: "14px", color: "#23262F", background: "#E6E8EC", border: "none" }} label="3" variant="outlined" />} checkedIcon={<CheckCircleIcon sx={{ fontSize: "31px" }} className='primary-text' />} />
                                    }
                                    <span>{`Confirm ${selected.directSalePrice}XTZ listing`}</span>
                                </h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Accept the signature request in your wallet and wait for your listing to process.
                                <a className='primary-text block-elem'>View on tzkt</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}

export default PopupCompleteListing;