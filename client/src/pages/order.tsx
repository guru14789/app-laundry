import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServices } from "@/hooks/use-orders";
import { useLocation } from "wouter";
import { OrderForm } from "@/components/order/order-form";
import { FloatingNavigation } from "@/components/layout/floating-navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OrderPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const { services, isLoading: servicesLoading } = useServices();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Get service ID from URL params
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("serviceId");
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
  }, []);

  if (loading || servicesLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const selectedService = services.find((s: any) => s.id === selectedServiceId);

  if (!selectedService) {
    return (
      <div className="screen-container">
        <div className="min-h-screen bg-background">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-muted mr-4"
                onClick={() => navigate("/dashboard")}
                data-testid="button-back"
              >
                <ArrowLeft size={20} />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">
                Select a Service
              </h2>
            </div>
            <p className="text-muted-foreground text-center">
              Please select a service from the dashboard to place an order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      {/* Status Bar - Updated to IST time for India test */}
      <div className="status-bar">
        <span>08:30</span>{" "}
        {/* Updated to a realistic IST time (e.g., 08:30 AM IST, Sep 15, 2025) */}
        <span>LaundryPro India Test</span>{" "}
        {/* Updated app name for test context */}
        <div className="flex items-center gap-1">
          <i className="fas fa-signal text-sm"></i>
          <i className="fas fa-wifi text-sm"></i>
          <i className="fas fa-battery-three-quarters text-sm"></i>
        </div>
      </div>

      {/* Order Screen */}
      <div className="min-h-screen bg-background">
        <div className="p-6 pb-28">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-muted mr-4"
              onClick={() => navigate("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-2xl font-bold text-foreground">New Order</h2>
          </div>

          <OrderForm selectedService={selectedService} />
        </div>

        <FloatingNavigation />
      </div>
    </div>
  );
}
