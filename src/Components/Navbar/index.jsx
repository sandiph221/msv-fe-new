import React, { useEffect, useState } from "react";
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
    Settings,
} from "@material-ui/icons";

import { useSelector, useDispatch } from "react-redux";
import { SignOut } from "../../store/actions/AuthAction";
import * as constant from "../../utils/constant";
import { formatServerImages } from "utils/functions.js";
import NotificationComponent from "./NotificationComponent";

const Navbar = () => {
    // Hooks & Redux
    const location = useLocation();
    const pathname = location.pathname;
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { logoURL } = useSelector((state) => state.settings);

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
            to: "/admin/contact-support",
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
            to: "/user/profile",
            icon: <AccountBox fontSize="small" />,
            text: "Edit Profile",
            visible: !isSuperAdmin
        },
        {
            to: "/user/account-management",
            icon: <Settings fontSize="small" />,
            text: "Settings",
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
                    <Link
                        key={index}
                        to={item.to}
                        className={`
                            flex items-center px-4 py-2 mx-1 rounded-md text-gray-700 
                            hover:bg-yellow-200 transition-colors duration-200
                            ${item.selected ? 'bg-yellow-200' : ''}
                            ${mobileView ? 'w-full mb-2 justify-start' : ''}
                        `}
                    >
                        <span className="mr-2">{item.icon}</span>
                        <span className="text-sm font-medium whitespace-nowrap">
                            {item.text}
                        </span>
                    </Link>
                ))}
        </>
    );

    const renderUserMenuItems = () => (
        <div className="py-1">
            {userMenuItems
                .filter(item => item.visible)
                .map((item, index) => (
                    item.onClick ? (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            {item.icon}
                            <span className="ml-2">{item.text}</span>
                        </button>
                    ) : (
                        <Link
                            key={index}
                            to={item.to}
                            onClick={handleUserMenuClose}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            {item.icon}
                            <span className="ml-2">{item.text}</span>
                        </Link>
                    )
                ))}
        </div>
    );

    const renderLogo = () => (
        <NavLink to="/" className="flex items-center">
            <img
                className="h-8 w-auto"
                src={formatServerImages(logoURL)}
                alt="My Social View"
            />
        </NavLink>
    );

    const renderDesktopView = () => (
        <div className="flex items-center justify-between w-full px-4">
            {renderLogo()}
            <div className="flex items-center space-x-1">
                {renderNavItems()}
            </div>
        </div>
    );

    const renderMobileView = () => (
        <div className="flex items-center justify-between w-full px-4">
            {renderLogo()}

            <button
                onClick={handleDrawerToggle}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="menu"
            >
                <MenuIcon style={{ color: "#323132" }} />
            </button>

            {/* Mobile Drawer */}
            {drawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={handleDrawerToggle}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
                        <div className="pt-12 px-4">
                            {renderNavItems()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 ">
            <div className="flex items-center justify-between h-16">
                {mobileView ? renderMobileView() : renderDesktopView()}

                <div className="flex items-center space-x-4 px-4">
                    <div className="flex items-center justify-center">
                        <NotificationComponent />
                    </div>

                    {/* User Menu Button */}
                    <div className="relative">
                        <button
                            id="navbar-menu-item"
                            onClick={handleUserMenuOpen}
                            className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <AccountCircleIcon fontSize="large" />
                        </button>

                        {/* User Dropdown Menu */}
                        {userMenuAnchor && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={handleUserMenuClose}
                                />

                                {/* Menu */}
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                    {renderUserMenuItems()}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
