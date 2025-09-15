import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/use-orders";
import { Phone } from "lucide-react";

export function OrderManagement() {
  const { orders, updateOrder, isUpdating } = useOrders();

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "status-pending bg-amber-100 text-amber-700",
      in_progress: "status-progress bg-blue-100 text-blue-700", 
      delivered: "status-delivered bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending;
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: { next: 'in_progress', label: 'Mark In Progress' },
      in_progress: { next: 'delivered', label: 'Mark Delivered' },
      delivered: { next: 'delivered', label: 'Completed' },
      cancelled: { next: 'cancelled', label: 'Cancelled' },
    };

    return statusFlow[currentStatus as keyof typeof statusFlow] || statusFlow.pending;
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrder({ id: orderId, updates: { status: newStatus } });
  };

  if (!orders.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground" data-testid="text-no-orders">
          No orders found
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="default">All</Button>
          <Button size="sm" variant="outline">Pending</Button>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((orderData: any) => {
          const { order, user, service } = orderData;
          const nextStatus = getNextStatus(order.status);
          
          return (
            <div 
              key={order.id} 
              data-testid={`order-card-${order.id}`}
              className="border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground" data-testid={`order-id-${order.id}`}>
                    #{order.id.substring(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`customer-name-${order.id}`}>
                    {user.username}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    className={`order-status ${getStatusBadge(order.status)}`}
                    data-testid={`order-status-${order.id}`}
                  >
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground" data-testid={`order-details-${order.id}`}>
                  {service.name} • {order.quantity} {service.pricingUnit}s
                </p>
                <p className="font-semibold text-primary" data-testid={`order-total-${order.id}`}>
                  ${Number(order.total).toFixed(2)}
                </p>
              </div>
              
              <div className="flex gap-2">
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button
                    data-testid={`button-update-status-${order.id}`}
                    size="sm"
                    className="flex-1"
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(order.id, nextStatus.next)}
                  >
                    {nextStatus.label}
                  </Button>
                )}
                <Button
                  data-testid={`button-call-customer-${order.id}`}
                  size="sm"
                  variant="outline"
                  className="px-4"
                >
                  <Phone size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
