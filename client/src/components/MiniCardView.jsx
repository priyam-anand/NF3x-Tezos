import { makeStyles } from '@mui/styles';
import { getImageURI } from '../api/getterTezos';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const useStyles = makeStyles({
  root: {
    boxShadow: "0px 0px 25px rgba(37, 97, 186, 0.12)",
    maxWidth: "223px !important",
    "& img": {
      width: "202px",
      height: "199px"
    },
    "& .section-btn-block": {
      background: "#ffffff",
      border: "none",
    },
    "& h3": {
      fontSize: "13px",
      color: "#23262F",
      fontWeight: 500,
      marginTop: "10px"
    }
  },
  active: {
    boxShadow: "0px 0px 4px #ff0083 !important",
  }
});

function MiniCardView({ token, swapOffer, setSwapOffer }) {

  const handleSelect = () => {
    setSwapOffer({
      ...swapOffer,
      tokenAddress: token.contract.address,
      tokenId: token.tokenId,
      name: token.metadata.name,
      image: getImageURI(token.metadata.thumbnailUri)
    })
  }

  const classes = useStyles();
  if (swapOffer.tokenAddress == token.contract.address && swapOffer.tokenId == token.tokenId) {
    return (
      <div className={`${classes.root} ${classes.active} section-btn-block card-view`} onClick={handleSelect}>
        <img className='radius-10' src={getImageURI(token.metadata.thumbnailUri)} />
        <h3>
          {token.metadata.name}
        </h3>
      </div>
    )
  }
  return (
    <div className={`${classes.root} section-btn-block card-view`} onClick={handleSelect}>
      <img className='radius-10' src={getImageURI(token.metadata.thumbnailUri)} />
      <h3>
        {token.metadata.name}
      </h3>
    </div>
  );
}

export default MiniCardView;