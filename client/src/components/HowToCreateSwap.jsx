import { makeStyles } from '@mui/styles';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
  root:{
    width: "220px",
    display: "inline-block",
    background: "#FAFAFA",
    verticalAlign: "top",
    padding: "40px",
    "& .howtoswap-checkbox":{
      borderBottom: "1px solid #E3E3E3"
    },
    "& ul": {
      padding: "27px 0",
      "& label": {
        color: "#23262F",
        fontWeight: "500",
        fontSize: "16px"
      },
      "& li":{
        padding: "5px"
      }
    },
    "& h3": {
      fontSize: "18px",
      color: "#23262F",
      margin: 0,
      padding: "17px",
      borderBottom: "1px solid #E3E3E3"
    },
    "& .know-more":{
      background: "#F8E3FF",
      borderRadius: "13px",
      padding: "10px",
      "& img": {
        width: "114px",
        display: "inline-block"
      },
      "& > div": {
        width: "calc(100% - 114px)",
        display: "inline-block",
        verticalAlign: "top",
        marginTop: "15px",
        "& > span": {
          fontSize: "12px",
          color: "#23262F",
          fontWeight: "500",
          display: "block"
        },
        "& Button":{
          height: "29px",
          padding: "7px 40px",
          fontWeight: "500",
          border: "transparent",
          marginTop: "10px"
        }
      },
    }
  }
});

function HowToCreateSwap() {
  const classes = useStyles();
  return (
        <div className={classes.root}>
            <h3>How to swap?</h3>
            <ul className='howtoswap-checkbox'>
              <li>
                <Checkbox {...label} defaultChecked sx={{ color: pink[800], '&.Mui-checked': { color: pink[600], }, }} />
                <label>Select an NFT</label>
              </li>
              <li>
                <Checkbox {...label} sx={{ color: "#E6E8EC", '&.Mui-checked': { color: pink[600], }, }} />
                <label>Choose Option</label>
              </li>
              <li>
                <Checkbox {...label} sx={{ color: "#E6E8EC", '&.Mui-checked': { color: pink[600], }, }} />
                <label>Choose Option</label>
              </li>
              <li>
                <Checkbox {...label} sx={{ color: "#E6E8EC", '&.Mui-checked': { color: pink[600], }, }} />
                <label>Choose Option</label>
              </li>
            </ul>
            <h3>Know more?</h3>
            <div className='know-more'>
              <img src='./img/announcement.png'/>
              <div>
                <span>checkout our recent blogs!</span>
                <Button disableRipple variant='outlined' className='bg-white btn'>Blog</Button>
              </div>
            </div>
        </div>
  );
}

export default HowToCreateSwap;