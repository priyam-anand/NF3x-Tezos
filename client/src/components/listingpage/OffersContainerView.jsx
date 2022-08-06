import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Autocomplete, Button, IconButton, InputBase, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OffersReceivedView from '../listingpage/offersview/OffersReceivedView';
import OffersMadeView from '../listingpage/offersview/OffersMadeView';
import { useSelector } from 'react-redux';
import { _getRejectedBnpl, _getRejectedDirectSale, _getRejectedSwap } from '../../api/getter';
import { getOffers } from '../../api/getterTezos';

const useStyles = makeStyles({
  root: {
    width: '100%',
  }
});

function OffersContainerView({
  listedItems,
  modules,
  updateOfferCategory
}) {
  const classes = useStyles();
  const [offerViewToggle, setOfferViewToggle] = useState(true);
  const [received, setReceived] = useState(0);
  const [allOffers, setAllOffers] = useState([]);
  const [made, setMade] = useState(0);

  const [rejectedOffers, setRejectedOffers] = useState([]);

  const { account, getters } = useSelector((state) => state.tezosConfig);

  // const getRejected = async () => {
  //   try {
  //     var items = await Promise.all([
  //       _getRejectedDirectSale(account, getter),
  //       _getRejectedBnpl(account, getter),
  //       _getRejectedSwap(account, getter)]
  //     );
  //     var rejectedItems = new Map();
  //     const rejectedOffers = [];

  //     for (var i = 0; i < items[0].length; i++) {
  //       var obj = rejectedItems.get(items[0][i].itemId)
  //       if (!obj) {
  //         obj = {
  //           id: items[0][i].itemId,
  //           swap: [],
  //           bnpl: [],
  //           direct: []
  //         }
  //       }
  //       obj.direct.push({ ...items[0][i], idx: i });
  //       rejectedItems.set(items[0][i].itemId, obj);
  //     }
  //     for (var i = 0; i < items[1].length; i++) {
  //       var obj = rejectedItems.get(items[1][i].itemId)
  //       if (!obj) {
  //         obj = {
  //           id: items[1][i].itemId,
  //           swap: [],
  //           bnpl: [],
  //           direct: []
  //         }
  //       }
  //       obj.bnpl.push({ ...items[1][i], idx: i });
  //       rejectedItems.set(items[1][i].itemId, obj);
  //     }
  //     for (var i = 0; i < items[2].length; i++) {
  //       var obj = rejectedItems.get(items[2][i].itemId)
  //       if (!obj) {
  //         obj = {
  //           id: items[2][i].itemId,
  //           swap: [],
  //           bnpl: [],
  //           direct: []
  //         }
  //       }
  //       obj.swap.push({ ...items[2][i], idx: i });
  //       rejectedItems.set(items[2][i].itemId, obj);
  //     }
  //     for (let key of rejectedItems.keys()) {
  //       rejectedOffers.push(rejectedItems.get(key));
  //     }
  //     setRejectedOffers(rejectedOffers);
  //   } catch (error) {
  //     console.log(error);
  //     window.alert(error.message);
  //     window.location.reload();
  //   }
  // }

  // useEffect(() => {
  //   getRejected();
  // }, []);


  const fetchOffers = async () => {
    var _allOffers = [];
    for (let i = 0; i < listedItems.length; i++) {
      const offers = await getOffers(listedItems[i].token, listedItems[i].tokenId.toNumber());
      if (offers == null)
        continue;
      _allOffers.push({ token: listedItems[i].token, tokenId: listedItems[i].tokenId.toNumber(), owner: listedItems[i].owner, reserveOffers: Object.values(offers.reserveOffers), swapOffers: Object.values(offers.swapOffers) });
    }
    setAllOffers(_allOffers)
    console.log("allOffers", _allOffers);
  }

  useEffect(() => {
    // var count = 0;
    // for (let i = 0; i < listedItems.length; i++) {
    //   const item = listedItems[i];
    //   if (item.owner.toLowerCase() == account) {
    //     count += item.swapOffers.length + item.directSaleOffers.length + item.bnplOffers.length;
    //   }
    // }
    // setReceived(count);

    fetchOffers();

    // const timeNow = Math.floor(Date.now() / 1000);
    // count = 0;
    // for (let i = 0; i < listedItems.length; i++) {
    //   const item = listedItems[i];
    //   for (let i = 0; i < item.swapOffers.length; i++)
    //     if (item.swapOffers[i].owner.toLowerCase() == account && item.swapOffers[i].time_period > timeNow) {
    //       count++;
    //     }
    //   for (let i = 0; i < item.bnplOffers.length; i++)
    //     if (item.bnplOffers[i].owner.toLowerCase() == account && item.bnplOffers[i].time_period > timeNow) {
    //       count++;
    //     }
    // }
    // setMade(count);

  }, [listedItems])

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
    <div className={classes.root}>
      <div className={`width-100 inline-block`}>
        <div className={`action-block flex-wrap`}>
          <div className='margin-bottom-10'>
            <Button disableRipple className={`btn ${!modules[0].isSelected ? "bg-white b-grey-text bg-b-grey-border opacity-5" : "bg-primary"} margin-bottom-5 radius-10 margin-right-20`} onClick={() => updateOfferCategory(true)} variant="contained">{`Offers Received (${received})`}</Button>
            <Button disableRipple className={`btn ${!modules[1].isSelected ? "bg-white b-grey-text bg-b-grey-border opacity-5" : "bg-primary"} radius-10`} onClick={() => updateOfferCategory(false)} variant="contained">{`Offers Made (${made})`}</Button>
          </div>
          <Paper
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
          </Paper>
        </div>
        {modules[0].isSelected && <OffersReceivedView listedItems={allOffers} />}
        {modules[1].isSelected && <OffersMadeView listedItems={allOffers} rejectedOffers={(modules[1].filters[0].list[0].isSelected) ? rejectedOffers : []} />}
      </div>
    </div>
  );
}

export default OffersContainerView;