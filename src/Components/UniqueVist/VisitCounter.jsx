import { useEffect } from 'react';
import axios from 'axios';

const VisitCounter = () => {
    // Generate a 7-digit unique visitor ID
    const generateVisitorId = () => {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    // Get current timestamp
    const getCurrentTimestamp = () => {
        return Date.now();
    };

    const isUserLoggedIn = () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            console.log('userInfo:', userInfo);
            if (!userInfo) return false;

            const parsedUserInfo = JSON.parse(userInfo);
            return parsedUserInfo && parsedUserInfo.user && parsedUserInfo.access_token;
        } catch (error) {
            console.error('Error parsing userInfo from localStorage:', error);
            return false;
        }
    };

    // Get user ID from localStorage
    const getUserId = () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) return null;

            const parsedUserInfo = JSON.parse(userInfo);
            return parsedUserInfo?.user?.id || null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    };

    // Check if we should log a visit based on time intervals
    const shouldLogVisit = (isLoggedIn) => {
        const lastLoggedTime = localStorage.getItem('lastVisitLogTime');
        const currentTimestamp = getCurrentTimestamp();

        if (!lastLoggedTime) return true;

        const timeDifference = currentTimestamp - parseInt(lastLoggedTime);

        if (isLoggedIn) {
            // For logged-in users, check if 1 hour has passed
            const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
            return timeDifference >= oneHourInMs;
        } else {
            // For non-logged-in users, check if 6 hours have passed
            const sixHoursInMs = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
            return timeDifference >= sixHoursInMs;
        }
    };

    const getVisitorId = () => {
        let visitorId = localStorage.getItem('visitorId');

        if (!visitorId) {
            visitorId = generateVisitorId();
            localStorage.setItem('visitorId', visitorId);
        }

        return visitorId;
    };

    const logUniqueVisit = async (visitorId, isLoggedIn, userId = null) => {
        try {
            const endpoint = '/unique-visits';
            const payload = isLoggedIn
                ? { visitor_id: userId, location: window.location.pathname, isRegistered: true }
                : { visitor_id: visitorId, location: window.location.pathname };

            const response = await axios.post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                localStorage.setItem('lastVisitLogTime', getCurrentTimestamp().toString());
                console.log('Unique visit logged successfully');
            } else {
                console.error('Failed to log unique visit:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error logging unique visit:', error);
        }
    };

    // Main effect to handle visit logging
    useEffect(() => {
        const handleVisitLog = async () => {
            const isLoggedIn = isUserLoggedIn();

            // Check if we should log a visit
            if (shouldLogVisit(isLoggedIn)) {
                const visitorId = getVisitorId();

                if (isLoggedIn) {
                    const userId = getUserId();
                    if (userId) {
                        await logUniqueVisit(visitorId, true, userId);
                    } else {
                        console.error('User is logged in but user ID not found');
                    }
                } else {
                    await logUniqueVisit(visitorId, false);
                }
            } else {
                const logInterval = isLoggedIn ? '1 hour' : '6 hours';
                console.log(`Visit already logged within the last ${logInterval}`);
            }
        };

        handleVisitLog();
    }, []);

    return null;
};

export default VisitCounter;
