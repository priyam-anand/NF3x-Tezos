import { Button, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DoubleArrowIcon } from './DoubleArrowIcon';
import { ArrowForwardIos } from '@mui/icons-material';
import { setMarket, setAccount, setGetter, setWeb3, setNFT } from '../redux/web3ConfigSlice';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
  root: {
    boxShadow: "0px 0px 25px rgba(37, 97, 186, 0.12)",
    maxWidth: "223px !important",
    "& img": {
      width: "202px",
      height: "199px"
    },
    "& .section-btn-block": {
      background: "#ffffff",
      border: "none",
    },
    "& h3": {
      fontSize: "13px",
      color: "#23262F",
      fontWeight: 500,
      marginTop: "10px"
    }
  },
  active: {
    boxShadow: "0px 0px 4px #ff0083 !important",
  }
});

function MiniCardView({ token, swapOffer, setSwapOffer }) {

  const handleSelect = () => {
    setSwapOffer({
      ...swapOffer,
      tokenAddress: token.asset_contract.address,
      tokenId: token.token_id,
      name: token.name != null
        ? token.name
        : token.asset_contract.name + " #" + token.token_id,
      image: token.image_url
    })
  }

  const classes = useStyles();
  if (swapOffer.tokenAddress == token.asset_contract.address && swapOffer.tokenId == token.token_id) {
    return (
      <div className={`${classes.root} ${classes.active} section-btn-block card-view`} onClick={handleSelect}>
        <img className='radius-10' src={token.image_url} />
        <h3>
          {token.name != null
            ? token.name
            : token.asset_contract.name + " #" + token.token_id
          }
        </h3>
      </div>
    )
  }
  return (
    <div className={`${classes.root} section-btn-block card-view`} onClick={handleSelect}>
      <img className='radius-10' src={token.image_url} />
      <h3>
        {token.name != null
          ? token.name
          : token.asset_contract.name + " #" + token.token_id
        }
      </h3>
    </div>
  );
}

export default MiniCardView;