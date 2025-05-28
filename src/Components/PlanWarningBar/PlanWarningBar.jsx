import axios from "axios";
import { useEffect, useState } from "react";

const fetchWithCache = async (url) => {
    const cacheKey = `cache_${url}`;
    const cache = JSON.parse(localStorage.getItem(cacheKey));
    const oneDay = 24 * 60 * 60 * 1000;

    if (cache && (Date.now() - cache.timestamp < oneDay)) {
        console.log("📦 From Cache");
        return cache.data;
    }

    const response = await axios.get(url);
    localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
    }));
    console.log("🌐 Fetched New");
    return response.data;
};

export default function PlanWarningBar() {
    const [remainingDays, setRemainingDays] = useState(null);
    const [isTrial, setIsTrial] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const calculateRemainingDays = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        async function fetchAndPopulate() {
            try {
                const data = await fetchWithCache('/subscription');
                setIsTrial(data.data.isTrial);
                const daysLeft = calculateRemainingDays(data.data.subscription_ends_at);
                setRemainingDays(daysLeft);
            } catch (error) {
                console.error('Error fetching subscription data:', error);
            }
        }
        fetchAndPopulate();
    }, []);

    // Component doesn't exist at all if conditions aren't met
    if (!isTrial || remainingDays === null || remainingDays >= 15 || !isVisible) {

        return null;
    }

    const getWarningMessage = () => {
        if (remainingDays <= 0) {
            return 'Your trial has expired. Please upgrade to continue using the service.';
        }
        if (remainingDays === 1) {
            return 'Your trial expires tomorrow. Upgrade now to avoid service interruption.';
        }
        return `Your trial expires in ${remainingDays} days. Consider upgrading to continue enjoying our services.`;
    };

    return (
        <div className="bg-red-50 border border-red-200 p-4 mb-4 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                        <p className="text-red-800 font-medium text-sm">
                            {getWarningMessage()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                        Upgrade Now
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-red-400 hover:text-red-600 transition-colors duration-200"
                        aria-label="Dismiss warning"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
