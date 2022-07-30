import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  },
  textTrade: {
    color: "#2B59FF",
    fontSize: "13px",
    display: "block",
    fontWeight: "700"
  },
  boxBlock: {
    textAlign: "center",
    padding: "10px",
    borderRadius: "20px",
    background: "#E1FFEE",
    width: "calc(25% - 40px)" ,
    maxWidth: "274px",
    display: "flex",
    margin: "10px",
    height: "300px",   
    position: 'relative',
    alignItems: 'center',
    "& img": {
      width: "100%",
      objectFit: 'scale-down',
    },
    "& .btn":{
      margin: "0 auto",
      left: 'calc(50% - 62.5px)',
      fontWeight: "700",
      width: '125px',
      position: 'absolute',
      bottom: '12px',
      height: '34px',
      
    }
  },
  mainblock: {
    marginTop: "50px",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  roadmapBg: {
    background: "url(./img/roadmap_bg.png)",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    paddingBottom: "10px",
    height: "25px",
    display: "block"
  },
  featurestatus: {
    height: '60px',
    borderRadius: '30px',
    background: 'rgba(255, 0, 131, 0.04)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    marginTop: "30px",
    '& svg':{
      color: '#FF0083',
      position: "absolute",
      left: "43%"
    }    
  },
  statusbar: {
    height: '4px',
    background: '#FF0083',
    width: '94%',
    left: '3%',
    position: 'absolute',
    zIndex: '1',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: '10',
    left: '4%',
    '& button': {
      width: '104px',
      height: '34px',
      fontSize: '10px',
      padding: "13px 20px !important"
    }
  },
  statusBlock:{
    maxWidth: "274px",
    width: "calc(25% - 40px)",
    display: "flex",
    alignItems: 'center',
    position: "relative"
  }

});

function DashboardRoadmap() {
  const classes = useStyles();
  return (<div className={`${classes.root} layout-block layout-home`}>
    <div>
      <span className={classes.textTrade}>EASY NFT TRADE</span>
      <h1>
        <span>RoadMap</span>
        <span className={classes.roadmapBg}></span>
      </h1>
      
    </div>
    <div className={classes.mainblock}>      
      <div className={classes.boxBlock}>
        <img src='./img/roadmap.png'/>
        <Button disableRipple className="btn `${classes.tradebtn}` bg-white black-text" variant='contained' size="small">Trade</Button>
      </div>
      <div className={classes.boxBlock} style={{backgroundColor: '#FEE1FF'}}>
        <img src='./img/roadmap3.png'/>
        <Button disableRipple className="btn bg-white black-text" variant='contained' size="small">Lend</Button>
      </div>
      <div className={classes.boxBlock} style={{backgroundColor: '#B7E1E3'}}>
        <img src='./img/roadmap2.png'/>
        <Button disableRipple className="btn bg-white black-text" variant='contained' size="small">Sell</Button>
      </div>
      <div className={classes.boxBlock} style={{backgroundColor: '#FFE9E8'}}>
        <img src='./img/roadmap1.png'/>
        <Button disableRipple className="btn bg-white black-text" variant='contained' size="small">Stake</Button>
      </div>
    </div>
    <div className={classes.featurestatus}>
      <div className={classes.statusbar}></div>
      <div className={classes.statusSection}>
        <div className={classes.statusBlock}>
          <CheckCircleIcon className={classes.checkicn} />
        </div>
        <div className={classes.statusBlock}>
          <Button disableRipple className="btn" variant='contained' size="small">Coming soon</Button>
        </div>
        <div className={classes.statusBlock}>
          <Button disableRipple className="btn" variant='contained' size="small">Coming soon</Button>
        </div>
        <div className={classes.statusBlock}>
          <Button disableRipple className="btn" variant='contained' size="small">Coming soon</Button>
        </div>
      </div>
      
      
    </div>
  </div>);
}

export default DashboardRoadmap;