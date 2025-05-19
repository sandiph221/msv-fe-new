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

// Custom Styled MenuItem Component
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

const useStyles = makeStyles((theme) => Styles(theme));

const Navbar = () => {
    // Hooks & Redux
    const location = useLocation();
    const pathname = location.pathname;
    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { logoURL } = useSelector((state) => state.settings);

    // Media queries
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const sm = useMediaQuery(theme.breakpoints.down("sm"));
    const md = useMediaQuery(theme.breakpoints.down("md"));

    // Styles
    const classes = useStyles({ xs, sm, md });

    // Local state
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });
    const { mobileView, drawerOpen } = state;

    // User role checks
    const isSuperAdmin = user.role === constant.SUPER_ADMIN_NAME;
    const isCustomerAdmin = user.role === constant.CUSTOMER_ADMIN_NAME;
    const isCustomerViewer = user.role === constant.CUSTOMER_VIEWER_NAME;

    // Responsive handler
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

    // Event handlers
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

    // Nav items configuration
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
            selected: pathname.includes("/user/comparision") || pathname.includes("/user/profile-comparison"),
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
            text: "Customer Support",
            selected: pathname === "/contact-support",
            visible: isSuperAdmin
        },
        {
            to: "/user/help",
            icon: <HelpIcon />,
            text: "Help",
            selected: pathname.includes("/user/help"),
            visible: true,
            mobileOnly: true
        }
    ];

    // User menu items configuration based on user role
    const userMenuItems = [
        {
            to: "/user/account-management",
            icon: <AccountBox fontSize="small" />,
            text: "Account Settings",
            visible: isCustomerAdmin
        },
        {
            to: "/user/profile",
            icon: <AccountBox fontSize="small" />,
            text: "Profile",
            visible: !isSuperAdmin
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
            visible: isCustomerAdmin && !isCustomerViewer
        },
        {
            to: "/admin/user-management",
            icon: <SupervisorAccountIcon fontSize="small" />,
            text: "User Management",
            visible: isSuperAdmin
        },
        {
            to: "/admin/cms",
            icon: <Description fontSize="small" />,
            text: "Content Management",
            visible: isSuperAdmin
        },
        {
            to: "/admin/subscription-management",
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

    // Component rendering functions
    const renderNavItems = () => (
        <>
            {navItems
                .filter(item => item.visible && (!item.mobileOnly || mobileView))
                .map((item, index) => (
                    <StyledMenuItem
                        key={index}
                        component={Link}
                        to={item.to}
                        className={classes.iconButton}
                        selected={item.selected}
                    >
                        {item.icon}
                        <Typography className={classes.navTextStyle}>
                            {item.text}
                        </Typography>
                    </StyledMenuItem>
                ))}
        </>
    );

    const renderUserMenuItems = () => (
        <div>
            {userMenuItems
                .filter(item => item.visible)
                .map((item, index) => (
                    <MenuItem
                        key={index}
                        component={item.onClick ? 'div' : Link}
                        to={item.onClick ? undefined : item.to}
                        onClick={item.onClick || handleUserMenuClose}
                    >
                        {item.icon} <Box mx={0.5}>{item.text}</Box>
                    </MenuItem>
                ))}
        </div>
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