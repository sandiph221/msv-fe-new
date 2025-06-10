import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAddedProfileList,
    deleteAddedProfileList,
    searchSocialMediaProfiles,
    addProfileList,
    setActiveSocialMediaType
} from '../../store/actions/SocialMediaProfileAction';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { formatImage, formatNumber } from '../../utils/functions';
import Spinner from '../Spinner';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { X } from 'lucide-react';

const ViewAddProfiles = ({ onStageComplete }) => {
    const dispatch = useDispatch();
    const {
        addedProfileList,
        addedProfileListLoading,
        activeSocialMediaType,
        searchedProfileList,
        searchLoading
    } = useSelector((state) => state.socialMediaProfileListReducer);
    const { user } = useSelector((state) => state.auth);

    const subdomain = user?.CustomerSubdomain?.subdomain;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [allProfiles, setAllProfiles] = useState([]);
    const [facebookProfiles, setFacebookProfiles] = useState([]);
    const [instagramProfiles, setInstagramProfiles] = useState([]);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

    // Fetch profiles for both platforms on mount
    useEffect(() => {
        const fetchAllProfiles = async () => {
            setIsLoadingProfiles(true);
            try {
                // Fetch Facebook profiles
                dispatch(setActiveSocialMediaType('facebook'));
                const fbProfiles = await dispatch(getAddedProfileList());
                setFacebookProfiles(fbProfiles || []);

                // Fetch Instagram profiles  
                dispatch(setActiveSocialMediaType('instagram'));
                const igProfiles = await dispatch(getAddedProfileList());
                setInstagramProfiles(igProfiles || []);

                // Reset to facebook as default
                dispatch(setActiveSocialMediaType('facebook'));
            } catch (error) {
                console.error('Error fetching profiles:', error);
            } finally {
                setIsLoadingProfiles(false);
            }
        };

        fetchAllProfiles();
    }, [dispatch]);

    // Combine profiles when either list changes
    useEffect(() => {
        const combined = [
            ...facebookProfiles.map(profile => ({ ...profile, platform: 'facebook' })),
            ...instagramProfiles.map(profile => ({ ...profile, platform: 'instagram' }))
        ];
        setAllProfiles(combined);
    }, [facebookProfiles, instagramProfiles]);

    // Enable/disable next button based on whether profiles exist
    useEffect(() => {
        const hasProfiles = allProfiles && allProfiles.length > 0;
        onStageComplete(hasProfiles);
    }, [allProfiles, onStageComplete]);

    // Auto search when typing
    useEffect(() => {
        if (searchQuery.trim()) {
            const timeoutId = setTimeout(() => {
                dispatch(searchSocialMediaProfiles(searchQuery));
                setShowSearchResults(true);
            }, 500); // Debounce search by 500ms

            return () => clearTimeout(timeoutId);
        } else if (!searchQuery.trim()) {
            setShowSearchResults(false);
            dispatch(searchSocialMediaProfiles(''));
        }
    }, [searchQuery, activeSocialMediaType, dispatch]);

    const refreshProfiles = async () => {
        setIsLoadingProfiles(true);
        try {
            // Refresh Facebook profiles
            const currentPlatform = activeSocialMediaType;
            dispatch(setActiveSocialMediaType('facebook'));
            const fbProfiles = await dispatch(getAddedProfileList());
            setFacebookProfiles(fbProfiles || []);

            // Refresh Instagram profiles  
            dispatch(setActiveSocialMediaType('instagram'));
            const igProfiles = await dispatch(getAddedProfileList());
            setInstagramProfiles(igProfiles || []);

            // Reset to original platform
            dispatch(setActiveSocialMediaType(currentPlatform));
        } catch (error) {
            console.error('Error refreshing profiles:', error);
        } finally {
            setIsLoadingProfiles(false);
        }
    };

    const handleDeleteProfile = async (profileId, platform) => {
        if (window.confirm('Are you sure you want to remove this profile?')) {
            const originalPlatform = activeSocialMediaType;
            try {
                dispatch(setActiveSocialMediaType(platform));
                await dispatch(deleteAddedProfileList(profileId));
                await refreshProfiles();
            } catch (error) {
                console.error('Error deleting profile:', error);
            } finally {
                dispatch(setActiveSocialMediaType(originalPlatform));
            }
        }
    };

    const handlePlatformChange = (platform) => {
        dispatch(setActiveSocialMediaType(platform));
        setDropdownOpen(false);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleAddProfile = async (profile) => {
        const profileToAdd = [{
            ...profile,
            picture: profile.picture ?? profile.profile_picture_url,
        }];

        const originalPlatform = activeSocialMediaType;
        try {
            await dispatch(addProfileList(profileToAdd));
            setSearchQuery('');
            setShowSearchResults(false);
            await refreshProfiles();
        } catch (error) {
            console.error('Error adding profile:', error);
        } finally {
            dispatch(setActiveSocialMediaType(originalPlatform));
        }
    };

    const isProfileAlreadyAdded = (profileId) => {
        return allProfiles && allProfiles.find(
            (profile) => parseInt(profile.social_page_id) === profileId
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowSearchResults(false);
        dispatch(searchSocialMediaProfiles(''));
    };

    const getPlatformIcon = (platform, size = 30) => {
        return platform === 'facebook' ?
            <FaFacebook color="#1877F2" size={size} /> :
            <FaInstagram color="#E1306C" size={size} />;
    };

    if (isLoadingProfiles) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size={40} />
            </div>
        );
    }

    return (
        <div className="">
            {/* Header Section */}
            <div className="mb-6">
                {/* Platform Dropdown and Search Input in same line */}
                <div className="flex items-center gap-4 mb-4">
                    {/* Platform Dropdown - For search platform selection */}
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 px-5 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
                        >
                            <span className="flex items-center space-x-2">
                                {getPlatformIcon(activeSocialMediaType, 20)}
                                <span className="capitalize text-sm font-medium">
                                    Search {activeSocialMediaType}
                                </span>
                            </span>
                            <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => handlePlatformChange('facebook')}
                                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 text-left"
                                >
                                    <FaFacebook color="#1877F2" />
                                    <span className="text-sm font-medium">Search Facebook</span>
                                </button>
                                <button
                                    onClick={() => handlePlatformChange('instagram')}
                                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 text-left"
                                >
                                    <FaInstagram color="#E1306C" />
                                    <span className="text-sm font-medium">Search Instagram</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full px-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                placeholder={`Search ${activeSocialMediaType} profiles by name or URL`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchQuery && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                                {searchLoading ? (
                                    <div className="flex justify-center items-center py-4">
                                        <Spinner size={20} />
                                    </div>
                                ) : searchedProfileList && searchedProfileList.length > 0 ? (
                                    searchedProfileList.map((profile) => (
                                        <div
                                            key={`${activeSocialMediaType}-${profile.id}`}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="flex-shrink-0">
                                                    {getPlatformIcon(activeSocialMediaType, 24)}
                                                </div>
                                                <Avatar
                                                    src={formatImage(
                                                        activeSocialMediaType,
                                                        subdomain,
                                                        profile.profile_picture_url
                                                    )}
                                                    alt={profile.name}
                                                    style={{ width: 40, height: 40 }}
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        {profile.name ?? profile.username}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {profile.username}
                                                    </p>
                                                    {(profile.fan_count ?? profile.followers_count) && (
                                                        <p className="text-xs text-gray-600">
                                                            Total {activeSocialMediaType === 'instagram' ? 'Followers' : 'Fans'}: {formatNumber(profile.fan_count ?? profile.followers_count)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {isProfileAlreadyAdded(profile.id) || profile.is_already_added ? (
                                                    <span className="text-xs text-red-500 font-medium">
                                                        Already Added
                                                    </span>
                                                ) : (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleAddProfile(profile)}
                                                        className="text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <AddCircleOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center py-4">
                                        <Typography className="text-gray-500 text-sm">
                                            Sorry, no results found
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Added Profiles</h2>
            </div>

            {/* Profiles List - Shows both Facebook and Instagram */}
            <div className="w-full space-y-3">
                {allProfiles && allProfiles.length > 0 ? (
                    allProfiles.map((profile) => (
                        <div
                            key={`${profile.platform}-${profile.id}`}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                {/* Platform Icon */}
                                <div className="flex-shrink-0">
                                    {getPlatformIcon(profile.platform)}
                                </div>

                                {/* Profile Avatar */}
                                <Avatar
                                    src={formatImage(
                                        profile.platform,
                                        subdomain,
                                        profile.picture
                                    )}
                                    alt={profile.name}
                                    className="w-10 h-10"
                                />
                                {/* Profile Info */}
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {profile.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {profile.username || `@${profile.name.toLowerCase().replace(/\s+/g, '')}`}
                                    </p>
                                    {profile.fan_count && (
                                        <p className="text-xs text-gray-600">
                                            {formatNumber(profile.fan_count)} {profile.platform === 'instagram' ? 'followers' : 'fans'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Delete Button */}
                            <IconButton
                                onClick={() => handleDeleteProfile(profile.id, profile.platform)}
                                size="small"
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                                <X size={16} />
                            </IconButton>
                        </div>
                    ))
                ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No profiles added yet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                            Search and add your first Facebook or Instagram profile to start monitoring your social media performance
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAddProfiles;
