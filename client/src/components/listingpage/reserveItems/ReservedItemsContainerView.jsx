import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import PendingPayments from './PendingPayments';
import PaymentsToReceive from './PaymentsToReceive';
import { useSelector } from 'react-redux';
import { getActiveBuyNowPayLaterItems_Buyer, getActiveBuyNowPayLaterItems_Seller } from '../../../api/getter';


const useStyles = makeStyles({
  root: {
    width: '100%',
  }
});

function ReservedItemsContainerView({
  onButtonChange
}) {
  const classes = useStyles();
  const [reserveViewToggle, setReserveViewToggle] = useState(true);

  const [itemsSeller, setItemsSeller] = useState([]);
  const [itemsBuyer, setItemsBuyer] = useState([]);

  const { web3, getter, market, account } = useSelector((state) => state.web3Config);

  const init = async () => {
    const _itemsSeller = await getActiveBuyNowPayLaterItems_Seller(getter, account);
    const _itemsBuyer = await getActiveBuyNowPayLaterItems_Buyer(getter, account);

    setItemsBuyer(_itemsBuyer);
    setItemsSeller(_itemsSeller);
  }

  console.log("itemSeller", itemsSeller);
  console.log("itemBuyer", itemsBuyer);

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    onButtonChange(!reserveViewToggle)
  }, [reserveViewToggle]);

  return (
    <div className={classes.root}>
      <div className={`width-100 inline-block`}>
        <div className={`action-block flex-wrap`}>
          <div>
            <Button disableRipple className={`btn ${!reserveViewToggle ? "bg-white b-grey-text bg-b-grey-border opacity-5" : "bg-primary"}`} sx={{ borderRadius: "10px !important", marginRight: "20px" }} onClick={() => setReserveViewToggle(true)} variant="contained">Pending Payments</Button>
            <Button disableRipple className={`btn ${reserveViewToggle ? "bg-white b-grey-text bg-b-grey-border opacity-5" : "bg-primary"}`} onClick={() => setReserveViewToggle(false)} sx={{ borderRadius: "10px !important" }} variant="contained">Payment To Be Received</Button>
          </div>
        </div>
        {reserveViewToggle ? <PendingPayments itemsBuyer={itemsBuyer} /> : <PaymentsToReceive itemsSeller={itemsSeller} />}
      </div>
    </div>
  );
}

export default ReservedItemsContainerView;