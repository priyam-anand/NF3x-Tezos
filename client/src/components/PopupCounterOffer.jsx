import { makeStyles } from '@mui/styles';
import { Avatar, Button, Checkbox, Chip, MenuItem, Select } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Brightness1Icon from '@mui/icons-material/Brightness1';

import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { pink } from '@mui/material/colors';
import { ArrowRightAlt } from '@mui/icons-material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
      color: "#777E90",
      "& .img-block":{
        display: "flex",
        justifyContent: "center",
        margin: "25px 0",
        "& img":{
            width: "139px",
            height: "117px",
        }
      },
      "& .btn-block":{
          marginTop: "50px !important"
      }
    },
    accordion: {
        background: "transparent !important",
        boxShadow: "none !important",
    },
    accordionSummary: {
        paddingLeft: "0 !important"
    },
    accordionDetails: {
        background: "#E6E8EC",
        borderRadius: "10px",
        padding: "15px !important",
        "& a":{
            fontWeight: 500,
            marginTop: "5px"
        }
    }
});

const PopupCounterOffer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className='flex-justify img-block'>
        <img className="radius-10" src="../img/complete-listing.png"/>
      </div>

      <div>
          <div className='input-text accordion-block'>
            <Accordion className={classes.accordion}>
                <AccordionSummary  className={classes.accordionSummary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Typography sx={{ width: '70%', flexShrink: 0, marginLeft: "19px" }}>
                        <span className='t2-text font-bold-16'>Enable email notifications</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <div>
                        Select the NFT you want to SWAP or Sell for eth select NFT you want to SWAP or Sell for eth
                        <a className='primary-text block-elem'>Manage account setting</a>
                    </div>
                </AccordionDetails>
            </Accordion>
          </div>
          
          <div className='margin-tb-10 btn-block'>
              <div className="center margin-tb-10">
                <Button disableRipple className={"btn font-bold-16"} variant="contained" endIcon={<ArrowRightAlt />}>View item</Button>
              </div>
          </div>
      </div>
    </div>
  );
}

export default PopupCounterOffer;