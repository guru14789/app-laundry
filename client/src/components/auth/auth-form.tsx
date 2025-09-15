import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Apple } from "lucide-react";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
      toast({
        title: "Success!",
        description: `Successfully ${isSignUp ? 'signed up' : 'signed in'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect will be handled by auth state change
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
        <div>
          <Input
            data-testid="input-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
        </div>
        <div>
          <Input
            data-testid="input-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
        </div>
        
        <Button
          data-testid="button-signin"
          type="submit"
          disabled={loading}
          className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold transition-all hover:bg-blue-50"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-white/20"></div>
        <span className="px-4 text-white/70 text-sm">or</span>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>

      <Button
        data-testid="button-google-signin"
        onClick={handleGoogleSignIn}
        className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:bg-white/20"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <Button
        data-testid="button-apple-signin"
        className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:bg-white/20"
      >
        <Apple className="w-5 h-5" />
        Continue with Apple
      </Button>

      <p className="text-center text-white/70 text-sm mt-6">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <button
          data-testid="button-toggle-signup"
          className="text-white font-semibold underline ml-1"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
