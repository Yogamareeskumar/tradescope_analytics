import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import UserProfileDropdown from './UserProfileDropdown';
import NotificationCenter from './NotificationCenter';
import CurrencyToggle from './CurrencyToggle';
import SyncStatusIndicator from './SyncStatusIndicator';
import ThemeToggle from './ThemeToggle';

const Header = ({ activeRoute = '/dashboard' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: 'BarChart3',
      tooltip: 'Performance overview and quick actions'
    },
    { 
      label: 'Trades', 
      path: '/trade-management', 
      icon: 'TrendingUp',
      tooltip: 'Trade records and manual entry'
    },
    { 
      label: 'Analytics', 
      path: '/analytics', 
      icon: 'PieChart',
      tooltip: 'Advanced performance insights'
    },
    { 
      label: 'Integrations', 
      path: '/broker-integration', 
      icon: 'Link',
      tooltip: 'Broker API management'
    }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border theme-transition">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center theme-transition">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">TradeScope</span>
            <span className="text-sm text-muted-foreground font-medium">Analytics</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={activeRoute === item?.path ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-4 py-2"
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={18} />
              <span className="font-medium">{item?.label}</span>
            </Button>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          <SyncStatusIndicator />
          <CurrencyToggle />
          <ThemeToggle variant="toggle" />
          <NotificationCenter />
          <UserProfileDropdown />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border theme-transition">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={activeRoute === item?.path ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                className="w-full justify-start space-x-3 px-4 py-3"
                fullWidth
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;