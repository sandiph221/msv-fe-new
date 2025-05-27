import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    const fetchAllNotifications = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const response = await axios.get(`/notifications?page=${page}&limit=${limit}`);

            // Parse the response according to the actual structure
            if (response.data.status && response.data.data) {
                setNotifications(response.data.data.notifications);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await axios.post(`/notifications/read/${id}`);

            // Check response status based on the API structure
            if (response.data.status) {
                // Refresh notifications after marking as read
                await fetchAllNotifications(pagination.currentPage, pagination.itemsPerPage);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };



    const loadMoreNotifications = async () => {
        if (pagination.currentPage < pagination.totalPages) {
            try {
                setLoading(true);
                const response = await axios.get(`/notifications?page=${pagination.currentPage + 1}&limit=${pagination.itemsPerPage}`);

                if (response.data.status && response.data.data) {
                    // Append new notifications to existing ones
                    setNotifications(prev => [...prev, ...response.data.data.notifications]);
                    setPagination(response.data.data.pagination);
                }
            } catch (error) {
                console.error("Error loading more notifications:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAllNotifications();
    }, []);

    // Since there's no isRead field in the schema, we'll assume all active notifications are unread
    // You might want to add a read status field to your schema
    const unreadCount = notifications.filter((notif) => notif.is_active).length;

    const formatTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMinutes = Math.floor((now - created) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Notifications</h3>

                        </div>

                        {loading && notifications.length === 0 ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 rounded-lg transition-colors ${notification.is_active ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50"
                                            }`}
                                    >
                                        <p className="text-sm text-gray-800 mb-2">
                                            {notification.text}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {formatTimeAgo(notification.createdAt)}
                                            </span>
                                            {notification.is_active && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {pagination.currentPage < pagination.totalPages && (
                                    <div className="text-center pt-3 border-t">
                                        <button
                                            onClick={loadMoreNotifications}
                                            disabled={loading}
                                            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? "Loading..." : "Load more"}
                                        </button>
                                    </div>
                                )}

                                {/* Pagination Info */}
                                {pagination.totalItems > 0 && (
                                    <div className="text-center pt-2">
                                        <span className="text-xs text-gray-500">
                                            Showing {notifications.length} of {pagination.totalItems} notifications
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default NotificationComponent;
