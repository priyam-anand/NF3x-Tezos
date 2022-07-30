import React from 'react'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import axios from "axios";
import { setAccount } from '../redux/web3ConfigSlice';
import { getTokenDetails, getImageURI } from '../../api/getter';

const SwapOffer = ({ offer, item, acceptOffer, index }) => {
    const { account, getter } = useSelector((state) => state.web3Config);
    const [data, setData] = useState({ name: '', image: '' });
    const [tokenName, setTokenName] = useState();
    const dispatch = useDispatch();

    const init = async () => {
        const _tokenDetails = await getTokenDetails(offer, getter, account);
        const data = await axios.get(_tokenDetails[0]);
        setData(data.data);
        setTokenName(_tokenDetails[1]);
    }
    useEffect(() => {
        init();
        window?.ethereum?.on("accountsChanged", accounts => {
            dispatch(setAccount({ account: accounts[0] }));
        });
    }, []);

    const getAddress = (acc) => {
        var acc = acc.substring(0, 8);
        acc = acc + '...';
        return acc;
    }

    return (
        <div>
            <div className="div-table-col">
                <div className='section-image-block'>
                    <img src={getImageURI(data.image)} />
                    <div className='section-image-desc'>
                        <span>{
                            data.name != undefined ? data.name : tokenName
                        }</span>
                        <span>Any</span>
                    </div>
                </div>
            </div>
            <div className="div-table-col primary-text">{getAddress(offer.owner)}</div>
            <div className="div-table-col">1h 23m</div>
            <div className="div-table-col">
                <Button disableRipple variant='outlined' className={"btn bg-white"}>View</Button>
                {item.owner == account ? <Button disableRipple variant='contained' className={"btn btn-success"} onClick={e => acceptOffer(index)}>Accept</Button> : <></>}
            </div>
        </div>
    )
}

export default SwapOffer