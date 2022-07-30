import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@mui/styles';
import ComponentHeader from '../components/ComponentHeader';
import CreateSwap from '../components/CreateSwap';
import HowToCreateSwap from '../components/HowToCreateSwap';
import SwapOptions from '../components/SwapOptions';
import { useSelector, useDispatch } from 'react-redux';
import Addresses from "../contracts/Addresses.json";
import PopupContainer from '../components/PopupContainer';
import PopupCompleteListing from '../components/PopupCompleteListing';
import PopupListedForSale from '../components/PopupListedForSale';
import { useNavigate } from 'react-router-dom';
import { fetchWeb3, fetchAccount, setNetwork, fetchGetter, fetchMarket, fetchNFTs } from "../api/web3";
import { _completeListing } from '../api/marketTezos';
import { init, getAccount, getGetters, getMarket } from "../api/tezos";
import { _getTokens } from '../api/getterTezos';

const useStyles = makeStyles({
  root: {
  },
  createListingHeader: {
    paddingLeft: "0",
  },
  createSwap: {
    display: "inline-block",
    width: "calc(100% - 350px)",
    "& .create-swap-sort": {
      marginLeft: "20px",
      color: "#B0B7C3",
      padding: "10px 20px"
    },
    "& .section-btn-block": {
      margin: "10px",
      Width: "212px"
    },
    "& .section-btn-block img": {
      maxWidth: "212px"
    },
    "& h3": {
      fontSize: "13px",
      color: "#23262F",
      fontWeight: 500,
      marginBottom: 0
    }
  },
  howToSwap: {
    display: "inline-block",
    width: "330px",
    padding: "10px",
    background: "#FAFAFA"
  },
  dropdown: {
    height: "30px",
    "& > fieldset": {
      border: "none"
    }
  },
  livePreview: {
    width: "252px",
    background: "#FCFCFD",
    boxShadow: "0px 64px 64px -48px rgba(31, 47, 70, 1)",
    borderRadius: "16px",
    display: "inline-block",
    padding: "50px",
  }

});

function CreateListing() {

  const { tezos, wallet, account, market, getters } = useSelector((state) => state.tezosConfig);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState({
    token: '',
    tokenId: '',
    metadata: { name: '', thumbnailUri: '' },
    sale: false,
    bnpl: false,
    swap: false,
    directSwap : false,
    directSalePrice: [''],
    offerToken: '',
    offerAmt: '',
    timePeriod: '1'
  });
  const [bnplListings, setBnplListings] = useState([
    {
      deposit: '',
      remainingAmt: '',
      duration: ''
    }
  ]);
  const [interestedToSwap, setInterestedToSwap] = useState([{
    swapAmount: '',
    swapToken: ''
  }]);
  const [popupState, setPopupState] = useState({
    completeListing: {
      open: false,
      state: 0,
    },
    listed: false,
    isLoading: true
  })
  const [available, setAvailable] = useState([]);
  const [unAvailable, setUnAvailable] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const _init = async () => {
    try {
      const { _tezos, _wallet } = await init(tezos, wallet, dispatch);
      await getAccount(_tezos, _wallet, account, dispatch);

      await getGetters(_tezos, getters, dispatch);
      await getMarket(_tezos, market, dispatch);

    } catch (error) {
      console.error(error);
      window.alert("An error ocurred");
      navigate('/');
    }
  }

  const getTokens = async () => {
    try {
      const _tokens = await _getTokens(account);
      setAvailable(_tokens);
    } catch (err) {
      window.alert("an error occured");
      navigate('/');
    }
  }

  const isReady = () => {
    return (
      typeof tezos !== 'undefined'
      && typeof account !== 'undefined'
      && typeof getters !== 'undefined'
      && typeof market !== 'undefined'
    )
  }

  const toWei = (amount) => {
    // return web3.utils.toWei(amount, 'ether');
  }

  const completeListing = async (e) => {
    e.preventDefault();
    try {
      await _completeListing(tezos, selected, market, account, bnplListings, interestedToSwap, setPopupState, dispatch);
      // setPopupState({
      //   completeListing: {
      //     open: false,
      //     state: 0,
      //   },
      //   listed: true
      // });
    } catch (error) {
      // setPopupState({
      //   completeListing: {
      //     open: false,
      //     state: 0,
      //   },
      //   listed: false
      // });
      window.alert(error.message);
      console.error(error);
    }
  }

  const canceCreatelListing = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setSelected({
      token: '',
      tokenId: '',
      sale: false,
      bnpl: false,
      swap: false,
      directSalePrice: [''],
      offerToken: 'Bored Apes',
      offerAmt: '',
      timePeriod: '1'
    });
    setBnplListings([
      {
        deposit: '',
        remainingAmt: '',
        duration: ''
      }
    ]);
    setInterestedToSwap([{
      swapAmount: '',
      swapToken: 'Bored Apes'
    }]);
  }

  useEffect(() => {
    _init();
  }, []);

  // useEffect(() => {
  //   if (web3 != undefined) {
  //     web3._provider.on('chainChanged', () => {
  //       window.location.reload();
  //     })
  //     web3._provider.on('accountsChanged', () => {
  //       window.location.reload();
  //     })
  //   }
  // }, [web3]);

  useEffect(() => {
    if (tezos != undefined && account != undefined)
      getTokens();
  }, [tezos, account]);


  const classes = useStyles();
  if (!isReady()) {
    return <>{"not ready"}</>
  }

  return (
    <Fragment>
      <ComponentHeader searchResult={searchResult} setSearchResult={setSearchResult} />

      {/* <PopupContainer isOpen={popupState.completeListing.open} popupTitle={"Complete Listing"} setState={e => setPopupState({ ...popupState, completeListing: { ...popupState.completeListing, open: false } })}>
        <PopupCompleteListing popupState={popupState} selected={selected} bnplListings={bnplListings} interestedToSwap={interestedToSwap} />
      </PopupContainer>
      <PopupContainer isOpen={popupState.listed} popupTitle={"Your Item is now listed for sale"} reload={true}>
        <PopupListedForSale popupState={popupState} selected={selected} bnplListings={bnplListings} interestedToSwap={interestedToSwap} />
      </PopupContainer> */}

      <div className={classes.root}>
        <div className={classes.createListingHeader}>
          <CreateSwap available={available} selected={selected} setSelected={setSelected} unAvailable={unAvailable} bnplListings={bnplListings} interestedToSwap={interestedToSwap}
          content={<SwapOptions selected={selected} setSelected={setSelected} completeListing={completeListing} bnplListings={bnplListings} setBnplListings={setBnplListings} interestedToSwap={interestedToSwap} setInterestedToSwap={setInterestedToSwap} canceCreatelListing={canceCreatelListing} />} 
          />
          {/* <HowToCreateSwap /> */}
        </div>
      </div>
    </Fragment>
  );
}

export default CreateListing;