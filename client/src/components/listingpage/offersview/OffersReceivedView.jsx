import React from 'react';
import { makeStyles } from '@mui/styles';
import OfferCard from './OfferCard';
import { useSelector } from 'react-redux';

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
              whiteSpace: 'nowrap',
            }
          },
          "& .flex-item-offer": {
            flex: "20%",
            textAlign: 'center',
            justifyContent: "flex-start",
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
            textAlign: "center",
            flex: 1,
          }
        }
      }
    }
  }
});

function OffersReceivedView({
  listedItems
}) {
  const classes = useStyles();

  const { account } = useSelector((state) => state.tezosConfig);
  return (
    <div className={classes.root}>
      <div className={`width-100 inline-block`}>
        {
          listedItems.map((item, index) => {
            if (item.owner == account) {
              if (item.swapOffers.length > 0 || item.reserveOffers.length > 0)
                return <OfferCard item={item} index={index} />
            }
          })
        }
      </div>
    </div>
  );
}

export default OffersReceivedView;