import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('tradescope-theme');
    if (savedTheme && ['light', 'dark', 'system']?.includes(savedTheme)) {
      return savedTheme;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Get system theme preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  };

  // Apply theme to document
  const applyTheme = (themeToApply) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList?.remove('light', 'dark');
    
    // Add new theme class
    root.classList?.add(themeToApply);
    
    // Update resolved theme
    setResolvedTheme(themeToApply);
  };

  // Handle theme changes
  useEffect(() => {
    let actualTheme = theme;
    
    if (theme === 'system') {
      actualTheme = getSystemTheme();
    }
    
    applyTheme(actualTheme);
    
    // Save to localStorage
    localStorage.setItem('tradescope-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const systemTheme = getSystemTheme();
        applyTheme(systemTheme);
      }
    };

    mediaQuery?.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery?.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Theme switching functions
  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setSystemTheme = () => setTheme('system');
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const value = {
    theme, // Current theme setting ('light', 'dark', 'system')
    resolvedTheme, // Actual applied theme ('light' or 'dark')
    setTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme,
    themes: [
      { value: 'light', label: 'Light', icon: 'Sun' },
      { value: 'dark', label: 'Dark', icon: 'Moon' },
      { value: 'system', label: 'System', icon: 'Monitor' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;