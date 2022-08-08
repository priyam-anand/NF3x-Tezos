import React, { Fragment, useState, useEffect } from 'react'
import { Card, Chip } from '@mui/material';
import { _getToken } from '../api/getter';
import { getImageURI } from '../api/getterTezos';
import { getTezLogo } from '../utils';
import TezLogo from "../SVG/TezosLogo_Icon_Blue.png";

const CreateListingPreview = ({ selected, bnplListings, interestedToSwap }) => {

    const [token, setToken] = useState({
        image: '',
        name: ''
    })
    const getItem = async () => {
        setToken({
            image: selected.metadata.thumbnailUri,
            name: selected.metadata.name
        })
    }

    useEffect(() => {
        getItem();
    }, [selected.token, selected.tokenId]);

    const getBnplListings = () => {
        return bnplListings.map((listing) => {
            return <Chip sx={{ maxWidth: "230px" }} className='chip-block chip' label={<Fragment>
                <img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                <span className='ellipsis' style={{ marginRight: "3px" }}>{listing.deposit}</span>
                <span style={{ marginRight: "3px" }}>+</span>
                <img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                <span className='ellipsis' style={{ marginRight: "3px" }}>{listing.remainingAmt}</span>
                {`${listing.duration} Days`}</Fragment>}
                variant="outlined" />
        })
    }

    const getSwapListings = () => {
        return interestedToSwap.map((listing) => {
            return <Chip sx={{ maxWidth: "230px" }} className='chip-block chip'
                label={`${listing.swapToken} - Any ${listing.swapAmount == '' || listing.swapAmount == 0 ? "" : ` + ${listing.swapAmount}`}`}
                variant="outlined" />
        })
    }

    if (selected.token == '') {
        return <p className="center">
            Select an NFT to begin listing
        </p>
    }

    return (
        <Card className={`no-shadow padding-10`}>
            <div className={`generic-card medium-card height-auto radius-20 pointer relative overflow-hidden`} style={{ maxWidth: "300px" }}>
                <img className='radius-20' src={getImageURI(token.image)} alt='img' />
                <div className='card-footer'>
                    <div className='flex-justify'>
                        <span className='font-14 medium-weight t2-text ellipsis'>{token.name}</span>
                    </div>
                    <div className='flex-justify-start column-direction card-chip-block'>
                        {
                            selected.sale ? <div className='green-block flex-justify-start'>
                                <span className='font-11 light-grey-text chip-title'>Swap Now: </span> <Chip sx={{ maxWidth: "230px" }} className='chip-block chip' label={<span>                    <img src={TezLogo} style={{ marginRight: "2px", marginTop: "2px", height: "12px", width: '10px' }} />
                                    {selected.directSalePrice} </span>} variant="outlined" />
                            </div> : null
                        }
                        {
                            selected.bnpl ? <div className='blue-block flex-justify-start'>
                                <span className='font-11 light-grey-text chip-title'>Reserve: </span>
                                <span>{getBnplListings()}</span>
                            </div> : null
                        }
                        {
                            selected.swap ? <div className='purple-block flex-justify-start'>
                                <span className='font-11 light-grey-text chip-title'>Exchange: </span>
                                <span>{getSwapListings()}</span>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CreateListingPreview