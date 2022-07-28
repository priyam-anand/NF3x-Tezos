import { makeStyles } from '@mui/styles';
import { Avatar, Button, Checkbox, Chip, MenuItem, Select } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { useSelector } from "react-redux";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
  root: {
    color: "#777E90",
    "& .icon-block": {
      width: "calc(100% - 20px)"
    },
    "& .btn-block": {
      width: "calc(100% - 10px)",
      display: "inline-block",
      "& .btn": {
        marginRight: "10px"
      }
    },
    "& .section-image-block": {
      width: "calc(50% - 40px) !important",
      marginLeft: "0",
      marginRight: "0"
    },
    "& .accordion-block": {
      marginBottom: "20px"
    },
    "& h2": {
      fontSize: "14px",
      color: "#777E90",
      clear: "both",
      float: "right",
      marginTop: 0,
      marginRight: "20px"
    },
    "& .custom-dropdown": {
      marginLeft: "0px",
      color: "#777E90",
      padding: "5px 0px 5px 0px",
      fontSize: "14px",
      float: "right",
      border: "none",
      "& img": {
        width: "14px",
        height: "25px"
      }
    },
    "& .deposit-block": {
      "& .deposit-block-text": {
        fontSize: "16px",
        fontWeight: 500,
        padding: "20px",
        boxSizing: "border-box",
        color: "#23262F",
        textAlign: "center",
        "& img": {
          verticalAlign: "middle"
        },
        "& label": {
          marginLeft: "10px"
        }
      }
    }
  },
  dropdown: {
    height: "20px",
    width: "calc(100% - 18px)",
    verticalAlign: "super",
    "& > fieldset": {
      border: "none"
    }
  },
  accordion: {
    background: "transparent !important",
    boxShadow: "none !important",
  },
  accordionSummary: {
    paddingLeft: "0 !important"
  },
  accordionDetails: {
    background: "#E6E8EC",
    borderRadius: "10px",
    padding: "15px !important",
    "& a": {
      fontWeight: 500,
      marginTop: "5px"
    }
  }
});

const PopupTransactionInProgress = ({ token, deposit, value }) => {
  const classes = useStyles();

  const { account } = useSelector((state) => state.web3Config);

  return (
    <div className={classes.root}>
      <div>
        <div className='section-image-block'>
          <img src={token.image_url} />
          <div className='section-image-desc'>
            <span>{token.asset_contract.name + " #" + token.token_id}</span>
            <span>Quantity - 01</span>
          </div>
        </div>
        <div className='section-image-block block-elem float-right'>
          <div className={"block-elem input-text no-shadow custom-dropdown"}>
            <img src='./img/ethereum.png' className="eth-img"/>
            <Select
              className={`${classes.dropdown} dropdown-home`}
              value={""}
              onChange={() => { }}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                {
                  value > 0
                    ? value
                    : 0.0123
                }
              </MenuItem>
            </Select>
          </div>
          {/* <h2>$1200</h2> */}
        </div>
      </div>

      <div className='margin-tb-10 icon-block'>
        <span className='text-desc-medium'>{`Your transaction is processing, item will be added to your wallet ${account}`}</span>
      </div>

      <div>
        <div className='input-text accordion-block'>
          <Accordion className={classes.accordion}>
            <AccordionSummary className={classes.accordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '70%', flexShrink: 0, marginLeft: "19px" }}>
                <span className='t2-text font-bold-16'>Enable email notifications</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <div>
                Select the NFT you want to SWAP or Sell for eth select NFT you want to SWAP or Sell for eth
                <a className='primary-text block-elem'>Manage account setting</a>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className='section-btn-block icon-block'>
          <span style={{ marginLeft: "10px" }} className='t2-text font-bold-16'>Share your listings</span>
          <div>
            <Avatar className='inline-flex bg-outline section-block-margin-all-20'><TelegramIcon className='telegram' /></Avatar>
            <Avatar className='inline-flex bg-outline section-block-margin-all-20'><RedditIcon className='reddit' /></Avatar>
            <Avatar className='inline-flex bg-outline section-block-margin-all-20'><TwitterIcon className='twitter' /></Avatar>
            <Avatar className='inline-flex bg-outline section-block-margin-all-20'><InsertLinkIcon className='insertlink' /></Avatar>
          </div>
        </div>
        {deposit > 0
          ? <>
            <div className={"deposit-block"}>
              <div className='deposit-block-text'>Deposit successful</div>
              <div className={"deposit-block-text block-elem input-text section-btn-block width-100 deposit-block-value"}>
                <img src='../img/ethereum.png' className="eth-img"/>
                <label>{deposit}</label>
              </div>
            </div>
            <div className='margin-tb-10 btn-block'>
              <div className="center margin-tb-10">
                <Button disableRipple className={"btn font-bold-16"} variant="contained">View item</Button>
              </div>
            </div>
          </>
          : <div className='margin-tb-10 btn-block'>
            <div className="center margin-tb-10">
              <Button disableRipple className={"btn font-bold-16"} variant="contained">View item</Button>
            </div>
          </div>
        }

      </div>
    </div>
  );
}

export default PopupTransactionInProgress;