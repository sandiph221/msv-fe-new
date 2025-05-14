import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import { NavLink, Link, useLocation } from "react-router-dom";

// Icons
import {
  Dashboard as DashboardIcon,
  Help as HelpIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  AccountBox,
  CardMembership as CardMembershipIcon,
  ExitToApp as ExitToAppIcon,
  Compare as CompareIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Menu as MenuIcon,
  Headset as HeadsetIcon,
  CallSharp as CallSharpIcon,
  BarChart,
  CreditCard,
  Description,
} from "@material-ui/icons";

import { useSelector, useDispatch } from "react-redux";
import { SignOut } from "../../store/actions/AuthAction";
import { Styles } from "./Styles";
import * as constant from "../../utils/constant";
import { formatServerImages } from "utils/functions.js";

const useStyles = makeStyles((theme) => Styles(theme));

// Styled menu dropdown menu from navbar
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

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { logoURL } = useSelector((state) => state.settings);
  const classes = useStyles({ xs, sm, md });
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  const isSuperAdmin = user.role === constant.SUPER_ADMIN_NAME;
  const isCustomerAdmin = user.role === constant.CUSTOMER_ADMIN_NAME;
  const isCustomerViewer = user.role === constant.CUSTOMER_VIEWER_NAME;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();
    window.addEventListener("resize", setResponsiveness);
    
    return () => {
      window.removeEventListener("resize", setResponsiveness);
    };
  }, []);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await dispatch(SignOut());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDrawerToggle = () => {
    setState((prevState) => ({ ...prevState, drawerOpen: !prevState.drawerOpen }));
  };

  // Navigation menu items
  const navItems = [
    {
      to: isSuperAdmin ? "/admin/dashboard" : "/user",
      icon: <DashboardIcon />,
      text: "Dashboard",
      selected: pathname === "/user" || pathname === "/admin/dashboard",
      visible: true
    },
    {
      to: "/user/brand-overview",
      icon: <AccountBox />,
      text: "Brand Overviews",
      selected: pathname === "/user/brand-overview",
      visible: !isSuperAdmin
    },
    {
      to: "/user/comparision",
      icon: <CompareIcon />,
      text: "Comparison",
      selected: pathname === "/user/comparision",
      visible: !isSuperAdmin
    },
    {
      to: "/user/social-listening",
      icon: <HeadsetIcon />,
      text: "Social Listening",
      selected: pathname === "/user/social-listening",
      visible: !isSuperAdmin
    },
    {
      to: "/contact-support",
      icon: <CallSharpIcon />,
      text: "Customer support",
      selected: pathname === "/contact-support",
      visible: isSuperAdmin
    },
    {
      to: "/user/help",
      icon: <HelpIcon />,
      text: "Help",
      selected: pathname === "/user/help",
      visible: true,
      mobileOnly: true
    }
  ];

  // User menu items
  const userMenuItems = [
    {
      to: "/user/account-management",
      icon: <AccountBox fontSize="small" />,
      text: "Account Settings",
      visible: isCustomerAdmin
    },
    {
      to: "/user/subscription-details",
      icon: <CreditCard fontSize="small" />,
      text: "Subscription",
      visible: isCustomerAdmin
    },
    {
      to: "/user/user-management",
      icon: <SupervisorAccountIcon fontSize="small" />,
      text: "User Management",
      visible: !isCustomerViewer
    },
    {
      to: "/user/cms",
      icon: <Description fontSize="small" />,
      text: "Content Management",
      visible: isSuperAdmin
    },
    {
      to: "/user/subscription-management",
      icon: <CardMembershipIcon fontSize="small" />,
      text: "Subscription Management",
      visible: isSuperAdmin
    },
    {
      to: "/admin/analytics",
      icon: <BarChart fontSize="small" />,
      text: "Analytics",
      visible: isSuperAdmin
    },
    {
      to: "/admin/user-activity",
      icon: <SupervisorAccountIcon fontSize="small" />,
      text: "Activity Logs",
      visible: isSuperAdmin
    },
    {
      to: "",
      icon: <ExitToAppIcon fontSize="small" />,
      text: "Logout",
      visible: true,
      onClick: handleLogout
    }
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item, index) => (
        item.visible && (
          <StyledMenuItem
            key={index}
            size="small"
            to={item.to}
            component={Link}
            className={classes.iconButton}
            selected={item.selected}
          >
            {item.icon}
            <Typography className={classes.navTextStyle}>
              {item.text}
            </Typography>
          </StyledMenuItem>
        )
      ))}
    </>
  );

  const renderUserMenuItems = () => (
    <>
      {userMenuItems.map((item, index) => (
        item.visible && (
          <MenuItem
            key={index}
            component={Link}
            to={item.to}
            onClick={item.onClick || handleUserMenuClose}
          >
            {item.icon} <Box mx={0.5}>{item.text}</Box>
          </MenuItem>
        )
      ))}
    </>
  );

  const renderLogo = () => (
    <NavLink to="/" className={classes.title}>
      <img
        className={classes.title}
        src={formatServerImages(logoURL)}
        alt="My Social View"
      />
    </NavLink>
  );

  const renderDesktopView = () => (
    <Toolbar style={{ display: "flex", flexGrow: 1, padding: 0 }}>
      {renderLogo()}
      <div style={{ display: "flex" }}>{renderNavItems()}</div>
    </Toolbar>
  );

  const renderMobileView = () => (
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
        edge="start"
        aria-label="menu"
        aria-haspopup="true"
        onClick={handleDrawerToggle}
      >
        <MenuIcon style={{ color: "#323132" }} />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <div style={{ padding: "50px 10px" }}>{renderNavItems()}</div>
      </Drawer>

      <div>{renderLogo()}</div>
    </Toolbar>
  );

  return (
    <AppBar position="fixed" className={classes.appBar}>
      {mobileView ? renderMobileView() : renderDesktopView()}

      <Button
        id="navbar-menu-item"
        className={classes.icons}
        onClick={handleUserMenuOpen}
      >
        <AccountCircleIcon fontSize="large" />
      </Button>
      
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchor}
        keepMounted
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        style={{
          top: 60,
          left: -30,
        }}
      >
        {renderUserMenuItems()}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
