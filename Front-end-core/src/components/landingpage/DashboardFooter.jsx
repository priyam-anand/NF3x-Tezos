import React from 'react';
import { makeStyles } from '@mui/styles';
import {Facebook, Instagram, YouTube} from '@mui/icons-material';

const useStyles = makeStyles({
  root: {
    textAlign: "left",
    background: "#101010",
  },
  getLatest: {
    "& > div": {
      width: "50%",
      display: "inline-block",
      padding: "35px 0px",
      verticalAlign: "top",
      "& > div": {
        marginTop: "20px",
        "& > Button:first-child": {
          color: "#999999",
          textTransform: "capitalize",
          marginRight: "10px"
        },
        "& > Button:last-child": {
          color: "#ffffff",
          textTransform: "capitalize",
          background: "#000000",
          boxShadow: "none"
        }
      },
      '@media (max-width: 600px)':{
        width: "100%",
        padding: 0,
        "& img":{
          display: "none"
        }
      }
    },
    '@media (max-width: 600px)':{
      flexDirection: "column"
    }
  },
  textLatestDesc: {
    color: "#6F6F6F",
    fontSize: "14px",
    display: "inline-block"
  },
  footerRight: {
    textAlign: "right",
    padding: "0",
    "& li": {
      display: "inline-block",
      color: "#ffffff",
      fontSize: "13px",
      padding: "0 20px",
      verticalAlign: "middle",
    },
    "& li:last-child": {
      paddingRight0: "0",
    },
    "& p": {
      color: "#ffffff"
    },
    '@media (max-width: 600px)':{
      marginTop: "29px",
      textAlign: "left",
      paddingLeft: "0",
      "& > ul":{
        padding: 0,
        "& > li":{
          display: "block",
          padding: "12px 10px 12px 0",
        }
      },
    },
    '@media (max-width: 1408px)':{
      "& li":{
        display: "block",
        padding: "12px 10px 12px 0",
      }
    }
  },
  socialmed: {
    margin: '35px 0',
    "& li":{
      padding: "0 10px"
    },
    '@media (max-width: 600px)':{
      margin: "15px 0",
      "& li":{
        display: "inline-block !important"
      }
    },
    '@media (max-width: 1408px)':{
      "& li":{
        display: "inline-block"
      }
    }
  },
  img: {
    width: '100px'
  }
});
function DashboardFooter() {
  const classes = useStyles();
  return (<div className={`${classes.root} layout-block layout-home`}>
            <div className={`${classes.getLatest} flex-justify`}>
              <div>
                {/* <img src="./img/nf3logo-footer.png" /> */}
                <h1 className={`font-40 white-text semibold-weight margin-zero`}>Create, Explore & Collect Digital Art NFTs</h1>
              </div>
              <div className={classes.footerRight}>
                <ul>
                  <li className='font-14 white-text opacity-8'><span  className='pointer'>PRIVACY POLICY</span></li>
                  <li className='font-14 white-text opacity-8'><span  className='pointer'>TERMS & CONDITIONS</span></li>
                  <li className='font-14 white-text opacity-8'><span  className='pointer'>ABOUT US</span></li>
                  <li className='font-14 white-text opacity-8'><span  className='pointer'>FAQ</span></li>
                </ul>
                <ul className={classes.socialmed}>
                  <li><Facebook className='pointer'/></li>
                  <li><Instagram className='pointer'/></li>
                  <li><YouTube className='pointer'/></li>
                </ul>
                <span className='font-14 white-text opacity-8'>&copy; 2021 NF3 INC. All Rights Reserved.</span>
              </div>
            </div>
          </div>);
}

export default DashboardFooter;