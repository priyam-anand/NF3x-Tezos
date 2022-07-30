import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setAccount } from '../redux/web3ConfigSlice';
import Button from '@mui/material/Button';
import { getTokenDetails } from '../api/getter';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
    root: {
        marginBottom: "10px",
        "& .section-image-block": {
            margin: "23px 24px",
            "@media (max-width: 600px)": {
                margin: "13px 12px"
            }
        },
        "& .interes-plus": {
            margin: "0 30px",
            "@media (max-width: 600px)": {
                margin: "0 15px"
            }
        },
        "& .swap-input": {
            "margin-right": "30px"
        },
        "& .make-offer": {
            padding: "10px 15px !important",
            "@media (max-width: 600px)": {
                lineHeight: "14px"
            }
        }
    }
});

// get token uri, contract name and image.

function InterestedSwap({ addresses, amounts, setOfferNftModal, owner }) {
    const classes = useStyles();

    const { getter, account, web3 } = useSelector((state) => state.web3Config);

    const [data, setData] = useState([{
        name: "",
        image: ""
    }]);
    const [tokenName, setTokenName] = useState([]);

    const toETH = (amount) => {
        return web3.utils.fromWei(amount, 'ether');
    }
    const getImageURI = (uri) => {
        uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
        return uri;
    }
    const dispatch = useDispatch();

    useEffect(() => {
        window?.ethereum?.on("accountsChanged", accounts => {
            dispatch(setAccount({ account: accounts[0] }));
        });
    }, [])

    useEffect(() => {
        const init = async () => {
            const _data = []
            const _tokenName = [];
            for (var i = 0; i < addresses.length; i++) {
                const _tokenDetails = await getTokenDetails({ token_addresses: [addresses[i]], tokenIds: [1] }, getter, account);
                const data = await axios.get(_tokenDetails[0]);

                _data.push(data.data);
                _tokenName.push(_tokenDetails[1]);
            }
            setData(_data);
            setTokenName(_tokenName);
        }
        init();
    }, [])

    return (
        <>{
            data.map((_data, index) => {
                return <div className={`${classes.root} flex-justify align-center`}>
                    <div className='outline-border radius-10 flex-justify align-center'>
                        <div className='section-image-block width-100 flex-justify align-center' key={index}>
                            <div className='flex-justify align-center margin-right-20'>
                                <img src={getImageURI(_data.image)} />
                                <div className='section-image-desc'>
                                    <span>{tokenName[index]}</span>
                                    <span>Any</span>
                                </div>
                            </div>
                            {
                                amounts[index] > 0 ? <><span className="interes-plus"> + </span>
                                    <span className='flex-justify align-center swap-input margin-right-10'>
                                        <img style={{ width: "15px", height: "25px", padding: "12px 0" }} src='../img/ethereum.png' className="eth-img" />
                                        <span style={{ marginRight: "5px" }} className='font-26 t2-text'>{toETH(amounts[index] + "")}</span>
                                    </span></> : null
                            }
                            {
                                owner != account ? <Button disableRipple variant='outlined' className={"btn btn-grey make-offer"} onClick={setOfferNftModal}>Make Offer</Button> : null
                            }
                        </div>

                    </div>
                </div>
            })
        }
        </>
    );
}

export default InterestedSwap;