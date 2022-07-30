import React, { useEffect, useState } from 'react'
import { ArrowForwardIos } from '@mui/icons-material';
import { Button, Chip } from '@mui/material';
import axios from "axios";
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAccount } from '../redux/web3ConfigSlice';
import { DoubleArrowIcon } from './DoubleArrowIcon';
import Addresses from "../contracts/Addresses.json";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getImageURI, _getToken } from '../../../api/getter';

const useStyles = makeStyles({
    maincard: {
        minHeight: '300px',
        display: "inline-block",
        verticalAlign: "top",
        minWidth: '240px',
        maxWidth: "240px",
        padding: '10px',
        margin: "0 40px 0 0px",
        borderRadius: "15px",
        width: 'auto',
        position: "relative",
        border: "1px solid transparent",
        boxShadow: '0px 0px 16.0897px rgba(37, 97, 186, 0.12)',
        "& .btn-edit > span:first-child": {
            marginRight: "3px"
        },
        '& > div': {
            background: "rgba(230, 232, 236, 0.22)",
            width: '240px'
        },
        "& h3": {
            fontSize: "13px",
            fontWeight: "500",
            color: "#23262F"
        },
        "& .swap-card": {
            position: "relative",
            border: "0.668067px solid #E6E8EC !important",
            width: "calc(100% - 20px)"
        },
        "& .swap-card .caption": {
            marginBottom: "20px"
        },
        "&:hover": {
            boxShadow: "0px 0px 25px rgba(37, 97, 186, 0.16)"
        }
    }
});

const ListingCard = ({ item, isEditable, onHandleSelectedItem, itemIndex, isActive }) => {
    const classes = useStyles();
    const { getter } = useSelector((state) => state.web3Config);
    const { account } = useSelector((state) => state.web3Config);
    const { web3 } = useSelector((state) => state.web3Config);
    const [data, setData] = useState({
        name: "",
        image: ""
    });
    const [tokenName, setTokenName] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        window?.ethereum?.on("accountsChanged", accounts => {
            dispatch(setAccount({ account: accounts[0] }));
        });
    }, [])

    const getData = async () => {
        try {
            if (item.token.toLowerCase() == Addresses.nameToAddress["World of Women"].toLowerCase()) {
                const _tokenDetails = await _getToken(item.token, item.tokenId);
                setData({ name: _tokenDetails.name, image: _tokenDetails.image_url })
            }
            else {
                const _tokenDetails = await getter.methods.getTokenDetails(item.token, item.tokenId).call({ from: account });
                const data = await axios.get(_tokenDetails[0]);
                setData(data.data);
                setTokenName(_tokenDetails[1]);
            }
        } catch (err) {
            if (err.response.status == 429) {
                setTimeout(() => {
                    getData();
                }, 500);
            } else {
                window.alert(err.message);
                console.error(err);
            }

        }

    }

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }

    useEffect(() => {
        getData();
    }, []);

    const chips = () => {
        return item.swapListing.token_addresses.map((address, index) => {
            return <Chip className='chip-block chip' key={index} label={`${Addresses.addressToName[address.toLowerCase()]} + ${item.swapListing.amounts[index] > 0 ? toETH(item.swapListing.amounts[index]) : ""}`} variant="outlined" />
        });
    }

    return (
        <div className={`${classes.maincard} ${isActive && "active-box"}`}>
            <div><img src={getImageURI(data.image)} style={{ minHeight: "235px", width: "239px", borderRadius: "15px" }} alt='img' /></div>
            <Link to={`/listdetail/${item.id}`}>
                <h3>{data.name == undefined ? tokenName : data.name}<ArrowForwardIos sx={{ verticalAlign: "middle", marginLeft: "4px", fontSize: "13px", color: "#332233" }} /></h3>
            </Link>
            <div className='section-btn-block swap-card'>
                <div className='caption'>Looking For</div>
                <DoubleArrowIcon />
                {item.directListing.payment_tokens.length == 0 ? <></> : <Chip className='chip-block chip' label={toETH(item.directListing.amounts[0])} variant="outlined" />}
                {item.bnplListings.length == 0 ? <></> : <Chip className='chip-block chip' label={`${toETH(item.bnplListings[0].deposit)} + ${toETH(item.bnplListings[0].remaining_amount)} ${(item.bnplListings[0].duration / 86400).toFixed()} Days`}
                    variant="outlined" />}
                {item.swapListing.payment_tokens.length == 0 ? <></> : chips()
                }
            </div>
            {isEditable && <Button disableRipple onClick={() => onHandleSelectedItem(item, itemIndex)} startIcon={<EditOutlinedIcon className='font-14' />} className={"btn btn-edit font-14 absolute"} variant="contained">edit</Button>}
        </div>
    )
}

export default ListingCard