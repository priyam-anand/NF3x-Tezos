import { Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import {ReactComponent as Loader} from '../SVG/loader.svg';

const useStyles = makeStyles({
    root: {
    }
});

const PopupLoader = ({isOpen, titleContent}) => {
    const classes = useStyles();
    return <div className={`${classes.root}`}>
                <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box className={`nft-popup bg-white radius-15 padding-30`} sx={{width: "500px"}}>
                        <div className='width-100 flex-justify column-direction align-center padding-30'>
                            <Loader className='margin-top-20 loader'/>
                            <span className='t2-text font-16 margin-top-40 margin-bottom-20 primary-text'>{titleContent}</span>
                            
                        </div>
                    </Box>
                </Modal>
           </div>
}

export default PopupLoader;