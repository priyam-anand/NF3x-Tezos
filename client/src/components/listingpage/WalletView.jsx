import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Autocomplete, IconButton, InputBase, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WalletViewCard from './WalletViewCard';
import PopupCardDetail from '../PopupCardDetail';
import PopupPrompt from '../PopupPrompt';
import Addresses from "../../contracts/Addresses.json";

const useStyles = makeStyles({
  root: {
    width: '100%',
    "& .list-main-cards > div": {
      marginBottom: "35px"
    }
  }
});



function WalletView({
  available
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [popupToken, setPopupToken] = useState({
    metadata: { displayUri: '', attributes: [{ name: '', value: '' }] },
    contract: { address: '' },
    tokenId: '',
    name: ''
  });
  const [filter, setFilter] = useState('');
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

  const filtered = (token) => {
    if (filter == '' || filter == null)
      return true;
    if (Addresses.nameToAddress[filter] == token.asset_contract.address)
      return true;
    return false
  }

  const calcLen = () => {
    var count = 0;
    for (let i = 0; i < available.length; i++)
      if (filtered(available[i]))
        count++;
    return count;
  }

  return (
    <div className={classes.root}>
      <div className={`action-block flex-wrap`}>
        <label className='black-text font-16 medium-weight desktop-sm-block margin-bottom-10'>{`Total Items (${calcLen()})`}</label>
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
            value={filter}
            onChange={(event, value) => {
              // setSearchResult(value);
              setFilter(value);
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

      <div className={`list-main-cards`}>
        {
          available.map((item) => {
            // if (filtered(item))
            return <WalletViewCard onClickView={setOpen} token={item} setPopupToken={setPopupToken} />
          })
        }
      </div>
      <PopupCardDetail isOpen={open} onClickView={setOpen} popupToken={popupToken} />
      {/* <PopupPrompt isOpen={open} onClickNo={setOpen} onClickYes={setOpen} titleContent={"Are you sure you  want to log out?"}/> */}
    </div>
  );
}

export default WalletView;