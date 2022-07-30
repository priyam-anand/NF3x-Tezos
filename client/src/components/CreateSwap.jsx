import React, { Fragment, useState } from 'react';
import { makeStyles } from '@mui/styles';
import ComponentHeader from './ComponentHeader';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CreateListingCard from "./CreateListingCard.jsx";
import ListingCard from './ListingCard';
import { Button, Card, Chip, FormControl } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as EthGreen } from '../SVG/green-eth.svg';
import { ReactComponent as EthBlue } from '../SVG/blue-eth.svg';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListingCardRefactor from './ListingCardRefactor';
import CardView from './CardView';
import CreateListingPreview from './CreateListingPreview';
import Addresses from "../contracts/Addresses.json";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
  root: {
    display: "flex",
    "@media (max-width: 600px)": {
      "flex-direction": "column"
    },
    "& .previewSection": {
      "max-height": "0",
      "overflow-y": "hidden",
      "-webkit-transition": "all 0.4s ease-out",
      "-moz-transition": "all 0.4s ease-out",
      "-o-transition": "all 0.4s ease-out",
      "transition": "all 0.4s ease-out"
    },
    "& .showPreview": {
      "max-height": "100%",
      "min-width": "411px",
      "@media (max-width: 600px)": {
        "min-width": "100%",
      }
    },
    "& .swap-ctn": {
      marginLeft: '55px',
      height: "calc(100vh - 75px)",
      overflow: "auto",
      width: "100%",
      "padding-right": "50px",
      "@media (max-width: 600px)": {
        marginLeft: "18px",
        height: "100%"
      },
      "& .create-swap": {
        paddingLeft: 0
      }
    },
    "& .search-swap": {
      borderRadius: "10px !important",
      height: "37px",
      "@media (max-width: 600px)": {
        maxWidth: "400px",
        width: "92%"
      }
    },
    "& .search-swap Button": {
      paddingTop: "5px",
      paddingBottom: "5px"
    },
    "& .swap-list": {
      // paddingTop: "25px",
      "max-height": "575px",
      overflow: "auto",
      width: "100%",
      "@media (max-width: 600px)": {
        display: "flex",
        overflow: "auto"
      },
      "& :first-child": {
        marginLeft: 0
      }
    },
    "& .create-swap": {
      margin: "35px 0 25px 0",
      padding: "0 26px",
      "@media (max-width: 600px)": {
        padding: "0"
      },
      "& .medium-weight": {
        marginBottom: "5px"
      },
      "& .mr-36": {
        marginRight: "36px"
      }
    },
    "& .create-swap-sort": {
      marginLeft: "20px",
      color: "#B0B7C3",
      padding: "5.5px 20px",
      borderRadius: "10px !important",
      "@media (max-width: 600px)": {
        margin: "17px 0"
      }
    },
    "& .section-btn-block": {
      position: "relative",
      margin: "10px",
      Width: "212px",
      "& .swap-checkbox": {
        position: "absolute",
        right: "20px",
        top: "20px"
      }
    },
    "& .section-btn-block img": {
      maxWidth: "212px"
    },
    "& .active-checkbox": {

    },
    "& h3": {
      fontSize: "13px",
      color: "#23262F",
      fontWeight: 500,
      marginBottom: 0
    },
    "& .closePreview": {
      color: "#FF0083",
      marginRight: '20px',
      "& span": {
        fontSize: "14px",
        marginRight: "8px"
      },
      "& svg": {
        fontSize: "20px"
      }
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
  }

});

function CreateSwap({ available, selected, setSelected, unAvailable, content, bnplListings, interestedToSwap }) {
  const classes = useStyles();
  const { web3 } = useSelector((state) => state.web3Config);
  const [showPreview, setShowPreview] = React.useState(false);
  const [filter, setFilter] = useState('');


  React.useEffect(() => {
    if (window.innerWidth < 601) {
      setShowPreview(false);
    } else {
      setShowPreview(true)
    }
  }, []);

  return (
    <div className={classes.root}>
      <div className={`outline-right-border display-md previewSection ${showPreview ? 'showPreview' : ''}`}>
        <div className="mobile-only float-right closePreview" onClick={() => setShowPreview(false)}>
          <span>Close Preview</span>
          <VisibilityOffIcon />
        </div>
        <div className="create-swap">
          {/* During integration change this to ListCard and integrate */}
          <CreateListingPreview selected={selected} bnplListings={bnplListings} interestedToSwap={interestedToSwap} />
          <p className="medium-weight center">Live Preview</p>
        </div>
      </div>
      <div className="swap-ctn">
        <div className='section-block create-swap'>
          <div className="flex-justify align-center">
            <h2 className='medium-weight font-16'>Create Swap</h2>
            {!showPreview && <div className="mobile-only float-right closePreview" onClick={() => setShowPreview(true)}>
              <span>See Preview</span>
              <VisibilityIcon />
            </div>}
          </div>
          <span className='text-desc-medium font-16'>Select the NFT from your wallet that you want to Swap</span>
        </div>
        <div className='margin-top-20'>
          <FormControl sx={{ m: 0, minWidth: 200, marginLeft: 0 }}>
            <Select
              className='option-input-field outline-border radius-10'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              displayEmpty
              sx={{ height: "57px", width: "215px !important", color: "#23262F" }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={''}>All Collections</MenuItem>
              <MenuItem value={'Bored Apes'}>Bored Apes</MenuItem>
              <MenuItem value={'Noodles'}>Noodle</MenuItem>
              <MenuItem value={'Azuki'}>Azuki</MenuItem>
              <MenuItem value={'WVRP'}>WVRP</MenuItem>
              <MenuItem value={'Mooncats'}>Mooncats</MenuItem>
              <MenuItem value={'World of Women'}>World of Women</MenuItem>
            </Select>
          </FormControl>
          {/* <Paper
            component="form"
            className={"inline-flex input-text no-shadow search-swap"}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          >
            <InputBase
              onInput={(e)=> e.target.value = Math.abs(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton disableRipple sx={{ p: '10px', color: "#B0B7C3" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper> */}
          {/* <div className={"inline-block input-text no-shadow create-swap-sort"}>
            <span>Sort by:</span>
            <Select
              className={`${classes.dropdown} dropdown-home`}
              value={""}
              onChange={() => { }}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">All Collection </MenuItem>
            </Select>
          </div> */}
        </div>
        <div className="section-block swap-list">
          {
            available.length == 0
              ? "You do not have any NFT(s) available"
              : available.map((token, index) => {
                return <CreateListingCard key={index} token={token} selected={selected} setSelected={setSelected} />
              })
          }
        </div>
        {content}
      </div>
    </div>
  );
}

export default CreateSwap;