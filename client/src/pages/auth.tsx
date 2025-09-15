import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { AuthForm } from "@/components/auth/auth-form";
import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle redirect result from Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          navigate("/dashboard");
          toast({
            title: "Success!",
            description: "Successfully signed in with Google",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });
  }, [navigate, toast]);

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500">
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
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

      {/* Auth Screen */}
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-emerald-500 p-8 flex flex-col justify-center items-center text-white">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <i className="fas fa-tshirt text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold mb-2" data-testid="app-title">LaundryPro</h1>
          <p className="text-blue-100" data-testid="app-tagline">Professional laundry at your doorstep</p>
        </div>

        {/* Auth Form */}
        <AuthForm />
      </div>
    </div>
  );
}
