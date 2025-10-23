import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTrading } from '../../hooks/useTrading';
import MetricsCard from './components/MetricsCard';
import DailyPnLChart from './components/DailyPnLChart';
import RecentTradesTable from './components/RecentTradesTable';
import StrategyRadarChart from './components/StrategyRadarChart';
import Header from '../../components/ui/Header';

const Dashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const {
    trades,
    portfolio,
    analytics,
    loading,
    error,
    loadTrades,
    loadPortfolio,
    loadAnalytics
  } = useTrading();
  
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalPnL: 0,
    todayPnL: 0,
    totalTrades: 0,
    winRate: 0,
    activePositions: 0
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      loadTrades({ limit: 10 }); // Load recent trades
      loadPortfolio();
      loadAnalytics({
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0], // Last 30 days
        dateTo: new Date()?.toISOString()?.split('T')?.[0]
      });
    }
  }, [user, loadTrades, loadPortfolio, loadAnalytics]);

  // Calculate dashboard metrics
  useEffect(() => {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const todayAnalytics = analytics?.find(item => item?.date === today);
    
    const totalPnL = portfolio?.totalPnL || 0;
    const todayPnL = todayAnalytics?.daily_pnl || 0;
    const totalTrades = trades?.length || 0;
    const activePositions = trades?.filter(trade => trade?.status === 'open')?.length || 0;
    
    // Calculate win rate from recent trades
    const closedTrades = trades?.filter(trade => trade?.status === 'closed') || [];
    const winningTrades = closedTrades?.filter(trade => (trade?.pnl || 0) > 0)?.length || 0;
    const winRate = closedTrades?.length > 0 ? (winningTrades / closedTrades?.length) * 100 : 0;

    setDashboardMetrics({
      totalPnL,
      todayPnL,
      totalTrades,
      winRate,
      activePositions
    });
  }, [trades, portfolio, analytics]);

  if (authLoading || loading?.portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-destructive mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location?.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'Trader'}!
          </h1>
          <p className="text-muted-foreground">
            Here's your trading performance overview
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricsCard
            title="Total P&L"
            value={`${dashboardMetrics?.totalPnL?.toLocaleString() || '0'}`}
            change=""
            changeType={dashboardMetrics?.totalPnL >= 0 ? 'positive' : 'negative'}
            icon="TrendingUp"
          />
          <MetricsCard
            title="Today's P&L"
            value={`${dashboardMetrics?.todayPnL?.toLocaleString() || '0'}`}
            change=""
            changeType={dashboardMetrics?.todayPnL >= 0 ? 'positive' : 'negative'}
            icon="Calendar"
          />
          <MetricsCard
            title="Total Trades"
            value={dashboardMetrics?.totalTrades?.toString() || '0'}
            change=""
            changeType="neutral"
            icon="BarChart"
          />
          <MetricsCard
            title="Win Rate"
            value={`${dashboardMetrics?.winRate?.toFixed(1) || '0'}%`}
            change=""
            changeType={dashboardMetrics?.winRate >= 50 ? 'positive' : 'negative'}
            icon="Target"
          />
          <MetricsCard
            title="Active Positions"
            value={dashboardMetrics?.activePositions?.toString() || '0'}
            change=""
            changeType="neutral"
            icon="Activity"
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily P&L Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Daily P&L Trend</h2>
            <DailyPnLChart data={analytics || []} loading={loading?.analytics} />
          </div>

          {/* Strategy Performance */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Strategy Performance</h2>
            <StrategyRadarChart data={analytics || []} loading={loading?.analytics} />
          </div>
        </div>

        {/* Recent Trades - Full Width */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Trades</h2>
          <RecentTradesTable 
            trades={trades?.slice(0, 8) || []} 
            loading={loading?.trades}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;