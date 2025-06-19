import { useEffect } from 'react';
import axios from 'axios';
const UniqueVisit = () => {
    // Generate a 7-digit unique visitor ID
    const generateVisitorId = () => {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Check if we should log a visit today
    const shouldLogVisit = () => {
        const lastLoggedDate = localStorage.getItem('lastVisitLogDate');
        const currentDate = getCurrentDate();
        return lastLoggedDate !== currentDate;
    };

    const getVisitorId = () => {
        let visitorId = localStorage.getItem('visitorId');

        if (!visitorId) {
            visitorId = generateVisitorId();
            localStorage.setItem('visitorId', visitorId);
        }

        return visitorId;
    };
      const logUniqueVisit = async (visitorId) => {
          try {
              const response = await axios.post('/unique-visits', {
                  visitor_id: visitorId
              }, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust based on your auth implementation
                  }
              });

              if (response.status === 200) {
                  // Update last logged date on successful API call
                  localStorage.setItem('lastVisitLogDate', getCurrentDate());
                  console.log('Unique visit logged successfully');
              } else {
                  console.error('Failed to log unique visit:', response.status, response.statusText);
              }
          } catch (error) {
              console.error('Error logging unique visit:', error);
          }
      };
    // Main effect to handle daily visit logging
    useEffect(() => {
        const handleDailyVisitLog = async () => {
            // Check if we should log a visit today
            if (shouldLogVisit()) {
                const visitorId = getVisitorId();
                await logUniqueVisit(visitorId);
            } else {
                console.log('Visit already logged today');
            }
        };

        // Log visit when component mounts
        handleDailyVisitLog();


        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    // This component doesn't render anything visible
    return null;
};

export default UniqueVisit;
