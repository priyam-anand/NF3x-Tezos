import { makeStyles } from '@mui/styles';
import { Button, Checkbox, Chip, MenuItem, Select } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getImageURI } from "../api/getterTezos"
import { getPositionImage } from '../utils';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        color: "#777E90",
        "& .icon-block": {
            width: "calc(100% - 20px)"
        },
        "& .img-block": {
            display: "flex",
            justifyContent: "center",
            margin: "25px 0",
            "& img": {
                width: "139px",
                height: "117px",
            }
        },
        "& .img-calc-block": {
            padding: "19px 0 !important"
        },
        "& .img-calc-block:last-child": {
            borderBottom: "none !important"
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
            marginRight: "0"
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
            color: "#777E90",
            padding: "5px 0px 5px 0px",
            fontSize: "14px",
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
        width: "calc(100% - 18px)",
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
    },
    size: {
        width: '100px'
    }
});

const PopupCompleteOffer = ({ popupState, token, swapOffer, swapNowOffer, reserveOffer, isPosToken }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <div className='margin-tb-10'>
                    <div className='width-100 flex-justify img-calc-block align-center outline-bottom-border'>
                        <div className='inline-flex-row'>
                            <span className='b-grey-text font-12'>Proposed offer</span>
                            <img className={`radius-10 ${classes.size}`} src={isPosToken ? getPositionImage() : getImageURI(token.thumbnailUri)} />
                            <span className='b-grey-text font-10'>{token.name}</span>
                        </div>
                        <CompareArrowsIcon className='t2-text font-bold-22' />
                        {
                            swapOffer.tokenAddress != '' ? <>
                                <div className='inline-flex-row'>
                                    <span className='b-grey-text font-12'>&nbsp;</span>
                                    <img className={`radius-10 ${classes.size}`} src={swapOffer.image} />
                                    <span className='b-grey-text font-10'>{swapOffer.name}</span>
                                </div>
                                {
                                    swapOffer.amount > 0 ? <>
                                        <span className='t2-text font-bold-20'>+</span>
                                        <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img" />} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${swapOffer.amount} Eth`}</Button></> : null
                                }
                            </> : null
                        }
                        {
                            reserveOffer.deposit > 0 ? <>
                                <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img" />} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${reserveOffer.deposit} Eth`}</Button>
                                <span className='t2-text font-bold-20'>+</span>
                                <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img" />} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${reserveOffer.remainingAmount} Eth`}</Button>
                                <span className='t2-text font-bold-20'>{`${reserveOffer.duration} Days`}</span>
                            </> : null
                        }
                        {
                            swapNowOffer.amount > 0 ? <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img" />} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${swapNowOffer.amount} Eth`}</Button> : null
                        }
                    </div>
                </div>
            </div>

            <div>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                <h3>
                                    <Checkbox {...label} defaultChecked icon={<Chip className='chip-block' sx={{ fontSize: "14px", color: "#23262F", background: "#E6E8EC", border: "none" }} label="1" variant="outlined" />} checkedIcon={<CheckCircleIcon sx={{ fontSize: "31px" }} className='primary-text' />} />
                                    <span>Initialize your wallet</span>
                                </h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Select the NFT you want to SWAP or Sell for eth select NFT you want to SWAP or Sell for eth
                                <a className='primary-text block-elem'>View on etherscan</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion} expanded={popupState.offer.open == 2}>
                        <AccordionSummary className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                <h3>
                                    <Checkbox {...label} defaultChecked icon={<Chip className='chip-block' sx={{ fontSize: "14px", color: "#23262F", background: "#E6E8EC", border: "none" }} label="2" variant="outlined" />} checkedIcon={<CheckCircleIcon sx={{ fontSize: "31px" }} className='primary-text' />} />
                                    <span>Approve this item for Offer</span>
                                </h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Select the NFT you want to SWAP or Sell for eth select NFT you want to SWAP or Sell for eth
                                <a className='primary-text block-elem'>View on etherscan</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion} expanded={popupState.offer.open == 3}>
                        <AccordionSummary className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                <h3>
                                    <Checkbox {...label} defaultChecked icon={<Chip className='chip-block' sx={{ fontSize: "14px", color: "#23262F", background: "#E6E8EC", border: "none" }} label="3" variant="outlined" />} checkedIcon={<CheckCircleIcon sx={{ fontSize: "31px" }} className='primary-text' />} />
                                    <span>Confirm Offer</span>
                                </h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Select the NFT you want to SWAP or Sell for eth select NFT you want to SWAP or Sell for eth
                                <a className='primary-text block-elem'>View on etherscan</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div >
    );
}

export default PopupCompleteOffer;