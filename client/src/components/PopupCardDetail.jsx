import { Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';

const useStyles = makeStyles({
    root: {

    },
    contactDetails: {
        width: "calc(100% - 264px) !important"
    },
    popupProperties: {
        minWidth: "180px"
    }
});

const PopupCardDetail = ({ isOpen, onClickView, popupToken }) => {
    const classes = useStyles();
    return <div className={`${classes.root}`}>
        <Modal
            open={isOpen}
            onClose={() => onClickView(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={`nft-popup bg-white radius-15 padding-15`} sx={{ width: "650px" }}>
                <div className='width-100 flex-justify'>
                    <img className='margin-right-25 radius-15' src={popupToken.image_url} />
                    <div className={`${classes.contactDetails} flex-justify column-direction padding-right-10`}>
                        <span className='neutral2-text font-18'>{popupToken.name != null
                            ? popupToken.name
                            : popupToken.asset_contract.name + " #" + popupToken.token_id
                        }</span>
                        <div className={`flex-justify outline-border margin-top-15 radius-15`}>
                            <div className={`margin-20 overflow-hidden`}>
                                <span className='width-100 flex-justify align-center padding-bottom-5'>
                                    <span className='width-50 grey-text font-16'>Contact Address</span>
                                    <span className='width-50 ellipsis primary-text'>{popupToken.asset_contract.address}</span>
                                </span>
                                <span className='width-100 flex-justify align-center padding-bottom-5'>
                                    <span className='width-50 grey-text font-16'>Token Id</span>
                                    <span className='width-50 ellipsis t2-text'>{popupToken.token_id}</span>
                                </span>
                                <span className='width-100 flex-justify align-center padding-bottom-5'>
                                    <span className='width-50 grey-text font-16'>Token Standard</span>
                                    <span className='width-50 ellipsis t2-text'>ERC-721</span>
                                </span>
                                <span className='width-100 flex-justify align-center padding-bottom-5'>
                                    <span className='width-50 grey-text font-16'>Blockchain</span>
                                    <span className='width-50 ellipsis t2-text'>Ethereum</span>
                                </span>
                                <span className='width-100 flex-justify align-center padding-bottom-5'>
                                    <span className='width-50 grey-text font-16'>Metadata</span>
                                    <span className='width-50 ellipsis t2-text'>Editable</span>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
                <span className='old1-text font-18 margin-top-20 block-elem'>Properties</span>

                <div className='flex-justify align-center width-100 margin-top-20'>
                    {
                        popupToken.traits.map((trait, index) => {
                            if (index >= 3)
                                return null
                            return <div className={`${classes.popupProperties} outline-border radius-15 padding-10 column-direction flex-justify align-center margin-right-20`} key={index}>
                                <span className='primary-text font-14 uppercase'>{trait.trait_type}</span>
                                <span className='neutral2-text opacity-6 bold font-20'>{trait.value}</span>
                                {/* <span className='grey-text font-14'>16% have this trait</span> */}
                            </div>
                        })
                    }
                </div>
            </Box>
        </Modal>
    </div>
}

export default PopupCardDetail;