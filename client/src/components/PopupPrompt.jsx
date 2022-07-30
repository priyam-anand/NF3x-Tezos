import { Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';

const useStyles = makeStyles({
    root: {
        
    }
});

const PopupPrompt = ({isOpen, onClickNo, onClickYes, titleContent}) => {
    const classes = useStyles();
    return <div className={`${classes.root}`}>
                <Modal
                open={isOpen}
                onClose={()=>onClickNo(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box className={`nft-popup bg-white radius-15 padding-15`} sx={{width: "290px"}}>
                        <div className='width-100 flex-justify column-direction padding-20'>
                            <span className='t2-text font-14'>{titleContent}</span>
                            <div className={`flex-justify align-center space-around margin-top-30`}>
                                <span className='primary-text font-16 bold pointer' onClick={onClickYes}>Yes</span>
                                <span className='primary-text font-16 bold pointer' onClick={onClickNo}>No</span>
                            </div>
                        </div>
                    </Box>
                </Modal>
           </div>
}

export default PopupPrompt;