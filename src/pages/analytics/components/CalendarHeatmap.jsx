import React from 'react';
import Icon from '../../../components/AppIcon';

const CalendarHeatmap = ({ currency }) => {
  // Mock calendar data for the last 12 months
  const generateCalendarData = () => {
    const data = [];
    const startDate = new Date();
    startDate?.setMonth(startDate?.getMonth() - 12);
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() + i);
      
      // Skip weekends for trading data
      if (date?.getDay() !== 0 && date?.getDay() !== 6) {
        const pnl = (Math.random() - 0.4) * 5000; // Bias towards positive
        data?.push({
          date: date?.toISOString()?.split('T')?.[0],
          pnl: pnl,
          trades: Math.floor(Math.random() * 8) + 1
        });
      }
    }
    return data;
  };

  const calendarData = generateCalendarData();
  const maxPnl = Math.max(...calendarData?.map(d => Math.abs(d?.pnl)));

  const getIntensity = (pnl) => {
    const intensity = Math.abs(pnl) / maxPnl;
    if (pnl > 0) {
      if (intensity > 0.8) return 'bg-green-600';
      if (intensity > 0.6) return 'bg-green-500';
      if (intensity > 0.4) return 'bg-green-400';
      if (intensity > 0.2) return 'bg-green-300';
      return 'bg-green-200';
    } else if (pnl < 0) {
      if (intensity > 0.8) return 'bg-red-600';
      if (intensity > 0.6) return 'bg-red-500';
      if (intensity > 0.4) return 'bg-red-400';
      if (intensity > 0.2) return 'bg-red-300';
      return 'bg-red-200';
    }
    return 'bg-gray-100';
  };

  const formatCurrency = (amount) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = currency === 'INR' ? amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : amount?.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  };

  // Group data by weeks for calendar layout
  const weeks = [];
  let currentWeek = [];
  
  calendarData?.forEach((day, index) => {
    const dayOfWeek = new Date(day.date)?.getDay();
    
    if (dayOfWeek === 1 && currentWeek?.length > 0) { // Monday
      weeks?.push(currentWeek);
      currentWeek = [];
    }
    currentWeek?.push(day);
    
    if (index === calendarData?.length - 1) {
      weeks?.push(currentWeek);
    }
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Daily PnL Calendar</h3>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Profit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">Loss</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className="text-muted-foreground">No Trades</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']?.map((month, index) => (
              <div key={month} className="flex-1 text-xs text-muted-foreground text-center min-w-[60px]">
                {month}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-53 gap-1">
            {weeks?.slice(0, 53)?.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {[1, 2, 3, 4, 5]?.map((dayOfWeek) => {
                  const dayData = week?.find(d => new Date(d.date)?.getDay() === dayOfWeek);
                  
                  return (
                    <div
                      key={`${weekIndex}-${dayOfWeek}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
                        dayData ? getIntensity(dayData?.pnl) : 'bg-gray-100'
                      }`}
                      title={dayData ? 
                        `${dayData?.date}: ${formatCurrency(dayData?.pnl)} (${dayData?.trades} trades)` : 
                        'No trading day'
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex mt-2">
            <div className="w-8 text-xs text-muted-foreground">
              <div className="h-3 mb-1"></div>
              <div className="h-3 mb-1">Mon</div>
              <div className="h-3 mb-1"></div>
              <div className="h-3 mb-1">Wed</div>
              <div className="h-3 mb-1"></div>
              <div className="h-3">Fri</div>
            </div>
          </div>
        </div>
      </div>
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {calendarData?.filter(d => d?.pnl > 0)?.length}
          </div>
          <div className="text-sm text-muted-foreground">Profitable Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-destructive">
            {calendarData?.filter(d => d?.pnl < 0)?.length}
          </div>
          <div className="text-sm text-muted-foreground">Loss Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">
            {formatCurrency(Math.max(...calendarData?.map(d => d?.pnl)))}
          </div>
          <div className="text-sm text-muted-foreground">Best Day</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">
            {formatCurrency(Math.min(...calendarData?.map(d => d?.pnl)))}
          </div>
          <div className="text-sm text-muted-foreground">Worst Day</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap;