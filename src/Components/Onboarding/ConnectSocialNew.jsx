import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoginSocialFacebook } from "reactjs-social-login";
import { linkSocialPlatform } from "../../store/actions/CustomersAction";
import { toast } from "react-toastify";
import axios from "axios";
import {
    FaFacebook,
    FaInstagram,
    FaCheckCircle,
    FaSpinner
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ConnnectSocialNew = ({ onStageComplete }) => {
    const dispatch = useDispatch();

    const [platformData, setPlatFormData] = useState("");
    const [account, setAccount] = useState("");
    const [linkingFacebook, setLinkingFacebook] = useState(false);
    const [loading, setLoading] = useState(true);
    const [instagramConnected, setInstagramConnected] = useState(false);

    /**
     * Handle successful social login
     * @param {Object} response - The response from social login
     */
    const handleLinkSocial = async (response) => {
        try {
            setLinkingFacebook(true);
            // Extract the access token from the response
            const accessToken = response.data.accessToken;
            console.log("find pic", response.data)
            const otherData = { first_name: response.data.first_name, email: response.data.email, last_name: response.data.last_name, picture: response.data.picture.data.url }
            await dispatch(linkSocialPlatform(accessToken, otherData));
            await getIntegratedData("facebook");
            toast.success("Account linked successfully");
            setLinkingFacebook(false);
            // Check if stage is complete (both Facebook connected and Instagram selected if available)
            checkStageCompletion();
        } catch (error) {
            console.log(error);
            toast.error("Error while linking account");
            setLinkingFacebook(false);
            onStageComplete(false);
        }
    };

    const getIntegratedData = async (platform) => {
        try {
            const data = await axios.get(`/integration/${platform}/details`);
            setPlatFormData(data?.data?.platformDetails);
            // set default instagram account
            setAccount(data?.data?.platformDetails?.instagram?.id || "");
            // Check if Instagram is already connected
            if (data?.data?.platformDetails?.instagram?.id) {
                setInstagramConnected(true);
            }
            return data?.data?.platformDetails;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleUnlinkSocial = async (platform) => {
        try {
            await axios.delete(`/integration/${platform}/unlink`);
            setPlatFormData(undefined);
            setAccount("");
            setInstagramConnected(false);
            onStageComplete(false);
            toast.success("Account unlinked successfully");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message ?? error?.message);
        }
    };

    const selectDefaultSocial = async (platform) => {
        if (!account) return toast.error("Please select an account.");

        // Handle "none" selection to unlink Instagram
        if (account === "none") {
            try {
                await axios.delete(`/integration/${platform}/unlink-account`);
                setInstagramConnected(false);
                setAccount("");
                toast.success("Instagram account disconnected successfully");
                checkStageCompletion();
                return;
            } catch (error) {
                console.log(error);
                toast.error("Failed to disconnect Instagram account");
                return;
            }
        }

        try {
            await axios.put(`/integration/${platform}/default_account`, {
                accountId: account,
            });
            setInstagramConnected(true);
            toast.success("Instagram account updated successfully");
            checkStageCompletion();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update Instagram account");
        }
    };

    // Check if the onboarding stage is complete
    const checkStageCompletion = () => {
        // Stage is complete if Facebook is connected and either:
        // 1. No Instagram accounts are available, OR
        // 2. Instagram account is selected and connected
        if (platformData) {
            const hasInstagramAccounts = platformData?.instagram?.other_instagrams && platformData.instagram.other_instagrams.length > 0;
            if (!hasInstagramAccounts || instagramConnected) {
                onStageComplete(true);
            } else {
                onStageComplete(false);
            }
        } else {
            onStageComplete(false);
        }
    };

    // Handle Facebook section click
    const handleFacebookSectionClick = () => {
        if (platformData) {
            // If connected, disconnect
            handleUnlinkSocial("facebook");
        }
        // If not connected, the LoginSocialFacebook component will handle the connection
    };

    // Handle Instagram section click
    const handleInstagramSectionClick = () => {
        // Only allow interaction if Facebook is connected
        if (!platformData) {
            toast.info("Please connect Facebook first to access Instagram accounts");
            return;
        }

        // If no Instagram accounts available, show message
        if (!platformData?.instagram?.other_instagrams || platformData.instagram.other_instagrams.length === 0) {
            toast.info("No Instagram accounts found. Please ensure your Facebook account has connected Instagram business accounts.");
            return;
        }
    };

    // Get the selected Instagram account details
    const getSelectedInstagramAccount = () => {
        if (!platformData?.instagram?.other_instagrams || !account) return null;
        return platformData.instagram.other_instagrams.find(acc => acc.id === account);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getIntegratedData("facebook");
            if (data) {
                const hasInstagramAccounts = data?.instagram?.other_instagrams && data.instagram.other_instagrams.length > 0;
                const isInstagramConnected = data?.instagram?.id;

                if (!hasInstagramAccounts || isInstagramConnected) {
                    onStageComplete(true);
                } else {
                    onStageComplete(false);
                }
            } else {
                onStageComplete(false);
            }
            setLoading(false);
        })();
    }, []);

    // Update stage completion when dependencies change
    useEffect(() => {
        if (!loading) {
            checkStageCompletion();
        }
    }, [platformData, instagramConnected, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center ">
                <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-blue-500" />
            </div>
        );
    }

    const selectedInstagramAccount = getSelectedInstagramAccount();

    return (
        <div className="">
            <div className="">
                <p className="text-gray-600">Link your social media accounts to get started</p>
            </div>

            {/* Social Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook Card */}
                {platformData ? (
                    // Connected State - Clickable to disconnect
                    <div
                        className="bg-white border border-gray-200 flex items-center justify-center section1 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                        onClick={handleFacebookSectionClick}
                    >
                        <div className="text-center">
                            {/* Profile Picture and Status */}
                            <div className="relative inline-block">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                                    {platformData?.facebook?.picture?.data?.url ? (
                                        <img
                                            src={platformData.facebook.picture.data.url}
                                            alt={platformData?.facebook?.name || "Profile"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <FaFacebook className="w-8 h-8 text-blue-600" />
                                    )}
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {platformData?.facebook?.name || "Facebook User"}
                                </h3>
                                <p className="text-red-500 hover:text-red-600 text-sm font-medium mt-1">
                                    Disconnect
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Disconnected State - Clickable to connect
                    <LoginSocialFacebook
                        appId={import.meta.env.VITE_REACT_APP_ID}
                        fieldsProfile="id,first_name,last_name,middle_name,name,name_format,picture,short_name,email"
                        scope="pages_show_list,business_management,instagram_basic,instagram_manage_insights,pages_read_engagement,email"
                        onResolve={handleLinkSocial}
                        onReject={(error) => {
                            console.log({ error });
                            toast.error("Failed to connect to Facebook");
                            setLinkingFacebook(false);
                            onStageComplete(false);
                        }}
                    >
                        <div className="bg-white border border-gray-200 section1 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50 w-full">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    {linkingFacebook ? (
                                        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
                                    ) : (
                                        <FaFacebook className="w-8 h-8 text-blue-600" />
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Connect with Facebook</h3>
                                    <p className="text-blue-500 text-sm font-medium">
                                        {linkingFacebook ? "Connecting..." : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </LoginSocialFacebook>
                )}

                {/* Instagram Card - Now functional based on Facebook connection */}
                <div
                    className={`bg-white border section2 border-gray-200 rounded-lg p-6 shadow-sm transition-all ${platformData
                            ? (platformData?.instagram?.other_instagrams && platformData.instagram.other_instagrams.length > 0)
                                ? "cursor-default"
                                : "opacity-75 cursor-not-allowed"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                    onClick={handleInstagramSectionClick}
                >
                    <div className="text-center space-y-4">
                        <div className="relative inline-block">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                                {instagramConnected && selectedInstagramAccount && platformData?.instagram?.profile_picture_url ? (
                                    <img
                                        src={platformData.instagram.profile_picture_url}
                                        alt={selectedInstagramAccount?.name || "Instagram Profile"}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <FaInstagram className="w-8 h-8 text-pink-600" />
                                )}
                            </div>
                            {instagramConnected && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {instagramConnected && selectedInstagramAccount
                                    ? selectedInstagramAccount.name
                                    : "Connect with Instagram"
                                }
                            </h3>
                            {instagramConnected && selectedInstagramAccount && (
                                <p className="text-gray-600 text-xs mb-1">
                                    @{selectedInstagramAccount.username}
                                </p>
                            )}
                            <p className={`text-sm font-medium ${!platformData
                                    ? "text-gray-500"
                                    : (platformData?.instagram?.other_instagrams && platformData.instagram.other_instagrams.length > 0)
                                        ? instagramConnected
                                            ? "text-green-500"
                                            : "text-orange-500"
                                        : "text-gray-500"
                                }`}>
                            </p>
                        </div>
                    </div>

                    {/* Instagram Selection - Show only if Facebook is connected and has Instagram accounts */}
                    {platformData && platformData?.instagram?.other_instagrams && platformData.instagram.other_instagrams.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
        
                            <div className="space-y-2">
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                                    value={account}
                                    onChange={(e) => setAccount(e.target.value)}
                                >
                                    <option value="">Select an Instagram account</option>
                                    {instagramConnected && (
                                        <option value="none">SELECT NONE (Disconnect)</option>
                                    )}
                                    {platformData.instagram.other_instagrams.map((p) => (
                                        <option value={p.id} key={p.id}>
                                            {p.name} (@{p.username})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        selectDefaultSocial("instagram");
                                    }}
                                    disabled={!account}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                                >
                                    {account === "none" ? "Disconnect Instagram™" : instagramConnected ? "Update Instagram™ Account" : "Connect Instagram™ Account"}
                                </button>
                         
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer N    ote */}
            <div className="text-xs text-gray-500 text-center mt-6">
                By connecting, you agree to allow access to your social media accounts for automation features.
            </div>
        </div>
    );
};

export default ConnnectSocialNew;