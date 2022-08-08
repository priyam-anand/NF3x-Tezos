import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { _getTokenMetadata, getImageURI } from '../api/getterTezos';
import Contracts from "../contracts/Contracts.json";
import { getTezLogo } from "../utils"
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
    root: {
        marginBottom: "10px",
        "& .section-image-block": {
            margin: "23px 24px",
            "@media (max-width: 600px)": {
                margin: "13px 12px"
            }
        },
        "& .interes-plus": {
            margin: "0 30px",
            "@media (max-width: 600px)": {
                margin: "0 15px"
            }
        },
        "& .swap-input": {
            "margin-right": "30px"
        },
        "& .make-offer": {
            padding: "10px 15px !important",
            "@media (max-width: 600px)": {
                lineHeight: "14px"
            }
        }
    }
});

function InterestedSwap({ listings, setOfferNftModal, setNftSwapModal, nftSwap, setNftSwap }) {
    const classes = useStyles();
    const { account } = useSelector((state) => state.tezosConfig);
    const [data, setData] = useState([{
        symbol: "",
        thumbnailUri: ""
    }]);

    const toTez = (amount) => {
        return amount / 1000000;
    }

    const swapClick = (index) => {
        setNftSwap({ ...nftSwap, paymentToken: Contracts.XTZ, amount: toTez(listings.listing.swapListing.amounts.get(index + "")), index: index });
        setNftSwapModal(true);
    }

    useEffect(() => {
        const init = async () => {
            const _data = []
            for (var i = 0; i < listings.listing.swapListing.tokens.size; i++) {
                const metadata = await _getTokenMetadata(listings.listing.swapListing.tokens.get(i + ""), 0);
                _data[i] = metadata;
            }
            console.log(_data);
            setData(_data);
        }
        init();
    }, [])


    return (
        <>{
            data.map((_data, index) => {
                return <div className={`${classes.root} flex-justify align-center`}>
                    <div className='outline-border radius-10 flex-justify align-center'>
                        <div className='section-image-block width-100 flex-justify align-center' key={index}>
                            <div className='flex-justify align-center margin-right-20'>
                                <img src={getImageURI(_data.thumbnailUri)} />
                                <div className='section-image-desc'>
                                    <span>{_data.symbol}</span>
                                    <span>Any</span>
                                </div>
                            </div>
                            {
                                listings.listing.swapListing.amounts.get(index + "") > 0 ? <><span className="interes-plus"> + </span>
                                    <span className='flex-justify align-center swap-input margin-right-10'>
                                        <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src={TezLogo} className="eth-img" />
                                        <span style={{ marginRight: "5px" }} className='font-26 t2-text'>{toTez(listings.listing.swapListing.amounts.get(index + ""))}</span>
                                    </span></> : null
                            }

                            {
                                listings.owner != account ? listings.listing.swapListing.swapAllowed
                                    ? <>
                                        <Button disableRipple variant='outlined' className={"btn btn-grey make-offer"} onClick={e => swapClick(index)}>Swap</Button>
                                        <Button disableRipple variant='outlined' className={"btn btn-grey make-offer"} onClick={setOfferNftModal}>Make Offer</Button>
                                    </> : <Button disableRipple variant='outlined' className={"btn btn-grey make-offer"} onClick={setOfferNftModal}>Make Offer</Button> : null
                            }
                        </div>

                    </div>
                </div>
            })
        }
        </>
    );
}

export default InterestedSwap;