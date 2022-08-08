import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { IconButton, InputAdornment, InputBase, OutlinedInput, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import Util from '../common/Util';
import { getTezLogo } from "../utils"
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        borderRadius: "10px",
        maxWidth: "900px",
        padding: "10px 20px",
        marginTop: "20px",
        color: "#23262F",
        background: "#FFFFFF",
        marginLeft: "5px",
        "box-shadow": "0px 4px 30px rgba(37, 97, 186, 0.1)",
        "@media (max-width: 600px)": {
            "width": "84%"
        },
        "& .option-input-field": {
            background: "#FFFFFF",
            border: "1px solid #E6E8EC !important",
            borderRadius: "10px",
            width: "300px"
        },
        "& .swap-within": {
            marginLeft: "10px !important"
        }
    },
    swapCalculation: {
        marginTop: "15px",
        "& > span": {
            margin: "0 10px",
            fontSize: "16px"
        },
        "& h1": {
            fontSize: "40px",
            marginTop: "0"
        },
        "& > div": {
            width: "calc(40% - 50px)",
            marginRight: "10px",
            marginLeft: "10px",
            "@media (max-width: 600px)": {
                width: "100%",
                display: "block"
            },
            "& label": {
                width: "100%",
                fontSize: "14px",
                color: "#878D9D",
                fontWeight: 600,
                opacity: 1
            },
            "& .option-input-field": {
                width: "100%",
                margin: "11px 0",
                border: "1px solid #E6E8EC !important",
                borderRadius: "10px",
            },
        },
        "& .total": {
            color: '#FF0083',
            "& label": {
                color: '#FF0083'
            },
            "& h1": {
                fontSize: "16px",
                "font-weight": "500"
            }
        },
        "& > div:last-child": {
            width: "calc(20% - 50px)",
        }
    }
});

function SwapNowOption({ listing, index, removeOption, setDeposit, setRemainigAmt, setDuration }) {

    const classes = useStyles();
    return (
        <div className={`${classes.root} relative`}>
            {index !== 0 && <CloseIcon className="pointer" sx={{ position: "absolute", top: "25px", right: "25px" }} onClick={e => removeOption(index)} />}
            <div className={`section-block margin-tb-10`}>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <Select
                        className='option-input-field'
                        value={""}
                        onChange={() => { }}
                        displayEmpty
                        sx={{ height: "57px", width: "300px", color: "#23262F" }}
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="">
                            XTZ
                        </MenuItem>
                    </Select>
                </FormControl>

            </div>
            <div className={classes.swapCalculation}>
                <div className='inline-block'>
                    <label>Deposit</label>
                    <OutlinedInput
                        onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                        id="outlined-adornment-weight"
                        value={listing.deposit}
                        className='option-input-field'
                        type="text"
                        InputProps={{ min: 0 }}
                        onChange={e => setDeposit(e.target.value, index)}
                        placeholder="Enter Amount"
                        sx={{ width: "200px", height: "57px", margin: "8px", color: "#23262F", background: "#ffffff" }}
                        startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={TezLogo} /></InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                </div>
                <span>+</span>
                <div className='inline-block'>
                    <label>Swap Later</label>
                    <OutlinedInput
                        onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                        id="outlined-adornment-weight"
                        value={listing.remainingAmt}
                        type="text"
                        InputProps={{ min: 0 }}
                        className='option-input-field'
                        onChange={e => setRemainigAmt(e.target.value, index)}
                        placeholder="Enter Amount"
                        sx={{ width: "200px", height: "57px", margin: "8px", color: "#23262F", background: "#ffffff" }}
                        startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={TezLogo} /></InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                </div>
                <span>=</span>
                <div className='total inline-block'>
                    <label className="font-bold-16">Total</label>
                    <h1>{Number(listing.deposit) + Number(listing.remainingAmt)}E</h1>
                </div>
            </div>
            <div className={`section-block margin-tb-10 swap-within`}>
                <div className='inline-block'>
                    <label>Swap within</label>
                    <Paper
                        component="form"
                        className={"input-text"}
                        sx={{ p: '2px 4px', height: "57px", display: 'flex', boxShadow: "none !important", marginTop: "10px", alignItems: 'center', width: 200 }}
                    >
                        <InputBase
                            onInput={(e) => e.target.value = Math.abs(e.target.value)}
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="0"
                            type="number"
                            InputProps={{ min: 0 }}
                            value={listing.duration}
                            onChange={e => setDuration(e.target.value, index)}
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                            Days
                        </IconButton>
                    </Paper>
                </div>
            </div>

        </div>
    );
}

export default SwapNowOption;