import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ReactComponent as DoubleHeaderArrow } from '../SVG/double-headed.svg';
import Addresses from "../contracts/Contracts.json"
import { _getTokenMetadata, getImageURI } from "../api/getterTezos";
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png"

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
  }
});

const PopupListedForSale = ({ selected, bnplListings, interestedToSwap }) => {
  const navigate = useNavigate();
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
            <span className='t2-text font-12 ellipsis'>{token.name}</span>
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
        <div className='section-btn-block icon-block'>
          <h1 className='section-title'>Share your listings</h1>
          <div>
            <TelegramIcon className='telegram section-block-margin-all-20' />
            <RedditIcon className='reddit section-block-margin-all-20' />
            <TwitterIcon className='twitter section-block-margin-all-20' />
            <InsertLinkIcon className='insertlink section-block-margin-all-20' />
          </div>
        </div>
        <div className='margin-tb-10 btn-block'>
          <div className="center margin-tb-10">
            <Button disableRipple className={"btn font-bold-16"} variant="contained" onClick={e => navigate(`/listdetail/${selected.token}/${selected.tokenId}`)}>View item</Button>
            <Button disableRipple className={"btn font-bold-16 bg-white primary-text primary-border"} variant="outlined" onClick={e => navigate('/listing')}>All Listing</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupListedForSale;