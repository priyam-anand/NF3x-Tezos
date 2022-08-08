import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { InputAdornment, OutlinedInput } from '@mui/material';
import Util from '../common/Util';
import { getTezLogo } from '../utils';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
  root: {
    "& .option-input-field": {
      background: "#FFFFFF",
      border: "1px solid #E6E8EC !important",
      borderRadius: "10px",
      width: "300px",
      "@media (max-width: 600px)": {
        margin: "2px 0 !important"
      }
    }
  }
});

function SwapNowOption({ selected, setSelected }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={`section-block margin-tb-10`}>
        <div className={`section-block margin-tb-10`}>
          <FormControl sx={{ m: 1, minWidth: 200, marginLeft: 0 }}>
            <Select
              className='option-input-field'
              value={""}
              onChange={() => { }}
              displayEmpty
              sx={{ height: "57px", color: "#23262F" }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                XTZ
              </MenuItem>
            </Select>
          </FormControl>
          <OutlinedInput
            onInput={(e) => e.target.value = Util.allowNumeric(e.target.value)}
            id="outlined-adornment-weight"
            value={selected.directSalePrice[0]}
            className='option-input-field'
            type="text"
            InputProps={{ min: 0 }}
            onChange={(e) => { setSelected({ ...selected, directSalePrice: [e.target.value] }) }}
            placeholder="Enter Amount"
            sx={{ width: "200px", height: "57px", margin: "8px", color: "#23262F", background: "#ffffff" }}
            startAdornment={<InputAdornment position="start"><img className='outline-right-border input-img eth-img' src={getTezLogo()} /></InputAdornment>}
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

export default SwapNowOption;