import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center space-y-4">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <Icon name="TrendingUp" size={28} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">TradeScope</h1>
          <p className="text-sm text-accent font-medium">Analytics</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Sign in to your trading analytics dashboard
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;