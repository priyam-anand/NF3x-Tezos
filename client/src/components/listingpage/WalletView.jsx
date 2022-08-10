import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Autocomplete, IconButton, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WalletViewCard from './WalletViewCard';
import PopupCardDetail from '../PopupCardDetail';

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
  ];
  const flatProps = {
    options: collections.map((option) => option.title),
  };

  return (
    <div className={classes.root}>
      <div className={`action-block flex-wrap`}>
        <label className='black-text font-16 medium-weight desktop-sm-block margin-bottom-10'>{`Total Items`}</label>
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
    </div>
  );
}

export default WalletView;