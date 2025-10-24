import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'trade',
      title: 'Trade Executed Successfully',
      message: 'AAPL position closed at $175.50 with a gain of +2.3%',
      timestamp: '2 minutes ago',
      date: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      icon: 'TrendingUp',
      color: 'success',
      priority: 'high'
    },
    {
      id: 2,
      type: 'sync',
      title: 'Broker Sync Complete',
      message: 'Interactive Brokers data synchronized successfully. 15 new trades imported.',
      timestamp: '15 minutes ago',
      date: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      icon: 'RefreshCw',
      color: 'accent',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Risk Management Alert',
      message: 'Portfolio exposure exceeds 80% threshold. Consider position rebalancing.',
      timestamp: '1 hour ago',
      date: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      icon: 'AlertTriangle',
      color: 'warning',
      priority: 'high'
    },
    {
      id: 4,
      type: 'system',
      title: 'Market Hours Notification',
      message: 'US markets will close in 30 minutes. Any pending orders will be processed.',
      timestamp: '2 hours ago',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      icon: 'Clock',
      color: 'muted',
      priority: 'low'
    },
    {
      id: 5,
      type: 'trade',
      title: 'Stop Loss Triggered',
      message: 'TSLA position closed at $245.20 due to stop loss activation (-1.5%)',
      timestamp: '3 hours ago',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      icon: 'TrendingDown',
      color: 'destructive',
      priority: 'medium'
    },
    {
      id: 6,
      type: 'system',
      title: 'Weekly Report Available',
      message: 'Your weekly trading performance report is ready for review.',
      timestamp: '1 day ago',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      icon: 'FileText',
      color: 'accent',
      priority: 'low'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;
  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification?.read;
    return notification?.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(prev => 
        prev?.map(notification => ({ ...notification, read: true }))
      );
      setLoading(false);
    }, 500);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      setNotifications([]);
    }
  };

  const getColorClasses = (color, read) => {
    const baseClasses = read ? 'opacity-60' : '';
    
    switch (color) {
      case 'success':
        return `text-green-600 ${baseClasses}`;
      case 'warning':
        return `text-yellow-600 ${baseClasses}`;
      case 'destructive':
        return `text-red-600 ${baseClasses}`;
      case 'accent':
        return `text-blue-600 ${baseClasses}`;
      default:
        return `text-gray-500 ${baseClasses}`;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Low</span>;
      default:
        return null;
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Notifications', count: notifications?.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'trade', label: 'Trading', count: notifications?.filter(n => n?.type === 'trade')?.length },
    { value: 'alert', label: 'Alerts', count: notifications?.filter(n => n?.type === 'alert')?.length },
    { value: 'sync', label: 'Sync', count: notifications?.filter(n => n?.type === 'sync')?.length },
    { value: 'system', label: 'System', count: notifications?.filter(n => n?.type === 'system')?.length }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header activeRoute="/notifications" />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={20} />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your trading activities and system alerts
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Marking...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="CheckCheck" size={16} />
                      <span>Mark All Read</span>
                    </>
                  )}
                </Button>
              )}
              
              {notifications?.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearAllNotifications}
                  className="flex items-center space-x-2 text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={filter === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option?.value)}
                className="flex items-center space-x-2"
              >
                <span>{option?.label}</span>
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {option?.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' ? "You're all caught up! New notifications will appear here."
                  : `No ${filter} notifications to display.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                  !notification?.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`flex-shrink-0 ${getColorClasses(notification?.color, notification?.read)}`}>
                      <Icon name={notification?.icon} size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-lg font-semibold ${
                            notification?.read ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {notification?.title}
                          </h3>
                          {getPriorityBadge(notification?.priority)}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification?.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification?.id)}
                              className="flex items-center space-x-1 text-primary hover:text-primary/80"
                            >
                              <Icon name="Check" size={14} />
                              <span className="text-xs">Mark Read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification?.id)}
                            className="flex items-center space-x-1 text-muted-foreground hover:text-destructive"
                          >
                            <Icon name="X" size={14} />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-foreground mb-3 leading-relaxed">
                        {notification?.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="capitalize">
                          {notification?.type} • {notification?.timestamp}
                        </span>
                        <span>
                          {notification?.date?.toLocaleDateString()} at {notification?.date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button (for future pagination) */}
        {filteredNotifications?.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="px-8">
              Load More Notifications
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;