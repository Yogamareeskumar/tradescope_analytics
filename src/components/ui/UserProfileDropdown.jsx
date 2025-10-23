import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Image from '../AppImage';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = {
    name: 'Alex Thompson',
    email: 'alex.thompson@tradescope.com',
    avatar: '/assets/images/avatar-placeholder.jpg',
    role: 'Professional Trader'
  };

  const menuItems = [
    { 
      label: 'Profile Settings', 
      icon: 'User', 
      action: () => console.log('Profile Settings'),
      description: 'Manage your account details'
    },
    { 
      label: 'Trading Preferences', 
      icon: 'Settings', 
      action: () => console.log('Trading Preferences'),
      description: 'Configure trading parameters'
    },
    { 
      label: 'Security', 
      icon: 'Shield', 
      action: () => console.log('Security'),
      description: 'Password and 2FA settings'
    },
    { 
      label: 'Help & Support', 
      icon: 'HelpCircle', 
      action: () => console.log('Help & Support'),
      description: 'Get assistance and documentation'
    },
    { 
      label: 'Sign Out', 
      icon: 'LogOut', 
      action: () => window.location.href = '/login',
      description: 'Securely log out of your account',
      variant: 'destructive'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    item?.action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
      >
        <Image
          src={user?.avatar}
          alt={`${user?.name} profile picture`}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.role}</div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <Image
                src={user?.avatar}
                alt={`${user?.name} profile picture`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
                <div className="text-xs text-accent font-medium">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-150 ${
                  item?.variant === 'destructive' ?'text-destructive hover:bg-destructive/10' :'text-popover-foreground'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  className={item?.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item?.label}</div>
                  <div className="text-xs text-muted-foreground">{item?.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;