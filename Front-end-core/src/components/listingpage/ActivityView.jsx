import React, { useState} from 'react';
import { makeStyles } from '@mui/styles';
import {ReactComponent as LinkSVG} from '../../SVG/link.svg';


const useStyles = makeStyles({
  root: {
    marginTop: "26px",
    "& .activity-block > div":{
      padding: "24px 8px",
      flex: "0 1 23%",
      borderRight: "none !important",
      background: "#F9FAFB",
      "&:last-child":{
        borderRight: "1px solid #8e8e93 !important",
      }
    },
    "& .activity-list > div":{
      background: "#ffffff !important",
      borderTop: "none !important",
      borderBottom: "1px solid #8e8e93 !important",
      "& .primary-text path":{
        stroke: "#FF0083"
      }
    }
  },
});

function ActivityView() {
  const classes = useStyles();
  
  return (
    <div className={`${classes.root} width-100 radius-5`}>
        <div className={`flex-justify activity-block`}>
            <div class="b-grey-text font-16 medium-weight center bg-b-grey-border">Transaction Type</div>
            <div class="b-grey-text font-16 medium-weight center bg-b-grey-border">Transaction Details</div>
            <div class="b-grey-text font-16 medium-weight center bg-b-grey-border">From</div>
            <div class="b-grey-text font-16 medium-weight center bg-b-grey-border">To</div>
            <div class="b-grey-text font-16 medium-weight center bg-b-grey-border">Time</div>
            <div class="b-grey-text font-16 medium-weight center bg-b-grey-border">Link</div>
        </div>
        <div className={`flex-justify activity-list activity-block`}>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border">List</div>
            <div class="t2-text font-14 medium-weight bg-b-grey-border">
              <div className='flex-justify-start align-center'>
                <img className="small-card-img radius-5" src="../img/azuki.png" style={{marginRight: "16px"}} />
                <div className='flex-justify-start column-direction'>
                    <span className='t2-text font-12'>Mutant Ape Echoes #23234</span>
                    <span className='b-grey-text font-12'>Any</span>
                </div>
              </div>
            </div>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border">0x2357hffd689</div>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border">0x2357hffd689</div>
            <div class="t2-text font-12 medium-weight center bg-b-grey-border">3 Days Ago</div>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border"><LinkSVG className='primary-text'/></div>
        </div>
        <div className={`flex-justify activity-list activity-block`}>
            <div class="t2-text font-16 medium-weight center bg-b-grey-border">List</div>
            <div class="t2-text font-16 medium-weight bg-b-grey-border">
              <div className='flex-justify-start align-center'>
                <img className="small-card-img radius-5" src="../img/azuki.png" style={{marginRight: "16px"}} />
                <div className='flex-justify-start column-direction'>
                    <span className='t2-text font-12'>Mutant Ape Echoes #23234</span>
                    <span className='b-grey-text font-12'>Any</span>
                </div>
              </div>
            </div>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border">0x2357hffd689</div>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border">0x2357hffd689</div>
            <div class="t2-text font-12 medium-weight center bg-b-grey-border">3 Days Ago</div>
            <div class="t2-text font-14 medium-weight center bg-b-grey-border"><LinkSVG className='primary-text'/></div>
        </div>
    </div>
  );
}

export default ActivityView;