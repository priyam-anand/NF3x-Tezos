import React, { FC, PropsWithChildren, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    "& div[aria-labelledby=customized-dialog-title]": {
      borderRadius: "32px",
      background: "#ffffff",
      padding: "20px",
      minWidth: "500px",
      maxWidth: "700px"
    }
  },
  title: {
    fontWeight: "600 !important",
    fontSize: "18px !important",
    color: "#23262F",
    textAlign: "center"
  },
  content: {
    borderTop: "2px solid #E6E8EC !important",
    borderBottom: "none !important"
  }
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const BootstrapDialogTitle = (props) => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} className={classes.title} {...other}>
      {children}
      {onClose ? (
        <IconButton
          disableRipple
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const PopupContainer = ({
  children,
  isOpen,
  popupTitle,
  width,
  reload,
  setState
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(isOpen);
  const handleClose = () => {
    if (reload)
      window.location.reload();
    if (setState != undefined)
      setState();
    setOpen(false);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={`${classes.root} popup-nft`}
      // sx={{width: `${(width && width+" !important")?? "auto"}`}}
      >
        <BootstrapDialogTitle id="customized-dialog-title font-24 semibold-weight" onClose={handleClose}>
          {popupTitle}
        </BootstrapDialogTitle>
        <DialogContent dividers className={classes.content}>
          {children}
        </DialogContent>
        {/* <DialogActions>
          <Button disableRipple autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </div>
  );
}

export default PopupContainer