import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { InputAdornment, OutlinedInput } from '@mui/material';
import Util from '../../common/Util';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
  root: {
    padding: "10px 0",
    "& .option-input-field": {
      borderRadius: "15px",
      marginLeft: 0
    }
  }
});

function EditSwapNowOption({ selected, setSelected }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={``}>
        <div className={`flex-justify`}>
          <FormControl sx={{ m: 1, width: 188 }}>
            <Select
              className='option-input-field bg-white outline-border t2-text'
              value={""}
              onChange={() => { }}
              displayEmpty
              sx={{ height: "57px", color: "#23262F" }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                ETH
              </MenuItem>
            </Select>
          </FormControl>
          <OutlinedInput
            onInput={(e)=> e.target.value = Util.allowNumeric(e.target.value)}
            id="outlined-adornment-weight"
            value={selected.directSalePrice}
            className='option-input-field bg-white outline-border t2-text'
            onChange={(e) => { setSelected({ ...selected, directSalePrice: [e.target.value] }) }}
            placeholder="Enter Amount"
            type="text"
            InputProps={{  min: "0.01", step:"0.01", pattern:"\d+" } }
            sx={{ width: "188px", height: "57px", margin: "8px", color: "#23262F", background: "#ffffff" }}
            startAdornment={<InputAdornment position="start" ><img className='outline-right-border input-img eth-img' src='../img/ethereum.png'/></InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditSwapNowOption;