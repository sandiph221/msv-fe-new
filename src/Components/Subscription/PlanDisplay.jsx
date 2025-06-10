import { useState } from "react";

const PriceItem = ({
    id,
    price = "",
    duration = "",
    handleClick,
    discountPercentage,
    currentPlanId
}) => {
    const isCurrentPlan = currentPlanId === id;

    return (
        <div className="flex items-center justify-between w-full p-4 rounded-md transition-colors duration-300 hover:bg-blue-50">
            <div className="flex-grow">
                <h4 className="font-semibold text-gray-800 capitalize mb-1">
                    {duration}
                </h4>
                <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                        AUD {price}
                    </span>
                    {discountPercentage > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            {discountPercentage}% off
                        </span>
                    )}
                </div>
            </div>

            <div>
                {isCurrentPlan ? (
                    <button
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 cursor-default"
                        disabled
                    >
                        Current Plan
                    </button>
                ) : (
                    <button
                        onClick={handleClick}
                        className="px-3 py-1 text-xs font-semibold rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                        Select Plan
                    </button>
                )}
            </div>
        </div>
    );
};

const PlanFeature = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
            <span className="text-blue-600 mr-2">{icon}</span>
            <span className="text-sm text-gray-600">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
);

export default function PlanDisplay({
    plans = [],
    onPlanClick,
    currentPlanId,
}) {
    const [hoveredPlan, setHoveredPlan] = useState(null);

    if (!plans.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                No subscription plans available at the moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
            {plans.map((plan) => (
                <div
                    key={`plan-${plan.id}`}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 ${hoveredPlan === plan.id ? "transform -translate-y-1 shadow-lg" : "shadow"
                        }`}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                >
                    <div className="p-6 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {plan.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            {plan.description}
                        </p>

                        {/* Plan Features Section */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Plan Features</h4>
                            <div className="space-y-1">
                                <PlanFeature
                                    icon="👥"
                                    label="User Limit"
                                    value={plan.user_limit === -1 ? "Unlimited" : plan.user_limit}
                                />
                                <PlanFeature
                                    icon="📱"
                                    label="Social Profiles"
                                    value={plan.social_profile_limit === -1 ? "Unlimited" : plan.social_profile_limit}
                                />
                            </div>
                        </div>

                        <div className="h-px w-full bg-gray-200 my-4"></div>

                        {/* Pricing Section */}
                        <div className="mt-auto">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Pricing Options</h4>
                            {plan.PlanTypePrices && plan.PlanTypePrices.map((price, index) => (
                                <div key={`price-${price.id}`}>
                                    {index > 0 && <div className="h-px w-full bg-gray-200 my-2"></div>}
                                    <PriceItem
                                        id={price.id}
                                        currentPlanId={currentPlanId}
                                        handleClick={() => onPlanClick(price)}
                                        duration={price.duration}
                                        price={price.price}
                                        discountPercentage={parseFloat(price.discount_percentage)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
