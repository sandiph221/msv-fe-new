
import { makeStyles } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const useStyles = makeStyles((theme) => ({
  alertIconContainer: {
    paddingBottom: 0,
  },
  popUpContainer: {
    textAlign: 'center',
  },
  actionBtn: {
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8,
  },

  btnItem: {
    margin: '0 15px',
  },
}));

const Alert = ({
  title,
  open,
  setOpen,
  onConfirm,
  description,
  icon,
  confirmBtn,
  buttonbgcolor,
  closeButton,
  textColor
}) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.popUpContainer}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='alert-box'
    >
      <DialogTitle
        id='alert-box'
        classname={classes.alertIconContainer}
      >
        {icon}
      </DialogTitle>
      <DialogTitle id='alert-box'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-box'>{description}</DialogContentText>
      </DialogContent>

      <DialogActions className={classes.actionBtn}>
        <Button
          className={classes.btnItem}
          onClick={() => setOpen(false)}
          variant='contained'
          color='default'
          style={{boxShadow: "none", margin: 0}}
        >
          {closeButton ? closeButton : 'CANCEL'}
        </Button>
        {confirmBtn ? (
          <Button
            className={classes.btnItem}
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            variant='contained'
            color='default'
            style={{
              backgroundColor: buttonbgcolor,
              color: textColor
            }}
          >
            {confirmBtn}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default Alert;
