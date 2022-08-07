import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowRightAlt } from '@mui/icons-material';
import { DoubleArrowIcon } from './DoubleArrowIcon';
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
        "& .popup-flex": {
            justifyContent: "space-evenly"
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
    }
});

const PopupConfirmSwapOffer = ({ swapOffer, reserveOffer, swapNowOffer, confirmSwapNowOffer, confirmReserveOffer, confirmSwapOffer, token, isPosToken }) => {
    const classes = useStyles();

    return (
        <div className={`${classes.root} outline-bottom-border`}>
            <div className='margin-tb-10'>
                <div className='width-100 flex-justify img-calc-block align-center outline-bottom-border popup-flex align-baseline'>
                    <div className='relative section-image-block width-auto inline-block radius-10 padding-10'>
                        <img className="radius-10" src={isPosToken ? getPositionImage() : getImageURI(token.thumbnailUri)} />
                        <div className='section-image-desc width-auto'>
                            <span className='t2-text font-16 medium-weight margin-tb-10'>
                                {token.name}
                            </span>
                            {/* <span className='b-grey-text font-14'>#1234</span> */}
                        </div>
                    </div>

                    <span>
                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20.5" cy="20.5" r="20" transform="rotate(-180 20.5 20.5)" fill="#F9FAFB" stroke="#E4E4E4" />
                            <path d="M26.417 21.3543L17.5105 21.3543C17.0859 21.3543 16.7417 21.6985 16.7417 22.1231C16.7417 22.5476 17.0859 22.8918 17.5105 22.8918L26.417 22.8918L24.6544 24.6545C24.3542 24.9547 24.3542 25.4414 24.6544 25.7416C24.9546 26.0418 25.4413 26.0418 25.7415 25.7416L28.8166 22.6667C28.8345 22.6487 28.8514 22.6299 28.8675 22.6103C28.8748 22.6014 28.8811 22.5921 28.8879 22.5829C28.8961 22.572 28.9046 22.5613 28.9122 22.5499C28.9196 22.5389 28.9259 22.5276 28.9326 22.5164C28.9388 22.5061 28.9452 22.496 28.9509 22.4854C28.9571 22.4739 28.9623 22.4622 28.9677 22.4505C28.973 22.4394 28.9785 22.4285 28.9832 22.4172C28.9879 22.4058 28.9917 22.3942 28.9958 22.3827C29.0002 22.3706 29.0048 22.3586 29.0086 22.3462C29.0121 22.3347 29.0146 22.323 29.0175 22.3113C29.0207 22.2986 29.0243 22.2861 29.0268 22.2732C29.0295 22.2597 29.0311 22.2461 29.033 22.2325C29.0346 22.2213 29.0368 22.2102 29.0379 22.1989C29.0429 22.1484 29.0429 22.0976 29.0379 22.0471C29.0368 22.0358 29.0346 22.0248 29.033 22.0135C29.0311 21.9999 29.0295 21.9863 29.0268 21.9728C29.0242 21.9599 29.0207 21.9474 29.0175 21.9348C29.0146 21.9231 29.012 21.9114 29.0085 21.8999C29.0048 21.8875 29.0001 21.8755 28.9958 21.8634C28.9916 21.8518 28.9878 21.8402 28.9832 21.8289C28.9785 21.8175 28.9729 21.8067 28.9677 21.7956C28.9622 21.7839 28.957 21.7722 28.9509 21.7607C28.9452 21.7501 28.9387 21.74 28.9326 21.7297C28.9259 21.7185 28.9195 21.7071 28.9122 21.6962C28.9046 21.6848 28.8961 21.6741 28.888 21.6632C28.8811 21.654 28.8748 21.6447 28.8674 21.6358C28.8515 21.6163 28.8347 21.5976 28.8169 21.5798C28.8167 21.5797 28.8167 21.5795 28.8165 21.5794L25.7415 18.5045C25.4413 18.2042 24.9546 18.2042 24.6544 18.5044C24.3542 18.8047 24.3542 19.2914 24.6544 19.5916L26.417 21.3543Z" fill="#23262F" />
                        </svg>

                        {/* <img src={getTezLogo()} alt="" /> */}

                    </span>

                    <div style={{ display: "inline-flex", flexDirection: "column" }}>
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
                                            <span className='t2-text font-16 medium-weight margin-tb-10'>Tezos</span>
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
                                        <span className='t2-text font-16 medium-weight margin-tb-10'>Tezos</span>
                                        <span className='b-grey-text font-14'>{reserveOffer.deposit}</span>
                                    </div>
                                </div>
                                <div className='relative section-image-block width-auto inline-block radius-10'>
                                    <img className="radius-10" src={getTezLogo()} />
                                    <div className='section-image-desc width-auto'>
                                        <span className='t2-text font-16 medium-weight margin-tb-10'>Tezos</span>
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
                                    <span className='t2-text font-16 medium-weight margin-tb-10'>Tezos</span>
                                    <span className='b-grey-text font-14'>{swapNowOffer.amount}</span>
                                </div>
                            </div> : null
                        }
                    </div>
                </div>
            </div>

            <div>
                <div className='margin-tb-10 float-right'>
                    <div className="">
                        {
                            swapOffer.tokenAddress != '' ? <Button disableRipple className={"btn font-bold-16"} variant="contained" endIcon={<ArrowRightAlt />} onClick={confirmSwapOffer}>Make Swap Offer</Button> : null
                        }
                        {
                            reserveOffer.deposit > 0 ? <Button disableRipple className={"btn font-bold-16"} variant="contained" endIcon={<ArrowRightAlt />} onClick={confirmReserveOffer}>Make Swap Offer</Button> : null
                        }
                        {
                            swapNowOffer.amount > 0 ? <Button disableRipple className={"btn font-bold-16"} variant="contained" endIcon={<ArrowRightAlt />} onClick={confirmSwapNowOffer}>Make Swap Offer</Button> : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupConfirmSwapOffer;