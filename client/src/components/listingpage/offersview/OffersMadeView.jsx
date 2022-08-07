import React from 'react';
import { makeStyles } from '@mui/styles';
import { useSelector } from "react-redux"
import OfferCard from './OfferCard';
import RejectedOfferCard from './RejectedOfferCard';
import { getTimeStamp } from '../../../api/getterTezos';

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
  const { account } = useSelector((state) => state.tezosConfig);

  const notExpired = (timePeriod) => {
    var _timestamp = getTimeStamp(timePeriod);
    return _timestamp > Date.now() / 1000;
  }

  return (
    <div className={classes.root}>
      <div className={`width-100 inline-block`}>
        {
          listedItems.map((item, index) => {
            var isValid = false;
            for (let i = 0; i < item.swapOffers.length; i++)
              if (item.swapOffers[i].owner == account && notExpired(item.swapOffers[i].timePeriod)) {
                isValid = true;
                break;
              }
            for (let i = 0; i < item.reserveOffers.length; i++)
              if (item.reserveOffers[i].owner == account && notExpired(item.reserveOffers[i].timePeriod)) {
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
              if (item.swapOffers[i].owner == account && !notExpired(item.swapOffers[i].timePeriod)) {
                isValid = true;
                break;
              }
            for (let i = 0; i < item.reserveOffers.length; i++)
              if (item.reserveOffers[i].owner == account && !notExpired(item.reserveOffers[i].timePeriod)) {
                isValid = true;
                break;
              }
            if (isValid) {
              return <OfferCard item={item} index={index} made={true} />
            }
          })
        }


        {
          rejectedOffers.reserve.map((item, index) => {
            return < RejectedOfferCard item={item} index={index} reserve={true} />
          })
        }
        {
          rejectedOffers.swap.map((item, index) => {
            return <RejectedOfferCard item={item} index={index} swap={true} />
          })
        }
      </div>
    </div>
  );
}

export default OffersMadeView;