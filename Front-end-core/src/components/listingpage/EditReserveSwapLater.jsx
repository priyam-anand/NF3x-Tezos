import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { IconButton, InputAdornment, InputBase, OutlinedInput, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Util from '../../common/Util';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
    root: {
        background: "#F7F8F9",
        borderRadius: "15px",
        maxWidth: "900px",
        padding: "10px 10px 10px 10px",
        color: "#23262F",
        "& .option-input-field": {
            borderRadius: "15px",
        },
        "& .swap-within": {
            marginLeft: "10px !important"
        }
    },
    swapCalculation: {
        marginTop: "15px",
        "& > div": {
            width: "calc(40% - 15px)",
            marginRight: "10px",
            marginLeft: "10px",
            "& label": {
                width: "100%",
                fontSize: "16px"
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

function EditReserveSwapLater({ listing, index, removeOption, setDeposit, setRemainigAmt, setDuration }) {
    const classes = useStyles();
    return (
        <div className={`${classes.root} bg-white relative`}>
            {index > 0 && <CloseIcon className="pointer" sx={{ position: "absolute", top: "25px", right: "25px" }} onClick={e => removeOption(index)} />}
            <div className={``}>
                <FormControl sx={{ m: 1 }}>
                    <Select
                        className='option-input-field bg-white outline-border t2-text'
                        value={""}
                        onChange={() => { }}
                        displayEmpty
                        sx={{ height: "57px", width: "188px" }}
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="">
                            ETH
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className={classes.swapCalculation}>
                <div className='inline-block'>
                    <label className='b-grey-text font-bold-16'>Deposit</label>
                    <OutlinedInput
                        onInput={(e)=> e.target.value = Util.allowNumeric(e.target.value)}
                        id="outlined-adornment-weight"
                        value={listing.deposit}
                        type="text"
                        InputProps={{  min: 0 } }
                        className='option-input-field bg-white outline-border t2-text font-14'
                        onChange={(e) => setDeposit(e.target.value, index)}
                        placeholder="Enter Amount"
                        sx={{ width: "188px", height: "57px", margin: "8px" }}
                        startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src='../img/ethereum.png' /></InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                </div>
                <span>+</span>
                <div className='inline-block'>
                    <label className='b-grey-text font-bold-16'>Swap Later</label>
                    <OutlinedInput
                        onInput={(e)=> e.target.value = Util.allowNumeric(e.target.value)}
                        id="outlined-adornment-weight"
                        value={listing.remainingAmt}
                        type="text"
                        InputProps={{  min: 0 } }
                        className='option-input-field bg-white outline-border t2-text font-14'
                        onChange={e => setRemainigAmt(e.target.value, index)}
                        placeholder="Enter Amount"
                        sx={{ width: "188px", height: "57px", margin: "8px" }}
                        startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src='../img/ethereum.png' /></InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                </div>
                <div className='inline-flex-row'>
                    <label className='primary-text font-bold-16'>Total</label>
                    <span className='primary-text font-16'>{Number(listing.deposit) + Number(listing.remainingAmt)}E</span>
                </div>
            </div>
            <div className={`section-block margin-tb-10 swap-within`}>
                <div className='inline-block'>
                    <label className='b-grey-text font-bold-16'>Swap within</label>
                    <div>
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
                                value={listing.duration}
                                onChange={(e) => setDuration(e.target.value, index)}
                            />
                            <IconButton disableRipple sx={{ p: '10px', fontSize: "16px", color: '#B0B7C3' }} aria-label="search">
                                Days
                            </IconButton>
                        </Paper>
                        {/* <FormControl sx={{ marginTop: "10px" }}>
                            <Select
                                className='option-input-field bg-white outline-border t2-text font-14'
                                value={listing.duration}
                                onChange={e => setDuration(e.target.value, index)}
                                displayEmpty
                                sx={{ height: "57px", width: "188px" }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="5">5 Day</MenuItem>
                                <MenuItem value="7">7 Days</MenuItem>
                                <MenuItem value="10">10 Days</MenuItem>
                                <MenuItem value="15">15 Days</MenuItem>
                                <MenuItem value="20">20 Days</MenuItem>
                            </Select>
                        </FormControl> */}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default EditReserveSwapLater;