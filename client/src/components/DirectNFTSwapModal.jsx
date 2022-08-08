import React from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import MiniCardView from '../components/MiniCardView';

const DirectNFTSwapModal = ({ offerNftModal, handleClose, classes, directNftSwap, available, swapOffer, setSwapOffer, nftSwap }) => {
    return (
        <Modal
            keepMounted
            open={offerNftModal}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={`modal ${classes.modal}`}>
                <div className={"display-flex flex-justify"}>
                    <h3 className="section-title font-16">Offer NFT </h3>
                    <CloseIcon className="pointer" onClick={() => handleClose()} />
                </div>
                <div className={`${classes.offerList}`}>
                    {
                        available.map((token, index) => {
                            return <div className={`${classes.offerListItem}`} key={index}>
                                <MiniCardView token={token} swapOffer={swapOffer} setSwapOffer={setSwapOffer} />
                            </div>
                        })
                    }
                </div>
                <div className={`section-block margin-top-20 bottom-section`}>
                    <div className="center">
                        <Button disableRipple className={"btn btn-grey"} onClick={() => handleClose()}>Cancel</Button>
                        <Button disableRipple className={"btn white-text text-center margin-left-10"} onClick={directNftSwap}>Confirm</Button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default DirectNFTSwapModal