import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import {ConnectWithoutContact} from '@mui/icons-material';

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    background: '#FAFAFA',
    height: '800px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    '@media (max-width: 600px)':{
      height: "auto"
    }
  },
  textMeet: {
    fontWeight: "700"
  },
  textTitleDesc: {
    color: "#6F6F6F",
    width: "700px",
    display: "inline-block",
    '@media (max-width: 600px)':{
      width: "auto"
    }
  },
  btnCommunity: {
    marginTop: "20px !important",
    textTransform: "capitalize"
  },
  img1: {
    position: 'absolute',
    top: '34%',
    left: '16%',
  },
  img2: {
    position: 'absolute',
    top: '74%',
    left: '44%',
  },
  img3: {
    position: 'absolute',
    top: '67%',
    left: '70%',
  },
  img4: {
    position: 'absolute',
    top: '25%',
    left: '66%',
  },
  img0: {
    position: 'absolute',
    top: '40%',
    left: '76%',
  },
  img6: {
    position: 'absolute',
    top: '66%',
    left: '21%',
  },
  img7: {
    position: 'absolute',
    top: '20%',
    left: '40%',
  }
});
function DashboardCommunity() {
  const classes = useStyles();
  return (<div className={`${classes.root} join-community layout-block layout-home`}>
            <div>
              <h1 className={classes.textMeet}>Join The Community</h1>
              <span className={classes.textTitleDesc}>we have a large scale group to support each other in this game, Join us to get the news as soon as possible and follow our latest announcements.</span>
            </div>
            <div>
              <Button disableRipple startIcon={<ConnectWithoutContact/>} className={`${classes.btnCommunity} text-capitalize no-shadow`} variant='contained'>Join Community</Button>
            </div>
            <img className={classes.img1} src='./img/Ellipse7.png' alt='' />
            <img className={classes.img2} src='./img/Ellipse7-1.png' alt='' />
            <img className={classes.img6} src='./img/Ellipse7-6.png' alt='' />
            <img className={classes.img7} src='./img/Ellipse7-7.png' alt='' />
            <img className={classes.img3} src='./img/Ellipse7-3.png' alt='' />
            <img className={classes.img4} src='./img/Ellipse7-4.png' alt='' />
            <img className={classes.img0} src='./img/Ellipse7-2.png' alt='' />
            
          </div>);
}

export default DashboardCommunity;