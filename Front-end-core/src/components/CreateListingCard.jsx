import React from 'react';
import { makeStyles } from '@mui/styles';
import { getImageURI } from "../api/getterTezos";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        margin: "10px"
    }
})

const CreateListingCard = ({ token, selected, setSelected }) => {
    const handleClick = () => {
        setSelected({ ...selected, token: token.contract.address, tokenId: token.tokenId, metadata : token.metadata });
    }

    const isSelected = () => {
        return (selected.token == token.contract.address && selected.tokenId == token.tokenId)
    }

    const classes = useStyles();

    return (
        <div className={`${isSelected() ? "active-box" : ""} section-btn-block ${classes.root}`} onClick={handleClick} >

            <img className='radius-10' src={getImageURI(token.metadata.thumbnailUri)} />
            <h3>{token.metadata.name}</h3>
        </div>
    );
}

export default CreateListingCard