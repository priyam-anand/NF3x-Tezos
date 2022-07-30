import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {ReactComponent as MenuNav} from '../SVG/right-nav.svg';
import {ReactComponent as Category } from '../SVG/Category.svg';
import {ReactComponent as User } from '../SVG/User.svg';
import { ReactComponent as Collection } from '../SVG/Collections.svg';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';

const useStyles = makeStyles({
  root: {
    flex: "0 0 24px",
    
  },
});

function RightMenu({}) {
  const classes = useStyles();
  const navigate = useNavigate();
  
  const [mobileSizing, setMobileSizing] = useState("");
  const [rightMenu, setRightMenu] = useState(false);

  const updateSize = () => {
    setMobileSizing(window.innerWidth > 900? "mobile-view-nft":"");
  }
  window.addEventListener('resize', updateSize);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setRightMenu(open);
  };

  const list = (anchor) => (
    <Box
      className='menu-list'
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem className='b-grey-text padding-top-20 padding-bottom-20' button key={"0"} onClick={()=>navigate(`/listing`)}>
          <ListItemIcon sx={{minWidth: "37px"}}>
            <Category />
          </ListItemIcon>
          <ListItemText className='medium-weight font-20' primary={"Explore"} />
        </ListItem>
        <ListItem className='b-grey-text padding-top-20 padding-bottom-20' button key={"0"} onClick={()=>navigate(`/listing`)}>
          <ListItemIcon sx={{minWidth: "37px"}}>
            <Collection />
          </ListItemIcon>
          <ListItemText className='medium-weight font-20' primary={"Collections"} />
        </ListItem>
        <ListItem className='b-grey-text padding-bottom-20' button key={"1"} onClick={()=>navigate(`/dashboard`)}>
          <ListItemIcon sx={{minWidth: "37px"}}>
            <User />
          </ListItemIcon>
          <ListItemText className='medium-weight font-20' primary={"Dashboard"} />
        </ListItem>
        <ListItem className='b-grey-text padding-bottom-20' button key={"3"} onClick={()=>navigate(`#`)}>
          <ListItemIcon sx={{minWidth: "37px"}}>
            <Logout className="margin-right-10" />
          </ListItemIcon>
          <ListItemText className='medium-weight font-20' primary={"Logout"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className={`${classes.root} ${mobileSizing} flex-justify align-center right-menu`}>
      <div>
        <MenuNav sx={{width: "24px", height: "24px"}} className="pointer" onClick={toggleDrawer("right", true)}/>
        <Drawer
          anchor={"right"}
          open={rightMenu}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </div>
    </div>);
}

export default RightMenu;