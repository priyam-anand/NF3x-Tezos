import React, { Fragment, useEffect, useState } from 'react';
import Listingsidebar from '../components/ListingSidebar';
import { makeStyles } from '@mui/styles';
import ComponentHeader from '../components/ComponentHeader';
import { useSelector, useDispatch } from 'react-redux';
import ListingCard from '../components/ListingCard';
import Addresses from "../contracts/Addresses.json";
import { ReactComponent as FilterFill } from "../SVG/filter-fill.svg";
import { ReactComponent as FilterStroke } from "../SVG/filter-stroke.svg";
import { fetchAccount, fetchGetter, fetchWeb3, setNetwork } from '../api/web3';
import { getListedItems } from '../api/getter';

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
  const { account, web3, getter } = useSelector((state) => state.web3Config);
  const dispatch = useDispatch();
  const [filterCategories, setFilterCategories] = useState([
    { name: 'Payments', filters: [{ name: "Pay in full", isSelected: true }, { name: "Pay partial", isSelected: true }, { name: 'Swap', isSelected: true }] }]);
  const [listedItems, setListedItems] = useState([]);
  const [sidebarstate, setsidebarstate] = useState(true);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [offeredFilter, setOfferedFilter] = useState([]);
  const [wantedOfferFilter, setWantedOfferFilter] = useState([]);
  const [count, setCount] = useState(0);
  const [searchResult, setSearchResult] = useState(null);

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

  const init = async () => {
    try {
      var _web3 = await fetchWeb3(web3, dispatch);
      await fetchAccount(_web3, account, dispatch);
      await setNetwork(_web3);
      await fetchGetter(_web3, getter, dispatch);
    } catch (error) {
      console.log(error);
      window.alert("An error occured");
    }
  }

  const validateCardData = (item) => {
    const payInFull = filterCategories[0].filters[0].isSelected;
    const payPartial = filterCategories[0].filters[1].isSelected;
    const swap = filterCategories[0].filters[2].isSelected;
    const listingType = item.listingType;
    if (payInFull && payPartial && swap)
      return listingType[0] || listingType[1] || listingType[2];
    if (payInFull && payPartial)
      return listingType[0] || listingType[1];
    if (payPartial && swap)
      return listingType[2] || listingType[1];
    if (payInFull && swap)
      return listingType[0] || listingType[2];
    if (payInFull)
      return listingType[0];
    if (payPartial)
      return listingType[1];
    if (swap)
      return listingType[2];
    return false;
  }

  const validOfferedFilter = (item) => {
    if (offeredFilter.length == 0)
      return true;
    for (let i = 0; i < offeredFilter.length; i++) {
      if (Addresses.nameToAddress[offeredFilter[i].title] == item.token.toLowerCase())
        return true;
    }
    return false;
  }

  const validWantedCollection = (item) => {
    if (wantedOfferFilter.length == 0)
      return true;
    for (let i = 0; i < item.swapListing.token_addresses.length; i++) {
      for (let j = 0; j < wantedOfferFilter.length; j++) {
        if (Addresses.nameToAddress[wantedOfferFilter[j].title] == item.swapListing.token_addresses[i].toLowerCase())
          return true;
      }
    }
    return false;
  }

  const _getListedItems = async () => {
    const items = await getListedItems(getter, account)
    setListedItems(items);
  }

  const getCount = () => {
    var _count = 0;
    for (let i = 0; i < listedItems.length; i++) {
      if (validateCardData(listedItems[i]) && validOfferedFilter(listedItems[i]) && validWantedCollection(listedItems[i]) && isSearchValid(listedItems[i]))
        _count++;
    }
    setCount(_count);
  }

  const isSearchValid = (item) => {
    if (searchResult == null || Addresses.nameToAddress[searchResult] == item.token.toLowerCase())
      return true;
    return false;
  }

  useEffect(() => {
    init();
    updateSize();
  }, []);

  useEffect(() => {
    if (web3 != undefined) {
      web3._provider.on('chainChanged', () => {
        window.location.reload();
      })
      web3._provider.on('accountsChanged', () => {
        window.location.reload();
      })
    }
  }, [web3]);

  useEffect(() => {
    if (getter != undefined)
      _getListedItems();
  }, [getter]);

  useEffect(() => {
    getCount();
  }, [listedItems]);

  useEffect(() => {
    getCount();
  }, [offeredFilter.length, filterCategories[0].filters[0].isSelected, filterCategories[0].filters[1].isSelected, filterCategories[0].filters[2].isSelected, wantedOfferFilter.length, searchResult])

  if (web3 == undefined)
    return <></>
  console.log(searchResult);
  return (
    <Fragment>
      <ComponentHeader searchResult={searchResult} setSearchResult={setSearchResult} />
      <div className={classes.root}>
        <div className={`listingsidebar ${!sidebarstate ? "listingsidebarHide" : ""}`}>

          <div className={`filter-title flex-justify align-center padding-10 outline-bottom-border padding-bottom-20`}>
            <span className='primary-text font-bold-16'>
              {
                searchResult == null
                  ? `All Collections (${count})`
                  : `${searchResult} (${count})`
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
              {
                searchResult == null
                  ? <span className='bold'>{`All Collections (${count})`}</span>
                  : <span className='flex-justify width-100'>
                      <span className="display-flex column-direction" style={{flex: "80%"}}>
                        <span className='font-20 bold'>{`${searchResult} (${count})`}</span>
                        <span className='flex-justify-start medium-weight'>
                          <span className='b-grey-text margin-right-5'>By</span>
                          <span className='black-text'>kingofthegoblin</span>
                        </span>
                      </span>
                      <span className='display-flex column-direction margin-right-40 center'>
                        <span className='black-text'>2351</span>
                        <span className='b-grey-text font-normal'>Items</span>
                      </span>
                      <span className='display-flex column-direction margin-right-40 center'>
                        <span className='black-text'>4.6K</span>
                        <span className='b-grey-text font-normal'>Owners</span>
                      </span>
                    </span>
              }
            </span>
          </div>

          <div className={`list-main-cards`}>
            {listedItems.map((item, index) => {
              if (validateCardData(item) && validOfferedFilter(item) && validWantedCollection(item)) {
                if (isSearchValid(item))
                  return <ListingCard key={index} item={item} />
              }
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ListingPage;