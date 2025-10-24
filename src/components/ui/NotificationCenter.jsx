import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'trade',
      title: 'Trade Executed',
      message: 'AAPL position closed at $175.50 (+2.3%)',
      timestamp: '2 minutes ago',
      read: false,
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      id: 2,
      type: 'sync',
      title: 'Broker Sync Complete',
      message: 'Interactive Brokers data synchronized successfully',
      timestamp: '15 minutes ago',
      read: false,
      icon: 'RefreshCw',
      color: 'accent'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Risk Alert',
      message: 'Portfolio exposure exceeds 80% threshold',
      timestamp: '1 hour ago',
      read: true,
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 4,
      type: 'system',
      title: 'Market Hours',
      message: 'US markets will close in 30 minutes',
      timestamp: '2 hours ago',
      read: true,
      icon: 'Clock',
      color: 'muted'
    }
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setNotifications(prev => 
      prev?.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const handleViewAllNotifications = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const getColorClasses = (color, read) => {
    const baseClasses = read ? 'opacity-60' : '';
    
    switch (color) {
      case 'success':
        return `text-success ${baseClasses}`;
      case 'warning':
        return `text-warning ${baseClasses}`;
      case 'accent':
        return `text-accent ${baseClasses}`;
      default:
        return `text-muted-foreground ${baseClasses}`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-lg shadow-elevated z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-popover-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-accent hover:text-accent/80"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification?.id}
                  className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150 ${
                    !notification?.read ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${getColorClasses(notification?.color, notification?.read)}`}>
                      <Icon name={notification?.icon} size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            notification?.read ? 'text-muted-foreground' : 'text-popover-foreground'
                          }`}>
                            {notification?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification?.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification?.timestamp}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification?.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification?.id)}
                              className="w-6 h-6 text-accent hover:text-accent/80"
                            >
                              <Icon name="Check" size={12} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => clearNotification(notification?.id)}
                            className="w-6 h-6 text-muted-foreground hover:text-destructive"
                          >
                            <Icon name="X" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications?.length > 0 && (
            <div className="px-4 py-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-accent hover:text-accent/80"
                onClick={handleViewAllNotifications}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;