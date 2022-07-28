import React, { useState, useEffect } from 'react';
import ReservedItemCard from './ReservedItemCard';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        display: "flex",
        "flex-flow": "row wrap"
    }
});


function PendingPayments({ itemsBuyer }) {

    const classes = useStyles();
    return <div className={classes.root}>
        {
            itemsBuyer.map((item, index) => {
                return <ReservedItemCard cardType='to_pay' item={item} />
            })
        }
    </div>
}

export default PendingPayments;