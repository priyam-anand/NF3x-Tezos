import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Autocomplete, IconButton, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ListingCard from '../ListingCard';
import PositionListingCard from '../PositionListingCard';
import { useSelector } from "react-redux";
import Addresses from "../../contracts/Contracts.json";

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

  const { account } = useSelector((state) => state.tezosConfig);
  const [activeListing, setActiveListing] = useState([]);
  const [inactiveListing, setInactiveListing] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [filter, setFilter] = useState('');

  const onHandleSelectedItem = (e, data) => {

  }

  const filtered = (token) => {
    if (filter == '' || filter == null)
      return true;
    if (Addresses.nameToAddress[filter] == token.token.toLowerCase())
      return true;
    return false;
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
              <label className='black-text font-16 medium-weight margin-top-10'>{`Active Listing`}</label>
            </div>

            <div className={`list-main-cards width-100`}>
              {activeListing.map((item, index) => {
                if (item.token != Addresses.PositionToken)
                  return <ListingCard isEditable={false} isActive={selectedItem.index === index} key={index} itemIndex={index} onHandleSelectedItem={onHandleSelectedItem} item={item} />;
                else {
                  return <PositionListingCard isEditable={false} isActive={selectedItem.index === index} key={index} itemIndex={index} onHandleSelectedItem={onHandleSelectedItem} item={item} />
                }
              })}
            </div>
          </div>}
          {filters[1].isSelected && <div>
            <div className={`action-block flex-wrap`}>
              <label className='black-text font-16 medium-weight margin-bottom-10'>{`Inactive Listing`}</label>
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
                return <ListingCard isEditable={false} isCustomLabel={true} isActive={selectedItem.index === index} key={index} itemIndex={index} onHandleSelectedItem={onHandleSelectedItem} item={item} />;
              })}
            </div>
          </div>}
        </div>
        }
      </div>
    </>
  );
}

export default MyListingView;