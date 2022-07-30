import React from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { ReactComponent as ContentCopy } from '../../SVG/contentcopy.svg';

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    background: 'white',
    "& h1":{
      marginBottom: "0"
    },
    '& .tradeoptions': {
      marginTop: '77px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      lineHeight: "26px",
      justifyContent: 'center',
      alignItems: 'flexStart',
      '& span': {
        fontSize: '18px',
        fontWeight: '700'
      },
      '& p': {
        fontSize: '16px'
      },
      '@media (max-width: 600px)':{
        marginTop: "20px"
      }
    }
  },
  textTrade: {
    color: "#2B59FF",
    fontSize: "13px",
    display: "block",
    fontWeight: "700"
  },
  nftitle: {
    fontSize: '48px',
    marginTop: '20px'
  },
  boxTitle: {
    color: "#12141D",
    fontWeight: "700 !important",
    fontSize: "18px !important",
    padding: '16px 16px 5px 16px !important'
  },
  boxBlock: {
    textAlign: "left",
    margin: "10px",
    boxShadow: 'initial !important',
    border: "1px solid rgba(0, 0, 0, 0.15)",
    '& :nthChild(1)': {
    padding: '16px 16px 5px 16px !important',
    height: '42px'
    },
    '@media (max-width: 600px)':{
      maxWidth: "initial !important",
      padding: "30px",
      
    }
  },
  roadmapBg: {
    background: "url(./img/roadmap_bg.png)",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    paddingBottom: "10px",
    height: "30px",
    display: "block"
  }

});

function DashboardTradingOptions() {
  const classes = useStyles();
  return (<div className={`${classes.root} layout-block`}>
    <div>
      <span className={classes.textTrade}>EASY NFT TRADE</span>
      <h1 className={classes.nftitle}>Why NF3x?</h1>
      <span className={classes.roadmapBg}></span>
    </div>
    <div className='tradeoptions'>
      <Card className={`${classes.boxBlock} radius-15`} sx={{ maxWidth: 270 }}>
        <CardHeader
          className={classes.boxTitle}
          avatar={
            <Avatar sx={{ bgcolor: "rgba(255, 0, 131, 0.2)" }} aria-label="recipe">
              <ContentCopy />
            </Avatar>
          }
          title="Peer to peer"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
          Locate, barter and swap assets securely with no intermediary.
          </Typography>
        </CardContent>
      </Card>
      <Card className={`${classes.boxBlock} radius-15`} sx={{ maxWidth: 270 }}>
        <CardHeader
          className={classes.boxTitle}
          avatar={
            <Avatar sx={{ bgcolor: "rgba(255, 0, 131, 0.2)" }} aria-label="recipe">
              <ContentCopy />
            </Avatar>
          }
          title="Multi-Asset"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
          Create, bid and swap bundles of both Fungible and Non-Fungible Tokens
          </Typography>
        </CardContent>
      </Card>
      <Card className={`${classes.boxBlock} radius-15`} sx={{ maxWidth: 270 }}>
        <CardHeader
          className={classes.boxTitle}
          avatar={
            <Avatar sx={{ bgcolor: "rgba(255, 0, 131, 0.2)" }} aria-label="recipe">
              <ContentCopy />
            </Avatar>
          }
          title="Reserve now, pay later"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
          Pay a deposit to negotiate the option to swap at a later date with seller
          </Typography>
        </CardContent>
      </Card>
      <Card className={`${classes.boxBlock} radius-15`} sx={{ maxWidth: 270 }}>
        <CardHeader
          className={classes.boxTitle}
          avatar={
            <Avatar sx={{ bgcolor: "rgba(255, 0, 131, 0.2)" }} aria-label="recipe">
              <ContentCopy />
            </Avatar>
          }
          title="Buy and sell options to swap"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
          Buy or sell the right to swap at a future date
          </Typography>
        </CardContent>
      </Card>
    </div>
  </div>);
}

export default DashboardTradingOptions;