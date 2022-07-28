import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chip, Stack } from '@mui/material';
import AntSwitch from '../common/AntSwitch';
import {ReactComponent as Filter} from '../SVG/filter.svg';
import {ReactComponent as CrossSVG} from '../SVG/cross.svg';
import {ReactComponent as FilterCollapse} from '../SVG/filter-collapse.svg';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const useStyles = makeStyles({
    roots: {
        marginInline: '20px',
        '@media (max-width: 600px)': {
          paddingBottom: "100px"
        },
        '& #panel1aHeader': {
          padding: 0
        }
    },
    listingMainhead: {
      paddingBlock: '30px',
      fontSize: "20px",
      fontWeight: "700",
      borderBottom: "1px solid #E6E8EC",
      '@media (max-width: 600px)': {
        "&.dashboard-filter": {
          display: "none"
        }
      }
    },
    paymentTitle: {
        fontWeight: '700',
        fontSize: '12px',
        lineHeight: '12px',
        color: '#B1B5C3',
        textTransform: 'capitalize'
    },
    paymentoptions: {
        fontSize: '14px',
        color: '#23262F',
        display: 'flex',
        fontWeight: "500",
        alignItems: 'center',
        '& .switchElem': {
            marginLeft: 'auto'
        }
    },
    filterboxsection: {
      paddingBlock: '52px',
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
    checkbox:{
      '& checked': {
        color: '#000'
      }
    },
    
});

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 }
  ];

const blue = {
  500: '#FF0083',
};

const grey = {
  400: '#BFC7CF',
  500: '#AAB4BE',
  600: '#6F7E8C',
};

function Dashboardsidebar({menuitems, filterstatus, categories, onFilterChange, onClose}) {

    const [itemstate, setItemState] = useState(false);
    const [offerFilter, setOfferFilter] = useState(false);
    const [reservedItemFilter, setReservedItemFilter] = useState(false);
    const [expanded, setExpanded] = useState('panel1');
    const [filterstate, setfilterstate] = useState(true);

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
      setItemState(false);
      setOfferFilter(false);
      setReservedItemFilter(false);
      if(menuitems === 'Listings') setItemState(true);
      else if(menuitems === 'Offers') setOfferFilter(true); 
      else if(menuitems === 'Reserved Items') setReservedItemFilter(true);
    }, [menuitems]);

    const filterstat = (stat) => {
      filterstatus(stat);
    };

    const classes = useStyles();
    return ( <>
    {!filterstate && 
    <div className={classes.roots}>
      <div className={`${classes.listingMainhead} flex-justify align-center`} style={{paddingBlock: "27px !important"}} onClick={() => {setfilterstate(!filterstate); filterstat(!filterstate)}}>
        <span className='inline-block font-16 t2-text'><Filter/></span>
      </div>
    </div>}

    {filterstate && <div className={classes.roots}>
            <div className={`${classes.listingMainhead} flex-justify align-center desktop-sm-flex`} onClick={() => {setfilterstate(!filterstate); filterstat(!filterstate)}}>
              <span className='inline-block font-16 t2-text flex-justify display-flex align-center'>
                <Filter/>
                <span className='medium-weight' style={{marginLeft: "5px"}}>Filter</span>
              </span>
              <FilterCollapse/>
            </div>

            <div className={`${classes.listingMainhead} flex-justify align-center mobile-sm-flex-dashboard-filter`}>
              <span className='inline-block font-16 t2-text flex-justify display-flex align-center'>
                <Filter/>
                <span className='medium-weight' style={{marginLeft: "5px"}}>Filter</span>
              </span>
              <CrossSVG className='pointer' onClick={()=>onClose(false)}/>
            </div>
            
            { itemstate && 
            categories[1].filters.map((filter, parentIndex)=>{
              return <Accordion defaultExpanded className='no-shadow' key={parentIndex}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" className={"padding-zero"}>
                <h3 className={`${classes.paymentTitle} inline-block t2-text font-bold-14 semibold-weight`}>{filter.name}</h3>
                </AccordionSummary>
                  <AccordionDetails>
                  {filter.list.map((listItem, i)=>{
                      return <div className={`${classes.paymentoptions} flex-justify`} key={i}>
                                <span className={`t2-text font-14`}>{listItem.name}</span>
                                {/* <span className='switchElem'> <GreenSwitch disableRipple onClick={(e)=>onFilterChange(e, menuitems, parentIndex, i)} {...label} checked={listItem.isSelected} /> </span> */}
                                <span className='switchElem margin-tb-10'>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <AntSwitch sx={{fontSize: "18px"}} inputProps={{ 'aria-label': 'ant design' }} onClick={(e)=>onFilterChange(e, menuitems, parentIndex, i)} {...label} checked={listItem.isSelected} />
                                  </Stack>
                                </span>
                            </div>;
                    })}
                  </AccordionDetails>
                </Accordion>
            })}

          { offerFilter && <>
                              {categories[2].filters.map((modules, parentIndex)=>{
                                return modules.isSelected && modules.filters.map((filter, filterIndex)=>{
                                    return <Accordion defaultExpanded className='no-shadow' key={parentIndex}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel2${parentIndex}a-content`} id={`panel2${parentIndex}a-header`} className={"padding-zero"}>
                                            <h3 className={`${classes.paymentTitle} inline-block t2-text font-bold-14`}>{filter.name}</h3>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              {filter.list.map((listItem, i)=>{
                                                return <div className={`${classes.paymentoptions} flex-justify`} key={i}>
                                                          <span className={`t2-text font-14`}>{listItem.name}</span>
                                                          <span className='switchElem margin-tb-10'>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                              <AntSwitch sx={{fontSize: "18px"}} inputProps={{ 'aria-label': 'ant design' }} onClick={(e)=>onFilterChange(e, menuitems, filterIndex, i)} {...label} checked={listItem.isSelected} />
                                                            </Stack>
                                                          </span>
                                                      </div>;
                                              })}
                                            </AccordionDetails>
                                          </Accordion>
                                })}
                              )}
                            </>
          }
          {reservedItemFilter && <> 
            {categories[3].showFilters && categories[3].filters.map((filter, parentIndex)=>{
              return <Accordion defaultExpanded className='no-shadow' key={parentIndex}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel2${parentIndex}a-content`} id={`panel2${parentIndex}a-header`} className={"padding-zero"}>
              <h3 className={`${classes.paymentTitle} inline-block t2-text font-bold-14`}>{filter.name}</h3>
              </AccordionSummary>
              <AccordionDetails>
                {filter.list.map((listItem, i)=>{
                  return <div className={`${classes.paymentoptions} flex-justify`} key={i}>
                            <span className={`t2-text font-14`}>{listItem.name}</span>
                            <span className='switchElem margin-tb-10'>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <AntSwitch sx={{fontSize: "18px"}} inputProps={{ 'aria-label': 'ant design' }} onClick={(e)=>onFilterChange(e, menuitems, parentIndex, i)} {...label} checked={listItem.isSelected} />
                              </Stack>
                            </span>
                        </div>;
                })}
              </AccordionDetails>
            </Accordion>
            })}
          </>}
          {!itemstate && !offerFilter && !reservedItemFilter && <div className={classes.filterboxsection}>
            <span className='no-filter b-grey-text font-14'>No Filter Available For {menuitems}</span>
          </div>}
        </div>}
      </>
    );
}

export default Dashboardsidebar;