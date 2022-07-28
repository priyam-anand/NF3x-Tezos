import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  textMeet: {
    fontWeight: "700"
  },
  textTitleDesc: {
    color: "#12141D",
    width: "400px",
    display: "inline-block"
  },
  textContentDesc: {
    color: "#12141D"
  },
  
  boxTitle: {
    color: "#18181B",
    fontWeight: "700 !important",
    fontSize: "18px !important"
  },
  boxBlock: {
    textAlign: "left",
    width: "calc(25% - 20px)" ,
    display: "inline-block",
    margin: "10px"
  },
  meetBlogContainer: {
    width: "100%",
    marginTop: "40px",
    "& > div": {
      
      display: "inline-block",
      width: "calc(33.33% - 125px)",
      margin: "35px 120px 35px 0",
      "& > img": {
        maxWidth: "200px"
      }
    },
    "& > div:first-child": {
      marginLeft: "0",
    }
  }

});
function DashboardBlog() {
  const classes = useStyles();
  return (<div className={`${classes.root} layout-block layout-home`}>
    <div>
      <h1 className={classes.textMeet}>Read our blogs to learn more about NF3x</h1>
      <span className={classes.textTitleDesc}>Our CyberNews Investigation team uses white hacking techniques to find and safely cybersecurity threats & vulnerabilities.</span>
    </div>
    <div className={classes.meetBlogContainer}>
      {[...Array(3)].map((e, i) => {
          return <div key={i}>
                    <img src='./img/blog.png'/>
                    <h3 className={classes.textMeet}>Cyber Attach: Is the 'Big One' coming soon in 2022</h3>
                    <span className={`${classes.textContentDesc} block`}>in the past 90 days, the world has a serious escalation in cyberattacks.</span>
                  </div>;
      })}
      
    </div>
  </div>);
}

export default DashboardBlog;