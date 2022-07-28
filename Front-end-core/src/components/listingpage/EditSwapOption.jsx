import { makeStyles } from '@mui/styles';
import { Checkbox, FormControl, Button, Select, MenuItem, FormControlLabel, InputAdornment, OutlinedInput, Paper, InputBase, IconButton } from '@mui/material';
import EditSwapNowOption from './EditSwapNowOption';
import ReserveSwapLater from './EditReserveSwapLater';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditInterestedSwap from './EditInterestedSwap';
import { pink } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Add, ArrowRightAlt } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState } from 'react';

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
  root: {
    display: "inline-block",
    verticalAlign: "top",
    padding: "50px 50px 50px 50px",
    "& .create-swap-sort": {
      background: "#ffffff",
      color: "#B0B7C3",
      padding: "7.5px 20px 7.5px 10px"
    },
    "& .button-block": {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "25px"
    }
  },
  swapTitle: {
    display: "flex",
    justifyContent: "space-between"
  },
  reserveContainer: {
    paddingBottom: "20px"
  },
  smallText: {
    color: "#A5A7AA",
    fontSize: "14px"
  },
  swapOption: {
    "& .swap-accordion:last-child": {
      border: "none !important"
    },
    "& .swap-option-btn Button": {
      border: "1px solid #E6E8EC",
      marginRight: "20px"
    },
    "& .swap-list-item": {
      marginBottom: "40px"
    },
    "& .swap-switch": {
      margin: "10px 20px 20px 10px"

    },
  },
  dropdown: {
    height: "55px",
    paddingLeft: "10px",
    "& > fieldset": {
      border: "none"
    }
  },
});

function EditSwapOption({ selected, setSelected, completeEditListing, onClose, bnplListings, setBnplListings, interestedToSwap, setInterestedToSwap }) {
  const classes = useStyles();

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

  const addSwapOption = () => {
    setInterestedToSwap([...interestedToSwap, {
      swapAmount: '',
      swapToken: 'Bored Apes'
    }]);
  }

  const removeInterestedSwap = (index) => {
    interestedToSwap.splice(index, 1);
    setInterestedToSwap([...interestedToSwap]);
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

  const setToken = (value, index) => {
    var temp = [...interestedToSwap];
    temp[index].swapToken = value;
    setInterestedToSwap(temp);
  }

  const setAmount = (value, index) => {
    var temp = [...interestedToSwap];
    temp[index].swapAmount = value;
    setInterestedToSwap(temp);
  }

  return (
    <div className={classes.root}>
      <div className={`${classes.swapOption}`}>
        <div className={classes.swapTitle}>
          <span className='font-bold-20'>Swap Options</span>
          <CloseOutlinedIcon className='pointer' onClick={onClose} />
        </div>

        <Accordion className={`swap-accordion bg-transparent no-shadow no-border outline-bottom-border`} expanded={selected.sale}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
            sx={{ padding: 0, "& > div:first-child": { alignItems: "center", "& > label": {marginLeft: 0} } }}
          >
            <FormControlLabel control={<Checkbox {...label} checked={selected.sale} className="primary-text" onChange={e => setSelected({ ...selected, sale: !selected.sale })} sx={{ fontSize: "22px", paddingLeft: "0", color: pink[800], '&.Mui-checked': { color: pink[600], }, }} />} label={<Typography sx={{ flexShrink: 0 }}><span className={`font-16 t2-text ${!selected.sale && "opacity-4"}`}>Swap Now</span></Typography>} />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {<EditSwapNowOption selected={selected} setSelected={setSelected} />}
          </AccordionDetails>
        </Accordion>

        <Accordion className={`swap-accordion bg-transparent no-shadow no-border outline-bottom-border`} expanded={selected.bnpl}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
            sx={{ padding: 0, "& > div:first-child": { alignItems: "center", "& > label": {marginLeft: 0}  } }}
          >
            <FormControlLabel control={<Checkbox {...label} checked={selected.bnpl} className="primary-text" onChange={e => setSelected({ ...selected, bnpl: !selected.bnpl })} sx={{ fontSize: "22px", paddingLeft: "0", color: pink[800], '&.Mui-checked': { color: pink[600], }, }} />} label={<Typography sx={{ flexShrink: 0 }}><span className={`font-16 t2-text ${!selected.bnpl && "opacity-4"}`}>Reserve and Swap Later</span></Typography>} />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {<div className={classes.reserveContainer}>
              {
                bnplListings.map((listing, index) => {
                  if (index > 0) {
                    return <>
                      <div className='inline-flex-row width-100 margin-tb-10'>
                        <span className='primary-text font-14'>OR</span>
                      </div>
                      <ReserveSwapLater listing={listing} index={index} removeOption={removeOption} setDeposit={setDeposit} setRemainigAmt={setRemainigAmt} setDuration={setDuration} />
                    </>
                  }
                  return <ReserveSwapLater listing={listing} index={index} removeOption={removeOption} setDeposit={setDeposit} setRemainigAmt={setRemainigAmt} setDuration={setDuration} />
                })
              }
              {
                bnplListings.length < 2 ? <div className='button-block'>
                  <Button disableRipple startIcon={<Add />} className={"btn bg-white primary-text primary-border"} variant="outlined" onClick={addOption}>Add Another Option</Button>
                </div> : null
              }

            </div>}
          </AccordionDetails>
        </Accordion>

        <Accordion className={`swap-accordion bg-transparent no-shadow no-border outline-bottom-border`} expanded={selected.swap}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
            sx={{ padding: 0, "& > div:first-child": { alignItems: "center", "& > label": {marginLeft: 0} } }}
          >
            <FormControlLabel control={<Checkbox {...label} checked={selected.swap} className="primary-text" onChange={e => setSelected({ ...selected, swap: !selected.swap })} sx={{ fontSize: "22px", paddingLeft: "0", color: pink[800], '&.Mui-checked': { color: pink[600], }, }} />} label={<Typography sx={{ flexShrink: 0 }}><span className={`font-16 t2-text ${!selected.swap && "opacity-4"}`}>Interested to swap for</span></Typography>}/>
            
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <div className={classes.reserveContainer}>
            {
              interestedToSwap.map((listing, index) => {
                return <>
                  {
                    index > 0 ? <div className='inline-flex-row width-100 margin-tb-10'>
                      <span className='primary-text font-14'>OR</span>
                    </div> : null
                  }
                  <EditInterestedSwap index={index} listing={listing} setToken={setToken} setAmount={setAmount} removeInterestedSwap={removeInterestedSwap} />
                </>
              })
            }
            {
              interestedToSwap.length < 2 ? <div className='button-block'>
                <Button disableRipple startIcon={<Add />} className={"btn bg-white primary-text primary-border"} variant="outlined" onClick={addSwapOption}>Add Another Option</Button>
              </div> : null
            }
            </div>
          </AccordionDetails>
        </Accordion>

        <div className={`section-block margin-tb-10 width-100 float-left`}>
          <div className={`section-block margin-tb-10 width-100 float-left`}>
            <span>Listing Duration</span>
          </div>
          <div className={`section-block margin-tb-10`}>
              {/* <span><AccessTimeIcon sx={{ fontSize: "28px", verticalAlign: "middle", borderRight: "1px solid #E6E8EC" }} /></span> */}
              <Paper
                component="form"
                className={"outline-border radius-10"}
                sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200, color: "#23262F" }}
              >
                <InputBase
                  onInput={(e)=> e.target.value = Math.abs(e.target.value)}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="0"
                  type="number"
                  inputProps={{ min: 0, 'aria-label': 'search google maps' }}
                  value={selected.timePeriod}
                  onChange={(e) => setSelected({ ...selected, timePeriod: e.target.value })}
                />
                <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                  Days
                </IconButton>
              </Paper>
              {/* <Select
                className={`${classes.dropdown} dropdown-home`}
                value={selected.timePeriod}
                onChange={(e) => { setSelected({ ...selected, timePeriod: e.target.value }) }}
                displayEmpty
                sx={{ height: "40px", background: "#ffffff" }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={3}>3 Days</MenuItem>
                <MenuItem value={5}>5 Days</MenuItem>
                <MenuItem value={10}>10 Days</MenuItem>
              </Select> */}
          </div>
        </div>

        <div className={`section-block float-right margin-tb-10`}>
          <Button disableRipple className="btn bg-primary white-text white-border" variant='contained' onClick={completeEditListing}>Save</Button>
        </div>
      </div>
    </div >
  );
}

export default EditSwapOption;