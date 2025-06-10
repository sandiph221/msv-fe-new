import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LogoBannerUpload from './LogoBanner';
import ConnectSocial from './ConnectSocialNew';
import ViewAddProfiles from './ViewAddProfiles';
import axios from 'axios';
import { MSVFooterLogo } from '../logosandicons';

// Progress Bar Component
const ProgressBar = ({ stages, currentStepIndex }) => {
    return (
        <div className="flex justify-between gap-2">
            {stages.map((stage, index) => {
                const isActive = currentStepIndex === index;
                const isCompleted = currentStepIndex > index;
                const isAccessible = currentStepIndex >= index;

                return (
                    <React.Fragment key={index}>
                        <div
                            className={`
                                rounded-lg border-2 p-2 flex items-center transition-colors duration-200
                                ${isActive ? 'border-yellow-500 bg-yellow-50' : ''}
                                ${isCompleted ? 'border-green-500 bg-green-50' : ''}
                                ${!isAccessible ? 'border-gray-300 bg-gray-50' : ''}
                                ${isAccessible && !isActive && !isCompleted ? 'border-yellow-400' : ''}
                            `}
                        >
                            <div
                                className={`
                                    rounded-full mr-2 w-6 h-6 border flex justify-center items-center text-sm font-medium
                                    ${isActive ? 'border-yellow-500 text-yellow-500' : ''}
                                    ${isCompleted ? 'border-green-500 text-green-500 bg-green-500 ' : ''}
                                    ${!isAccessible ? 'border-gray-300 text-gray-400' : ''}
                                    ${isAccessible && !isActive && !isCompleted ? 'border-yellow-400 text-yellow-400' : ''}
                                `}
                            >
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <span
                                className={`
                                    font-semibold text-sm
                                    ${isActive ? 'text-yellow-500' : ''}
                                    ${isCompleted ? 'text-green-600' : ''}
                                    ${!isAccessible ? 'text-gray-400' : ''}
                                    ${isAccessible && !isActive && !isCompleted ? 'text-yellow-400' : ''}
                                `}
                            >
                                {stage.name}
                            </span>
                        </div>

                        {index < stages.length - 1 && (
                            <div className="flex items-center">
                                <div
                                    className={`
                                        h-1 w-8 rounded transition-colors duration-200
                                        ${currentStepIndex > index ? 'bg-green-400' : 'bg-gray-300'}
                                    `}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// Loading Spinner Component
const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">{message}</p>
        </div>
    </div>
);

// Main Onboarding Component
const OnboardingComponent = ({ user: propUser }) => {
    // State Management
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState(null);

    // Get user from Redux if not passed as prop
    const { user: reduxUser } = useSelector((state) => state.auth);
    const user = propUser || reduxUser;

    // Onboarding Stages Configuration
    const stages = [
        {
            name: "Connect Social",
            component: ConnectSocial,
            title: "Connect your social accounts",
            description: "Link your social media accounts to get started"
        },
        {
            name: "Add Profiles",
            component: ViewAddProfiles,
            title: "Add profiles you want to inspect",
            description: "Select the profiles you'd like to monitor and analyze"
        },
        {
            name: "Logo & Banner",
            component: LogoBannerUpload,
            title: "Upload Logo and Banner of your Company",
            description: "Customize your workspace with your company branding"
        }
    ];

    // Utility Functions


    const showError = useCallback((message) => {
        setError(message);
        setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }, []);

    // API Functions
    const updateOnboardingProgress = useCallback(async (stepIndex, isCompleted = false) => {
        try {
            setIsLoading(true);
            setError(null);
          

            const response = await axios.post('/user/update/onboarding', {
                onboarding_state: stepIndex + 1, // Convert to 1-based index for backend
                onboarding_completed: isCompleted
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000 // 10 second timeout
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to save progress. Please try again.';
            console.error('Error updating onboarding state:', error);
            showError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showError]);

    // Initialize onboarding state from user data
    useEffect(() => {
        const initializeOnboarding = () => {
            if (!user) {
                setIsInitializing(false);
                return;
            }

            try {
                // Convert backend onboarding_state (1-based) to frontend index (0-based)
                const backendState = user.onboarding_state || 1;
                const stepIndex = Math.max(0, Math.min(backendState - 1, stages.length - 1));

                setCurrentStepIndex(stepIndex);

                // Mark previous steps as completed
                const completed = new Set();
                for (let i = 0; i < stepIndex; i++) {
                    completed.add(i);
                }

                // If onboarding is fully completed, mark current step as completed too
                if (user.onboarding_completed && stepIndex < stages.length) {
                    completed.add(stepIndex);
                }

                setCompletedSteps(completed);
            } catch (error) {
                console.error('Error initializing onboarding state:', error);
                showError('Failed to load your progress');
            } finally {
                setIsInitializing(false);
            }
        };

        initializeOnboarding();
    }, [user, stages.length, showError]);

    // Event Handlers
    const handleStepComplete = useCallback((isComplete) => {
        setCompletedSteps(prev => {
            const newCompleted = new Set(prev);
            if (isComplete) {
                newCompleted.add(currentStepIndex);
            } else {
                newCompleted.delete(currentStepIndex);
            }
            return newCompleted;
        });
    }, [currentStepIndex]);

    const handleNext = useCallback(async () => {
        if (!completedSteps.has(currentStepIndex) || currentStepIndex >= stages.length - 1) {
            return;
        }

        try {
            const nextStepIndex = currentStepIndex + 1;
            await updateOnboardingProgress(nextStepIndex, false);
            setCurrentStepIndex(nextStepIndex);
        } catch (error) {
            // Error is already handled in updateOnboardingProgress
            console.error('Failed to proceed to next step');
        }
    }, [currentStepIndex, completedSteps, stages.length, updateOnboardingProgress]);

    const handlePrevious = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    }, [currentStepIndex]);

    const handleComplete = useCallback(async () => {
        if (!completedSteps.has(currentStepIndex)) {
            showError('Please complete the current step before finishing');
            return;
        }

        try {
            await updateOnboardingProgress(currentStepIndex, true);
            alert('🎉 Onboarding completed successfully! Welcome aboard!');
            // You might want to redirect to dashboard here
            // window.location.href = '/dashboard';
        } catch (error) {
            // Error is already handled in updateOnboardingProgress
            console.error('Failed to complete onboarding');
        }
    }, [currentStepIndex, completedSteps, updateOnboardingProgress, showError]);

    // Computed Values
    const currentStage = stages[currentStepIndex];
    const StepComponent = currentStage?.component;
    const isCurrentStepCompleted = completedSteps.has(currentStepIndex);
    const isLastStep = currentStepIndex === stages.length - 1;
    const canProceed = isCurrentStepCompleted && !isLoading;

    // Loading States
    if (isInitializing) {
        return <LoadingSpinner message="Loading your progress..." />;
    }

    if (!user) {
        return <LoadingSpinner message="Loading user data..." />;
    }

    if (!currentStage) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Invalid onboarding step</p>
                    <button
                        onClick={() => setCurrentStepIndex(0)}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <img
                            src={MSVFooterLogo}
                            className="h-12 mb-6"
                            alt="MSV Logo"
                        />

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <ProgressBar
                                stages={stages}
                                currentStepIndex={currentStepIndex}
                            />
                        </div>

                        {/* Step Info */}
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {currentStage.title}
                            </h1>
                            {currentStage.description && (
                                <p className="text-gray-600">
                                    {currentStage.description}
                                </p>
                            )}
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Step Content */}
                    <div className="p-6">
                        <div className="min-h-[400px] flex flex-col justify-center">
                            <StepComponent
                                onStageComplete={handleStepComplete}
                                isCompleted={isCurrentStepCompleted}
                            />
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center">
                            {/* Previous Button */}
                            <div>
                                {currentStepIndex > 0 ? (
                                    <button
                                        onClick={handlePrevious}
                                        disabled={isLoading}
                                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                ) : (
                                    <div /> // Empty div for spacing
                                )}
                            </div>

                            {/* Step Counter */}
                            <div className="text-sm text-gray-500">
                                Step {currentStepIndex + 1} of {stages.length}
                            </div>

                            {/* Next/Complete Button */}
                            <button
                                onClick={isLastStep ? handleComplete : handleNext}
                                disabled={!canProceed}
                                className={`
                                    px-6 py-3 rounded-lg font-medium transition-colors duration-200
                                    ${canProceed
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Saving...
                                    </span>
                                ) : isLastStep ? (
                                    'Complete Onboarding'
                                ) : (
                                    `Next: ${stages[currentStepIndex + 1]?.name || ''}`
                                )}
                            </button>
                        </div>

                        {/* Help Text */}
                        {!isCurrentStepCompleted && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Complete the current step to continue
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingComponent;
