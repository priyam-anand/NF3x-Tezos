import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Avatar, TextField, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Add, FolderOpen } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import { ReactComponent as Search } from '../SVG/Search.svg';
import { ReactComponent as SearchBlack } from '../SVG/Search-black.svg';
import { ReactComponent as AddSVG } from '../SVG/Add.svg';
import { useNavigate } from 'react-router-dom';
import RightMenu from './RightMenu';
import { setWeb3, setAccount } from '../redux/web3ConfigSlice';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ReactComponent as Profile } from '../SVG/Profile.svg';
import { ReactComponent as Category } from '../SVG/Category.svg';
import { ReactComponent as User } from '../SVG/User.svg';
import { ReactComponent as Collection } from '../SVG/Collections.svg';
import { ReactComponent as Notification } from "../SVG/Notification.svg";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { logout } from '../utils';

const useStyles = makeStyles({
  root: {
    border: "1px solid #E6E8EC",
    '@media (max-width: 900px)': {
      paddingTop: "40px",
      paddingBottom: "10px",
      border: "none",
    },
    '@media (min-width: 601px) and (max-width: 900px)': {
      border: "1px solid #E6E8EC",
      paddingTop: "20px",
      paddingBottom: "15px",
    },
  },
  logo: {
    width: "89px",
    flexDirection: "row",
    "& img": {
      width: "88px"
    },
    verticalAlign: "top",
    marginLeft: "26px",
  },
  icon: {
    marginRight: 13,
    "& rect": {
      stroke: "#23262F"
    }
  },
  menus: {
    width: "calc(100% - 90px)",
    textAlign: "right",
    "& .search-container": {
      minWidth: "433px"
    },
    "& .search-input": {
      width: "100%",
      maxWidth: "547px",
      height: "45px",
    },
    "& li": {
      fontStyle: "normal",
      display: "inline-block",
      listStyle: "none",
      verticalAlign: "middle"
    },
    "& li.menu-padding": {
      padding: "0 40px 0 0",
    },
    "& li:last-child": {
      paddingRight: "10px"
    },
    '@media (max-width: 900px)': {
      "& li": {
        float: 'none',
        padding: "0 9px !important"
      },
      "& li:last-child": {
        paddingRight: "20px !important"
      },
    }
  },
  menuItem: {
    width: "173px",
    "& .text": {
      color: '#878D9D'
    }
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 287,
    background: 'white',
    boxShadow: 24,
    borderRadius: 15,
    padding: "29px",
    "& .modal-btn": {
      color: '#FF0083'
    }
  }

});


function ComponentHeader({ searchResult, setSearchResult }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.web3Config);
  const [mobileSizing, setMobileSizing] = useState("");
  const [leftMenu, setLeftMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = React.useState(false);

  const dispatch = useDispatch();

  const getAddress = (account) => {
    var acc = account.substring(0, 8);
    acc = acc + '..';
    return acc;
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setLeftMenu(open);
  };

  const disconnectWallet = () => {
    dispatch(setWeb3({ web3: undefined }));
    dispatch(setAccount({ account: undefined }));
    logout();
    navigate('/')
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const collections = [
    { title: 'Bored Apes' },
    { title: 'Azuki' },
    { title: 'Noodles' },
    { title: 'Mooncats' },
    { title: 'WVRP' },
    { title: 'World of Women' },
    { title: "Doodles" }
  ];
  const flatProps = {
    options: collections.map((option) => option.title),
  };
  const updateSize = () => {
    setMobileSizing(window.innerWidth > 900 ? "" : "");
  }
  window.addEventListener('resize', updateSize);


  return (
    <div className={`${classes.root} ${mobileSizing} flex-justify align-center`}>
      <div className={classes.logo}>
        <Link to="/listing"><img src="../img/logo.svg" /></Link>
      </div>
      <div className={classes.menus}>
        <ul>
          <li className='float-left search-container font-bold-14 desc-text padding-10 desktop-search'>
            <Paper
              component="form"
              className={"search-input no-border no-shadow radius-15 input-text outline-border"}
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
              <IconButton disableRipple sx={{ p: '10px', pr: "0", color: '#B0B7C3' }} aria-label="search">
                <Search className='b-grey-text' />
              </IconButton>
              <Autocomplete
                sx={{ ml: 1, flex: 1, color: "#B0B7C3" }}
                placeholder="Search.."
                noOptionsText="No result found"
                {...flatProps}
                id="flat-demo"
                freeSolo
                value={searchResult}
                onChange={(event, value) => {
                  setSearchResult(value);
                }}
                onSubmit={e => e.preventDefault()}
                options={collections.map((option) => option.title)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className='font-16'
                    placeholder="Search"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />
            </Paper>
          </li>
          <li className='mobile-inline'>
            <SearchBlack />
          </li>
          <li className="menu-padding desktop-sm-inline">
            <Link className="display-flex align-center" to={"/listing"}>
              <Category className={classes.icon} />
              <span className="text">Explore</span>
            </Link>
          </li>
          <li className="menu-padding desktop-sm-inline">
            <Link className="display-flex align-center" to={"/collections"}>
              <Collection className={classes.icon} />
              <span className="text">Collections</span>
            </Link>
          </li>
          <li className="menu-padding">
            <Notification />
          </li>
          <li className='desktop-create-listing font-bold-14 desc-text padding-10'>
            <Button disableRipple startIcon={<Add />} className={"btn bg-primary white-text primary-border"} variant="outlined"> <Link to={"/createlist"}>Create listing</Link></Button>

          </li>
          <li className='mobile-inline'>
            <AddSVG onClick={() => navigate(`/createlist`)} />
          </li>
          {/* <li className='font-bold-14 desc-text padding-10 desktop-connect-wallet'>
            <Button disableRipple startIcon={<FolderOpen />} className={"btn bg-primary white-text white-border"} variant="contained">
              {account != undefined ? getAddress(account) : `Connect to wallet`}
            </Button>
          </li> */}
          <li className='font-bold-14 desc-text padding-10 desktop-user'>
            {/* <Link to={"/dashboard"}><Avatar src="./img/user.png" /></Link> */}
            <Tooltip title="Account settings">
              <IconButton
                size="small"
                sx={{ ml: 2, margin: 0 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onMouseOver={handleClick}
              >
                <Profile sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* <MenuItem className={classes.menuItem}>
                <Link className="display-flex align-center" to={"/listing"}>
                  <ListItemIcon>
                    <Category className="margin-right-10" />
                  </ListItemIcon>
                  <span className="text">Explore</span>
                </Link>
              </MenuItem> */}
              {/* <Divider /> */}
              <MenuItem className={classes.menuItem}>
                <Link className="display-flex align-center" to={"/dashboard"}>
                  <ListItemIcon>
                    <User className="margin-right-10" />
                  </ListItemIcon>
                  <span className="text">Profile</span>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem className={classes.menuItem} onClick={handleModalOpen}>
                <ListItemIcon>
                  <Logout className="margin-right-10" />
                </ListItemIcon>
                <span className="text">Logout</span>
              </MenuItem>
            </Menu>
          </li>
          <li className='mobile-inline'>
            <RightMenu />
          </li>
        </ul>
        <Modal
          keepMounted
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={classes.modal}>
            <Typography id="modal-modal-description" sx={{ mt: 0, mb: 3, textAlign: 'center' }}>
              Are you sure you want to log out
            </Typography>
            <div className="center">
              <Button disableRipple className="modal-btn" onClick={disconnectWallet}>Yes</Button>
              <Button disableRipple className="modal-btn" onClick={handleModalClose}>No</Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>);
}

export default ComponentHeader;