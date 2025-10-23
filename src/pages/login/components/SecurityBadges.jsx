import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      label: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      label: 'Secure Login',
      description: 'JWT authentication'
    },
    {
      icon: 'Database',
      label: 'Data Protected',
      description: 'Bank-level security'
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {securityFeatures?.map((feature, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg"
        >
          <Icon 
            name={feature?.icon} 
            size={16} 
            className="text-success" 
          />
          <div className="text-left">
            <div className="text-xs font-medium text-foreground">
              {feature?.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {feature?.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;