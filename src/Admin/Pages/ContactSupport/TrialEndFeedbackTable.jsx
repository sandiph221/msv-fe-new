import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrialEndFeedbackTable = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalForms, setTotalForms] = useState(0);
    const [limit, setLimit] = useState(10);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState('');

    // Fetch feedback data
    const fetchFeedbackData = async (page = 1, searchTerm = '', pageLimit = 10) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page,
                limit: pageLimit,
                ...(searchTerm && { query: searchTerm })
            };

            const response = await axios.get('/trial-end-forms', { params });

            if (response.data.status === true) {
                setFeedbackData(response.data.data.trialEndForms || []);
                setTotalPages(response.data.data.totalPages || 1);
                setTotalForms(response.data.data.totalForms || 0);
                setCurrentPage(response.data.data.currentPage || 1);
            } else {
                setError(response.data.message || 'Failed to fetch feedback data');
            }
        } catch (error) {
            console.error('Error fetching feedback data:', error);
            if (error.response?.status === 401) {
                setError('Please log in to view feedback data.');
            } else if (error.response?.status === 403) {
                setError('You do not have permission to view this data.');
            } else {
                setError('Failed to load feedback data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete feedback entry
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback entry? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(id);
        setError('');
        setDeleteSuccess('');

        try {
            const response = await axios.delete(`/trial-end-forms/${id}`);

            if (response.data.status === true) {
                setDeleteSuccess('Feedback entry deleted successfully');
                // Refresh the current page data
                await fetchFeedbackData(currentPage, searchQuery, limit);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setDeleteSuccess('');
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to delete feedback entry');
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            if (error.response?.status === 404) {
                setError('Feedback entry not found.');
            } else if (error.response?.status === 403) {
                setError('You do not have permission to delete this entry.');
            } else {
                setError('Failed to delete feedback entry. Please try again.');
            }
        } finally {
            setDeleteLoading(null);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchFeedbackData(1, searchQuery, limit);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchFeedbackData(newPage, searchQuery, limit);
        }
    };

    // Handle limit change
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1);
        fetchFeedbackData(1, searchQuery, newLimit);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render star rating
    const renderStarRating = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span
                key={index}
                className={`text-lg ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    // Generate pagination numbers
    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    useEffect(() => {
        fetchFeedbackData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Trial End Feedback</h1>
                            <p className="text-gray-600 mt-1">
                                Manage and review user feedback from trial endings
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Total: {totalForms} entries</span>
                        </div>
                    </div>

                    {/* Search and Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <form onSubmit={handleSearch} className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by user name, email, or feedback..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <span className="sr-only">Search</span>
                                </button>
                            </div>
                        </form>

                        <div className="flex items-center space-x-2">
                            <label htmlFor="limit" className="text-sm text-gray-700">Show:</label>
                            <select
                                id="limit"
                                value={limit}
                                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {deleteSuccess && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {deleteSuccess}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600">Loading feedback data...</span>
                            </div>
                        </div>
                    ) : feedbackData.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback entries found</h3>
                            <p className="text-gray-600">
                                {searchQuery ? 'Try adjusting your search criteria.' : 'No trial end feedback has been submitted yet.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rating
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Feedback
                                            </th>
                                      
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Submitted
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {feedbackData.map((feedback) => (
                                            <tr key={feedback.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-yellow-800">
                                                                    {feedback.User?.first_name?.charAt(0) || '?'}
                                                                    {feedback.User?.last_name?.charAt(0) || ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {feedback.User?.first_name} {feedback.User?.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {feedback.User?.email}
                                                            </div>
                                                            {feedback.User?.CustomerSubdomain?.subdomain && (
                                                                <div className="text-xs text-blue-600">
                                                                    {feedback.User.CustomerSubdomain.subdomain}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-1">
                                                        {renderStarRating(feedback.rating)}
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            ({feedback.rating}/5)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs">
                                                        {feedback.feedback_text ? (
                                                            <div>
                                                                <p className="truncate" title={feedback.feedback_text}>
                                                                    {feedback.feedback_text.length > 100
                                                                        ? `${feedback.feedback_text.substring(0, 100)}...`
                                                                        : feedback.feedback_text
                                                                    }
                                                                </p>
                                                                {feedback.feedback_text.length > 100 && (
                                                                    <button
                                                                        onClick={() => {
                                                                            const modal = document.createElement('div');
                                                                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                                                                            modal.innerHTML = `
                                                                                <div class="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-96 overflow-y-auto">
                                                                                    <div class="flex justify-between items-start mb-4">
                                                                                        <h3 class="text-lg font-semibold text-gray-900">Full Feedback</h3>
                                                                                        <button class="text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
                                                                                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                    <p class="text-gray-700 whitespace-pre-wrap">${feedback.feedback_text}</p>
                                                                                </div>
                                                                            `;
                                                                            document.body.appendChild(modal);
                                                                        }}
                                                                        className="text-xs text-yellow-600 hover:text-yellow-800 mt-1"
                                                                    >
                                                                        Read more
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">No feedback text</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(feedback.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDelete(feedback.id)}
                                                        disabled={deleteLoading === feedback.id}
                                                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${deleteLoading === feedback.id
                                                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                                : 'text-red-700 bg-red-100 hover:bg-red-200'
                                                            }`}
                                                    >
                                                        {deleteLoading === feedback.id ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                    : 'text-gray-700 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                    : 'text-gray-700 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing{' '}
                                                <span className="font-medium">
                                                    {((currentPage - 1) * limit) + 1}
                                                </span>{' '}
                                                to{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * limit, totalForms)}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-medium">{totalForms}</span>{' '}
                                                results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                                                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                            : 'text-gray-500 bg-white hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {getPaginationNumbers().map((page, index) => (
                                                    page === '...' ? (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                                    ? 'z-10 bg-yellow-50 border-yellow-500 text-yellow-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ))}

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                                                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                            : 'text-gray-500 bg-white hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrialEndFeedbackTable;
