import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ variant = 'dropdown' }) => {
  const { theme, setTheme, themes, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Simple toggle mode (cycles through light -> dark -> system)
  if (variant === 'toggle') {
    const getCurrentThemeIcon = () => {
      switch (theme) {
        case 'light':
          return 'Sun';
        case 'dark':
          return 'Moon';
        case 'system':
        default:
          return 'Monitor';
      }
    };

    const handleToggle = () => {
      if (theme === 'light') {
        setTheme('dark');
      } else if (theme === 'dark') {
        setTheme('system');
      } else {
        setTheme('light');
      }
    };

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative"
        title={`Current theme: ${theme === 'system' ? `System (${resolvedTheme})` : theme}`}
      >
        <Icon 
          name={getCurrentThemeIcon()} 
          size={18} 
          className="transition-all duration-200" 
        />
      </Button>
    );
  }

  // Dropdown mode (shows all options)
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        title="Change theme"
      >
        <Icon 
          name={theme === 'light' ? 'Sun' : theme === 'dark' ? 'Moon' : 'Monitor'} 
          size={18} 
        />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-36 bg-popover border border-border rounded-lg shadow-lg z-50">
            <div className="p-1">
              {themes?.map((themeOption) => (
                <button
                  key={themeOption?.value}
                  onClick={() => {
                    setTheme(themeOption?.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors
                    hover:bg-accent hover:text-accent-foreground
                    ${theme === themeOption?.value 
                      ? 'bg-accent text-accent-foreground font-medium' 
                      : 'text-popover-foreground'
                    }
                  `}
                >
                  <Icon name={themeOption?.icon} size={16} />
                  <span>{themeOption?.label}</span>
                  {theme === themeOption?.value && (
                    <Icon name="Check" size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
            
            {/* System Theme Indicator */}
            {theme === 'system' && (
              <div className="px-3 py-2 border-t border-border">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon 
                    name={resolvedTheme === 'dark' ? 'Moon' : 'Sun'} 
                    size={12} 
                  />
                  <span>Using {resolvedTheme} mode</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;