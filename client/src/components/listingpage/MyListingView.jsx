import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Autocomplete, IconButton, InputBase, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ListingCard from '../ListingCard';
import EditSwapOption from './EditSwapOption';
import { useSelector, useDispatch } from "react-redux";
import CardView from '../CardView';
import Addresses from "../../contracts/Addresses.json";
import ListingCardRefactor from '../ListingCardRefactor';
import CreateListingPreview from '../CreateListingPreview';
import { _completeEditListing } from '../../api/market';

const useStyles = makeStyles({
  root: {
    width: '100%',
    "& .list-main-cards > div": {
      marginBottom: "35px"
    },
    "& .list-item": {
      width: "calc(100% - 556px)"
    }
  },
  editswap: {
    // width: "calc(50% - 65px)",
    width: "100%",
    marginLeft: "40px",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    "& > div:first-child": {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: 'max-content',
      alignItems: 'center'
    }
  },
  maincard: {
    margin: '0 !Important'
  },
  livepreview: {
    margin: '28px 0',
  }
});

function MyListingView({
  listedItems,
  filters
}) {
  const classes = useStyles();

  const { tezos, market, account } = useSelector((state) => state.tezosConfig);
  const dispatch = useDispatch();
  // const [acitveListingCount, setActiveListingCount] = useState(0);
  // const [inacitveListingCount, setInactiveListingCount] = useState(0);
  const [activeListing, setActiveListing] = useState([]);
  const [inactiveListing, setInactiveListing] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [selected, setSelected] = useState({
    token: '',
    tokenId: '',
    sale: false,
    bnpl: false,
    swap: false,
    directSalePrice: [''],
    timePeriod: '1'
  });
  const [bnplListings, setBnplListings] = useState([
    {
      deposit: '',
      remainingAmt: '',
      duration: ''
    }
  ])
  const [interestedToSwap, setInterestedToSwap] = useState([{
    swapAmount: '',
    swapToken: ''
  }]);
  const [filter, setFilter] = useState('');

  // const toETH = (amount) => {
  //   return web3.utils.fromWei(amount, 'ether');
  // }

  // const toWei = (amount) => {
  //   return web3.utils.toWei(amount, 'ether');
  // }

  const onHandleSelectedItem = (e, data) => {
    // e.stopPropagation();
    // let currentSelectedItem = { ...selectedItem, data };
    // var _bnplListings = [];
    // var _interestedToSwap = [];
    // for (let i = 0; i < data.bnplListings.length; i++) {
    //   const _listing = data.bnplListings[i];
    //   const _currListing = {
    //     deposit: toETH(_listing.deposit),
    //     remainingAmt: toETH(_listing.remaining_amount),
    //     duration: _listing.duration / 86400
    //   };
    //   _bnplListings.push(_currListing);
    // }

    // for (let i = 0; i < data.swapListing.amounts.length; i++) {
    //   const _currListing = {
    //     swapAmount: toETH(data.swapListing.amounts[i]),
    //     swapToken: Addresses.addressToName[data.swapListing.token_addresses[i].toLowerCase()]
    //   };
    //   _interestedToSwap.push(_currListing);
    // }

    // setSelected({
    //   token: data.token,
    //   tokenId: data.tokenId,
    //   sale: data.listingType[0],
    //   bnpl: data.listingType[1],
    //   swap: data.listingType[2],
    //   directSalePrice: data.listingType[0] ? toETH(data.directListing.amounts[0]) : '',
    //   offerToken: data.listingType[2] ? Addresses.addressToName[data.swapListing.token_addresses[0].toLowerCase()] : Addresses.addressToName['0x91d0c5784804bd8d27a30be96b3da4037f095251'],
    //   offerAmt: data.listingType[2] ? toETH(data.swapListing.amounts[0]) : '',
    //   timePeriod: 3
    // });
    // setInterestedToSwap(_interestedToSwap);
    // setBnplListings(_bnplListings);
    // setSelectedItem(currentSelectedItem);
  }

  const completeEditListing = async (e) => {
    // e.preventDefault();

    // try {
    //   await _completeEditListing(market, account, selected, toWei, bnplListings, interestedToSwap, dispatch);
    //   window.location.reload();
    // } catch (error) {
    //   window.alert(error.message);
    //   console.log(error);
    // }
  }

  const filtered = (token) => {
    if (filter == '' || filter == null)
      return true;
    if (Addresses.nameToAddress[filter] == token.token.toLowerCase())
      return true;
    return false;
  }

  const activeCount = () => {
    var count = 0;
    for (var i = 0; i < activeListing.length; i++)
      if (filtered(activeListing[i]))
        count++;
    return count;
  }

  const inactiveCount = () => {
    var count = 0;
    for (var i = 0; i < inactiveListing.length; i++)
      if (filtered(inactiveListing[i]))
        count++;
    return count;
  }

  useEffect(() => {
    if (account == undefined)
      return;
    var _activeListing = [];
    var _inactiveListing = [];

    for (let i = 0; i < listedItems.length; i++) {
      if (listedItems[i].owner != account)
        continue;
      const expires = (new Date(listedItems[i].listing.timePeriod)).getTime();
      const curr = Math.floor(Date.now());
      if (expires > curr)
        _activeListing.push(listedItems[i]);
      else
        _inactiveListing.push(listedItems[i]);
    }

    setActiveListing(_activeListing);
    setInactiveListing(_inactiveListing);
  }, [account, listedItems]);

  const collections = [
    { title: 'Bored Apes' },
    { title: 'Azuki' },
    { title: 'Noodles' },
    { title: 'Mooncats' },
    { title: 'WVRP' },
    { title: 'World of Women' },
    { title: "Doodles" }
  ];
  const flatProps = {
    options: collections.map((option) => option.title),
  };

  return (
    <>
      <div className={classes.root}>
        {!selectedItem.data && <div className={`${(selectedItem.data && "width-50 list-item") ?? "width-100"} inline-block`}>
          {filters[0].isSelected && <div>
            <div className={`action-block flex-wrap row-reverse-direction`}>

              <Paper
                component="form"
                className={"search-input input-text no-shadow float-right margin-bottom-10"}
                sx={{
                  p: '2px 4px', display: 'flex', height: "45px", alignItems: 'center', width: 400, "@media (max-width: 900px)": {
                    width: "100%"
                  }
                }}
              >
                <Autocomplete
                  sx={{ ml: 1, flex: 1, color: "#B0B7C3" }}
                  placeholder="Search.."
                  noOptionsText="No result found"
                  {...flatProps}
                  id="flat-demo"
                  freeSolo
                  value={filter}
                  onChange={(event, value) => {
                    setFilter(value)
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
                  <SearchIcon />
                </IconButton>
              </Paper>
              <label className='black-text font-16 medium-weight margin-top-10'>{`Active Listing (${activeCount()})`}</label>
            </div>

            <div className={`list-main-cards width-100`}>
              {activeListing.map((item, index) => {
                return <ListingCard isEditable={false} isActive={selectedItem.index === index} key={index} itemIndex={index} onHandleSelectedItem={onHandleSelectedItem} item={item} />;
              })}
            </div>
          </div>}
          {filters[1].isSelected && <div>
            <div className={`action-block flex-wrap`}>
              <label className='black-text font-16 medium-weight margin-bottom-10'>{`Inactive Listing (${inactiveCount()})`}</label>
              {!filters[0].isSelected && <Paper
                component="form"
                className={"search-input input-text no-shadow"}
                sx={{
                  p: '2px 4px', display: 'flex', height: "45px", alignItems: 'center', width: 400, "@media (max-width: 900px)": {
                    width: "100%"
                  }
                }}
              >
                <Autocomplete
                  sx={{ ml: 1, flex: 1, color: "#B0B7C3" }}
                  placeholder="Search.."
                  noOptionsText="No result found"
                  {...flatProps}
                  id="flat-demo"
                  freeSolo
                  value={""}
                  onChange={(event, value) => {
                    // setSearchResult(value);
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
                  <SearchIcon />
                </IconButton>
              </Paper>}
            </div>

            <div className={`list-main-cards width-100`}>
              {inactiveListing.map((item, index) => {
                // if (filtered(item)) {
                return <ListingCard isEditable={false} isCustomLabel={true} isActive={selectedItem.index === index} key={index} itemIndex={index} onHandleSelectedItem={onHandleSelectedItem} item={item} />;
                // }
              })}
            </div>
          </div>}
        </div>
        }
      </div>
      {selectedItem.data && <div className={`width-100 ${classes.editswap}`}>
        <div className='width-50'><div className={`${classes.livepreview} t2-text font-14 semibold-weight`}>Live Preview</div>
          <CreateListingPreview selected={selected} bnplListings={bnplListings} interestedToSwap={interestedToSwap} />
        </div>
        <div className='width-50 bg-light' style={{ height: "calc(100vh - 161px)", overflow: "auto" }}><EditSwapOption selected={selected} setSelected={setSelected} onClose={() => setSelectedItem({})} completeEditListing={completeEditListing} bnplListings={bnplListings} setBnplListings={setBnplListings} interestedToSwap={interestedToSwap} setInterestedToSwap={setInterestedToSwap} /></div>
      </div>
      }
    </>
  );
}

export default MyListingView;