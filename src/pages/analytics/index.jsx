import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ChartTypeSelector from './components/ChartTypeSelector';
import DateRangeControls from './components/DateRangeControls';
import CalendarHeatmap from './components/CalendarHeatmap';
import StrategyRadarChart from './components/RadarChart';
import TimeAnalysisChart from './components/TimeAnalysisChart';
import TrendAnalysisChart from './components/TrendAnalysisChart';
import AdvancedFilters from './components/AdvancedFilters';
import ChartCustomization from './components/ChartCustomization';
import PremiumVisualizationEngine from './components/PremiumVisualizationEngine';
import AdvancedMetricsPanel from './components/AdvancedMetricsPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useTrading } from '../../hooks/useTrading';
import { useAuth } from '../../contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const { analytics, trades, loading, loadAnalytics, loadTrades } = useTrading();
  const [activeChart, setActiveChart] = useState('calendar');
  const [currency, setCurrency] = useState('USD');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
    endDate: new Date()?.toISOString()?.split('T')?.[0],
    preset: '30d'
  });
  const [filters, setFilters] = useState({
    assetClass: 'all',
    strategy: 'all',
    positionSize: 'all',
    outcome: 'all',
    minPnL: '',
    maxPnL: '',
    minDuration: '',
    maxDuration: '',
    tags: [],
    includePartialFills: true,
    includeCommissions: true
  });
  const [chartConfig, setChartConfig] = useState({
    colorScheme: 'default',
    dataDensity: 'medium',
    showGrid: true,
    showLabels: false,
    showTooltips: true,
    showLegend: true,
    animate: true,
    responsive: true,
    showTrendLines: false,
    showMovingAverages: false,
    showVolume: false,
    showBenchmark: false,
    logScale: false,
    zeroBaseline: true,
    gradient: true,
    smooth: true,
    strokeWidth: 2
  });
  const [savedPresets, setSavedPresets] = useState([
    {
      name: 'Winning Trades Only',
      filters: { ...filters, outcome: 'winners' },
      createdAt: '2024-10-15T10:30:00Z'
    },
    {
      name: 'Large Positions',
      filters: { ...filters, positionSize: 'large' },
      createdAt: '2024-10-14T15:45:00Z'
    }
  ]);

  // Load data on component mount and when filters change
  useEffect(() => {
    if (user) {
      loadAnalytics({
        dateFrom: dateRange?.startDate,
        dateTo: dateRange?.endDate
      });
      loadTrades({
        dateFrom: dateRange?.startDate,
        dateTo: dateRange?.endDate,
        limit: 1000 // Load more for analytics
      });
    }
  }, [user, dateRange?.startDate, dateRange?.endDate, loadAnalytics, loadTrades]);

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('tradescope-currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    // Listen for currency changes from header
    const handleCurrencyChange = (event) => {
      setCurrency(event?.detail?.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  const handleSavePreset = (preset) => {
    setSavedPresets(prev => [...prev, preset]);
  };

  const handleExportChart = (format) => {
    // Mock export functionality
    console.log(`Exporting chart as ${format}`);
    
    // Create a mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `analytics-chart-${activeChart}-${new Date()?.toISOString()?.split('T')?.[0]}.${format}`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  // Transform data for premium visualization engine
  const transformDataForChart = () => {
    if (!analytics || analytics?.length === 0) return [];
    
    return analytics?.map(item => ({
      name: new Date(item.date)?.toLocaleDateString(),
      'Daily P&L': item?.daily_pnl || 0,
      'Cumulative P&L': item?.cumulative_pnl || 0,
      'Win Rate': item?.win_rate || 0,
      'Volume': item?.volume || 0
    }));
  };

  const renderActiveChart = () => {
    const chartData = transformDataForChart();
    
    switch (activeChart) {
      case 'premium-line':
        return (
          <PremiumVisualizationEngine
            data={chartData}
            chartType="line"
            config={chartConfig}
            theme="dark"
          />
        );
      case 'premium-area':
        return (
          <PremiumVisualizationEngine
            data={chartData}
            chartType="area"
            config={chartConfig}
            theme="dark"
          />
        );
      case 'premium-bar':
        return (
          <PremiumVisualizationEngine
            data={chartData}
            chartType="bar"
            config={chartConfig}
            theme="dark"
          />
        );
      case 'calendar':
        return <CalendarHeatmap currency={currency} data={analytics} />;
      case 'radar':
        return <StrategyRadarChart currency={currency} data={analytics} />;
      case 'bar':
        return <TimeAnalysisChart currency={currency} data={analytics} />;
      case 'line':
        return <TrendAnalysisChart currency={currency} data={analytics} />;
      default:
        return <CalendarHeatmap currency={currency} data={analytics} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="/analytics" />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Analytics</h1>
                <p className="text-muted-foreground">
                  Professional-grade performance insights with institutional-level analytics and risk metrics
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                  loading={loading?.analytics}
                >
                  Refresh Data
                </Button>
                <Button
                  variant="default"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => handleExportChart('pdf')}
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Premium Controls Section */}
          <div className="space-y-6 mb-8">
            {/* Enhanced Chart Type and Date Range */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Premium Visualization</h3>
                  <ChartTypeSelector 
                    activeChart={activeChart} 
                    onChartChange={setActiveChart}
                    premiumMode={true}
                  />
                </div>
                
                <div className="flex-1">
                  <DateRangeControls 
                    dateRange={dateRange} 
                    onDateRangeChange={setDateRange} 
                  />
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSavePreset={handleSavePreset}
              savedPresets={savedPresets}
            />

            {/* Enhanced Chart Customization */}
            <ChartCustomization
              chartConfig={chartConfig}
              onConfigChange={setChartConfig}
              onExport={handleExportChart}
              premiumMode={true}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Charts Section */}
            <div className="xl:col-span-2 space-y-8">
              {/* Primary Chart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Performance Visualization</h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  {loading?.analytics ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                      <span className="ml-3 text-muted-foreground">Loading analytics...</span>
                    </div>
                  ) : (
                    renderActiveChart()
                  )}
                </div>
              </div>

              {/* Secondary Charts for Comparison */}
              {activeChart !== 'radar' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Strategy Performance Radar</h3>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <StrategyRadarChart currency={currency} data={analytics} />
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Metrics Sidebar */}
            <div className="space-y-6">
              <AdvancedMetricsPanel 
                currency={currency} 
                data={trades || []}
              />

              {/* AI-Powered Performance Insights */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">AI Performance Insights</h4>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-4 border border-success/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-success">Strong Performance Trend</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your 30-day rolling Sharpe ratio has improved by 18% with consistent risk management
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg p-4 border border-warning/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning">Volatility Alert</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Consider position sizing adjustments during high VIX periods (>25) for optimal risk control
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-accent">Optimization Opportunity</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your best risk-adjusted returns occur between 10:30-11:30 AM EST - consider concentrating activity
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="Award" size={16} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-primary">Strategy Excellence</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your momentum strategy shows 2.3x alpha vs market benchmark with 15% lower volatility
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;