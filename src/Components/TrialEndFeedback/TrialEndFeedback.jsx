import React, { useState } from 'react';
import axios from 'axios';

const TrialEndFeedback = ({ onSubscribe, onFeedbackSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const feedbackData = {
                rating,
                feedback_text: message || undefined // Only include if message exists
            };

            const response = await axios.post('/trial-end-forms', feedbackData);

            // Check if response indicates success
            if (response.data.status === true) {
                // Reset form after successful submission
                setRating(0);
                setMessage('');
                setSubmitSuccess(true);

                // Call callback if provided
                if (onFeedbackSubmitted) {
                    onFeedbackSubmitted(response.data);
                }

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } else {
                // Handle case where status is false but request didn't throw error
                setSubmitError(response.data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);

            // Handle backend error response format
            if (error.response?.data) {
                const errorData = error.response.data;

                // Check if user has already submitted feedback
                if (errorData.status_code === 400 &&
                    errorData.message?.toLowerCase().includes('already submitted')) {
                    setAlreadySubmitted(true);
                    setSubmitError(errorData.message);
                } else {
                    // Handle other backend errors
                    setSubmitError(errorData.message || 'An error occurred while submitting feedback');
                }
            } else if (error.response?.status === 403) {
                setSubmitError('You do not have permission to submit feedback.');
            } else if (error.response?.status === 401) {
                setSubmitError('Please log in to submit feedback.');
            } else if (error.code === 'NETWORK_ERROR') {
                setSubmitError('Network error. Please check your connection and try again.');
            } else {
                setSubmitError('Failed to submit feedback. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStarClick = (starValue) => {
        setRating(starValue);
        // Clear any previous errors when user interacts
        if (submitError) {
            setSubmitError('');
        }
    };

    const handleStarHover = (starValue) => {
        setHoveredRating(starValue);
    };

    const handleStarLeave = () => {
        setHoveredRating(0);
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= (hoveredRating || rating);

            return (
                <button
                    key={starValue}
                    type="button"
                    className={`text-3xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded ${isActive
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-300 hover:text-yellow-400'
                        }`}
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => handleStarHover(starValue)}
                    onMouseLeave={handleStarLeave}
                    aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
                    disabled={isSubmitting || alreadySubmitted}
                >
                    ★
                </button>
            );
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Your Trial Has Ended
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Thank you for trying our product! To continue enjoying all features, please subscribe to one of our plans.
                        </p>

                        {/* Subscribe Button */}
                        <button
                            onClick={onSubscribe}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 mb-8"
                        >
                            Subscribe Now
                        </button>
                    </div>

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Thank you for your feedback! It has been submitted successfully.
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {submitError && (
                        <div className={`mb-6 p-4 border rounded-lg ${alreadySubmitted
                                ? 'bg-blue-100 border-blue-400 text-blue-700'
                                : 'bg-red-100 border-red-400 text-red-700'
                            }`}>
                            <div className="flex items-center">
                                {alreadySubmitted ? (
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {submitError}
                            </div>
                        </div>
                    )}

                    {/* Already Submitted Notice */}
                    {alreadySubmitted && (
                        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg">
                            <div className="text-center">
                                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">
                                    We appreciate that you've already shared your feedback with us.
                                    Your input is valuable and helps us improve our product.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Feedback Form */}
                    {!alreadySubmitted && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                    How would you rate our product?
                                </h3>

                                {/* Rating Stars */}
                                <div className="flex justify-center space-x-1 mb-6">
                                    {renderStars()}
                                </div>

                                {rating > 0 && (
                                    <p className="text-center text-sm text-gray-600 mb-4">
                                        You rated us {rating} star{rating !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tell us about your experience (optional)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                                    placeholder="Share your thoughts, suggestions, or feedback..."
                                    maxLength={500}
                                    disabled={isSubmitting}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {message.length}/500
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || rating === 0}
                                className={`w-full font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 ${isSubmitting || rating === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Submit Feedback'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Your feedback helps us improve our product for everyone
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrialEndFeedback;
