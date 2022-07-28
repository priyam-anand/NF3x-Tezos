import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import { Checkbox, FormControl, Button, Select, MenuItem, FormControlLabel, InputAdornment, OutlinedInput, Chip, Stack, Paper, InputBase, IconButton } from '@mui/material';
import SwapNowOption from './SwapNowOption';
import ReserveSwapLater from './ReserveSwapLater';
import InterestedSwap from './InterestedSwap';
import { pink } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Add, ArrowRightAlt } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { setAccount } from '../redux/web3ConfigSlice';
import { useSelector, useDispatch } from 'react-redux';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AntSwitch from '../common/AntSwitch';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import InterestedToSwapCard from './InterestedToSwapCard';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FF0083',
    '&:hover': {
      backgroundColor: alpha('#FF0083', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#FF0083',
  },
}));

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
  root: {
    display: "inline-block",
    verticalAlign: "top",
    width: "100%",
    "& .inactive": {
      cursor: 'not-allowed',
      opacity: 0.5,
      "pointer-events": "none"
    }
  },
  reserveContainer: {
    paddingBottom: "20px",
    "& .width-100": {
      "max-width": "900px",
      "margin-top": "20px"
    }
  },
  smallText: {
    color: "#777E90",
    fontSize: "16px"
  },
  swapOption: {
    "& .swap-option-btn Button": {
      // border: "1px solid #E6E8EC",
      marginRight: "20px"
    },
    "& .swap-list-item": {
      marginBottom: "40px"
    },
    "& .swap-switch": {
      margin: "10px 20px 20px 10px"

    },
    "& .option-input-field": {
      background: "#FFFFFF",
      borderRadius: "10px",
      border: "1px solid #E6E8EC !important",
      width: "300px",
      "@media (max-width: 600px)": {
        marginLeft: 0
      }
    },
    "& .add-btn": {
      borderColor: "#FF0083 !important",
      color: "#FF0083 !important",
      marginTop: "20px"
    },
    "& h2": {
      marginBottom: "5px"
    },
    "& .p-0": {
      padding: "0 20px 0 0"
    },
    "& .checkbox-section": {
      borderBottom: "1px solid #E6E8EC",
      padding: "18px 0",
      margin: 0,
      "& .accordion": {
        paddingLeft: 0
      }
    },
    "& label": {
      color: "#23262F",
      fontSize: "16px",
      fontWeight: 500,
      opacity: 0.7
    }
  }
});

function SwapOptions({ selected, setSelected, completeListing, bnplListings, setBnplListings, interestedToSwap, setInterestedToSwap, canceCreatelListing }) {

  const addOption = () => {
    setBnplListings([...bnplListings, {
      deposit: '',
      remainingAmt: '',
      duration: ''
    }]);
  }

  const removeOption = (index) => {
    const temp = [];
    var i = 0;
    while (i < bnplListings.length) {
      if (i != index)
        temp.push(bnplListings[i]);
      i++;
    }
    setBnplListings(temp)
  }

  const setDeposit = (value, index) => {
    var temp = [...bnplListings];
    temp[index].deposit = value;
    setBnplListings(temp);
  }

  const setRemainigAmt = (value, index) => {
    var temp = [...bnplListings];
    temp[index].remainingAmt = value;
    setBnplListings(temp);
  }

  const setDuration = (value, index) => {
    var temp = [...bnplListings];
    temp[index].duration = value;
    setBnplListings(temp);
  }

  const setSwapAmount = (value, index) => {
    var temp = [...interestedToSwap];
    temp[index].swapAmount = value;
    setInterestedToSwap(temp);
  }

  const setSwapToken = (value, index) => {
    var temp = [...interestedToSwap];
    temp[index].swapToken = value;
    setInterestedToSwap(temp);
  }

  const addInterestedSwap = () => {
    setInterestedToSwap([
      ...interestedToSwap,
      {
        swapAmount: '',
        swapToken: ''
      }
    ])
  }

  const removeInterestedSwap = (index) => {
    interestedToSwap.splice(index, 1);
    setInterestedToSwap([...interestedToSwap]);
  }

  const swapNowClick = () => {
    setSelected({ ...selected, sale: !selected.sale })
  }

  const reserveSwapClick = () => {
    setSelected({ ...selected, bnpl: !selected.bnpl });
  }

  const interestedToSwapClick = () => {
    setSelected({ ...selected, swap: !selected.swap })
  }

  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div className={classes.root}>
      <div className={`${classes.swapOption} ${selected && !selected.token ? 'inactive' : ''}`}>
        <h2 className="medium-weight font-16">Swap Options</h2>
        <span className={classes.smallText}>Select one or multiple Swap Options</span>

        <div className='section-block checkbox-section'>
          <Accordion className='no-shadow'>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion" onClick={swapNowClick}>
              <Checkbox className="p-0" {...label} checked={selected.sale} onChange={swapNowClick} sx={{ color: pink[800], '&.Mui-checked': { color: '#FF0083', }, }} />
              <label className="medium-weight">Swap Now</label>
            </AccordionSummary>
            <AccordionDetails>
              <SwapNowOption selected={selected} setSelected={setSelected} />
            </AccordionDetails>
          </Accordion>
        </div>

        <div className='section-block checkbox-section'>
          <Accordion className='no-shadow'>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion" onClick={reserveSwapClick}>
              <Checkbox className="p-0" {...label} checked={selected.bnpl} onChange={reserveSwapClick} sx={{ color: pink[800], '&.Mui-checked': { color: '#FF0083', }, }} />
              <label>Reserve and Swap Later</label>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.reserveContainer}>
                {
                  bnplListings.map((listing, index) => {
                    if (index > 0) {
                      return <React.Fragment key={index}>
                        <div className='inline-flex-row width-100'>
                          <span className='black-text font-bold-16'>OR</span>
                        </div>
                        <ReserveSwapLater listing={listing} index={index} removeOption={removeOption} setDeposit={setDeposit} setRemainigAmt={setRemainigAmt} setDuration={setDuration} />
                      </React.Fragment>
                    }
                    return <ReserveSwapLater key={index} listing={listing} index={index} removeOption={removeOption} setDeposit={setDeposit} setRemainigAmt={setRemainigAmt} setDuration={setDuration} />
                  })
                }
                {
                  bnplListings.length < 2 ? <div className='button-block inline-flex align-center'>
                    <Button disableRipple startIcon={<Add />} className={"btn bg-white primary-text primary-border"} sx={{ marginTop: "27px" }} variant="outlined" onClick={addOption}>Add Another Option</Button>
                  </div> : null
                }

              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className='section-block checkbox-section'>
          <Accordion className='no-shadow'>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion" onClick={interestedToSwapClick}>
              <Checkbox className="p-0" {...label} checked={selected.swap} onChange={interestedToSwapClick} sx={{ color: pink[800], '&.Mui-checked': { color: '#FF0083', }, }} />
              <label>Interested to Swap for</label>
            </AccordionSummary>
            <AccordionDetails>
              {interestedToSwap.map((item, index) => <>
                {index > 0 &&
                  <div className='inline-flex-row width-50'>
                    <span className='black-text font-bold-16'>OR</span>
                  </div>
                }
                <InterestedToSwapCard index={index} setSwapAmount={setSwapAmount} setSwapToken={setSwapToken} removeInterestedSwap={removeInterestedSwap} key={index} item={item} />
              </>
              )}
              {
                interestedToSwap.length < 2 ? <div className='button-block inline-flex align-center'>
                  <Button disableRipple startIcon={<Add />} className={"btn bg-white primary-text primary-border"} sx={{ marginTop: "19px" }} variant="outlined" onClick={addInterestedSwap}>Add Another Option</Button>
                </div> : null
              }

            </AccordionDetails>
          </Accordion>
        </div>

        <div className='section-block checkbox-section no-border'>
          <div>
            <Accordion defaultExpanded className='no-shadow'>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion">
                <div>
                  <label>Listing Duration</label>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className={`margin-top-20`}>
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
                      inputProps={{ min: 0, 'aria-label': 'search google maps' }}
                      value={selected.timePeriod}
                      onChange={(e) => { setSelected({ ...selected, timePeriod: e.target.value }) }}
                    />
                    <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                      Days
                    </IconButton>
                  </Paper>
                  {/* <FormControl sx={{ m: 1, minWidth: 200, marginLeft: 0 }}>
                <Select
                  className='option-input-field'
                  value={selected.timePeriod}
                  onChange={(e) => { setSelected({ ...selected, timePeriod: e.target.value }) }}
                  displayEmpty
                  sx={{ height: "57px", width: "300px"}}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value={1}>1 Day</MenuItem>
                  <MenuItem value={3}>3 Days</MenuItem>
                  <MenuItem value={5}>5 Days</MenuItem>
                  <MenuItem value={10}>10 Days</MenuItem>
                </Select>
              </FormControl> */}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        <div className='section-block swap-option-btn' style={{ maxWidth: "900px" }}>
          <Button disableRipple className={"btn bg-primary white-text"} endIcon={<ArrowRightAlt />} variant="contained" onClick={completeListing}>Complete listing</Button>
          <Button disableRipple className={"btn bg-white text-capitalize old3-text old3-border"} variant="outlined" onClick={canceCreatelListing}>Cancel</Button>
          <label className='float-right block-elem' style={{ marginTop: '12px' }}>
            Auto saving
            <Box sx={{ display: 'inline-block', marginLeft: "5px" }}>
              <CircularProgress sx={{ width: "15px !important", height: "15px !important", verticalAlign: "top", marginTop: "5px" }} />
            </Box>
          </label>
          <div style={{ color: "#777E90", marginLeft: "15px", fontSize: "12px", marginTop: "17px" }}>Platform swap fee 0.05Eth</div>
        </div>

      </div>
    </div >
  );
}

export default SwapOptions;