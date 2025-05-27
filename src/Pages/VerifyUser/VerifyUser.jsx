import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader, Mail, ArrowRight } from 'lucide-react';

const VerifyUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                // Get token from URL query parameters
                const queryParams = new URLSearchParams(location.search);
                const token = queryParams.get('token');

                if (!token) {
                    setVerificationStatus('error');
                    setMessage('Invalid verification link. No token found.');
                    return;
                }

                // Send verification request to backend
                const response = await axios.get(`/verify/${token}`);

                if (response.data.success) {
                    setVerificationStatus('success');
                    setMessage('Email verified successfully! You can now log in to your account.');

                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setVerificationStatus('error');
                    setMessage('Email verification failed. The link may be expired or invalid.');
                }
            } catch (error) {
                console.error('Verification failed:', error);
                setVerificationStatus('error');
                setMessage('Email verification failed. Please try again or contact support.');
            }
        };

        verifyUserEmail();
    }, [location.search, navigate]);

    const handleRedirect = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white mr-3" />
                            <h1 className="text-2xl font-bold text-white">Email Verification</h1>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-10">
                        <div className="text-center">
                            {/* Status Icon */}
                            <div className="mb-6">
                                {verificationStatus === 'loading' && (
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                                        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                                    </div>
                                )}

                                {verificationStatus === 'success' && (
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full animate-pulse">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                )}

                                {verificationStatus === 'error' && (
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                                        <XCircle className="w-10 h-10 text-red-600" />
                                    </div>
                                )}
                            </div>

                            {/* Status Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {verificationStatus === 'loading' && 'Verifying Your Email...'}
                                {verificationStatus === 'success' && 'Verification Successful!'}
                                {verificationStatus === 'error' && 'Verification Failed'}
                            </h2>

                            {/* Status Message */}
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {verificationStatus === 'loading' && 'Please wait while we verify your email address. This should only take a moment.'}
                                {message && message}
                            </p>

                            {/* Action Buttons */}
                            {verificationStatus === 'success' && (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleRedirect('/login')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
                                    >
                                        Continue to Login
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-sm text-gray-500">
                                        Redirecting automatically in 3 seconds...
                                    </p>
                                </div>
                            )}

                            {verificationStatus === 'error' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleRedirect('/')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Go to Homepage
                                    </button>
                                    <button
                                        onClick={() => handleRedirect('/register')}
                                        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Try Registering Again
                                    </button>
                                </div>
                            )}

                            {verificationStatus === 'loading' && (
                                <div className="flex justify-center">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Need help? <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Contact Support</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyUser;
