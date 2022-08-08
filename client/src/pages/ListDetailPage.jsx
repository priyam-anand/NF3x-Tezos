import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import ComponentHeader from '../components/ComponentHeader';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, IconButton, InputBase, Paper, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InterestedSwap from '../components/InterestedSwap';
import MiniCardView from '../components/MiniCardView';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import SwapOffer from "../components/SwapOffer";
import { OpenInNew } from '@mui/icons-material';
import Addresses from "../contracts/Contracts.json";
import PopupContainer from "../components/PopupContainer";
import PopupConfirmSwapNow from "../components/PopupConfirmSwapNow";
import PopupReserveSwapLater from "../components/PopupReserveSwapLater";
import PopupConfirmSwapOffer from "../components/PopupConfirmSwapOffer";
import PopupProposedSwapOffer from "../components/PopupProposedSwapOffer"
import PopupCompleteOffer from "../components/PopupCompleteOffer";
import PopupAcceptOffer from '../components/PopupAcceptOffer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import { ReactComponent as Search } from '../SVG/Search.svg';
import Util from '../common/Util';
import { _confirmSwapNow, _handleCancelListing, _confirmPayLater, _directNftSwap, _confirmSwapNowOffer, _confirmReserveOffer, _confirmSwapOffer, _confirmAcceptOffer, _confirmAcceptReserveOffer } from '../api/marketTezos';
import { useNavigate } from 'react-router-dom';
import { init, getAccount, getGetters, getMarket } from "../api/tezos"
import { _getItem, _getTokenMetadata, getImageURI, _getTokens, _getOffers, getReservationData, getTimeStamp } from '../api/getterTezos';
import { MichelsonMap } from "@taquito/taquito";
import DirectNFTSwapModal from '../components/DirectNFTSwapModal';
import { getPositionImage } from '../utils';
import { Link } from 'react-router-dom';
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png"
import LoadingPage from './LoadingPage';

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: "inline-block",
    "& .create-swap-sort": {
      background: "#ffffff",
      color: "#B0B7C3",
      padding: "5px 20px"
    },
  },
  "label-text": {
    fontSize: 16,
    fontWeight: 500,
    color: '#23262F',
    opacity: 0.7,
  },
  detailContainer: {
    margin: "20px",
    display: "flex",
    "@media (max-width: 600px)": {
      "flex-direction": "column"
    },
    "& h2": {
      color: "#323B4B",
      fontSize: "26px",
      margin: "0",
      "@media (max-width: 600px)": {
        fontSize: "16px"
      }
    }
  },
  leftPanel: {
    width: "calc(30% - 10px)",
    display: "inline-block",
    marginRight: "10px",
    "& > div:first-child": {
      background: "#FAFAFA",
      padding: "20px",
      borderRadius: "20px",
    },
    "& .owner": {
      "& img": {
        width: "62px !important", height: "62px !important",
      },
      "& .bold": {
        color: '#23262F'
      }
    },
    "& .img-block-round": {
      margin: "20px auto 10px auto"

    },
    "& .swap-title": {
      fontSize: "24px !important",
      color: "#23262F !important",
      fontFamily: "poppins !important"
    },
    "& .accordion-title": {
      fontSize: 18,
      color: '#323B4B'
    },
    '@media (max-width: 1000px)': {
      width: "calc(40% - 10px)",
    },
    '@media (max-width: 600px)': {
      width: "100%",
      "& .swap-title": {
        fontSize: "16px !important",
        color: "#23262F !important",
        fontFamily: "poppins !important"
      },
      "& .accordion-title": {
        fontSize: "16px !important",
        color: "#23262F !important"
      },
      "& .owner": {
        "& img": {
          width: "54px !important", height: "54px !important",
        },
        "& .font-26": {
          fontSize: "18px !important",
          color: "#23262F !important"
        },
        "& .font-22": {
          fontSize: "19px !important",
        }
      }
    }
  },
  accordionContentContainer: {
    width: "100%",
    display: "inline-block"
  },
  accordionContentBlock: {
    borderRadius: "14px",
    background: "#ffffff",
    textAlign: "center",
    display: "inline-block",
    width: "calc(50% - 23px)",
    verticalAlign: "top",
    marginBottom: "10px",
    padding: "5px",
    border: "0.5px solid #E6E8EC",

    "&:nth-child(odd)": {
      marginRight: "10px"
    },
    "&:nth-child(even)": {
      marginLeft: "10px"
    },
    "& span": {
      display: "block"
    },
    "& span:first-child": {
      fontSize: "14px"
    },
    "& span:nth-child(2)": {
      fontWeight: "700",
      fontSize: "20px",
      color: "rgba(35, 38, 47, 0.66)"
    },
    "& span:last-child": {
      fontSize: "14px",
      color: "#8E8E93",
      fontWeight: "400"
    }
  },
  accodionContentBlockDetail: {
    width: "calc(100% - 42px)",
    padding: "30px 20px 20px 10px",
    position: "relative",
    "& label": {
      width: "50%",
      display: "inline-block",
      textAlign: "left",
      color: "#8E8E93",
      fontSize: "18px",
      verticalAlign: "top",
      textOverflow: "ellipsis",
      overflow: "hidden",
    }
  },
  accordion: {
    background: "transparent !important",
    boxShadow: "none !important",
    "& h3": {
      margin: "0"
    },
  },
  rightPanel: {
    width: "70%",
    display: "inline-block",
    "@media (max-width: 600px)": {
      width: "100%"
    },
    "& .swap-button ": {
      width: '127px',
      fontSize: '14px',
      "font-family": "poppins",
      "font-weight": "normal",
      padding: "10px 15px !important",
      "line-height": "18px",
      height: "38px !important",
      '@media (max-width: 870px)': {
        width: "100%",
        maxWidth: "250px",
        marginTop: "20px"
      }
    },
    "& .p24": {
      padding: '23px 24px !important'
    },
    "& .btn": {
      fontWeight: "400 !important",
      fontFamily: "poppins !important",
      fontSize: "14px !important"
    },
    "& .swap-options": {
      fontSize: "24px !important",
      color: "#23262F !important",
      fontFamily: "poppins !important"
    },
    "& .options-block": {
      fontSize: "16px !important",
      color: "#23262F !important",
      opacity: "0.7",
      fontFamily: "poppins !important",
      fontWeight: "500 !important"
    },
    "& .reserve-now-block": {
      marginTop: "16px",
      maxWidth: "610px",
      display: "flex",
      padding: "20px",
      alignItems: "center",
      justifyContent: "space-between",
      "& .crypto-value": {
        "margin-right": 0,
        // width: 62
      },
      "& .plus": {
        margin: "0 30px 0 10px"
      },
      "& > div ": {
        '@media (max-width: 870px)': {
          justifyContent: 'space-evenly',
          width: "100%"
        }
      },
      "& .expire-text": {
        marginLeft: 15
      },
      '@media (max-width: 870px)': {
        flexDirection: "column",
      },
      '@media (max-width: 600px)': {
        maxWidth: "auto",
      }
    },
    "& .expire-date": {
      fontSize: "16px !important",
      color: '#777E91 !important',
      fontWeight: 400,
      background: 'none',
      padding: 0
    },
    "& > div": {
      marginLeft: "10px",
      boxShadow: "0px 0px 25px rgba(37, 97, 186, 0.12)",
      borderRadius: "20px",
      padding: "20px",
      "@media (max-width: 600px)": {
        marginLeft: "0",
        boxShadow: 'none',
        padding: 0,
        marginTop: '25px'
      }
    },
    verticalAlign: "top",
    "& .section-btn-block": {
      width: "calc(100% - 20px)",
      // "@media (max-width: 600px)": {
      //   width: "92% !important",
      //   float: "right",
      //   display: "flex",
      //   "align-items": "center",
      //   "justify-content": "space-between"
      // },
      "& > span:first-child": {
        color: "#323B4B",
        fontSize: "26px",
        fontWeight: "700",
        marginRight: "5px"
      }
    },
    "& .swap-now .section-btn-block": {
      width: "auto",
      paddingLeft: "15px",
      "& > span": {
        verticalAlign: "middle",
      },
      "& Button": {
        marginLeft: "10px",
        paddingLeft: "20px",
        paddingRight: "20px",
        height: "36px"
      }
    },
    "& .swap-now > div.section-btn-block": {
      '@media (max-width: 600px)': {
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        padding: "21px 10px"
      }
    },
    '@media (max-width: 1000px)': {
      width: "60%",
    },
    '@media (max-width: 600px)': {
      width: "100% !important",
      marginTop: "35px",
      "& .section-title": {
        fontSize: '16px',
        opacity: 0.7
      },
      "& > div": {
        boxShadow: "none",
        padding: 0,
        marginLeft: "0px"
      },
      "& .swap-options": {
        fontSize: "16px !important",
      }
    }
  },
  makeOffer: {
    borderRadius: "14px",
    padding: "20px",
    display: "inline-block",
    width: "calc(100% - 40px)",
    '& .offer-section': {
      "border-bottom": "1px solid #E6E8EC",
      "padding-bottom": "12px"
    }
  },
  offerList: {
    width: "100%",
    display: "flex",
    overflow: "auto"
  },
  offerListItem: {
    display: "inline-block",
    padding: "10px !important",
    "& nth-child(odd)": {
      marginRight: "10px"
    },
    "& img": {
      width: "200px",
      height: "200px"
    },
    "& span": {
      display: "block",
      color: "#23262F",
      fontSize: "13px"
    }
  },
  offersReceived: {
    "& .div-table-row-header .div-table-col": {
      color: "#777E90",
      fontSize: "13px"
    },
    "& .section-image-block": {
      width: "100%",
    },
    "& Button": {
      marginRight: "10px"
    }
  },
  dropdown: {
    height: "55px",
    paddingLeft: "10px",
    "& > fieldset": {
      border: "none"
    }
  },
  modal: {
    width: 'fit-content',
    "& .bottom-section": {
      display: "flex",
      "justify-content": "space-between",
      "align-items": "end",
      "& .center": {
        margin: "0  0 10px 15px",
      },
      "& .label-text": {
        color: '#23262F',
        "font-weight": 500,
        opacity: 1
      }
    },
    "& .label-text": {
      marginBottom: 3,
      fontSize: 14,
      fontWeight: 600,
      color: '#878D9D',
      opacity: 0.7
    },
    "& .total": {
      marginTop: 0,
      color: '#FF0083',
      "& h3": {
        margin: '34px 0 0'
      },
      "& p": {
        margin: 0
      }
    }
  }

});

function ListDetailPage() {
  const { collection, tokenId } = useParams();
  const isPosToken = collection == Addresses.PositionToken;
  const { tezos, wallet, account, market, getters } = useSelector((state) => state.tezosConfig);
  const dispatch = useDispatch();
  const [swapOfferModal, setSwapOfferModal] = useState(false);
  const [reservePayLater, setReservePayLater] = useState(false);
  const [offerNftModal, setOfferNftModal] = useState(false);
  const [nftSwapModal, setNftSwapModal] = useState(false);
  const [offerNftSearch, setOfferNftSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState({
    name: '',
    displayUri: '',
    thumbnailUri: '',
    attributes: [],
    reservedToken: '',
    reservedTokenId: ''
  });
  const [item, setItem] = useState({
    owner: '',
    listing: {
      listingType: new MichelsonMap(),
      timePeriod: '',
      directListing: {
        amount: 0
      }
    }
  });
  const [reserveListing, setReserveListing] = useState([{ deposit: '', remaining: '', duration: '' }]);
  const [swapListing, setSwapListing] = useState({ listings: [{ token: '', paymentToken: '', amount: '' }], directAllowed: false })
  const [reserved, setReserved] = useState(false);
  const [available, setAvailable] = useState([{ metadata: { thumbnailUri: '', name: '' }, contract: { address: '' }, tokenId: '' }]);
  const [swapNowOffer, setSwapNowOffer] = useState({
    amount: '',
    time_period: 1
  });
  const [reserveOffer, setReserveOffer] = useState({
    deposit: '',
    remainingAmount: '',
    duration: '',
    time_period: 1
  })
  const [swapOffer, setSwapOffer] = useState({
    tokenAddress: '',
    tokenId: '',
    amount: '',
    name: '',
    image: '',
    time_period: 1
  });
  const [nftSwap, setNFTSwap] = useState({
    paymentToken: '',
    amount: '',
    index: ''
  });
  const [swapOffers, setSwapOffers] = useState([]);
  const [directSaleOffers, setDirectSaleOffers] = useState([]);
  const [reserveOffers, setReserveOffers] = useState([]);
  const [popupState, setPopupState] = useState({
    swapNow: {
      open: false,
      value: 0
    },
    reserverNow: {
      open: false,
      deposit: 0,
      remainingAmount: 0,
      duration: 0,
      index: 0
    },
    offer: {
      open: false,
      token: {
        tokenAddress: '',
        tokenId: ''
      },
      amount: ''
    },
    processing: {
      open: false,
      value: 0
    }
  });
  const [offerPopup, setOfferPopup] = useState({
    open: false,
    image: '',
    name: '',
    value: '',
    swap: '',
    index: ''
  });
  const [filtered, setFiltered] = useState("");
  const navigate = useNavigate();
  const [reservationDetails, setReservationDetails] = useState({});


  const handleClose = () => {
    setNftSwapModal(false);
    setOfferNftModal(false)
    setReservePayLater(false)
    setSwapOfferModal(false)
    setSwapNowOffer({
      amount: '',
      time_period: 1
    });
    setReserveOffer({
      deposit: '',
      remainingAmount: '',
      duration: '',
      time_period: 1
    });
    setSwapOffer({
      tokenAddress: '',
      tokenId: '',
      amount: '',
      name: '',
      image: '',
      time_period: 1
    })
  }

  const getItem = async () => {
    try {

      const item = await _getItem(collection, tokenId, getters);
      console.log(item);
      if (isPosToken) {
        const reservationData = await getReservationData(tokenId);
        const metadata = await _getTokenMetadata(reservationData.token, reservationData.tokenId);
        setToken({ name: "Reservation for " + metadata.name, reservedToken: reservationData.token, reservedTokenId: reservationData.tokenId });
        console.log("reservation data", reservationData);
        setReservationDetails(reservationData);
      } else {
        const metadata = await _getTokenMetadata(collection, tokenId);
        setToken(metadata);
        setReserved(item.listing.reserveListing.accepted);
      }
      setItem(item);

      var listings = [];
      for (var i = 0; i < item.listing.reserveListing.deposit.size; i++) {
        listings[i] = {
          deposit: item.listing.reserveListing.deposit.get((i + "")),
          remaining: item.listing.reserveListing.remaining.get((i + "")),
          duration: item.listing.reserveListing.duration.get((i + "")),
        }
      }
      setReserveListing(listings);

      listings = [];
      for (var i = 0; i < item.listing.swapListing.tokens.size; i++) {
        listings[i] = {
          token: item.listing.swapListing.tokens.get((i + "")),
          paymentToken: item.listing.swapListing.paymentTokens.get((i + "")),
          amount: item.listing.swapListing.amounts.get((i + "")),
        }
      }
      setSwapListing({
        listings: listings,
        directAllowed: item.listing.swapListing.swapAllowed
      });
      setLoading(false)
    } catch (err) {
      window.alert(err.message);
      console.error(err);
    }

  }

  const _init = async () => {
    try {
      const { _tezos, _wallet } = await init(tezos, wallet, dispatch);
      await getAccount(_tezos, _wallet, account, dispatch);

      await getGetters(_tezos, getters, dispatch);
      await getMarket(_tezos, market, dispatch);
    } catch (error) {
      console.error(error);
      window.alert("An error ocurred");
    }
  }

  const getOffers = async () => {
    try {
      const _offers = await _getOffers(getters, collection, tokenId);

      var offer = [];
      for (var i = 0; i < _offers.reserveOffers.size; i++) {
        offer[i] = {
          deposit: _offers.reserveOffers.get(0 + "").deposit.amounts.get("0").toNumber(),
          remainingAmount: _offers.reserveOffers.get(0 + "").remaining.amounts.get("0").toNumber(),
          owner: _offers.reserveOffers.get(i + "").owner,
          timePeriod: _offers.reserveOffers.get(i + "").timePeriod,
          index: i
        }
      }
      setReserveOffers(offer);

      offer = [];
      for (var i = 0; i < _offers.swapOffers.size; i++) {
        offer[i] = {
          token: _offers.swapOffers.get(i + "").assets.tokens.get("0"),
          tokenId: _offers.swapOffers.get(i + "").assets.tokenIds.get("0")?.toNumber(),
          amount: _offers.swapOffers.get(i + "").assets.amounts.get("0").toNumber(),
          paymentToken: _offers.swapOffers.get(i + "").assets.paymentTokens.get("0"),
          owner: _offers.swapOffers.get(i + "").owner,
          timePeriod: _offers.swapOffers.get(i + "").timePeriod,
          index: i
        }
      }
      setSwapOffers(offer)
    } catch (error) {
      console.error(error);
      window.alert("An error ocurred");
    }
  }
  const resetPopupState = () => {
    setPopupState({
      swapNow: {
        open: false,
        value: 0
      },
      reserverNow: {
        open: false,
        deposit: 0,
        remainingAmount: 0,
        duration: 0,
        index: 0
      },
      offer: {
        open: false,
        token: {
          tokenAddress: '',
          tokenId: ''
        },
        amount: ''
      },
      processing: {
        open: false,
        value: 0
      }
    })
  }

  const resetOfferPopup = () => {
    setOfferPopup({
      open: false,
      image: '',
      name: '',
      value: '',
      swap: '',
      index: ''
    })
  }

  const isReady = () => {
    return (
      typeof tezos !== 'undefined'
      && typeof account !== 'undefined'
      && typeof getters !== 'undefined'
      && typeof market !== 'undefined'
    )
  }

  const toTez = (amount) => {
    return amount / 1000000;
  }

  const handleBuyNow = async () => {
    setPopupState({
      ...popupState, swapNow: {
        open: true,
        value: toTez(item.listing.directListing.amount.toNumber())
      }
    })
  }

  const confirmSwapNow = async () => {
    try {
      await _confirmSwapNow(item, market, popupState, setPopupState, dispatch);
      resetPopupState();
      navigate('/dashboard');
    } catch (error) {
      resetPopupState();
      window.alert(error.message);
      console.error(error);
    }
  }

  const handlePayLater = async (index) => {
    setPopupState({
      ...popupState,
      reserverNow: {
        open: true,
        deposit: toTez(reserveListing[index].deposit),
        remainingAmount: toTez(reserveListing[index].remaining),
        duration: reserveListing[index].duration,
        index: index
      }
    });
  }

  const confirmPayLater = async (index) => {
    try {
      await _confirmPayLater(item, reserveListing[index], market, popupState, setPopupState, index, dispatch);
      navigate('/dashboard');
      resetPopupState();
    } catch (error) {
      resetPopupState();
      window.alert(error.message);
      console.error(error);
    }
  }

  const directNftSwap = async () => {
    try {

      await _directNftSwap(tezos, account, item, nftSwap, swapOffer, market, dispatch);
      resetPopupState();
      navigate('/dashboard');
    } catch (error) {
      window.alert(error.message);
      console.error(error);
    }
  }

  const getTokens = async () => {
    try {
      const _tokens = await _getTokens(account);
      setAvailable(_tokens);
    } catch (err) {
      window.alert("an error occured");
      navigate('/listing');
    }
  }


  const makeSwapNowOffer = () => {
    const { amount, time_period } = swapNowOffer;
    var _amount = amount == undefined || amount == '' ? 0 : amount;
    console.log(amount, time_period);
    if (_amount == 0 || time_period == 0) {
      window.alert("Invalid Parameters");
      return;
    }
    setPopupState({
      ...popupState,
      offer: {
        open: 1,
        token: {
          tokenAddress: '',
          tokenId: ''
        },
        amount: _amount
      }
    });
  }

  const confirmSwapNowOffer = async () => {
    try {
      await _confirmSwapNowOffer(item, market, swapNowOffer, popupState, setPopupState, dispatch);
    } catch (error) {
      resetPopupState();
      window.alert(error.message);
      console.log(error);
    }
  }

  const makeReserveOffer = () => {
    const { deposit, remainingAmount, duration, time_period } = reserveOffer;
    const _deposit = deposit == undefined || deposit == '' ? 0 : deposit;
    const _remainingAmt = remainingAmount == undefined || remainingAmount == '' ? 0 : remainingAmount;
    const _duration = duration == undefined || duration == '' ? 0 : duration;
    const _timePeriod = time_period == undefined || time_period == '' ? 0 : time_period;

    if (_deposit == 0 || _remainingAmt == 0 || _duration == 0 || _timePeriod == 0) {
      window.alert("Invalid Parameters");
      return;
    }
    setPopupState({
      ...popupState,
      offer: {
        open: 1,
        token: {
          tokenAddress: '',
          tokenId: ''
        },
        deposit: _deposit,
        remainingAmount: _remainingAmt,
        duration: _duration
      }
    });
    console.log("offer here", popupState.offer);
  }

  const confirmReserveOffer = async () => {
    try {
      await _confirmReserveOffer(item, market, reserveOffer, popupState, setPopupState, dispatch);
    } catch (error) {
      resetPopupState();
      window.alert(error.message);
      console.log(error);
    }
  }

  const makeSwapOffer = () => {
    const { tokenAddress, tokenId, amount, name, image, time_period } = swapOffer;
    var _amount = amount == undefined || amount == '' ? 0 : amount;
    const timePeriod = time_period * 86400;

    if (tokenAddress == '' || timePeriod == 0) {
      window.alert("Invalid Parameters");
      return;
    }

    setPopupState({
      ...popupState,
      offer: {
        open: 1,
        token: {
          tokenAddress: tokenAddress,
          tokenId: tokenId
        },
        amount: _amount
      }
    });
  }

  const confirmSwapOffer = async () => {
    console.log("confirm swap offer")
    try {
      await _confirmSwapOffer(tezos, account, item, market, swapOffer, popupState, setPopupState, dispatch);
    } catch (error) {
      resetPopupState();
      window.alert(error.message);
      console.log(error);
    }
  }

  const acceptOffer = (image, name, value, index, swap) => {
    console.log("accept offer");
    setOfferPopup({
      open: true,
      image: image,
      name: name,
      value: value == undefined || value == '' ? 0 : value,
      swap: swap,
      index: index
    })
  }

  const confirmAcceptOffer = async () => {
    try {
      await _confirmAcceptOffer(item, market, offerPopup.index, dispatch);
      resetOfferPopup();
      navigate('/dashboard');
    } catch (err) {
      window.alert(err.message);
      resetOfferPopup();
      console.log(err);
    }
  }

  const acceptReserveOffer = (image, name, deposit, remainingAmount, duration, index) => {
    setOfferPopup({
      open: true,
      image: image,
      name: name,
      deposit: deposit,
      remainingAmount: remainingAmount,
      duration: duration,
      index: index,
      reserve: true
    })
  }

  const confirmAcceptReserveOffer = async () => {
    try {
      await _confirmAcceptReserveOffer(item, market, offerPopup.index, dispatch);
      navigate('/dashboard');
      resetOfferPopup();
    } catch (err) {
      window.alert(err.message);
      resetOfferPopup();
      console.log(err);
    }
  }

  const handleCancelListing = async () => {
    try {
      await _handleCancelListing(market, item, dispatch);
      resetPopupState();
    } catch (err) {
      window.alert(err);
      console.log(err);
      resetPopupState();
    }
  }

  const getTime = (timeStamp) => {
    const time = getTimeStamp(timeStamp);
    var diff = time - Date.now() / 1000;
    const day = Math.floor(diff / 86400);
    diff = diff % 86400;
    const hour = Math.floor(diff / 3600);
    diff = diff % 3600;
    const mins = Math.floor(diff / 60);
    var ret = (day > 0 ? `${day} days ` : '') + (hour > 0 ? `${hour} hours ` : '') + (mins > 0 ? `${mins} mins` : '');
    return ret;
  }

  useEffect(() => {
    _init();
  }, [])

  useEffect(() => {
    if (getters != undefined) {
      getItem();
      getOffers();
    }
  }, [getters]);

  useEffect(() => {
    if (account != undefined)
      getTokens();
  }, [account]);

  const classes = useStyles();

  if (loading) {
    return <LoadingPage />
  }

  const collections = [
  ];

  const flatProps = {
    options: collections.map((option) => option.title),
  };

  return (
    <div className={classes.root}>
      <PopupContainer isOpen={popupState.swapNow.open} popupTitle={"Confirm Swap Now"} setState={e => setPopupState({ ...popupState, swapNow: { ...popupState.swapNow, open: false } })}>
        <PopupConfirmSwapNow value={popupState.swapNow.value} token={token} confirmSwapNow={confirmSwapNow} isPos={isPosToken} />
      </PopupContainer>

      <PopupContainer isOpen={popupState.reserverNow.open} popupTitle={"Reserve Now & Swap Later"} setState={e => setPopupState({ ...popupState, reserverNow: { ...popupState.reserverNow, open: false } })}>
        <PopupReserveSwapLater deposit={popupState.reserverNow.deposit} remainingAmount={popupState.reserverNow.remainingAmount} duration={popupState.reserverNow.duration} token={token} index={popupState.reserverNow.index} confirmPayLater={confirmPayLater} />
      </PopupContainer>

      <PopupContainer isOpen={popupState.offer.open == 1} popupTitle={"Confirm Swap Offer"} setState={e => setPopupState({ ...popupState, offer: { ...popupState.offer, open: false } })}>
        <PopupConfirmSwapOffer swapOffer={swapOffer} reserveOffer={reserveOffer} swapNowOffer={swapNowOffer} confirmSwapNowOffer={confirmSwapNowOffer} confirmReserveOffer={confirmReserveOffer} confirmSwapOffer={confirmSwapOffer} token={token} isPosToken={isPosToken} />
      </PopupContainer>

      <PopupContainer isOpen={popupState.offer.open >= 2 && popupState.offer.open <= 3} popupTitle={"Complete your offer"} setState={e => setPopupState({ ...popupState, offer: { ...popupState.offer, open: false } })}>
        <PopupCompleteOffer popupState={popupState} token={token} swapOffer={swapOffer} swapNowOffer={swapNowOffer} reserveOffer={reserveOffer} isPosToken={isPosToken} />
      </PopupContainer>
      <PopupContainer isOpen={popupState.offer.open == 4} popupTitle={"Your NFTs/Tez are proposed against following swap offer"} reload={true}>
        <PopupProposedSwapOffer token={token} swapOffer={swapOffer} swapNowOffer={swapNowOffer} reserveOffer={reserveOffer} isPosToken={isPosToken} />
      </PopupContainer>
      <PopupContainer isOpen={offerPopup.open} popupTitle={"Accept Swap Offer"} setState={e => setOfferPopup({ ...offerPopup, open: false })}>
        <PopupAcceptOffer token={token} confirmAcceptOffer={confirmAcceptOffer} offerPopup={offerPopup} resetOfferPopup={resetOfferPopup} confirmAcceptReserveOffer={confirmAcceptReserveOffer} isPosToken={isPosToken} />
      </PopupContainer>

      <ComponentHeader />
      <div className={classes.detailContainer}>
        {
          isPosToken
            ? <div className={classes.leftPanel}>
              <div>
                <Link className='font-26 bold swap-title' target={"_blank"} to={`/listdetail/${token.reservedToken}/${token.reservedTokenId}`}>{
                  token.name
                }</Link>
                <div className='img-block-round overflow-hidden'>
                  <img className='radius-13' src={getPositionImage()} />
                </div>
                <div>
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      className='padding-zero'
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4bh-content"
                      id="panel4bh-header"
                    >
                      <span className='accordion-title'>Details</span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={classes.accordionContentContainer}>
                        <div className={`${classes.accordionContentBlock} ${classes.accodionContentBlockDetail}`}>
                          <div>
                            <label>Contact Address</label>
                            <label><span className="primary-text">{collection}</span></label>
                          </div>
                          <div>
                            <label>Token ID</label>
                            <label>{tokenId}</label>
                          </div>
                          <div>
                            <label>Token Standard</label>
                            <label>FA2</label>
                          </div>
                          <div>
                            <label>Blockchain</label>
                            <label>Tezos</label>
                          </div>
                          <div>
                            <label>Metadata</label>
                            <label>Editable</label>
                          </div>
                          <OpenInNew sx={{ position: "absolute", top: "10px", right: "10px", color: "#B0B7C3", fontSize: "13px" }} />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
              <div className='margin-top-30 owner'>
                <div className="bold font-18 ">Owner</div>
                <div className='flex-justify-start align-center margin-top-20'>
                  <div className='flex-justify-start column-direction'>
                    <span className='old2-text font-16 relative word-break'>{item.owner}<OpenInNew sx={{ color: "#B0B7C3", fontSize: "13px" }} /></span>
                  </div>
                </div>
              </div>
            </div>
            : <div className={classes.leftPanel}>
              <div>
                <span className='font-26 bold swap-title'>
                  {
                    token.name
                  }
                </span>
                <div className='img-block-round overflow-hidden'>
                  <img className='radius-13' src={getImageURI(token.displayUri)} />
                </div>
                <div className='margin-top-20'>
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      className='padding-zero'
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4bh-content"
                      id="panel4bh-header"
                    >
                      <span className='accordion-title'>Properties</span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={classes.accordionContentContainer}>
                        {token.attributes.map((attribute, index) => {
                          if (attribute.value != 0)
                            return <div className={classes.accordionContentBlock} key={index}>
                              <span className='primary-text'>{attribute.name}</span>
                              <span>{attribute.value}</span>
                            </div>
                        })}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>

                <div>
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      className='padding-zero'
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel4bh-content"
                      id="panel4bh-header"
                    >
                      <span className='accordion-title'>Details</span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={classes.accordionContentContainer}>
                        <div className={`${classes.accordionContentBlock} ${classes.accodionContentBlockDetail}`}>
                          <div>
                            <label>Contact Address</label>
                            <label><span className="primary-text">{collection}</span></label>
                          </div>
                          <div>
                            <label>Token ID</label>
                            <label>{tokenId}</label>
                          </div>
                          <div>
                            <label>Token Standard</label>
                            <label>FA2</label>
                          </div>
                          <div>
                            <label>Blockchain</label>
                            <label>Tezos</label>
                          </div>
                          <div>
                            <label>Metadata</label>
                            <label>Editable</label>
                          </div>
                          <OpenInNew sx={{ position: "absolute", top: "10px", right: "10px", color: "#B0B7C3", fontSize: "13px" }} />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
              <div className='margin-top-30 owner'>
                <div className="bold font-18 ">Owner</div>
                <div className='flex-justify-start align-center margin-top-20'>
                  <div className='flex-justify-start column-direction'>
                    <span className='old2-text font-16 relative word-break'>{item.owner}<OpenInNew sx={{ color: "#B0B7C3", fontSize: "13px" }} /></span>
                  </div>
                </div>
              </div>
            </div>
        }
        <div className={classes.rightPanel}>
          <div>
            <div className={`flex-justify align-center`}>
              <span className={`flex-justify align-center`}><span className='old1-text font-26 bold swap-options'>Swap Options</span>
                {item.owner == account ? <Button disableRipple variant='outlined' size="small" className={"btn bg-white primary-text primary-border margin-left-10"} onClick={handleCancelListing}>Cancel Listing</Button> : null}
              </span>
              <span className='font-16 old2-text font-16'>Expires in {getTime(item.listing.timePeriod)}</span>
            </div>

            {
              reserved ? <span className={`flex-justify align-center`}><span className='old1-text font-26 swap-options'>This Item has been RESERVED. If you own this reservation, please go to your dashboard to complete the payment</span> </span> : null
            }

            {
              isPosToken && item.listing.listingType.get('0')
                ? <>
                  <div className={`section-block swap-now`}>
                    <div className={"neutral2-text font-16 margin-top-30 margin-bottom-10 options-block"}>Deposit Paid</div>
                    <div className='section-btn-block p24'>
                      <span className="display-flex align-center"><img src={TezLogo} className="eth-img" />{toTez(reservationDetails.deposit.amounts[0])} </span>
                    </div>

                  </div>
                  <div className={`section-block swap-now`}>
                    <div className={"neutral2-text font-16 margin-top-30 margin-bottom-10 options-block"}>Remaining Amount</div>
                    <div className='section-btn-block p24'>
                      <span className="display-flex align-center"><img src={TezLogo} className="eth-img" />{toTez(reservationDetails.remaining.amounts[0])} </span>
                    </div>
                  </div>
                  <div className={`section-block swap-now`}>
                    <div className={"neutral2-text font-16 margin-top-30 margin-bottom-10 options-block"}>Time Left</div>
                    <div className='section-btn-block p24'>
                      <span className="display-flex align-center">{getTime(reservationDetails.dueDate)} </span>
                    </div>
                  </div>
                </>
                : null
            }

            {
              !item.listing.listingType.get('0') ? <></>
                : <div className={`section-block swap-now`}>
                  <div className={"neutral2-text font-16 margin-top-30 margin-bottom-10 options-block"}>Swap Now</div>
                  <div className='section-btn-block p24'>
                    <span className="display-flex align-center"><img src={TezLogo} className="eth-img" />{toTez(item.listing.directListing.amount.toNumber())} </span>
                    {
                      item.owner == account ? <></> : <div>
                        <Button disableRipple variant='outlined' className={"btn bg-white primary-text primary-border swap-button"} onClick={handleBuyNow}>Swap now</Button>
                        <Button disableRipple variant='outlined' className={"btn btn-grey swap-button"} onClick={() => setSwapOfferModal(true)}>Counter Offer</Button>
                      </div>
                    }
                  </div>
                </div>
            }

            {
              !item.listing.listingType.get('1') ? <></>
                : <div className={`section-block swap-now`}>
                  <div className={"neutral2-text font-22 medium-weight margin-top-40 margin-bottom-10 options-block"}>Reserve and Swap Later</div>
                  {
                    reserveListing.map((listing, index) => {
                      return <div className='section-btn-block reserve-now-block p24' key={index}>
                        <div className='flex-justify align-center'>
                          <div className='crypto-value'><img src={TezLogo} className="eth-img" />{toTez(listing.deposit)}  </div>
                          <div className="font-16 plus">+</div>
                          <div className='crypto-value'><img src={TezLogo} className="eth-img" />{toTez(listing.remaining)} </div>
                          <div className='expire-text'>{`within ${listing.duration / 86400} days`}</div>
                        </div>
                        <div>
                          {item.owner != account && <Button disableRipple variant='outlined' className={"btn bg-white primary-text primary-border swap-button"} onClick={e => handlePayLater(index)}>Reserve now</Button>}
                          {item.owner != account && <Button disableRipple variant='outlined' className={"btn btn-grey swap-button"} onClick={() => setReservePayLater(true)}>Counter Offer</Button>}
                        </div>
                      </div>
                    })
                  }
                </div>
            }
            {
              !item.listing.listingType.get('2') ? <></>
                : <div className={`section-block`}>
                  <div className={"neutral2-text font-22 medium-weight margin-top-40 margin-bottom-10 options-block"}>Interested in Swaps For</div>
                  <InterestedSwap listings={item} setOfferNftModal={setOfferNftModal} setNftSwapModal={setNftSwapModal} nftSwap={nftSwap} setNftSwap={setNFTSwap} />
                </div>
            }
            {
              item.owner != account ?
                <div className={`section-block ${classes.makeOffer}`}>
                  <Modal
                    keepMounted
                    open={swapOfferModal}
                    onClose={() => handleClose()}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className={`modal ${classes.modal}`}>
                      <div className={"display-flex flex-justify"}>
                        <h3 className="section-title font-16">Make Swap Offer</h3>
                        <CloseIcon className="pointer" onClick={() => handleClose()} />
                      </div>
                      <div className={`section-block margin-tb-10`}>
                        <div className={`section-block margin-tb-10 offer-section`}>
                          <div className={`section-block margin-tb-10 display-flex`}>
                            <FormControl sx={{ m: 0 }}>
                              <Select
                                className='input-text'
                                value={""}
                                onChange={() => { }}
                                displayEmpty
                                sx={{ height: "57px", width: "250px", background: "#ffffff", marginLeft: 0 }}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                <MenuItem value="">XTZ</MenuItem>
                              </Select>
                            </FormControl>
                            <OutlinedInput
                              onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                              className='input-text'
                              id="outlined-adornment-weight"
                              type="text"
                              InputProps={{ min: 0 }}
                              placeholder='Enter Amount'
                              value={swapNowOffer.amount}
                              onChange={(e) => { setSwapNowOffer({ ...swapNowOffer, amount: e.target.value }) }}
                              sx={{ width: "250px", height: "57px", margin: "8px", background: "#ffffff", marginTop: 0 }}
                              startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={TezLogo} /></InputAdornment>}
                              aria-describedby="outlined-weight-helper-text"
                              inputProps={{
                                'aria-label': 'weight',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`section-block margin-top-20 bottom-section`}>
                        <div>
                          <div className={"label-text font-16"}>Offer Validity</div>
                          <div className={`section-block margin-tb-10`}>
                            <Paper
                              component="form"
                              className={"outline-border radius-10"}
                              sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200, color: "#23262F" }}
                            >
                              <InputBase
                                onInput={(e) => e.target.value = Math.abs(e.target.value)}
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="0"
                                type="number"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                value={swapNowOffer.time_period}
                                onChange={(e) => setSwapNowOffer({ ...swapNowOffer, time_period: e.target.value })}
                              />
                              <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                                Days
                              </IconButton>
                            </Paper>
                          </div>
                        </div>
                        <div className="center">
                          <Button disableRipple className={"btn btn-grey"} onClick={() => handleClose()}>Cancel</Button>
                          <Button disableRipple className={"btn white-text text-center margin-left-10"} onClick={makeSwapNowOffer}>Confirm</Button>
                        </div>
                      </div>
                    </Box>
                  </Modal>
                  {/* From here */}
                  <Modal
                    keepMounted
                    open={reservePayLater}
                    onClose={() => handleClose()}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className={`modal ${classes.modal}`}>
                      <div className={"display-flex flex-justify"}>
                        <h3 className="section-title font-16">Offer Reserve Token And Pay Later </h3>
                        <CloseIcon className="pointer" onClick={() => handleClose()} />
                      </div>
                      <div className={`section-block margin-tb-10 display-flex`}>
                        <FormControl sx={{ ml: 0 }}>
                          <Select
                            className='input-text margin-left-0'
                            value={""}
                            onChange={() => { }}
                            displayEmpty
                            sx={{ height: "57px", width: "191px", background: "#ffffff" }}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            <MenuItem value="">XTZ</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className={`section-block margin-tb-10 display-flex`}>
                        <div>
                          <div className={"label-text font-14"}>Deposit</div>
                          <OutlinedInput
                            onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                            className='input-text margin-left-0'
                            id="outlined-adornment-weight"
                            type="text"
                            InputProps={{ min: 0 }}
                            placeholder='Enter Amount'
                            value={reserveOffer.deposit}
                            onChange={(e) => { setReserveOffer({ ...reserveOffer, deposit: e.target.value }) }}
                            sx={{ width: "191px", height: "57px", margin: "8px", background: "#ffffff" }}
                            startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={TezLogo} /></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                              'aria-label': 'weight',
                            }}
                          />
                        </div>
                        <div className={'display-flex align-center margin-10'}>
                          <p className={'margin-top-40'}>+</p>
                        </div>
                        <div>
                          <div className={"label-text font-14"}>Swap Later</div>
                          <OutlinedInput
                            onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                            className='input-text margin-left-0'
                            id="outlined-adornment-weight"
                            type="text"
                            InputProps={{ min: 0 }}
                            placeholder='Enter Amount'
                            value={reserveOffer.remainingAmount}
                            onChange={(e) => { setReserveOffer({ ...reserveOffer, remainingAmount: e.target.value }) }}
                            sx={{ width: "200px", height: "57px", margin: "8px", background: "#ffffff" }}
                            startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={TezLogo} /></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                              'aria-label': 'weight',
                            }}
                          />
                        </div>
                        <div className={'total'}>
                          <h3>Total</h3>
                          <p>{`${(Number(reserveOffer.deposit) + Number(reserveOffer.remainingAmount)).toFixed(3)} E`}</p>
                        </div>
                      </div>
                      <div>
                        <div className={"label-text font-14"}>Swap Within</div>
                        <Paper
                          component="form"
                          className={"outline-border radius-10"}
                          sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200, color: "#23262F" }}
                        >
                          <InputBase
                            onInput={(e) => e.target.value = Math.abs(e.target.value)}
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="0"
                            type="number"
                            inputProps={{ 'aria-label': 'search google maps' }}
                            value={reserveOffer.duration}
                            onChange={(e) => setReserveOffer({ ...reserveOffer, duration: e.target.value })}
                          />
                          <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                            Days
                          </IconButton>
                        </Paper>
                      </div>
                      <div className={`section-block margin-top-20 bottom-section`}>
                        <div>
                          <div className={"label-text font-16"}>Offer Validity</div>
                          <div className={`section-block margin-tb-10`}>
                            <Paper
                              component="form"
                              className={"outline-border radius-10"}
                              sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200, color: "#23262F" }}
                            >
                              <InputBase
                                onInput={(e) => e.target.value = Math.abs(e.target.value)}
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="0"
                                type="number"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                value={reserveOffer.time_period}
                                onChange={(e) => setReserveOffer({ ...reserveOffer, time_period: e.target.value })}
                              />
                              <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                                Days
                              </IconButton>
                            </Paper>
                          </div>
                        </div>
                        <div className="center">
                          <Button disableRipple className={"btn btn-grey"} onClick={() => handleClose()}>Cancel</Button>
                          <Button disableRipple className={"btn white-text text-center margin-left-10"} onClick={makeReserveOffer}>Confirm</Button>
                        </div>
                      </div>
                    </Box>
                  </Modal>

                  <div className={`section-block margin-tb-10`}>
                    <DirectNFTSwapModal offerNftModal={nftSwapModal} handleClose={handleClose} classes={classes} directNftSwap={directNftSwap} available={available} swapOffer={swapOffer} setSwapOffer={setSwapOffer} nftSwap={nftSwap} />
                    <Modal
                      keepMounted
                      open={offerNftModal}
                      onClose={() => handleClose()}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box className={`modal ${classes.modal}`}>
                        <div className={"display-flex flex-justify"}>
                          <h3 className="section-title font-16">Offer NFT(s) </h3>
                          <CloseIcon className="pointer" onClick={() => handleClose()} />
                        </div>
                        <div className={`section-block margin-tb-10`}>
                          <Paper
                            component="form"
                            className={"search-input no-border no-shadow radius-15 input-text outline-border"}
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                          >
                            <Autocomplete
                              sx={{ ml: 1, flex: 1, color: "#B0B7C3" }}
                              placeholder="Search.."
                              noOptionsText="No result found"
                              {...flatProps}
                              id="flat-demo"
                              freeSolo
                              value={offerNftSearch}
                              onChange={(event, value) => {
                                setOfferNftSearch(value);
                              }}
                              options={collections.map((option) => option.title)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  className='font-16'
                                  placeholder="Search"
                                  InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                  }}
                                />
                              )}
                            />
                            <IconButton disableRipple sx={{ p: '10px', color: '#B0B7C3' }} aria-label="search">
                              <Search className='b-grey-text' />
                            </IconButton>
                          </Paper>
                        </div>
                        <div className={`${classes.offerList}`}>
                          {
                            available.map((token, index) => {
                              return <div className={`${classes.offerListItem}`} key={index}>
                                <MiniCardView token={token} swapOffer={swapOffer} setSwapOffer={setSwapOffer} />
                              </div>
                            })
                          }
                        </div>
                        <div className={"section-title font-16 margin-top-15"}>Add Token</div>
                        <div className={`section-block margin-tb-10 display-flex`}>
                          <FormControl sx={{ m: 0 }}>
                            <Select
                              className='input-text'
                              value={""}
                              onChange={() => { }}
                              displayEmpty
                              sx={{ height: "57px", width: "200px", background: "#ffffff", marginLeft: 0 }}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem value="">XTZ</MenuItem>
                            </Select>
                          </FormControl>
                          <OutlinedInput
                            onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                            className='input-text'
                            id="outlined-adornment-weight"
                            type="text"
                            InputProps={{ min: 0 }}
                            placeholder='Enter Amount'
                            value={swapOffer.amount}
                            onChange={(e) => { setSwapOffer({ ...swapOffer, amount: e.target.value }) }}
                            sx={{ width: "200px", height: "57px", margin: "8px", background: "#ffffff", marginTop: 0 }}
                            startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={TezLogo} /></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                              'aria-label': 'weight',
                            }}
                          />
                        </div>
                        <div className={`section-block margin-top-20 bottom-section`}>
                          <div>
                            <div className={"label-text font-16"}>Offer Validity</div>
                            <div className={`section-block margin-tb-10`}>
                              <Paper
                                component="form"
                                className={"outline-border radius-10"}
                                sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200, color: "#23262F" }}
                              >
                                <InputBase
                                  onInput={(e) => e.target.value = Math.abs(e.target.value)}
                                  sx={{ ml: 1, flex: 1 }}
                                  placeholder="0"
                                  type="number"
                                  inputProps={{ 'aria-label': 'search google maps' }}
                                  value={swapOffer.time_period}
                                  onChange={(e) => setSwapOffer({ ...swapOffer, time_period: e.target.value })}
                                />
                                <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                                  Days
                                </IconButton>
                              </Paper>
                            </div>
                          </div>
                          <div className="center">
                            <Button disableRipple className={"btn btn-grey"} onClick={() => handleClose()}>Cancel</Button>
                            <Button disableRipple className={"btn white-text text-center margin-left-10"} onClick={makeSwapOffer}>Confirm</Button>
                          </div>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </div> : <></>
            }
            {/*  here here */}
          </div>

          <div className={`section-block ${classes.offersReceived} `}>
            <div className="outline-border radius-tlr-14">
              <div>
                <div className='outline-border radius-tlr-14 flex-justify align-center padding-15 center'>
                  <div style={{ flex: "1 1 30%" }}><div className={"section-title left"}>Offers Received</div></div>
                  <div style={{ flex: "1 1 20%" }} className="desc-text font-13">Offered by</div>
                  <div style={{ flex: "1 1 20%" }} className="desc-text font-13">Expires in</div>
                  <div style={{ flex: "1 1 30%" }}>&nbsp;</div>
                </div>

                {
                  swapOffers.map((offer, idx) => {
                    return <SwapOffer offer={offer} item={item} acceptOffer={acceptOffer} index={idx} />
                  })
                }
                {
                  reserveOffers.map((offer, idx) => {
                    return <SwapOffer offer={offer} item={item} acceptOffer={acceptOffer} index={idx} acceptReserveOffer={acceptReserveOffer} />
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >);
}

export default ListDetailPage;