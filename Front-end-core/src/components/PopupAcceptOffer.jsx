import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowRightAlt } from '@mui/icons-material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        color: "#777E90",
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
            marginTop: "50px !important"
        }
    },
    accordion: {
        background: "transparent !important",
        boxShadow: "none !important",
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
        width: "100px"
    }
});

const PopupAcceptOffer = ({ token, confirmAcceptOffer, offerPopup, resetOfferPopup, confirmAcceptReserveOffer }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className='margin-tb-10'>
                <div className='width-100 flex-justify img-calc-block align-center outline-bottom-border'>
                    <div className='inline-flex-row'>
                        <span className='b-grey-text font-12'>Proposed offer</span>
                        <img className={`radius-10 ${classes.size}`} src={token.image_url} />
                        <span className='b-grey-text font-10'>{
                            token.name != null
                                ? token.name
                                : token.asset_contract.name + " #" + token.token_id
                        }</span>
                    </div>
                    <CompareArrowsIcon className='t2-text font-bold-22' />
                    {
                        offerPopup.swap ? <div className='inline-flex-row'>
                            <span className='b-grey-text font-12'>&nbsp;</span>
                            <img className={`radius-10 ${classes.size}`} src={offerPopup.image} />
                            <span className='b-grey-text font-10'>{offerPopup.name}</span>
                        </div> : null
                    }
                    {
                        offerPopup.swap && offerPopup.value > 0 ? <span className='t2-text font-bold-20'>+</span>
                            : null
                    }
                    {
                        offerPopup.value > 0 ? <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img"/>} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${offerPopup.value} ETH`}</Button> : null
                    }
                    {
                        offerPopup.reserve ? <>
                            <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img"/>} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${offerPopup.deposit} ETH`}</Button>
                            <span className='t2-text font-bold-20'>+</span>
                            <Button disableRipple startIcon={<img src='../img/ethereum.png' className="eth-img"/>} sx={{ height: "30px", padding: "10px 15px !important" }} className={"btn bg-white primary-border b-grey-text font-12"} variant="outlined">{`${offerPopup.remainingAmount} ETH`}</Button>
                            <span className='t2-text font-bold-20'>{`${offerPopup.duration} Days`}</span>
                        </> : null
                    }
                </div>
            </div>

            <div>
                <div className='input-text accordion-block'>
                    <Accordion className={classes.accordion} expanded={true}>
                        <AccordionSummary className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '70%', flexShrink: 0, marginLeft: "19px" }}>
                                <span className='t2-text font-bold-16'>Accept Offer</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Are you sure you want to accept the following Swap Offer ?
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div className='margin-tb-10 btn-block'>
                    <div className="center margin-tb-10">
                        <Button disableRipple className={"btn font-bold-16"} style={{ "marginRight": '10px' }} variant="contained" onClick={resetOfferPopup}>Cancel</Button>
                        {
                            offerPopup.reserve ? <Button disableRipple className={"btn font-bold-16"} variant="contained" onClick={confirmAcceptReserveOffer}>Accept Offer</Button> : <Button disableRipple className={"btn font-bold-16"} variant="contained" onClick={confirmAcceptOffer}>Accept Offer</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAcceptOffer;