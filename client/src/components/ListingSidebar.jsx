import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircleIcon from '@mui/icons-material/Circle';
import { Chip, IconButton, Paper, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AntSwitch from '../common/AntSwitch';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactComponent as Filter } from '../SVG/filter.svg';
import { ReactComponent as FilterCollapse } from '../SVG/filter-collapse.svg';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles({
  root: {
    marginInline: '10px',
  },
  listingMainhead: {
    paddingBlock: '30px',
    fontSize: "20px",
    fontWeight: "700",
    borderBottom: "1px solid #E6E8EC",
    justifyContent: 'space-between',
    '& span': {
      // marginRight: '40px'
    },
    "& .filter-chip": {
      width: "20px !important",
      height: "20px !important",
      background: "transparent",
      border: "2px solid #000",
      position: "relative",
      "& > span": {
        position: "absolute",
        top: "0px",
        left: "0px",
        padding: 0
      }
    },
    '@media (max-width: 600px)': {
      "&.listing-filter": {
        display: "none"
      }
    }

  },
  filterboxsection: {
    paddingBlock: '15px',
    '& .MuiOutlinedInput': {
      padding: '0'
    },
    '& input': {
      padding: '0px !important',
      borderRadius: '20px'

    },
    MuiInputBaseColorPrimary: {
      borderRadius: '8px',
      paddingRight: '10px'
    }
  },
  filterboxfield: {
    width: '100% !important'
  },
  filterOptions: {
    marginRight: 0, paddingLeft: '10px', fontSize: '10px', paddingBlock: '0', display: 'flex', alignItems: 'center'
  },
});

const collections = [
  { title: 'Bored Apes' },
  { title: 'Azuki' },
  { title: 'Noodles' },
  { title: 'Mooncats' },
  { title: 'WVRP' },
  { title: 'World of Women' },
  { title: "Doodles" }
];

const blue = {
  500: '#FF0083',
};

const grey = {
  400: '#BFC7CF',
  500: '#AAB4BE',
  600: '#6F7E8C',
};


function Listingsidebar({ filterstatus, filterCategories, onFilterChange, offeredFilter, setOfferedFilter, wantedOfferFilter, setWantedOfferFilter }) {
  const classes = useStyles();
  const [filterstate, setfilterstate] = useState(true);
  const [expanded, setExpanded] = useState('panel1');

  const updateSize = () => {
    let isMobile = window.innerWidth > 600;
    setfilterstate(isMobile);
  }

  window.addEventListener('resize', updateSize);

  return (<>
    {!filterstate &&
      <div className={classes.root}>
        <div className={`${classes.listingMainhead} flex-justify align-center`} style={{ paddingBlock: "27px !important" }} onClick={() => { setfilterstate(!filterstate); filterstatus(!filterstate) }}>
          <span className='inline-block font-16 t2-text'>
            <Filter />
          </span>
        </div>
      </div>}
    {filterstate &&
      <div className={`${classes.root}`}>
        <div className={`${classes.listingMainhead} flex-justify align-center listing-filter`} >
          <span className='inline-block font-16 t2-text flex-justify display-flex align-center'>
            <Filter />
            <span className='medium-weight' style={{ marginLeft: "5px" }}>Filter</span>
          </span>
          <FilterCollapse onClick={() => { setfilterstate(!filterstate); filterstatus(!filterstate) }} />
        </div>
        {filterCategories.map((filterCategory, parentIndex) => {
          return <Accordion defaultExpanded className='no-shadow no-border outline-bottom-border padding-bottom-10 padding-top-10' key={parentIndex}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel1${parentIndex}a-content`} id={`panel1${parentIndex}a-header`} className={"padding-zero"}>
              <span className={`flex-justify t2-text font-bold-14 padding-zero`}>{filterCategory.name}</span>
            </AccordionSummary>
            <AccordionDetails>
              {filterCategory.filters.map((filter, i) => {
                return <div className={` flex-justify`} key={i}>
                  {/* ${classes.paymentoptions} */}
                  <span className={`t2-text font-14`}>{filter.name}</span>
                  <span className='switchElem margin-tb-10'>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AntSwitch sx={{ fontSize: "18px" }} inputProps={{ 'aria-label': 'ant design' }} onClick={(e) => onFilterChange(e, parentIndex, i)} {...label} checked={filter.isSelected} />
                    </Stack>
                  </span>
                </div>;
              })}
            </AccordionDetails>
          </Accordion>;
        })}

        <Accordion defaultExpanded className={` ${classes.filterboxsection} no-shadow no-border outline-bottom-border padding-bottom-10 padding-top-10`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel2a-content`} id={`panel2a-header`} className={"padding-zero"}>
            <span className={`flex-justify t2-text font-bold-14 padding-zero`}>Offered Collections</span>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              component="form"
              className={"search-input input-text no-shadow"}
              sx={{ p: '0px 4px', display: 'flex', alignItems: 'center', "& .MuiAutocomplete-inputRoot": { paddingTop: "0px !important", paddingBottom: "0px !important" } }}
            >
              <IconButton disableRipple sx={{ p: '6px', color: '#B0B7C3' }} aria-label="search">
                <SearchIcon className='b-grey-text' />
              </IconButton>
              <Autocomplete
                multiple
                popupIcon
                className={classes.filterboxfield}
                id="checkboxes-tags-demo"
                options={collections}
                disableCloseOnSelect
                value={offeredFilter}
                onChange={(event, value) => {
                  setOfferedFilter(value);
                }}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li {...props} className={classes.filterOptions} style={{}}>
                    <Checkbox
                      icon={<CircleIcon />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                      style={{ marginRight: 0, paddingLeft: 0, color: '#FF0083' }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search" className='filterinput' />
                )}
              />
            </Paper>
          </AccordionDetails>
        </Accordion>



        <Accordion defaultExpanded className={` ${classes.filterboxsection} no-shadow no-border padding-top-10`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel3a-content`} id={`panel3a-header`} className={"padding-zero"}>
            <span className={`flex-justify t2-text font-bold-14 padding-zero`}>Wanted Collections</span>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              component="form"
              className={"search-input input-text no-shadow outline-border"}
              sx={{ p: '0px 4px', display: 'flex', alignItems: 'center', "& .MuiAutocomplete-inputRoot": { paddingTop: "0px !important", paddingBottom: "0px !important" } }}
            >
              <IconButton disableRipple sx={{ p: '6px', color: '#B0B7C3' }} aria-label="search">
                <SearchIcon className='b-grey-text' />
              </IconButton>
              <Autocomplete
                multiple
                popupIcon
                className={classes.filterboxfield}
                id="checkboxes-tags-demo"
                options={collections}
                disableCloseOnSelect
                value={wantedOfferFilter}
                onChange={(event, value) => {
                  setWantedOfferFilter(value);
                }}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li {...props} className={classes.filterOptions} style={{}}>
                    <Checkbox
                      icon={<CircleIcon />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                      style={{ marginRight: 0, paddingLeft: 0, color: '#FF0083' }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search" className='filterinput' />
                )}
              />
            </Paper>
          </AccordionDetails>
        </Accordion>
      </div>
    }
  </>);
}

export default Listingsidebar;