import React, { Fragment, useEffect, useState } from 'react';
import Listingsidebar from '../components/ListingSidebar';
import { makeStyles } from '@mui/styles';
import ComponentHeader from '../components/ComponentHeader';
import { useSelector, useDispatch } from 'react-redux';
import ListingCard from '../components/ListingCard';
import Addresses from "../contracts/Contracts.json";
import { ReactComponent as FilterFill } from "../SVG/filter-fill.svg";
import { ReactComponent as FilterStroke } from "../SVG/filter-stroke.svg";
import { init, getAccount, getGetters } from "../api/tezos";
import { getListedItems } from '../api/getterTezos';
import { useNavigate } from 'react-router-dom';
import PositionListingCard from '../components/PositionListingCard';
import LoadingPage from './LoadingPage';

const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: "#FFFFFF",
    display: 'flex',
    flexDirection: 'row',
    '& .listingsidebar': {
      width: '250px',
      minWidth: "250px",
      "& .filter-title": {
        display: "none !important"
      },
      '@media (max-width: 600px)': {
        borderRight: 'none',
        width: "100%",
        "& .filter-title": {
          display: "flex !important"
        }
      }
    },
    '& .listingsidebarHide': {
      width: '50px',
      minWidth: "50px",
    },
    '@media (max-width: 600px)': {
      flexDirection: "column",
      padding: "10px",
      boxSizing: "border-box"
    }
  },
  listingMain: {
    width: 'calc(100% - 250px)',
    paddingLeft: '40px',
    color: '#777E91',
    minHeight: "calc(100vh - 75px)",
    borderLeft: '1px solid #E6E8EC',
    "& .expandList": {
      width: 'calc(100% - 50px) !important',
    },
    "&.expandList": {
      width: 'calc(100% - 51px)',

    },
    '@media (max-width: 600px)': {
      borderLeft: 'none',
      paddingLeft: 0,
      width: "100%",
      marginTop: "40px"
    }
  },
  listingMainhead: {
    paddingBlock: '30px',
    paddingLeft: '20px',
    display: 'flex',
    fontSize: "20px",
    fontWeight: "700",
    borderBottom: "1px solid #E6E8EC",
    justifyContent: 'row',
    // '& span': {
    //   marginRight: '40px'
    // }
  },
  listmaincards: {
    paddingBlock: '39px',
    paddingLeft: '26px',
    display: 'flex',
    flexFlow: 'row',
    flexWrap: 'wrap',
    marginBottom: '20px',
    background: '#fff',

  },

});

function ListingPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { tezos, wallet, account, getters } = useSelector((state) => state.tezosConfig);
  const dispatch = useDispatch();
  const [filterCategories, setFilterCategories] = useState([
    { name: 'Payments', filters: [{ name: "Pay in full", isSelected: true }, { name: "Pay partial", isSelected: true }, { name: 'Swap', isSelected: true }] }]);
  const [listedItems, setListedItems] = useState([]);
  const [sidebarstate, setsidebarstate] = useState(true);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [offeredFilter, setOfferedFilter] = useState([]);
  const [wantedOfferFilter, setWantedOfferFilter] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();

  const updateSize = () => {
    let isMobile = window.innerWidth > 600;
    setToggleFilter(isMobile);
    setsidebarstate(sidebarstate ? sidebarstate : isMobile);
  }

  window.addEventListener('resize', updateSize);

  const filterstatus = (status) => {
    setsidebarstate(status);
  };

  const onFilterChange = (e, parentIndex, index) => {
    if (filterCategories[parentIndex] && !filterCategories[parentIndex].filters) return;
    let currentData = [...filterCategories];
    currentData[parentIndex].filters[index].isSelected = e.target.checked;
    setFilterCategories(currentData);
  }

  const _init = async () => {
    try {
      const { _tezos, _wallet } = await init(tezos, wallet, dispatch);
      await getAccount(_tezos, _wallet, account, dispatch);
      await getGetters(_tezos, getters, dispatch);

    } catch (error) {
      console.log(error);
      window.alert("An error occured");
      navigate('/');
    }
  }

  const notExpired = (timePeriod) => {
    const expires = (new Date(timePeriod)).getTime();
    const curr = Math.floor(Date.now());
    return expires > curr
  }

  const _getListedItems = async () => {
    try {
      const items = await getListedItems(getters);
      setListedItems(items);
      setLoading(false);
    } catch (error) {
      console.log(error);
      window.alert("An error occured");
      navigate('/');
    }
  }

  useEffect(() => {
    _init();
    updateSize();
  }, []);

  useEffect(() => {
    if (getters != undefined)
      _getListedItems();
  }, [getters]);

  if (loading)
    return <LoadingPage />

  return (
    <Fragment>
      <ComponentHeader searchResult={searchResult} setSearchResult={setSearchResult} />
      <div className={classes.root}>
        <div className={`listingsidebar ${!sidebarstate ? "listingsidebarHide" : ""}`}>

          <div className={`filter-title flex-justify align-center padding-10 outline-bottom-border padding-bottom-20`}>
            <span className='primary-text font-bold-16'>
              {
                `All Collections`
              }
            </span>
            <span>
              {toggleFilter ? <FilterFill onClick={() => setToggleFilter(false)} /> : <FilterStroke onClick={() => setToggleFilter(true)} />}
            </span>
          </div>

          {toggleFilter && <Listingsidebar filterstatus={filterstatus} filterCategories={filterCategories} onFilterChange={onFilterChange} offeredFilter={offeredFilter} setOfferedFilter={setOfferedFilter} wantedOfferFilter={wantedOfferFilter} setWantedOfferFilter={setWantedOfferFilter} />}
        </div>
        <div className={`${classes.listingMain} ${(!sidebarstate && "expandList") ?? ""} `}>

          <div className={`${classes.listingMainhead}  desktop-listing-title`}>
            <span className='primary-text font-16 width-100'>
              <span className='bold'>{`All Collections`}</span>
            </span>
          </div>

          <div className={`list-main-cards`}>
            {listedItems.map((item, index) => {
              if (notExpired(item.listing.timePeriod)) {
                if (item.token != Addresses.PositionToken)
                  return <ListingCard key={index} item={item} />
                else
                  return <PositionListingCard key={index} item={item} />
              }
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ListingPage;