import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UploadImg from '../UploadImg';
import Spinner from '../Spinner';
import { formatServerImages } from '../../utils/functions.js';
import { UpdateCustomerBanner } from '../../store/actions/CustomersAction';
import { FaUpload } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const LogoBannerUpload = ({ onStageComplete }) => {
    useEffect(() => {
        onStageComplete(true)
    }, []);

    const dispatch = useDispatch();
    const { logoURL, bannerURL } = useSelector((state) => state.settings);

    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [uploadProgress, setUploadProgress] = useState({
        logo: false,
        banner: false
    });
    const [imgFormValues, setImgFormValues] = useState({
        logo: logoURL || "",
        featured_image: bannerURL || "",
    });
    const [notification, setNotification] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({
        logo: null,
        banner: null
    });
    const [hasChanges, setHasChanges] = useState(false);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const validateAndSaveChanges = async (event) => {
        event.preventDefault();
        let formErrors = {};

        // Validate logo if selected
        if (selectedFiles.logo && selectedFiles.logo.size > 2097152) {
            formErrors.logo = "Logo cannot be greater than 2 MB.";
        }

        // Validate banner if selected
        if (selectedFiles.banner && selectedFiles.banner.size < 2097152) {
            formErrors.featured_image = "Featured Image cannot be smaller than 2 MB.";
        }

        if (Object.keys(formErrors).length > 0) {
            setValidationErrors(formErrors);
            showNotification(`Validation failed: ${Object.values(formErrors)[0]}`);
            return;
        }

        // Clear previous errors
        setValidationErrors({});

        // Start upload progress for both if they have changes
        if (selectedFiles.logo) {
            setUploadProgress(prev => ({ ...prev, logo: true }));
        }
        if (selectedFiles.banner) {
            setUploadProgress(prev => ({ ...prev, banner: true }));
        }

        try {
            const uploadData = {
                logo: selectedFiles.logo || imgFormValues.logo,
                featured_image: selectedFiles.banner || imgFormValues.featured_image,
            };
            const logoBannerResponse = await dispatch(UpdateCustomerBanner(uploadData));

            setUploadProgress({ logo: false, banner: false });

            // ✅ Update form values with server response or keep existing
            if (logoBannerResponse?.data?.data) {
                const responseData = logoBannerResponse.data.data;
                setImgFormValues(prev => ({
                    logo: responseData.logo || prev.logo,
                    featured_image: responseData.featured_image || responseData.feature_image || prev.featured_image,
                }));
            }

            // Clear selected files and changes flag
            setSelectedFiles({ logo: null, banner: null });
            setHasChanges(false);

            showNotification('Changes saved successfully!');

        } catch (error) {
            const logoBannerResError = error.response?.data;
            const logoBannerErrorMsg = logoBannerResError?.message || 'Save failed';

            setUploadProgress({ logo: false, banner: false });
            setValidationErrors(logoBannerErrorMsg);
            showNotification(`Save failed: ${typeof logoBannerErrorMsg === 'string' ? logoBannerErrorMsg : 'Something went wrong'}`);
        }
    };

    const handleFileSelect = (type, event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(prev => ({ ...prev, [type]: file }));
            setHasChanges(true);
            // Clear any previous validation errors for this field
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[type === 'logo' ? 'logo' : 'featured_image'];
                return newErrors;
            });
        }
    };

    const handleUploadClick = (type) => {
        if (type === 'logo') {
            logoInputRef.current?.click();
        } else {
            bannerInputRef.current?.click();
        }
    };

    const handleRemove = (type) => {
        // Reset to original server image (not completely remove)
        if (type === 'logo') {
            setImgFormValues(prev => ({ ...prev, logo: logoURL || "" }));
            setSelectedFiles(prev => ({ ...prev, logo: null }));
        } else {
            setImgFormValues(prev => ({ ...prev, featured_image: bannerURL || "" }));
            setSelectedFiles(prev => ({ ...prev, banner: null }));
        }

        setHasChanges(true);
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[type === 'logo' ? 'logo' : 'featured_image'];
            return newErrors;
        });
    };

    // ✅ Improved getDisplayImage function with better error handling
    const getDisplayImage = (type) => {
        try {
            if (type === 'logo') {
                // If there's a selected file, create object URL
                if (selectedFiles.logo) {
                    return URL.createObjectURL(selectedFiles.logo);
                }

                // If there's a form value, format it properly
                if (imgFormValues.logo) {
                    // If it's already a File object, create object URL
                    if (imgFormValues.logo instanceof File) {
                        return URL.createObjectURL(imgFormValues.logo);
                    }
                    // If it's a string, format it
                    if (typeof imgFormValues.logo === 'string' && imgFormValues.logo.trim()) {
                        return formatServerImages(imgFormValues.logo);
                    }
                }

                return null;
            } else {
                // Banner logic
                if (selectedFiles.banner) {
                    return URL.createObjectURL(selectedFiles.banner);
                }

                if (imgFormValues.featured_image) {
                    // If it's already a File object, create object URL
                    if (imgFormValues.featured_image instanceof File) {
                        return URL.createObjectURL(imgFormValues.featured_image);
                    }
                    // If it's a string, format it
                    if (typeof imgFormValues.featured_image === 'string' && imgFormValues.featured_image.trim()) {
                        return formatServerImages(imgFormValues.featured_image);
                    }
                }

                return null;
            }
        } catch (error) {
            console.error('Error in getDisplayImage:', error);
            return null;
        }
    };

    const hasCustomImage = (type) => {
        if (type === 'logo') {
            return selectedFiles.logo || (imgFormValues.logo && imgFormValues.logo !== logoURL);
        } else {
            return selectedFiles.banner || (imgFormValues.featured_image && imgFormValues.featured_image !== bannerURL);
        }
    };

    // ✅ Update imgFormValues when Redux state changes
    useEffect(() => {
        setImgFormValues(prev => ({
            logo: logoURL || prev.logo,
            featured_image: bannerURL || prev.featured_image,
        }));
    }, [logoURL, bannerURL]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Hidden file inputs */}
            <input
                type="file"
                ref={logoInputRef}
                onChange={(e) => handleFileSelect('logo', e)}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={bannerInputRef}
                onChange={(e) => handleFileSelect('banner', e)}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Notification */}
            {notification && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
                    {notification}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Update Logo/Banner
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Use the upload and remove buttons to manage your brand assets, then save your changes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Section */}
                    <div className="space-y-0">
                        <div className="relative">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 min-h-[200px] flex items-center justify-center">
                                {(() => {
                                    const logoImage = getDisplayImage('logo');
                                    return logoImage ? (
                                        <img
                                            src={logoImage}
                                            alt="Logo"
                                            className="max-h-[180px] max-w-full object-contain"
                                            onError={(e) => {
                                                console.error('Logo image failed to load:', logoImage);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-gray-500">
                                            <p className="text-sm">No logo available</p>
                                            <p className="text-xs mt-1">Use upload button below</p>
                                        </div>
                                    );
                                })()}
                            </div>
                            {uploadProgress.logo && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-600">
                                        <Spinner size={20} />
                                        <span className="text-sm font-medium">Processing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Logo Action Buttons */}
                        <table className="w-full border border-gray-300">
                            <tbody>
                                <tr>
                                    <td className="w-1/2 border-r border-gray-300 p-3 text-center">
                                        <button
                                            onClick={() => handleUploadClick('logo')}
                                            disabled={uploadProgress.logo}
                                            className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-yellow-600 disabled:text-gray-400"
                                        >
                                            <FaUpload size={14} />
                                            Upload
                                        </button>
                                    </td>
                                    <td className="w-1/2 p-3 text-center">
                                        <button
                                            onClick={() => handleRemove('logo')}
                                            disabled={!hasCustomImage('logo') || uploadProgress.logo}
                                            className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-red-600 disabled:text-gray-400"
                                        >
                                            <RiDeleteBin6Line size={14} />
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {validationErrors.logo && (
                            <p className="text-red-500 text-sm mt-1 text-center">
                                {validationErrors.logo}
                            </p>
                        )}
                    </div>

                    {/* Banner Section */}
                    <div className="space-y-0">
                        <div className="relative">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 min-h-[200px] flex items-center justify-center">
                                {(() => {
                                    const bannerImage = getDisplayImage('banner');
                                    return bannerImage ? (
                                        <img
                                            src={bannerImage}
                                            alt="Banner"
                                            className="max-h-[180px] max-w-full object-contain"
                                            onError={(e) => {
                                                console.error('Banner image failed to load:', bannerImage);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-gray-500">
                                            <p className="text-sm">No banner available</p>
                                            <p className="text-xs mt-1">Use upload button below</p>
                                        </div>
                                    );
                                })()}
                            </div>
                            {uploadProgress.banner && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-600">
                                        <Spinner size={20} />
                                        <span className="text-sm font-medium">Processing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <table className="w-full border border-gray-300">
                        <tbody>
                            <tr>
                                <td className="w-1/2 border-r border-gray-300 p-3 text-center">
                                    <button
                                        onClick={() => handleUploadClick('banner')}
                                        disabled={uploadProgress.banner}
                                        className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-yellow-600 disabled:text-gray-400"
                                    >
                                        <FaUpload size={14} />
                                        Upload
                                    </button>
                                </td>
                                <td className="w-1/2 p-3 text-center">
                                    <button
                                        onClick={() => handleRemove('banner')}
                                        disabled={!hasCustomImage('banner') || uploadProgress.banner}
                                        className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-red-600 disabled:text-gray-400"
                                    >
                                        <RiDeleteBin6Line size={14} />
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {validationErrors.featured_image && (
                        <p className="text-red-500 text-sm mt-1 text-center">
                            {validationErrors.featured_image}
                        </p>
                    )}
                </div>
            </div>

            {/* Save Changes Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={validateAndSaveChanges}
                    disabled={!hasChanges || uploadProgress.logo || uploadProgress.banner}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {(uploadProgress.logo || uploadProgress.banner) ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
        </div >
    );
};

export default LogoBannerUpload;
