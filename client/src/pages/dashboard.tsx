import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useServices, useOrders } from "@/hooks/use-orders";
import { ServiceCard } from "@/components/dashboard/service-card";
import { FloatingNavigation } from "@/components/layout/floating-navigation";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth();
  const [, navigate] = useLocation();
  const { services } = useServices();
  const { orders } = useOrders();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const activeOrders = orders.filter((orderData: any) => 
    orderData.order.status === 'pending' || orderData.order.status === 'in_progress'
  );

  const monthlySpend = orders
    .filter((orderData: any) => {
      const orderDate = new Date(orderData.order.createdAt);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear() &&
             orderData.order.paymentStatus === 'paid';
    })
    .reduce((total: number, orderData: any) => total + Number(orderData.order.total), 0);

  const recentOrders = orders.slice(0, 2);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "status-pending bg-amber-100 text-amber-700",
      in_progress: "status-progress bg-blue-100 text-blue-700",
      delivered: "status-delivered bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending;
  };

  return (
    <div className="screen-container">
      {/* Status Bar */}
      <div className="status-bar">
        <span>9:41</span>
        <span>LaundryPro</span>
        <div className="flex items-center gap-1">
          <i className="fas fa-signal text-sm"></i>
          <i className="fas fa-wifi text-sm"></i>
          <i className="fas fa-battery-three-quarters text-sm"></i>
        </div>
      </div>

      {/* Dashboard */}
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="gradient-header">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="opacity-90">Welcome back,</p>
              <h2 className="text-2xl font-bold" data-testid="user-name">
                {userProfile?.username || 'User'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" className="w-12 h-12 bg-white/20 rounded-full text-white hover:bg-white/30">
              <Bell size={20} />
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Active Orders</p>
                <p className="text-2xl font-bold text-white" data-testid="active-orders-count">
                  {activeOrders.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">This Month</p>
                <p className="text-lg font-semibold text-white" data-testid="monthly-spend">
                  ${monthlySpend.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pb-28">
          {/* Service Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Choose Your Service</h3>
            <div className="space-y-4">
              {services.map((service: any) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => navigate(`/order?serviceId=${service.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Recent Orders</h3>
              <Button 
                variant="ghost" 
                className="text-primary font-semibold p-0"
                onClick={() => navigate("/history")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((orderData: any) => {
                  const { order, service } = orderData;
                  return (
                    <div key={order.id} className="bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground" data-testid={`order-id-${order.id}`}>
                          Order #{order.id.substring(0, 8)}
                        </p>
                        <Badge className={`order-status ${getStatusBadge(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2" data-testid={`order-details-${order.id}`}>
                        {service.name} • {order.quantity} {service.pricingUnit}s
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-primary font-semibold" data-testid={`order-total-${order.id}`}>
                          ${Number(order.total).toFixed(2)}
                        </p>
                        <p className="text-muted-foreground text-sm" data-testid={`order-date-${order.id}`}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-card rounded-xl p-8 border border-border text-center">
                  <p className="text-muted-foreground" data-testid="no-orders-message">
                    No orders yet. Start by selecting a service above!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <FloatingNavigation />
      </div>
    </div>
  );
}
