import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { IconButton, InputAdornment, InputBase, OutlinedInput, Paper } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Search } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Chip } from '@mui/material';
import Util from '../../common/Util';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
    root: {
        background: "#F7F8F9",
        borderRadius: "15px",
        maxWidth: "900px",
        padding: "10px 10px 10px 10px",
        color: "#23262F",
        "& label": {
            marginTop: "20px",
        },
        "& .flex-justify > div:first-child": {
            marginLeft: 0
        },
        "& .option-input-field": {
            borderRadius: "15px",
        },
        "& .swap-within": {
            // marginLeft: "10px !important"
        },
        "& .bundle-list": {
            maxHeight: "200px",
            overflow: "auto",
            "&:first-child": {
                marginLeft: 0
            }
        },
        "& .section-image-block": {
            maxWidth: "calc(50% - 20px)",
            margin: "8px"
        },
        "& .section-image-desc": {
            width: "calc(100% - 80px)"
        }
    },
    swapCalculation: {
        marginTop: "15px",
        "& > div": {
            width: "calc(40% - 50px)",
            marginRight: "10px",
            marginLeft: "10px",
            "& label": {
                width: "100%",
            },
            "& .option-input-field": {
                width: "100%",
                marginLeft: "0"
            }
        },
        "& > div:last-child": {
            width: "calc(20% - 50px)",
        }
    }
});

function EditInterestedSwap({ index, listing, setToken, setAmount, removeInterestedSwap }) {
    const classes = useStyles();
    return (
        <div className={`${classes.root} bg-white `}>
            {/* <label className='font-bold-14 b-grey-text'>Search and select connections to swap for</label>
            <div className={`flex-justify`}>
                <OutlinedInput
                    onInput={(e)=> e.target.value = Util.allowNumeric(e.target.value)}
                    id="outlined-adornment-weight"
                    value={''}
                    className='option-input-field bg-white outline-border t2-text'
                    onChange={e => { }}
                    placeholder="Select Token"
                    sx={{ width: "188px", height: "57px", margin: "8px", color: "#23262F", background: "#ffffff" }}
                    startAdornment={<InputAdornment position="start" ><Search /></InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        'aria-label': 'weight',
                    }}
                />
            </div>
            <label className='font-bold-14 b-grey-text inline-block'>Selected Bundles</label>
            <div className={`bundle-list`}>
                <div className='bundle-item relative section-image-block inline-block width-50 bg-light radius-10 padding-10'>
                    <img src={"./img/azuki.png"} />
                    <div className='section-image-desc'>
                        <span className='t2-text font-14'>Mutant Ape Yacht</span>
                        <span className='b-grey-text font-14'>Any</span>
                    </div>
                    <CloseOutlinedIcon className='absolute primary-text' sx={{ top: "5px", right: "5px", fontSize: "17px" }} />
                </div>
                <div className='bundle-item relative section-image-block inline-block width-50 bg-light radius-10 padding-10'>
                    <img src={"./img/azuki.png"} />
                    <div className='section-image-desc'>
                        <span className='t2-text font-14'>Mutant Ape Yacht</span>
                        <span className='b-grey-text font-14'>Any</span>
                    </div>
                    <CloseOutlinedIcon className='absolute primary-text' sx={{ top: "5px", right: "5px", fontSize: "17px" }} />
                </div>
                <div className='bundle-item relative section-image-block inline-block width-50 bg-light radius-10 padding-10'>
                    <img src={"./img/azuki.png"} />
                    <div className='section-image-desc'>
                        <span className='t2-text font-14'>Mutant Ape Yacht</span>
                        <span className='b-grey-text font-14'>Any</span>
                    </div>
                    <CloseOutlinedIcon className='absolute primary-text' sx={{ top: "5px", right: "5px", fontSize: "17px" }} />
                </div>
                <div className='bundle-item relative section-image-block inline-block width-50 bg-light radius-10 padding-10'>
                    <img src={"./img/azuki.png"} />
                    <div className='section-image-desc'>
                        <span className='t2-text font-14'>Mutant Ape Yacht</span>
                        <span className='b-grey-text font-14'>Any</span>
                    </div>
                    <CloseOutlinedIcon className='absolute primary-text' sx={{ top: "5px", right: "5px", fontSize: "17px" }} />
                </div>
            </div> */}

            <div className={`section-block margin-tb-10 swap-within`}>
                <div className='inline-block'>
                    <div className={`flex-justify`}>
                        <FormControl sx={{ m: 1, width: 188 }}>
                            <Select
                                className='option-input-field bg-white outline-border t2-text'
                                value={listing.swapToken}
                                onChange={(e) => { setToken(e.target.value, index) }}
                                displayEmpty
                                sx={{ height: "57px", color: "#23262F" }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={"Bored Apes"}>Bored Apes</MenuItem>
                                <MenuItem value={'Noodles'}>Noodle</MenuItem>
                                <MenuItem value={'Azuki'}>Azuki</MenuItem>
                                <MenuItem value={'WVRP'}>WVRP</MenuItem>
                                <MenuItem value={'Mooncats'}>Mooncats</MenuItem>
                                <MenuItem value={'World of Women'}>World of Women</MenuItem>
                                <MenuItem value={'Doodles'}>Doodles</MenuItem>
                            </Select>
                        </FormControl>
                        <OutlinedInput
                            onInput={(e)=> e.target.value = Util.allowNumeric(e.target.value)}
                            id="outlined-adornment-weight"
                            value={listing.swapAmount}
                            type="text"
                            InputProps={{ min: 0 }}
                            className='option-input-field bg-white outline-border t2-text'
                            onChange={(e) => { setAmount(e.target.value, index) }}
                            placeholder="Enter Amount"
                            sx={{ width: "188px", height: "57px", margin: "8px", color: "#23262F", background: "#ffffff" }}
                            startAdornment={<InputAdornment position="start" ><img className='outline-right-border input-img eth-img' src='../img/ethereum.png' /></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                        />
                        {index > 0 ? <Chip className='radius-50-cent pointer swap-close' sx={{ padding: "17px 0px 12px 0px", marginTop: "20px", marginLeft: "10px", "& > span": { paddingLeft: "9px", paddingRight: "9px" } }} label={<CloseIcon sx={{ fontSize: "16px" }} />} onClick={e => removeInterestedSwap(index)} /> : null}
                    </div>
                    {/* <div>
                        <FormControl sx={{ marginTop: "10px" }}>
                            <Select
                                className='option-input-field bg-white outline-border t2-text font-14'
                                value={selected.duration}
                                onChange={(e) => setSelected({ ...selected, duration: (e?.target?.value && parseInt(e.target.value)) ?? 0 })}
                                displayEmpty
                                sx={{ height: "57px", width: "188px" }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="1">1 Day</MenuItem>
                                <MenuItem value="2">2 Days</MenuItem>
                                <MenuItem value="3">3 Days</MenuItem>
                                <MenuItem value="4">4 Days</MenuItem>
                                <MenuItem value="5">5 Days</MenuItem>
                            </Select>
                        </FormControl>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default EditInterestedSwap;