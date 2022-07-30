import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button, InputAdornment, TextField } from '@mui/material';
import {ArrowRightAlt, ConnectWithoutContact} from '@mui/icons-material';
import {Email} from '@mui/icons-material';
import { ReactComponent as SMS } from '../../SVG/sms.svg';

const useStyles = makeStyles({
  root: {
    textAlign: "left",

  },
  //, url('../img/Right-arrow-curved.png'), url('../img/Left-arrow-curved.png')
  tradeBlock: {
    backgroundColor: "#FF0083",
    backgroundImage: "url('../img/bg-trade.png')",
    backgroundPosition: "left top",
    backgroundRepeat: "no-repeat",
    padding: "88px 0",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    "& > div":{
      width: "60%",
      display: "inline-block",
      '@media (max-width: 600px)':{
        width: "80%"
      }
    },
    '@media (max-width: 600px)':{
      padding: "20px 0",
      marginTop: "20px"
    }
  },
  textTitleDesc: {
    color: "#ffffff",
    display: "inline-block"
  },
  btnCommunity: {
    marginTop: "20px !important",
    textTransform: "capitalize",
    verticalAlign: "top !important",
    color: "#FF0083 !important",
    width: '150px',
    height: '50px'
  },
  getLatest: {
    margin: "110px 20px 20px 20px",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    "& :nthChild(1)": {
      width: '45%',
      paddingRight: '10%'
    },
    "& > div": {
      width: "38%",
      "& > div": {
        marginTop: "20px",
        "& > Button:last-child": {
          height: "35px",
          width: "170px",
          color: "#ffffff",
          textTransform: "capitalize",
          background: "#000000",
          // padding: "0px 20px !important"
        }
      },
      '@media (max-width: 600px)':{
        width: "100%",
        boxSizing: "border-box",
        padding: 0,
        marginTop: "50px"
      }
    },
    '@media (max-width: 600px)':{
      marginTop: "0px",
      flexDirection: "column"
    }
  },
  textLatestLeft: {
    fontWeight: "500",
    marginTop: "0",
    fontSize: '50px'
  },
  latestTxtBtm: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: "wrap",
    "& .email-input input":{
      padding: "7.5px 14px"
    },
    '@media (max-width: 600px)':{
      flexDirection: "column",
    }
  },
  textLatestRight: {
    fontWeight: "700",
    marginTop: "0"
  },
  textLatestDesc: {
    color: "#6F6F6F",
    fontSize: "14px",
    display: "inline-block",
    width: '75%',
    '@media (max-width: 600px)':{
      width: "auto",
    }
  },
  getQuestions: {
    padding: "0",
    "& li": {
      fontSize: "14px",
      fontWeight: "700",
      padding: "30px 0",
      verticalAlign: "middle",
      borderBottom: "1px solid #E6EAEE"
    },
    "& li:last-child": {
      borderBottom: "none"
    },
    "& .info-question": {
      color: "#101010"
    },
    "& .info-question-arrow": {
        float: 'right',
        color: "#C4C4C4",
        cursor: "pointer"
    }
  }
});
function DashboardInfo() {
  const classes = useStyles();
  return (<div className={`${classes.root} layout-block layout-home`}>
            <div className={`${classes.tradeBlock} radius-20`}>
              <div className={"width-100"}>
                <span className="white-text font-50 bold center block-elem" style={{marginBottom: "20px"}}>Trade Your Own NFT!</span>
                <div className={"white-text center font-18"}>we have a large scale group to support each other in this game, Join us to get the news as soon as possible and follow our latest announcements.</div>
              </div>
              {/* <Button disableRipple className={`${classes.btnCommunity} text-capitalize bg-white`} size="medium">List NFT</Button> */}
            </div>
            <div className={classes.getLatest}>
              <div>
                <h1 className={classes.textLatestLeft}>Get the Latest Updates</h1>
                <span className={classes.textLatestDesc}>Sign up to our regular newsletter for news, insight, new product releases & more.</span>
                <div className={classes.latestTxtBtm}>
                  <TextField
                    className='email-input'
                    id="input-with-icon-textfield"
                    placeholder='Input email address'
                    label=""
                    sx={{height: "50px", fontSize: "12px", width: "300px", height: "50px", padding: "0px 14px 7px 0px", "& fieldset":{border: "1px solid #F1F1F1"}, '@media (max-width: 600px)':{paddingRight: "0"}}}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SMS/>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button disableRipple variant="contained" className='no-shadow' >Get in Touch</Button>
                </div>
              </div>
              <div>
                <h3 className={classes.textLatestRight}>Maybe your question is have been answered. Check this out!</h3>
                <ul className={classes.getQuestions}>
                  <li>
                    <span className="info-question">What is NF3x?</span>
                    <span className="info-question-arrow"><ArrowRightAlt/></span>
                  </li>
                  <li>
                    <span className="info-question">How to swap NFT?</span>
                    <span className="info-question-arrow"><ArrowRightAlt/></span>
                  </li>
                  <li>
                    <span className="info-question">How to Bid an item?</span>
                    <span className="info-question-arrow"><ArrowRightAlt/></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>);
}

export default DashboardInfo;