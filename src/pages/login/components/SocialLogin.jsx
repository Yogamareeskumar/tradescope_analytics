import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = ({ isLoading }) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      action: () => console.log('Google login'),
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    },
    {
      name: 'Microsoft',
      icon: 'Square',
      action: () => console.log('Microsoft login'),
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      borderColor: 'border-blue-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.name}
            variant="outline"
            onClick={provider?.action}
            disabled={isLoading}
            className={`h-11 ${provider?.bgColor} ${provider?.textColor} ${provider?.borderColor}`}
          >
            <Icon name={provider?.icon} size={18} className="mr-2" />
            {provider?.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;