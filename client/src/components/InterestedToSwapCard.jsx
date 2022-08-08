import React from 'react';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Chip, InputAdornment, OutlinedInput } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import Util from '../common/Util';
import { getTezLogo } from '../utils';
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png";

const useStyles = makeStyles({
    interestedToSwapCard: {
        "background": "#FFFFFF",
        "border-radius": "10px",
        "padding": "15px 10px",
        "width": "fit-content",
        "margin-top": "10px",
        "margin-bottom": "10px",
        "margin-left": "5px",
        // "& .swap-close":{
        //     display: "none"
        // },
        // "&:hover .swap-close":{
        //     display: "inline-flex"
        // },
        "& :first-child": {
            marginTop: 0
        },
        "@media (max-width: 600px)": {
            "width": "90%"
        },
        "& .heading": {
            "font-size": "14px",
            "line-height": "18px",
            color: "#878D9D"
        },
        "& .select-token": {
            maxWidth: "261px",
            "border-radius": "10px !important",
            "height": "46px",
            marginTop: "15px"
        },
        "& .mt-27": {
            marginTop: "27px"
        },
        "& .bundleCardCtn": {
            display: "flex",
            "& :last-child": {
                marginRight: 0
            },
            "@media (max-width: 600px)": {
                "flex-direction": "column"
            },
            "& .bundleCard": {
                padding: "10px",
                background: "#F7F8F9",
                display: "flex",
                marginTop: "10px",
                marginRight: "23px",
                borderRadius: "10px",
                height: "40px",
                width: "fit-content",
                "& .display-flex": {
                    height: "18px"
                },
                "& p": {
                    color: "#23262F",
                    "font-size": "14px",
                    "max-width": "134px",
                    "white-space": "nowrap",
                    "overflow": "hidden",
                    "text-overflow": "ellipsis",
                    margin: "0"
                },
                "& .sub-text": {
                    "font-size": "14px",
                    "color": "#878D9D",
                    "line-height": "18px"
                },
                "& img": {
                    width: "40px",
                    height: "40px",
                    borderRadius: "5px",
                    marginRight: "8px"
                },
                "& .icon": {
                    color: "#FF0083",
                    position: "relative",
                    cursor: "pointer",
                    top: "-5px",
                    fontSize: "22px"
                }
            }
        },
        "& .option-input-field": {
            margin: "0",
            "@media (max-width: 600px)": {
                "margin": "8px"
            },
        },
        "& .swap-input": {
            width: 215
        }
    }
});

const InterestedToSwapCard = ({ index, setSwapAmount, setSwapToken, removeInterestedSwap, key, item }) => {
    const classes = useStyles();
    const collections = [
        { title: 'Ottez' },
        { title: 'Tezzardz' },
        { title: 'Neonz' },
        { title: 'Ziggurats' },
        { title: 'Prjktneon' },
        { title: 'GOGOs' }
    ];
    const flatProps = {
        options: collections.map((option) => option.title),
    };
    return <div className={classes.interestedToSwapCard}>
        <div className='flex-justify align-center'>
            <Autocomplete
                sx={{ ml: 1, flex: 1, color: "#B0B7C3" }}
                placeholder="Choose Collection"
                noOptionsText="No result found"
                {...flatProps}
                id="flat-demo"
                freeSolo
                className="swap-input"
                value={item.swapToken}
                onChange={(event, value) => {
                    setSwapToken(value, index);
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
            <span style={{ margin: "0 15px 0 15px" }} className="black-text font-14 semibold-weight">+</span>
            <OutlinedInput
                onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
                id="outlined-adornment-weight"
                value={item.swapAmount}
                type="text"
                InputProps={{ min: 0 }}
                className='option-input-field'
                onChange={(e) => setSwapAmount(e.target.value, index)}
                placeholder="Enter Amount"
                sx={{ width: "200px !important", height: "57px", color: "#23262F", background: "#ffffff" }}
                startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={getTezLogo()} /></InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                    'aria-label': 'weight',
                }}
            />
            {index > 0 && <Chip className='radius-50-cent pointer swap-close' sx={{ padding: "17px 0px 12px 0px", marginLeft: "10px", "& > span": { paddingLeft: "9px", paddingRight: "9px" } }} label={<CloseIcon sx={{ fontSize: "16px" }} />} onClick={e => removeInterestedSwap(index)} />}
        </div>
    </div>
}

export default InterestedToSwapCard;