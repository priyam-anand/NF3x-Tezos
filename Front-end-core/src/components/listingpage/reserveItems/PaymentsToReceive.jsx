import React from 'react';
import { makeStyles } from '@mui/styles';
import ReservedItemCard from './ReservedItemCard';

const useStyles = makeStyles({
    root: {
        "& .flex-cards": {
            display: "flex",
            "flex-flow": "row wrap",
        },
        " & .title": {
            color: '#000000',
            "font-size": "14px"
        }
    }
});

function PaymentsToReceive({ itemsSeller }) {
    const classes = useStyles();
    return <div className={classes.root}>
        <h3 className="title medium-weight">{`Pending Payments (${itemsSeller.length})`}</h3>
        <div className="flex-cards">
            {
                itemsSeller.map((item, index) => {
                    return <ReservedItemCard cardType='recieve_pending' item={item} />
                })
            }
        </div>
        {/* <div>
            <h3 className="title medium-weight">Received Payments (2)</h3>
            <div className="flex-cards">
                <ReservedItemCard cardType="received" />
                <ReservedItemCard cardType="received" />
            </div>
        </div> */}
    </div>
}

export default PaymentsToReceive;