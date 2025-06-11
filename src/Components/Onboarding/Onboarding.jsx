import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Footer } from "Components/Footer/Footer";
import { SignOut } from "../../store/actions/AuthAction";
import { formatServerImages } from "utils/functions.js";
import {
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";
import OnboardingComponent from "./OnboardingComponents";

export default function Onboarding({ hasPaid }) {
    const [error, setError] = useState(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);

    // Redux
    const dispatch = useDispatch();
    const { logoURL } = useSelector((state) => state.settings);
    const { user } = useSelector((state) => state.auth);

    // Navbar handlers
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Simple Navbar */}
            <nav className="bg-white shadow-md">
                <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-16 xl:px-24">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            className="h-8 w-auto"
                            src={formatServerImages(logoURL)}
                            alt="My Social View"
                        />
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={handleUserMenuOpen}
                            className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <ExitToAppIcon fontSize="small" />
                                            <span className="ml-2">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow px-4 py-8 md:px-8 lg:px-16 xl:px-24 relative">
                <div className="absolute inset-0 overflow-hidden">
                    <img 
                        src="https://img001.prntscr.com/file/img001/YoLPGZuRQVyFBop7FpRH2Q.png" 
                        alt="" 
                        className="w-full h-full object-cover blur-sm"
                    />
                    <div className="absolute inset-0 bg-white/30"></div>
                </div>
                <div className="relative z-10 w-1/2 mx-auto">
                    <OnboardingComponent user={user} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
