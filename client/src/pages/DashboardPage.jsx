import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import ComponentHeader from '../components/ComponentHeader';
import { Drawer, MenuItem, Select } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as FilterFill } from "../SVG/filter-fill.svg";
import { ReactComponent as FilterStroke } from "../SVG/filter-stroke.svg";
import Dashboardsidebar from '../components/DashboardSidebar';
import Addresses from "../contracts/Addresses.json";
import MyListingView from '../components/listingpage/MyListingView';
import WalletView from '../components/listingpage/WalletView';
import OffersContainerView from '../components/listingpage/OffersContainerView';
import ReservedItemsContainerView from '../components/listingpage/reserveItems/ReservedItemsContainerView';
import ActivityView from '../components/listingpage/ActivityView';
import { fetchAccount, fetchGetter, fetchMarket, fetchNFTs, fetchWeb3, setNetwork } from '../api/web3';
import { getItemWithOwer, getListedItems, getMyListedItems, _getTokens } from "../api/getter";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: '100%',
    // height: 1116,
    backgroundColor: "#FFFFFF",
    display: 'flex',
    flexDirection: 'row',

    '& .listingsidebar': {
      width: '250px',
      minWidth: "250px",
      // height: '1116px',
    },
    '& .sidebarnarrow': {
      width: '60px',
      // height: '1116px',
    }
  },
  listingMain: {
    width: 'calc(100% - 250px)',
    paddingLeft: '40px',
    paddingRight: "40px",
    minHeight: "calc(100vh - 75px)",
    "@media (max-width: 600px)": {
      width: "100%"
    }
  },
  listingMainhead: {
    paddingBlock: '30px',
    display: 'flex',
    fontSize: "20px",
    fontWeight: "700",
    justifyContent: 'row',
    '& span': {
      marginRight: '79px',
      "@media (max-width: 900px)": {
        marginRight: "30px"
      }
    },
    '& span:last-child': {
      marginRight: '0px'
    }
  }
});

function DashboardPage() {
  
  const classes = useStyles();
  const [showReservedFilters, setShowReservedFilters] = useState(false);
  const [categories, setCategories] = useState([
    { name: 'Wallet', isSelected: true },
    { name: 'Listings', isSelected: false, filters: [{ name: "Item Store", list: [{ name: "Active", isSelected: true }, { name: "Inactive", isSelected: false }] }] }, 
    { name: 'Offers', isSelected: false, filters: [{moduleName: "Offers Received", isSelected: true, filters: [{ name: "See Offers", list: [{ name: "Swap Now", isSelected: true }, { name: "Reserve and swap", isSelected: true }, { name: "NFT Swap", isSelected: true }] }]}, {moduleName: "Offers Made", isSelected: false, filters: [{ name: "Expired Offers", list: [{ name: "Expired Offers", isSelected: false }] }, { name: "See Offers", list: [{ name: "Swap Now", isSelected: true }, { name: "Reserve and swap", isSelected: true }, { name: "NFT Swap", isSelected: true }] }]}] },
    { name: 'Reserved Items', isSelected: false, filters: [{ name: 'Payments', list: [{ name: "Pending", isSelected: true }, { name: "Received", isSelected: true }], showFilters: showReservedFilters }] }]);

  const [menuselection, setmenuselection] = useState('');

  const { account, nfts, web3, getter, market } = useSelector((state) => state.web3Config);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [listedItems, setListedItems] = useState([]);
  const [myListedItems, setMyListedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarstate, setsidebarstate] = useState(true);
  const [available, setAvailable] = useState([]);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [selectedCategoryIndex, setCategoryIndex] = useState(0);

  const init = async () => {
    try {
      var _web3 = await fetchWeb3(web3, dispatch);
      await fetchAccount(_web3, account, dispatch);
      await setNetwork(_web3);
      await fetchGetter(_web3, getter, dispatch);
      await fetchMarket(_web3, market, dispatch);
    } catch (error) {
      console.log(error);
      window.alert("An error occured");
    }
  }

  const updateOfferCategory = (offerToggle) => {
    let currentCateList = [...categories];
    currentCateList[2].filters[0].isSelected = offerToggle;
    currentCateList[2].filters[1].isSelected = !offerToggle;
    setCategories(currentCateList);
  }

  const onHandleCategory = (catIndex) => {
    let key = typeof catIndex == "object" ? catIndex.props.value : catIndex;
    let currentCateList = [...categories.map((cate, i) => {
      if (i === key) {
        setCategoryIndex(key);
        cate.isSelected = true;
        setmenuselection(cate.name);
      } else cate.isSelected = false;
      return cate;
    }
    )];
    setCategories(currentCateList);
  }


  const _getListedItems = async () => {
    var items = await getListedItems(getter, account);
    items = await getItemWithOwer(items, nfts);
    const myItems = await getMyListedItems(getter, account);
    setListedItems(items);
    setMyListedItems(myItems);
    setLoading(false);
  }

  const getTokens = async () => {
    try {
      await _getTokens(account, setAvailable);
    } catch (error) {
      if (error.response.status == 429) {
        setTimeout(() => {
          getTokens();
        }, 500);
      } else {
        window.alert("an error occured");
        navigate('/listing');
      }
    }
  }

  const getContracts = async () => {
    try {
      await fetchNFTs(web3, dispatch);
    } catch (error) {
      console.error(error);
      window.alert("An error ocurred");
    }
  }

  useEffect(() => {
    init();
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
    if (web3 != undefined)
      getContracts();
  }, [web3]);

  useEffect(() => {
    if (account != undefined && getter != undefined && nfts[Addresses.ERC721.length - 1] != undefined) {
      getTokens();
      _getListedItems();
    }

  }, [nfts[Addresses.ERC721.length - 1], account, getter]);

  const filterstatus = (status) => {
    setsidebarstate(status);
  };

  const updateSize = () => {
    let isMobile = window.innerWidth > 600;
    // setToggleFilter(isMobile);
  }

  window.addEventListener('resize', updateSize);

  const onFilterChange = (e, currentMenu, parentIndex, index) => {
    let currentCatIndex = 0;
    for (const ckey in categories) {
      if (categories[ckey]) {
        const currentC = categories[ckey];
        if (currentC.name == currentMenu) {
          currentCatIndex = ckey;
          break;
        }
      }
    }

    if (categories[currentCatIndex] && !categories[currentCatIndex].filters) return;
    let isOneSelected = false;

    let currentCateList = [...categories];
    if (currentMenu === "Listings") {
      currentCateList[currentCatIndex].filters[parentIndex].list = currentCateList[currentCatIndex].filters[parentIndex].list.map((filter, i) => {
        if (i === index) filter.isSelected = e.target.checked;
        if (!isOneSelected && filter.isSelected) isOneSelected = true;
        return filter;
      });
      if (!isOneSelected) currentCateList[currentCatIndex].filters[parentIndex].list[0].isSelected = true;
    }else if (currentMenu === "Offers") {
      currentCateList[currentCatIndex].filters = currentCateList[currentCatIndex].filters.map(module => {
          if(module.isSelected){
            module.filters[parentIndex].list.map( (filter, i) => {
                if (i === index) filter.isSelected = e.target.checked;
                // if (!isOneSelected && filter.isSelected) isOneSelected = true;
                return filter;
            });
          }
          return module;
        });
    }


    setCategories(currentCateList);
  }

  const onReservedItemsButtonChange = (val) => {
    setShowReservedFilters(val);
    categories[3].showFilters = val;
  }

  if (web3 == undefined)
    return <></>

  return (
    <Fragment>
      <ComponentHeader />
      <div className={classes.root}>
        <div className={`${sidebarstate ? 'listingsidebar' : 'sidebarnarrow'} desktop-sm-block`}>
          <Dashboardsidebar menuitems={menuselection} filterstatus={filterstatus} categories={categories} onFilterChange={onFilterChange} />
        </div>
        <div className={`${classes.listingMain} ${!sidebarstate ? "width-100-imp" : ''} outline-left-border`}>
          <div className={`${classes.listingMainhead} outline-bottom-border desktop-sm-block`}>
            {categories.map((category, i) => {
              return <span key={i} className={`${category.isSelected ? "primary-text" : "opacity-5"} font-bold-16 pointer`}
                onClick={() => onHandleCategory(i)}>{category.name}</span>;
            })}
          </div>
          <div className='mobile-sm-flex-dashboard-filter flex-justify align-center padding-top-20'>
            <Select
              className="neutral2-text font-14 bg-neutral2-border radius-10 width-50 border-transparent"
              value={selectedCategoryIndex}
              sx={{ height: "43px" }}
              onChange={(e, data) => onHandleCategory(data)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {categories.map((category, i) => {
                return <MenuItem value={i}>{category.name}</MenuItem>;
              })}
            </Select>
            <span>
              {toggleFilter ? <FilterFill onClick={() => setToggleFilter(false)} /> : <FilterStroke onClick={() => setToggleFilter(true)} />}
            </span>
            <Drawer
              anchor={"bottom"}
              open={toggleFilter}
              onClose={() => setToggleFilter(true)}
            >
              <Dashboardsidebar menuitems={menuselection} filterstatus={filterstatus} categories={categories} onFilterChange={onFilterChange} onClose={setToggleFilter} />
            </Drawer>
          </div>

          {categories[0].isSelected && <WalletView available={available} />}
          {categories[1].isSelected && <MyListingView listedItems={myListedItems} filters={categories[1].filters[0].list} onFilterChange={onFilterChange} />}
          {categories[2].isSelected && <OffersContainerView listedItems={listedItems} modules= {categories[2].filters} updateOfferCategory={updateOfferCategory} />}
          {categories[3].isSelected && <ReservedItemsContainerView onButtonChange={onReservedItemsButtonChange} />}
          {/* {categories[4].isSelected && <ActivityView />} */}
        </div>

      </div>
    </Fragment>
  );
}

export default DashboardPage;