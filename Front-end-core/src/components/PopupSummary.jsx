import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { ArrowRightAlt } from '@mui/icons-material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        color: "#777E90",
        
        "& .popup-summary":{
            borderBottom: "1px solid #E6E8EC",
            display: "inline-block",
            width: "100%",
            padding: "10px",
            boxSizing: "border-box"
        },
        "& .popup-summary:nth-last-child(3), & .popup-summary:nth-last-child(2)":{
            borderBottom: "none"
        },
        "& .popup-summary:nth-last-child(2)":{
            background: "#F7F8F9",
            borderRadius: "14px",
            
        },
        
        "& .icon-block":{
            width: "calc(100% - 20px)"
        },
        "& .btn-block":{
            marginTop: "30px !important",
        },
        "& .section-image-block":{
            "& .section-image-desc":{
                width: "100% !important"
            },
            width: "calc(50% - 40px) !important",
            margin: "10px",
        },
        "& h2":{
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
            fontSize: "16px",
            float: "right",
            border: "none",
            "& img":{
                width: "14px",
                height: "25px",
                verticalAlign: "bottom"
            }
        },
    }
});

const PopupSummary = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <div className='popup-summary'>
            <div className='section-image-block'>
                <div className='section-image-desc'>
                    <span>Total Gas fees</span>
                    <span>Est. maximum</span>
                </div>
            </div>
            <div className='section-image-block block-elem float-right'>
                <div className={"block-elem input-text no-shadow custom-dropdown"}>
                    <img src='../img/ethereum.png' className="eth-img"/>
                    <label>0.002345 </label>
                </div>
                <h2>$1200</h2>
            </div>
        </div>
        <div className='popup-summary'>
            <div className='section-image-block'>
                <div className='section-image-desc'>
                    <span>Marketplace fees</span>
                    <span>Est. maximum</span>
                </div>
            </div>
            <div className='section-image-block block-elem float-right'>
                <div className={"block-elem input-text no-shadow custom-dropdown"}>
                    <img src='../img/ethereum.png' className="eth-img"/>
                    <label>0.002345 </label>
                </div>
                <h2>$1200</h2>
            </div>
        </div>
        <div className='popup-summary'>
            <div className='section-image-block'>
                <div className='section-image-desc'>
                    <span>Creator royalities</span>
                    <span>Est. maximum</span>
                </div>
            </div>
            <div className='section-image-block block-elem float-right'>
                <div className={"block-elem input-text no-shadow custom-dropdown"}>
                    <img src='../img/ethereum.png' className="eth-img"/>
                    <label>0.002345 </label>
                </div>
                <h2>$1200</h2>
            </div>
        </div>
        <div className='popup-summary'>
            <div className='section-image-block'>
                <div className='section-image-desc'>
                    <span>Total Profits</span>
                    <span>Est. maximum</span>
                </div>
            </div>
            <div className='section-image-block block-elem float-right'>
                <div className={"block-elem input-text no-shadow custom-dropdown"}>
                    <img src='../img/ethereum.png' className="eth-img"/>
                    <label>0.002345 </label>
                </div>
                <h2>$1200</h2>
            </div>
        </div>
        <div className='margin-tb-10 btn-block'>
            <div className="center margin-tb-10">
                <Button disableRipple className={"btn width-100 font-bold-16"} endIcon={<ArrowRightAlt />} variant="contained">Start listing</Button>
            </div>
        </div>
    </div>
  );
}

export default PopupSummary;