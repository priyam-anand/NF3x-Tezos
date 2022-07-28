import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as Wallet } from '../../SVG/Wallet.svg';
import { ReactComponent as BannerCard } from '../../SVG/banner-card.svg';
import { init, getAccount } from "../../api/tezos";

const useStyles = makeStyles({
  root: {
    backgroundImage: "linear-gradient(to top, rgb(255, 255, 254), rgb(255, 255, 254))",
    padding: "20px 10%",
    boxSizing: "border-box",
    "& .right-menu": {
      display: "none"
    },
    '@media (max-width: 600px)': {
      paddingTop: "60px",
      paddingBottom: "60px",
      "& .right-menu": {
        display: "flex"
      }
    }
  },
  logo: {
    "& img": {
      width: "80px"
    },
    verticalAlign: "middle",
    width: "150px",
    display: "inline-block",
    '@media (max-width: 600px)': {
      flex: "auto",
      marginLeft: "15px",
      borderRight: "none",
    }
  },
  //banner style
  bannerContainer: {
    paddingTop: "186px",
    paddingBottom: "220px",
    backgroundImage: "linear-gradient(to top, rgb(253, 254, 253), rgb(255, 255, 254))",
    '& .documentationtxt': {
      marginLeft: '10px',
      fontSize: '17px'
    },
    '@media (max-width: 600px)': {
      paddingTop: "0",
      paddingBottom: "0px",
      flexDirection: "column"
    }
  },
  bannerPanel: {
    width: "50%",
    "& > span": {
      margin: "10px 5px"
    },
    "& > div > Button": {
      marginTop: "36px",
      marginRight: "10px"
    },
    '& .dashboardsubtitle': {
      width: '68%',
      fontSize: '18px',
      '@media (max-width: 600px)': {
        width: "100%"
      }
    },
    "&.banner-img": {
      textAlign: "center",
      alignSelf: "flex-start",
      "& .banner-svg": {
        top: "-70px",
        right: 0,
        width: "100%",
        '@media (max-width: 600px)': {
          top: "-130px",
          minWidth: "360px"
        }
      }
    },
    '@media (max-width: 600px)': {
      width: "100%",
      marginTop: "75px",
      marginBottom: "60px"
    },
    '@media (min-width: 600px) and (max-width: 1000px)': {
      width: "100%",
      marginBottom: "25px"
    }
  },
  bannerPanelLeftText: {
    fontWeight: "700",
    fontSize: "70px",
    color: "#101010",
    lineHeight: "1.1em",
    "@media (max-width: 1000px)": {
      fontSize: "50px"
    }
  }
});

function DashboardHeader() {

  const dispatch = useDispatch();
  const { tezos, wallet, account } = useSelector((state) => state.tezosConfig)

  const connectWallet = async () => {
    try {
      const { _tezos, _wallet } = await init(tezos, wallet, dispatch);
      const _account = await getAccount(_tezos, _wallet, account, dispatch);
    } catch (error) {
      window.alert(error.message);
    }
  }

  const getAddress = (account) => {
    var acc = account.substring(0, 10);
    acc = acc + '...';
    return acc;
  }

  const classes = useStyles();
  return (
    <div style={{ overflow: "hidden" }}>
      <div className={`${classes.root} width-100 layout-home flex-justify align-center`}>
        <div className={classes.logo}>
          <Link to="/listing"><img src="./img/logo.svg" /></Link>
        </div>
        <Button disableRipple className={"btn bg-primary white-text white-border"} variant="contained" startIcon={<Wallet />} onClick={connectWallet}>
          {typeof account !== 'undefined' ? getAddress(account) : `Connect`}
        </Button>
      </div>
      <div className={`${classes.bannerContainer} layout-home  flex-justify align-center`}>
        <div className={`${classes.bannerPanel}`}>
          <span className={`${classes.bannerPanelLeftText} inline-block`}>Safe Swap,</span>
          <span className={`${classes.bannerPanelLeftText} inline-block`}>Reserve Now</span>
          <span className={`${classes.bannerPanelLeftText} inline-block`}>Pay Later</span>
          <span className='dashboardsubtitle text-color inline-block'>A multi asset swap market place for Fungible and Non-Fungible Tokens (NFTs).</span>
          <div>
            <Button disableRipple className={"btn bg-primary white-text white-border"} variant="contained"><Link to={"/listing"}>Launch app</Link></Button>
            {/* <Button disableRipple className={"btn-text text-color-500 documentationtxt"} variant="text">Documentation</Button> */}
          </div>
        </div>
        <div className={`${classes.bannerPanel} banner-img`}>
          <div className='relative'>
            <div className='bg-blur'></div>
            {/* <img className='absolute banner-svg' src='../img/banner-card.png'/> */}
            <BannerCard className='absolute banner-svg' />
            {/* <Banner1 className='absolute banner-svg' style={{zIndex: 1, left: 0}}/>
            <Banner2 className='absolute banner-svg' style={{zIndex: 0, left: "100px", top: "-90px"}}/> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;