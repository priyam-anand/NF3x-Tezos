import { getImageURI } from '../../../api/getterTezos';
import { ReactComponent as SwapIcon } from '../../../SVG/swap.svg';

const OfferItem = ({ item }) => {
    return <div className="display-flex align-center">
        <div className='relative display-flex outline-border radius-10 padding-10'>
            <img className="small-card-img radius-5 margin-right-5" src={getImageURI(item.thumbnailUri)} />
            <div className='flex-justify-start column-direction'>
                <span className='t2-text font-14 left'>{item.name}</span>
            </div>
        </div>
        <div className="m-auto double-arrow-icon">
            <SwapIcon />
        </div>
    </div>
}

export default OfferItem;