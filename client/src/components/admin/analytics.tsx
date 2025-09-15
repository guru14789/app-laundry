import { Card } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-orders";

export function AnalyticsDashboard() {
  const { stats, revenue, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="admin-metrics">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="metric-card">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const progressPercentage = revenue ? Math.min((revenue.monthlyTotal / 12000) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="admin-metrics">
        <div className="metric-card">
          <p className="text-3xl font-bold text-primary mb-1" data-testid="metric-total-orders">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-muted-foreground text-sm">Total Orders</p>
        </div>
        <div className="metric-card">
          <p className="text-3xl font-bold text-secondary mb-1" data-testid="metric-revenue">
            ${stats?.revenue?.toFixed(2) || '0.00'}
          </p>
          <p className="text-muted-foreground text-sm">Revenue</p>
        </div>
        <div className="metric-card">
          <p className="text-3xl font-bold text-accent mb-1" data-testid="metric-pending-orders">
            {stats?.pendingOrders || 0}
          </p>
          <p className="text-muted-foreground text-sm">Pending</p>
        </div>
        <div className="metric-card">
          <p className="text-3xl font-bold text-emerald-600 mb-1" data-testid="metric-active-customers">
            {stats?.activeCustomers || 0}
          </p>
          <p className="text-muted-foreground text-sm">Active Users</p>
        </div>
      </div>

      {/* Revenue Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Analytics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Daily Average</span>
            <span className="font-semibold text-foreground" data-testid="analytics-daily-average">
              ${revenue?.dailyAverage?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Weekly Total</span>
            <span className="font-semibold text-foreground" data-testid="analytics-weekly-total">
              ${revenue?.weeklyTotal?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Monthly Goal</span>
            <div className="text-right">
              <span className="font-semibold text-foreground" data-testid="analytics-monthly-progress">
                ${revenue?.monthlyTotal?.toFixed(2) || '0.00'}
              </span>
              <span className="text-muted-foreground"> / $12,000</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress to Goal</span>
              <span className="text-sm font-semibold text-primary" data-testid="analytics-progress-percentage">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
                data-testid="analytics-progress-bar"
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
