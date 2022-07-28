import React from 'react';
import { makeStyles } from '@mui/styles';
import { useSelector } from "react-redux"
import OfferCard from './OfferCard';
import RejectedOfferCard from './RejectedOfferCard';

const useStyles = makeStyles({
  root: {
    width: '100%',
    "& .offer-block": {
      padding: "30px 14px",
      marginBottom: "30px",
      display: "flex",
      flex: "210px 1",
      "& .offer-item": {
        "& > div": {
          marginTop: "5px"
        }
      },
      "& .offer-item-list": {
        width: "100%",
        "& .offer-list-flex": {
          display: "flex",
          "& .flex-item-item": {
            flex: 1,
            textAlign: 'center',
            "& .m-auto": {
              margin: 'auto'
            },
            "& .section-image-block": {
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }
          },
          "& .flex-item-offer": {
            justifyContent: "flex-start",
            textAlign: "center",
            flex: "20%",
            "& > div": {
              // width: "fit-content"
            },
            "& .plus": {
              margin: '0 10px'
            },
          },
          "& .flex-item-by": {
            flex: 1,
            textAlign: 'center',
          },
          "& .flex-item-expires": {
            flex: 1,
            textAlign: 'center',  
          },
          "& .flex-item-action": {
            flex: 1,
            textAlign: 'center',
          }
        }
      }
    }
  }
});

function OffersMadeView({
  listedItems,
  rejectedOffers
}) {
  const classes = useStyles();
  const { account } = useSelector((state) => state.web3Config);
  const timeNow = Math.floor(Date.now() / 1000);
  return (
    <div className={classes.root}>
      <div className={`width-100 inline-block`}>
        {
          listedItems.map((item, index) => {
            var isValid = false;
            for (let i = 0; i < item.swapOffers.length; i++)
              if (item.swapOffers[i].owner.toLowerCase() == account && item.swapOffers[i].time_period > timeNow) {
                isValid = true;
                break;
              }
            for (let i = 0; i < item.bnplOffers.length; i++)
              if (item.bnplOffers[i].owner.toLowerCase() == account && item.bnplOffers[i].time_period > timeNow) {
                isValid = true;
                break;
              }
            for (let i = 0; i < item.directSaleOffers.length; i++)
              if (item.directSaleOffers[i].owner.toLowerCase() == account && item.directSaleOffers[i].time_period > timeNow) {
                isValid = true;
                break;
              }
            if (isValid) {
              return <OfferCard item={item} index={index} made={true} />
            }
          })
        }

        {/*  Everything below this needs to be shown only when expired offer toggle is 'ON' */}
        <span>
          Expired Offers
        </span>

        {
          listedItems.map((item, index) => {
            var isValid = false;
            for (let i = 0; i < item.swapOffers.length; i++)
              if (item.swapOffers[i].owner.toLowerCase() == account && item.swapOffers[i].time_period < timeNow) {
                isValid = true;
                break;
              }
            for (let i = 0; i < item.bnplOffers.length; i++)
              if (item.bnplOffers[i].owner.toLowerCase() == account && item.bnplOffers[i].time_period < timeNow) {
                isValid = true;
                break;
              }
            for (let i = 0; i < item.directSaleOffers.length; i++)
              if (item.directSaleOffers[i].owner.toLowerCase() == account && item.directSaleOffers[i].time_period < timeNow) {
                isValid = true;
                break;
              }
            if (isValid) {
              return <OfferCard item={item} index={index} made={true} />
            }
          })
        }

        {
          rejectedOffers.map((item, index) => {
            return <RejectedOfferCard item={item} index={index} />
          })
        }
      </div>
    </div>
  );
}

export default OffersMadeView;