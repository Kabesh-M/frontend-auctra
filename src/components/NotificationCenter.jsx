import React from 'react';
import { Bell, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchNotifications = async (pageNum = 1) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/notifications?page=${pageNum}&limit=10`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            toast.error('Failed to fetch notifications');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await apiClient.put(`/api/notifications/${notificationId}/read`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchNotifications(page);
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.put('/api/notifications/mark-all-read', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchNotifications(page);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all notifications as read');
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await apiClient.delete(`/api/notifications/${notificationId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchNotifications(page);
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_success':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'payment_failed':
                return <Clock className="text-red-500" size={20} />;
            case 'security_alert':
                return <Bell className="text-yellow-500" size={20} />;
            default:
                return <Bell className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg border border-blue-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-400">You have {unreadCount} unread notifications</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                    >
                        Mark All as Read
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No notifications</p>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-lg border transition ${
                                notification.isRead
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-gray-800 border-blue-500 ring-1 ring-blue-500'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    {getNotificationIcon(notification.type)}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{notification.title}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            className="text-blue-400 hover:text-blue-300 text-xs"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
