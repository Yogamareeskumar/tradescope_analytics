import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Storage',
      description: 'Bank-level security for your trading data'
    },
    {
      icon: 'Eye',
      title: 'Privacy Protected',
      description: 'We never share your personal information'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by thousands of traders worldwide'
    }
  ];

  return (
    <div className="bg-muted/30 rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Shield" size={20} className="text-success" />
        <h3 className="text-lg font-semibold text-foreground">Your Security Matters</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name={feature?.icon} size={16} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{feature?.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          By creating an account, you're joining a secure platform trusted by professional traders
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;