import React, { Fragment, useEffect, useState } from 'react'
import { ArrowForwardIos } from '@mui/icons-material';
import { Button, Card, Chip } from '@mui/material';
import axios from "axios";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({

});

const WalletViewCard = ({ token, onClickView, setPopupToken }) => {
    const handleClick = () => {
        onClickView(true);
        setPopupToken(token);
    }
    return (
        <div className='dashboard-card'>
            <Card className={`no-shadow padding-10`} onClick={handleClick}>
                <div className={`generic-card medium-card radius-20 pointer relative height-auto overflow-hidden`} >
                    <img className='radius-20' src={token.image_url} alt='img' />
                    <div className='card-footer'>
                        <div className='flex-justify'>
                            <span className='font-14 medium-weight t2-text ellipsis'>{
                                token.name == undefined ? token.asset_contract.name + " #" + token.token_id : token.name
                            }</span>
                            <span className='primary-text medium-weight font-14 card-detail'>See Details &gt;</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default WalletViewCard