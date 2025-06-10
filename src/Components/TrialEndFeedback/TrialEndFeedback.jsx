import React, { useState } from 'react';

const TrialEndFeedback = ({ onSubmit, onSubscribe }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                rating,
                message,
                timestamp: new Date().toISOString()
            });
            // Reset form after successful submission
            setRating(0);
            setMessage('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStarClick = (starValue) => {
        setRating(starValue);
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

                    {/* Feedback Form */}
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
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>

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
