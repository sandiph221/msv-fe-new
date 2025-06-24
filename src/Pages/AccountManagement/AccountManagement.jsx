import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSignInUser } from "../../store/actions/AuthAction";
import { UpdateCustomerBanner } from "../../store/actions/CustomersAction";
import Layout from "../../Components/Layout";
import Spinner from "../../Components/Spinner";
import Alert from "../../Components/AlertBox/Alert";
import UploadImg from "../../Components/UploadImg";
import ConnectToSocial from "../../Customer/Components/ConnectToSocial";
import SubscriptionDetail from "../SubscriptionManagementSetting/SubscriptionDetail";
import { formatServerImages } from "utils/functions.js";
import { ErrorOutline } from "@material-ui/icons";

// Separate component for page header
const PageHeader = () => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Account Management
            </h1>
            <p className="text-sm text-gray-600">
                Update your personal information, change passwords and connect apps
            </p>
        </div>
    );
};

// Separate component for section container
const SectionContainer = ({ title, description, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
};

// Separate component for image upload section
const ImageUploadSection = ({
    logoURL,
    bannerURL,
    onLogoChange,
    onBannerChange,
    onSubmit,
    errors,
    validationErrors,
    isSubmitting,
    isDisabled
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                    <UploadImg
                        id="upload-logo"
                        title="Upload Logo"
                        defaultImg={formatServerImages(logoURL)}
                        getSelectedData={onLogoChange}
                    />
                    {(errors?.logo || validationErrors?.logo || validationErrors?.brand_logo_size) && (
                        <p className="text-sm text-red-600">
                            {errors?.logo || validationErrors?.logo || validationErrors?.brand_logo_size}
                        </p>
                    )}
                </div>

                {/* Banner Upload */}
                <div className="space-y-2">
                    <UploadImg
                        id="upload-banner"
                        title="Upload Banner"
                        defaultImg={formatServerImages(bannerURL)}
                        getSelectedData={onBannerChange}
                    />
                    {(errors?.featured_image || validationErrors?.brand_featured_size) && (
                        <p className="text-sm text-red-600">
                            {errors?.featured_image || validationErrors?.brand_featured_size}
                        </p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm
                        ${isDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }
                        transition-colors duration-200
                    `}
                >
                    Update
                    {isSubmitting && <Spinner size={16} />}
                </button>
            </div>
        </form>
    );
};

// Separate component for delete account section
const DeleteAccountSection = ({ onDeleteClick }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Delete Account
                </h4>
                <p className="text-sm text-gray-600">
                    Deleting your account is a permanent action. Once you delete
                    your account, you will not be able to recover it. Please be
                    certain before proceeding.
                </p>
            </div>
            <button
                type="button"
                onClick={onDeleteClick}
                className="
                    px-6 py-2 bg-red-600 text-white rounded-lg font-medium text-sm
                    hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    transition-colors duration-200 whitespace-nowrap
                "
            >
                Delete Account
            </button>
        </div>
    );
};

// Separate component for loading state
const LoadingDisplay = () => {
    return (
        <div className="w-full min-h-[400px] flex items-center justify-center">
            <Spinner />
        </div>
    );
};

// Custom hook for image form management
const useImageForm = (logoURL, bannerURL, dispatch) => {
    const [imgFormValues, setImgFormValues] = useState({
        logo: logoURL || "",
        featured_image: bannerURL || "",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    // Update form values when props change
    useEffect(() => {
        setImgFormValues({
            logo: logoURL || "",
            featured_image: bannerURL || "",
        });
    }, [logoURL, bannerURL]);

    // Enable submit button when files are selected
    useEffect(() => {
        if (
            imgFormValues.logo instanceof File ||
            imgFormValues.featured_image instanceof File
        ) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [imgFormValues.logo, imgFormValues.featured_image]);

    const handleLogoChange = (item) => {
        setImgFormValues(prev => ({
            ...prev,
            logo: item,
        }));
    };

    const handleBannerChange = (item) => {
        setImgFormValues(prev => ({
            ...prev,
            featured_image: item,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let formErrors = {};

        // Image Size Validation
        if (imgFormValues.logo?.size > 2097152) {
            formErrors.logo = "Logo cannot be greater than 2 MB.";
        }
        if (imgFormValues.featured_image?.size < 2097152) {
            formErrors.featured_image = "Featured Image cannot be smaller than 2 MB.";
        }

        if (!imgFormValues.logo) {
            formErrors.logo = "Logo is Required";
        }

        if (!imgFormValues.featured_image) {
            formErrors.featured_image = "Brand banner image is Required";
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            setIsSubmitting(true);
            setIsDisabled(true);

            try {
                await dispatch(UpdateCustomerBanner(imgFormValues));
                setIsSubmitting(false);
                setValidationErrors({});
            } catch (error) {
                const errorMsg = error.response?.data?.message || {};
                setIsSubmitting(false);
                setIsDisabled(false);
                setValidationErrors(errorMsg);
            }
        }
    };

    return {
        imgFormValues,
        validationErrors,
        errors,
        isSubmitting,
        isDisabled,
        handleLogoChange,
        handleBannerChange,
        handleSubmit,
    };
};

// Custom hook for delete account functionality
const useDeleteAccount = (user, navigate) => {
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

    const handleDeleteClick = () => {
        setDeleteAlertOpen(true);
        setItemToDelete(user);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/account/${user.id}`);
            navigate("/logout");
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return {
        itemToDelete,
        deleteAlertOpen,
        setDeleteAlertOpen,
        handleDeleteClick,
        handleDeleteConfirm,
    };
};

// Main component
const AccountManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { logoURL, bannerURL } = useSelector((state) => state.settings);

    const [isLoading, setIsLoading] = useState(true);

    // Custom hooks
    const imageForm = useImageForm(logoURL, bannerURL, dispatch);
    const deleteAccount = useDeleteAccount(user, navigate);

    useEffect(() => {
        const initializeData = async () => {
            try {
                await dispatch(getSignInUser(user.id));
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) {
            initializeData();
        }
    }, [dispatch, user?.id]);

    if (isLoading) {
        return (
            <Layout>
                <LoadingDisplay />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <PageHeader />

                <div className="space-y-6">
                    {/* Social Connect Section - Only for customer-admin */}
                    {user?.role === "customer-admin" && (
                        <div className="mb-6">
                            <ConnectToSocial />
                        </div>
                    )}

                    {/* Logo/Banner Upload Section - Only for customer-admin */}
                    {user?.role === "customer-admin" && (
                        <SectionContainer
                            title="Update Logo/Banner"
                            description="Upload your company logo and banner image"
                        >
                            <ImageUploadSection
                                logoURL={logoURL}
                                bannerURL={bannerURL}
                                onLogoChange={imageForm.handleLogoChange}
                                onBannerChange={imageForm.handleBannerChange}
                                onSubmit={imageForm.handleSubmit}
                                errors={imageForm.errors}
                                validationErrors={imageForm.validationErrors}
                                isSubmitting={imageForm.isSubmitting}
                                isDisabled={imageForm.isDisabled}
                            />
                        </SectionContainer>
                    )}

                    {/* Account Management Section */}
                    <SectionContainer
                        title="Account Management"
                        className="space-y-6"
                    >
                        <DeleteAccountSection
                            onDeleteClick={deleteAccount.handleDeleteClick}
                        />

                        {/* Subscription Detail */}
                        <div className="pt-6 border-t border-gray-200">
                            <SubscriptionDetail />
                        </div>
                    </SectionContainer>
                </div>

                {/* Delete Confirmation Alert */}
                <Alert
                    alert={deleteAccount.itemToDelete}
                    icon={
                        <ErrorOutline
                            style={{
                                fontSize: "5rem",
                                color: "#ef4444",
                                paddingBottom: 0,
                                opacity: 0.8,
                            }}
                        />
                    }
                    title="Are you sure?"
                    confirmBtn="DELETE"
                    description="You're about to delete your account. This process cannot be undone."
                    open={deleteAccount.deleteAlertOpen}
                    setOpen={deleteAccount.setDeleteAlertOpen}
                    onConfirm={deleteAccount.handleDeleteConfirm}
                    buttonbgcolor="#ef4444"
                    textColor="#fff"
                />
            </div>
        </Layout>
    );
};

export default AccountManagement;
