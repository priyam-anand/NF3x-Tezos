import React, { useState, useEffect } from 'react'
import { Button, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DoubleArrowIcon } from './DoubleArrowIcon';
import { ArrowForwardIos } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setAccount } from '../redux/web3ConfigSlice';
import { _getToken } from '../api/getter';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
  root: {
    boxShadow: "0px 0px 25px rgba(37, 97, 186, 0.12)",
    "& img": {
      width: "247px",
      height: "230px"
    },
    "& .swap-card": {
      position: "relative",
      border: "0.668067px solid #E6E8EC !important",
      width: "calc(100% - 20px)"
    },
    "& .swap-card .caption": {
      marginBottom: "20px"
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
    },
    "& .view-details-btn": {
      width: "100%",
      color: "#ffffff",
      marginTop: "6px"
    },
  }
});

function CardView({ selected, bnplListings }) {

  const [token, setToken] = useState({
    name: '',
    image_url: ""
  });

  const getItem = async () => {
    try {
      const token = await _getToken(selected.token, selected.tokenId);
      setToken(token);
    } catch (err) {
      if (err.response.status == 429) {
        setTimeout(() => {
          getItem();
        }, 500);
      } else {
        console.error(err);
        window.alert(err.message);
      }
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    window?.ethereum?.on("accountsChanged", accounts => {
      dispatch(setAccount({ account: accounts[0] }));
    });
  }, [])

  useEffect(() => {
    getItem();
  }, [selected.token, selected.tokenId]);

  const getBnplListings = () => {
    return bnplListings.map(listing => {
      return <Chip className='chip-block chip' label={`${listing.deposit} + ${listing.remainingAmt}   ${listing.duration}Days`} variant="outlined" />
    })
  }

  const classes = useStyles();

  if (selected.token == '') {
    return <>
      Select an NFT to begin listing
    </>
  }

  return (
    <div className={`${classes.root} section-btn-block card-view`}>
      <img className='radius-10' src={token.image_url} />
      <h3>
        {token.name != null
          ? token.name
          : token.asset_contract.name + " #" + token.token_id
        }
      </h3>
      <div className='section-btn-block swap-card'>
        <div className='caption'>Looking for</div>
        <DoubleArrowIcon />
        {selected.sale ? <Chip className='chip-block chip' label={selected.directSalePrice} variant="outlined" /> : <></>}
        {selected.bnpl ? getBnplListings() : <></>}
        {selected.swap ? <Chip className='chip-block chip' label={`${selected.offerToken} - Any ${selected.offerAmt == '' || selected.offerAmt == 0 ? "" : ` + ${selected.offerAmt}`}`} variant="outlined" /> : <></>}
      </div>
      <Button disableRipple className="btn view-details-btn" endIcon={<ArrowForwardIos className='small-icon' />} >VIEW DETAILS </Button>
    </div>
  );
}

export default CardView;