import { ReactComponent as SwapIcon } from '../../../SVG/swap.svg';

const OfferItem = ({ item }) => {
    return <div className="display-flex align-center">
                <div className='relative display-flex outline-border radius-10 padding-10'>
                    <img className="small-card-img radius-5 margin-right-5" src={item.image_url} />
                    <div className='flex-justify-start column-direction'>
                        <span className='t2-text font-14 left'>{item.name != null ? item.name : item.asset_contract.name + " #" + item.token_id}</span>
                        <span className='b-grey-text font-14 left'>Any</span>
                    </div>
                </div>
                <div className="m-auto double-arrow-icon">
                    <SwapIcon />
                </div>
            </div>
}

export default OfferItem;