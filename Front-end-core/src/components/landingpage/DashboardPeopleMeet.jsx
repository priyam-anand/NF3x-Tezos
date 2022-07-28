import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    background: "linear-gradient(to right, #12141D, #181E33)"
  },
  textMeet: {
    color: "#ffffff",
    fontWeight: "700"
  },
  textTitleDesc: {
    color: "#A1A1A1",
    width: "400px",
    display: "inline-block"
  },
  textContentDesc: {
    color: "#A1A1A1"
  },
  
  boxTitle: {
    color: "#12141D",
    fontWeight: "700 !important",
    fontSize: "18px !important"
  },
  boxBlock: {
    textAlign: "left",
    width: "calc(25% - 20px)" ,
    display: "inline-block",
    margin: "10px"
  },
  meetPeopleContainer: {
    width: "100%",
    marginTop: "40px",
    "& > div": {
      display: "inline-block",
      maxWidth: "200px",
      margin: "35px 120px 35px 0",
    },
    "& > div:first-child": {
      marginLeft: "0",
    }
  }

});
function DashboardPeopleMeet() {
  const classes = useStyles();
  return (<div className={`${classes.root} layout-block layout-home`}>
    <div>
      <h1 className={classes.textMeet}>Meet the brains</h1>
      <span className={classes.textTitleDesc}>Amet minim mollit non deserunt ullamc aliqua dolor do amet sint. Velit officia consequat duis.</span>
    </div>
    <div className={classes.meetPeopleContainer}>
      {[...Array(9)].map((e, i) => {
          return <div key={i}>
                    <img src='./img/people.png'/>
                    <h3 className={classes.textMeet}>Jenny Wilson</h3>
                    <span className={`${classes.textContentDesc} block`}>Founder</span>
                  </div>;
      })}
      
    </div>
  </div>);
}

export default DashboardPeopleMeet;