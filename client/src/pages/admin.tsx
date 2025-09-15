import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { OrderManagement } from "@/components/admin/order-management";
import { AnalyticsDashboard } from "@/components/admin/analytics";
import { FloatingNavigation } from "@/components/layout/floating-navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'admin')) {
      navigate("/dashboard");
    }
  }, [user, userProfile, loading, navigate]);

  if (loading || !user || userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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

      {/* Admin Dashboard */}
      <div className="min-h-screen bg-background">
        <div className="p-6 pb-28">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="admin-title">Admin Dashboard</h2>
              <p className="text-muted-foreground">Manage orders and analytics</p>
            </div>
            <Button variant="default" size="icon" className="w-10 h-10 rounded-full">
              <User size={20} />
            </Button>
          </div>

          {/* Analytics */}
          <AnalyticsDashboard />

          {/* Order Management */}
          <div className="mt-6">
            <OrderManagement />
          </div>
        </div>

        <FloatingNavigation />
      </div>
    </div>
  );
}
