import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

const StyledMenu = withStyles({
    
  paper: {
    border: '1px solid #E2E2E2',
    marginTop: 5
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
        vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
        vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

const StyledButton = withStyles({
    root: {
        border: "1px solid #bdbdbd",
        marginLeft: 20,
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: 9,
        "&:hover": {
            backgroundColor: "#FFF8DE"
        }
    }
})(IconButton)


const DownloadButton = ({children}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="outlined"
        onClick={handleClick}
      >
      <GetAppIcon style={{color: "#323132", fontSize: 24}} />
      </StyledButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </StyledMenu>
    </div>
  );
}

export default DownloadButton