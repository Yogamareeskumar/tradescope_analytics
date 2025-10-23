import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const quickActions = [
    {
      id: 'add-trade',
      title: 'Add Manual Trade',
      description: 'Record a new trade manually',
      icon: 'Plus',
      color: 'primary',
      action: () => window.location.href = '/trade-management?action=add'
    },
    {
      id: 'import-trades',
      title: 'Import Trades',
      description: 'Sync from broker APIs',
      icon: 'Download',
      color: 'accent',
      action: () => window.location.href = '/broker-integration'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create performance summary',
      icon: 'FileText',
      color: 'secondary',
      action: () => window.location.href = '/analytics?view=report'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10 hover:bg-primary/20',
          icon: 'text-primary',
          border: 'border-primary/20 hover:border-primary/30'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10 hover:bg-accent/20',
          icon: 'text-accent',
          border: 'border-accent/20 hover:border-accent/30'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10 hover:bg-secondary/20',
          icon: 'text-secondary',
          border: 'border-secondary/20 hover:border-secondary/30'
        };
      default:
        return {
          bg: 'bg-muted hover:bg-muted/80',
          icon: 'text-muted-foreground',
          border: 'border-border hover:border-border'
        };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-success/10 rounded-lg">
          <Icon name="Zap" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Frequently used features</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions?.map((action) => {
          const colorClasses = getColorClasses(action?.color);
          
          return (
            <button
              key={action?.id}
              onClick={action?.action}
              className={`p-4 rounded-lg border transition-all duration-200 text-left group ${colorClasses?.bg} ${colorClasses?.border}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${colorClasses?.icon} bg-current/10`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-current transition-colors">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action?.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {/* Additional Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">156</div>
            <div className="text-xs text-muted-foreground">Total Trades</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">89</div>
            <div className="text-xs text-muted-foreground">Winning Trades</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">3</div>
            <div className="text-xs text-muted-foreground">Active Brokers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">24h</div>
            <div className="text-xs text-muted-foreground">Last Sync</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;