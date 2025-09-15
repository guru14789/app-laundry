import { useLocation } from "wouter";
import { Home, Plus, History, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function FloatingNavigation() {
  const [location, navigate] = useLocation();
  const { userProfile } = useAuth();

  const tabs = [
    { id: "dashboard", icon: Home, path: "/dashboard" },
    { id: "order", icon: Plus, path: "/order" },
    { id: "history", icon: History, path: "/history" },
    { id: "profile", icon: User, path: "/profile" },
    ...(userProfile?.role === 'admin' ? [{ id: "admin", icon: Settings, path: "/admin" }] : []),
  ];

  return (
    <div className="floating-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location === tab.path;
        
        return (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            className={`tab-button ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
}
