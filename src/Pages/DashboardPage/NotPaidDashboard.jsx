import axios from "axios";
import { useEffect, useState } from "react";
import { Footer } from "Components/Footer/Footer";
import PlanDisplay from "Components/Subscription/PlanDisplay";

export default function NotPaidDashboard({ hasPaid }) {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getSubscriptionPlans = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/subscription-plans');
            if (response && response.data) {
                setPlans(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch subscription plans:', error);
            setError('Unable to load subscription plans. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSubscriptionPlans();
    }, []);

    const handlePlanChoose = async (plan) => {
        try {
            const response = await axios.post(`/subscription/${plan.id}`);
            if (response.data.data.url) {
                window.open(response.data.data.url, '_blank');
            }
        } catch (error) {
            console.error('Error selecting plan:', error);
            // You could add a toast notification here for better UX
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-grow px-4 py-8 md:px-8 lg:px-16 xl:px-24">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-10">
                        Select a plan to start using the application
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : (
                        <div className="transition-all duration-300 ease-in-out">
                            <PlanDisplay onPlanClick={handlePlanChoose} plans={plans} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
