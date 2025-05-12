import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  withStyles,
  IconButton,
  Drawer,
  useTheme,
} from "@mui/material";

import { NavLink } from "react-router-dom";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpIcon from "@mui/icons-material/Help";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBox from "@mui/icons-material/AccountBox";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CompareIcon from "@mui/icons-material/Compare";

import { Link, withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { SignOut } from "../../store/actions/AuthAction";
import { Styles } from "./Styles";
import * as constant from "../../utils/constant";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuIcon from "@mui/icons-material/Menu";
import HeadsetIcon from "@mui/icons-material/Headset";
import CallSharpIcon from "@mui/icons-material/CallSharp";
import { formatServerImages } from "utils/functions.js";
import { BarChart, CreditCard, Description } from "@mui/icons-material";

const useStyles = makeStyles((theme) => Styles(theme));

/*Styled menu dropdown menu from navbar */

const StyledMenuItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#FBE281",
      "&:hover": {
        backgroundColor: "#FBE281",
      },
    },
  },
})(MenuItem);

const Navbar = ({ location: { pathname } }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { logoURL } = useSelector((state) => state.settings);
  const classes = useStyles({ xs, sm, md });
  const [show, setShow] = useState(null);
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const menuItem = () => (
    <>
      <StyledMenuItem
        size="small"
        to={user.role === constant.SUPER_ADMIN_NAME ? "/admin/dashboard" : "/"}
        component={Link}
        className={classes.iconButton}
        selected={pathname === "/" || pathname === "/admin/dashboard"}
      >
        {" "}
        <DashboardIcon />
        <Typography className={classes.navTextStyle}>Dashboard</Typography>
      </StyledMenuItem>

      {user.role !== constant.SUPER_ADMIN_NAME && (
        <StyledMenuItem
          to="/brand-overview"
          component={Link}
          activeclassname={classes.navbarActive}
          className={classes.iconButton}
          selected={pathname === "/brand-overview"}
        >
          {" "}
          <AccountBoxIcon />
          <Typography className={classes.navTextStyle}>
            Brand Overviews
          </Typography>
        </StyledMenuItem>
      )}

      {user.role !== constant.SUPER_ADMIN_NAME && (
        <StyledMenuItem
          to="/comparision"
          component={Link}
          activeclassname={classes.navbarActive}
          className={classes.iconButton}
          selected={pathname === "/comparision"}
        >
          {" "}
          <CompareIcon />
          <Typography className={classes.navTextStyle}>Comparison</Typography>
        </StyledMenuItem>
      )}
      {user.role !== constant.SUPER_ADMIN_NAME && (
        <StyledMenuItem
          to="/social-listening"
          component={Link}
          activeclassname={classes.navbarActive}
          className={classes.iconButton}
          selected={pathname === "/social-listening"}
        >
          {" "}
          <HeadsetIcon />
          <Typography className={classes.navTextStyle}>
            Social Listening
          </Typography>
        </StyledMenuItem>
      )}
      {user.role == constant.SUPER_ADMIN_NAME && (
        <StyledMenuItem
          to="/contact-support"
          component={Link}
          activeclassname={classes.navbarActive}
          className={classes.iconButton}
          selected={pathname === "/contact-support"}
        >
          {" "}
          <CallSharpIcon />
          <Typography className={classes.navTextStyle}>
            Customer support
          </Typography>
        </StyledMenuItem>
      )}
      <StyledMenuItem
        to="/help"
        component={Link}
        activeclassname={classes.navbarActive}
        className={classes.iconButton}
        selected={pathname === "/help"}
      >
        <HelpIcon />{" "}
        {mobileView ? (
          <Typography className={classes.navTextStyle}>Help</Typography>
        ) : (
          ""
        )}
      </StyledMenuItem>
    </>
  );
  const logo = () => (
    <NavLink to="/" className={classes.title}>
      <img
        className={classes.title}
        src={formatServerImages(logoURL)}
        alt="My Social View"
      />
    </NavLink>
  );

  const displayDesktop = () => {
    return (
      <Toolbar style={{ display: "flex", flexGrow: 1, padding: 0 }}>
        {logo()}
        <div style={{ display: "flex" }}>{menuItem()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar
        style={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "row-reverse",
          justifyContent: "space-between",
        }}
        disableGutters
      >
        <IconButton
          {...{
            edge: "start",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon style={{ color: "#323132" }} />
        </IconButton>

        <Drawer
          {...{
            anchor: "right",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div style={{ padding: "50px 10px" }}>{menuItem()}</div>
        </Drawer>

        <div>{logo()}</div>
      </Toolbar>
    );
  };

  const handleClick = (event) => {
    setShow(event.currentTarget);
  };

  const handleClose = () => {
    setShow(null);
  };
  useEffect(() => {
    // console.log("State Update", logoURL)
  }, [logoURL]);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      {mobileView ? displayMobile() : displayDesktop()}

      <Button
        id="navbar-menu-item"
        className={classes.icons}
        onClick={handleClick}
      >
        <AccountCircleIcon fontSize="large" />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={show}
        keepMounted
        open={Boolean(show)}
        onClose={handleClose}
        style={{
          top: 60,
          left: -30,
        }}
      >
        {user.role === constant.CUSTOMER_ADMIN_NAME && (
          <Box>
            <MenuItem
              component={Link}
              to="/account-management"
              onClick={() => {
                handleClose();
              }}
            >
              <AccountBox fontSize="small" />{" "}
              <Box mx={0.5}>Account Settings</Box>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/subscription-details"
              onClick={() => {
                handleClose();
              }}
            >
              <CreditCard fontSize="small" /> <Box mx={0.5}>Subscription</Box>
            </MenuItem>
            {/* <MenuItem
              component={Link}
              to='/customer-admin-setting'
              onClick={() => {
                handleClose();
              }}
            >
              <SettingsIcon fontSize='small' /> <Box mx={0.5}>Settings</Box>
            </MenuItem> */}
          </Box>
        )}
        {/* <MenuItem
          component={Link}
          to='/profile'
          onClick={handleClose}
        >
          {' '}
          <AccountCircleIcon fontSize='small' />
          <Box mx={0.5}>Profile</Box>
        </MenuItem> */}

        <MenuItem
          component={Link}
          to="/user-management"
          onClick={() => {
            handleClose();
          }}
        >
          {user.role !== constant.CUSTOMER_VIEWER_NAME && (
            <React.Fragment>
              <SupervisorAccountIcon fontSize="small" />
              <Box mx={0.5}>User Management</Box>
            </React.Fragment>
          )}
        </MenuItem>

        {user.role === constant.SUPER_ADMIN_NAME && (
          <Box>
            <MenuItem
              component={Link}
              to="/cms"
              onClick={() => {
                handleClose();
              }}
            >
              <Description fontSize="small" />
              <Box mx={0.5}>Content Management</Box>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/subscription-management"
              onClick={() => {
                handleClose();
              }}
            >
              {user.role !== constant.CUSTOMER_VIEWER_NAME ? (
                <React.Fragment>
                  <CardMembershipIcon fontSize="small" />
                  <Box mx={0.5}>Subscription Management</Box>
                </React.Fragment>
              ) : (
                ""
              )}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/analytics"
              onClick={() => {
                handleClose();
              }}
            >
              <BarChart fontSize="small" />
              <Box mx={0.5}>Analytics</Box>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/user-activity"
              onClick={() => {
                handleClose();
              }}
            >
              <SupervisorAccountIcon fontSize="small" />
              <Box mx={0.5}>Activity Logs</Box>
            </MenuItem>
          </Box>
        )}

        <MenuItem
          component={Link}
          to=""
          onClick={async () => {
            handleClose();
            try {
              await dispatch(SignOut());
            } catch (error) {}
          }}
        >
          {" "}
          <ExitToAppIcon fontSize="small" /> <Box mx={0.5}>Logout</Box>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default withRouter(Navbar);
