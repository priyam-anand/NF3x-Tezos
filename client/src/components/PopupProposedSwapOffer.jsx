import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowRightAlt } from '@mui/icons-material';
import { getImageURI } from '../api/getterTezos';
import { getPositionImage, getTezLogo } from '../utils';

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
        width: '100px'
    }
});

const PopupProposedSwapOffer = ({ token, swapOffer, swapNowOffer, reserveOffer, isPosToken }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
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
                            <div className='relative section-image-block width-auto inline-block radius-10'>
                                <img className="radius-10" src={swapOffer.image} />
                                <div className='section-image-desc width-auto'>
                                    <span className='t2-text font-16 medium-weight margin-tb-10'>{swapOffer.name}</span>
                                </div>
                            </div>
                            {
                                swapOffer.amount > 0 ? <div className='relative section-image-block width-auto inline-block radius-10'>
                                    <img className="radius-10" src={getTezLogo()} />
                                    <div className='section-image-desc width-auto'>
                                        <span className='t2-text font-16 medium-weight margin-tb-10'>Tez</span>
                                        <span className='b-grey-text font-14'>{swapOffer.amount}</span>
                                    </div>
                                </div> : null
                            }
                        </> : null
                    }
                    {
                        reserveOffer.deposit > 0 ? <>
                            <div className='relative section-image-block width-auto inline-block radius-10'>
                                <img className="radius-10" src={getTezLogo()} />
                                <div className='section-image-desc width-auto'>
                                    <span className='t2-text font-16 medium-weight margin-tb-10'>Tez</span>
                                    <span className='b-grey-text font-14'>{reserveOffer.deposit}</span>
                                </div>
                            </div>
                            <div className='relative section-image-block width-auto inline-block radius-10'>
                                <img className="radius-10" src={getTezLogo()} />
                                <div className='section-image-desc width-auto'>
                                    <span className='t2-text font-16 medium-weight margin-tb-10'>Tez</span>
                                    <span className='b-grey-text font-14'>{reserveOffer.remainingAmount}</span>
                                </div>
                            </div>
                            <span>
                                {`${reserveOffer.duration} Days`}
                            </span>
                        </> : null
                    }
                    {
                        swapNowOffer.amount > 0 ? <div className='relative section-image-block width-auto inline-block radius-10'>
                            <img className="radius-10" src={getTezLogo()} />
                            <div className='section-image-desc width-auto'>
                                <span className='t2-text font-16 medium-weight margin-tb-10'>Tez</span>
                                <span className='b-grey-text font-14'>{swapNowOffer.amount}</span>
                            </div>
                        </div> : null
                    }
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
                            <Typography sx={{ width: '70%', flexShrink: 0, marginLeft: "19px" }}>
                                <span className='t2-text font-bold-16'>Enable email notifications</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <div>
                                Select the NFT you want to SWAP or Sell for XTZ select NFT you want to SWAP or Sell for XTZ
                                <a className='primary-text block-elem'>Manage account setting</a>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div className='margin-tb-10 btn-block'>
                    <div className="center margin-tb-10">
                        <Button disableRipple className={"btn font-bold-16"} variant="contained" endIcon={<ArrowRightAlt />} onClick={e => window.location.reload()}>
                            View item
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default PopupProposedSwapOffer;