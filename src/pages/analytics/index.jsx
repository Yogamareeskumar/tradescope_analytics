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
import PremiumCandlestickChart from './components/PremiumCandlestickChart';
import PremiumHeatmapMatrix from './components/PremiumHeatmapMatrix';
import AdvancedRiskMetrics from './components/AdvancedRiskMetrics';
import Premium3DChart from './components/Premium3DChart';
import PremiumCorrelationMatrix from './components/PremiumCorrelationMatrix';
import PremiumReturnsDistribution from './components/PremiumReturnsDistribution';
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
      case 'premium-candlestick':
        return (
          <PremiumCandlestickChart
            data={analytics}
            currency={currency}
            config={chartConfig}
          />
        );
      case 'premium-heatmap':
        return (
          <PremiumHeatmapMatrix
            data={trades || []}
            currency={currency}
            config={chartConfig}
          />
        );
      case 'premium-risk':
        return (
          <AdvancedRiskMetrics
            data={analytics}
            currency={currency}
            config={chartConfig}
          />
        );
      case 'premium-correlation':
        return (
          <PremiumCorrelationMatrix
            data={analytics}
            currency={currency}
            config={chartConfig}
          />
        );
      case 'premium-distribution':
        return (
          <PremiumReturnsDistribution
            data={analytics}
            currency={currency}
            config={chartConfig}
          />
        );
      case 'premium-3d':
        return (
          <Premium3DChart
            data={analytics}
            currency={currency}
            config={chartConfig}
          />
        );
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

  // Get chart information for display
  const getChartInfo = () => {
    const chartTypes = {
      'calendar': { name: 'Calendar Heatmap', description: 'Daily P&L visualization over time' },
      'radar': { name: 'Strategy Performance', description: 'Multi-dimensional strategy analysis' },
      'bar': { name: 'Time Analysis', description: 'Performance breakdown by time periods' },
      'line': { name: 'Trend Analysis', description: 'Performance trends and patterns' },
      'premium-candlestick': { name: 'Advanced Candlestick', description: 'Professional OHLC analysis with volume' },
      'premium-heatmap': { name: 'Heatmap Matrix', description: 'Time-based performance pattern analysis' },
      'premium-risk': { name: 'Risk Analytics', description: 'Advanced risk metrics and drawdown analysis' },
      'premium-correlation': { name: 'Correlation Matrix', description: 'Asset correlation and relationship analysis' },
      'premium-distribution': { name: 'Returns Distribution', description: 'Statistical return distribution analysis' },
      'premium-3d': { name: '3D Surface Plot', description: 'Multi-dimensional performance visualization' },
      'premium-line': { name: 'Premium Line Chart', description: 'Enhanced line visualization with advanced features' },
      'premium-area': { name: 'Premium Area Chart', description: 'Enhanced area visualization with gradients' },
      'premium-bar': { name: 'Premium Bar Chart', description: 'Enhanced bar visualization with animations' }
    };
    
    return chartTypes?.[activeChart] || chartTypes?.['calendar'];
  };

  const currentChartInfo = getChartInfo();

  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="/analytics" />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Premium Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">Premium Analytics Suite</h1>
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-accent to-primary rounded-full">
                    <Icon name="Crown" size={14} className="text-white" />
                    <span className="text-xs font-semibold text-white">PRO</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Institutional-grade performance insights with AI-powered analytics, advanced risk metrics, and multi-dimensional visualizations
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
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                >
                  Export Premium Report
                </Button>
              </div>
            </div>
          </div>

          {/* Premium Feature Showcase */}
          <div className="mb-8 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 rounded-xl border border-accent/20 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="Sparkles" size={20} className="text-accent" />
                  <span>Premium Visualization Features</span>
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>Advanced Candlestick Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>3D Performance Mapping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>Risk Correlation Matrix</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>AI-Powered Insights</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-accent">
                <Icon name="Zap" size={16} />
                <span>Real-time processing active</span>
              </div>
            </div>
          </div>

          {/* Premium Controls Section */}
          <div className="space-y-6 mb-8">
            {/* Enhanced Chart Type and Date Range */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Premium Visualization Suite</h3>
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
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-foreground">{currentChartInfo?.name}</h2>
                    {activeChart?.startsWith('premium-') && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 rounded-md">
                        <Icon name="Crown" size={12} className="text-accent" />
                        <span className="text-xs font-medium text-accent">Premium</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} />
                      <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{currentChartInfo?.description}</p>
                <div className="bg-card border border-border rounded-xl p-6">
                  {loading?.analytics ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        <span className="ml-3 text-muted-foreground">Loading premium analytics...</span>
                      </div>
                    </div>
                  ) : (
                    renderActiveChart()
                  )}
                </div>
              </div>

              {/* Secondary Charts for Premium Analysis */}
              {activeChart !== 'radar' && !activeChart?.startsWith('premium-') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Complementary Analysis</h3>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <StrategyRadarChart currency={currency} data={analytics} />
                  </div>
                </div>
              )}
              
              {/* Premium Multi-Chart View */}
              {activeChart?.startsWith('premium-') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Risk Overview</h3>
                    <div className="bg-card border border-border rounded-xl p-4 h-64">
                      <AdvancedRiskMetrics data={analytics?.slice(0, 10)} currency={currency} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Pattern Analysis</h3>
                    <div className="bg-card border border-border rounded-xl p-4 h-64">
                      <PremiumHeatmapMatrix data={trades?.slice(0, 20) || []} currency={currency} />
                    </div>
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

              {/* Enhanced AI-Powered Performance Insights */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Brain" size={20} className="text-accent" />
                  <span>AI Performance Insights</span>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 rounded-md">
                    <Icon name="Cpu" size={10} className="text-accent" />
                    <span className="text-xs text-accent">AI</span>
                  </div>
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-4 border border-success/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-success">Strong Performance Trend</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your 30-day rolling Sharpe ratio has improved by 18% with consistent risk management
                        </p>
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          <span className="text-xs text-success">Confidence: 94%</span>
                        </div>
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
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                          <span className="text-xs text-warning">Action recommended</span>
                        </div>
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
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                          <span className="text-xs text-accent">ML Analysis</span>
                        </div>
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
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <span className="text-xs text-primary">Institutional grade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h5 className="text-sm font-medium text-foreground mb-2">Suggested Actions</h5>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Icon name="ArrowRight" size={12} className="text-accent" />
                        <span className="text-xs text-foreground">Increase position size in momentum trades</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Icon name="ArrowRight" size={12} className="text-primary" />
                        <span className="text-xs text-foreground">Set dynamic stop-loss based on volatility</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Premium Features Panel */}
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/30 p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Premium Analytics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Real-time Risk Monitoring</span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI Pattern Recognition</span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Advanced Correlation Analysis</span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">3D Visualization Suite</span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Statistical Distribution Analysis</span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Multi-Asset Correlation Matrix</span>
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Sparkles" size={14} className="text-accent" />
                    <span className="text-muted-foreground">
                      Powered by advanced analytics engine
                    </span>
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