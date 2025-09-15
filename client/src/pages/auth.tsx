import { useEffect, useState } from "react";

// Mock hooks and components for demonstration
const useAuth = () => ({ user: null, loading: false });
const useLocation = () => [null, (path) => console.log("Navigate to:", path)];
const useToast = () => ({ toast: (options) => console.log("Toast:", options) });

// Mock Firebase functions
const getRedirectResult = () => Promise.resolve(null);
const GoogleAuthProvider = { credentialFromResult: () => null };
const auth = {};

const AuthForm = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome"); // 'welcome', 'signin', 'signup'
  const [email, setEmail] = useState("nicholas@ergemia.com");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("Nicholas Ergemia");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleAuth = () => {
    console.log("Google auth clicked");
  };

  const handleFacebookAuth = () => {
    console.log("Facebook auth clicked");
  };

  if (currentScreen === "welcome") {
    return (
      <div className="w-full bg-white rounded-t-3xl px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 shadow-2xl">
        {/* Welcome Screen Content */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 relative">
            <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
              {/* Document icons */}
              <div className="relative">
                <div className="w-14 h-18 sm:w-16 sm:h-20 bg-white rounded-lg shadow-md transform -rotate-12 absolute -left-3 sm:-left-4">
                  <div className="p-1.5 sm:p-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mb-1"></div>
                    <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gray-200 rounded mb-1"></div>
                    <div className="w-5 sm:w-6 h-0.5 sm:h-1 bg-gray-200 rounded mb-1"></div>
                    <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-14 h-18 sm:w-16 sm:h-20 bg-white rounded-lg shadow-md transform rotate-12 absolute left-3 sm:left-4">
                  <div className="p-1.5 sm:p-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mb-1"></div>
                    <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gray-200 rounded mb-1"></div>
                    <div className="w-5 sm:w-6 h-0.5 sm:h-1 bg-gray-200 rounded mb-1"></div>
                    <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-14 h-18 sm:w-16 sm:h-20 bg-white rounded-lg shadow-md relative z-10">
                  <div className="p-1.5 sm:p-2">
                    <div className="grid grid-cols-4 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-200 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gray-200 rounded mb-1"></div>
                    <div className="w-5 sm:w-6 h-0.5 sm:h-1 bg-gray-200 rounded"></div>
                  </div>
                  <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm mb-2">Laundry App</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Transformative collaboration
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            for larger teams
          </h2>
        </div>

        <button
          onClick={() => setCurrentScreen("signup")}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg mb-4 sm:mb-6 shadow-lg"
        >
          Get Started
        </button>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-blue-600 rounded-full"></div>
          <div className="w-1.5 sm:w-2 h-0.5 sm:h-1 bg-gray-300 rounded-full"></div>
          <div className="w-1.5 sm:w-2 h-0.5 sm:h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (currentScreen === "signin") {
    return (
      <div className="w-full bg-white rounded-t-3xl px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => setCurrentScreen("welcome")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="text-gray-500 text-xs sm:text-sm">
              Don't have an account?
            </span>
            <button
              onClick={() => setCurrentScreen("signup")}
              className="text-blue-600 text-xs sm:text-sm font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">Enter your details below</p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
          <div>
            <label className="text-xs text-gray-500 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm"
              placeholder="nicholas@ergemia.com"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm pr-12"
                placeholder="••••••••••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg mb-3 sm:mb-4 shadow-lg">
          Sign in
        </button>

        <div className="text-center mb-5 sm:mb-6">
          <button className="text-gray-500 text-sm">
            Forgot your password?
          </button>
        </div>

        <div className="text-center text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
          Or sign in with
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={handleGoogleAuth}
            className="flex items-center justify-center space-x-2 p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 text-xs sm:text-sm font-medium">
              Google
            </span>
          </button>

          <button
            onClick={handleFacebookAuth}
            className="flex items-center justify-center space-x-2 p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-blue-600 text-xs sm:text-sm font-medium">
              Facebook
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Signup screen
  return (
    <div className="w-full bg-white rounded-t-3xl px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={() => setCurrentScreen("welcome")}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="text-gray-500 text-xs sm:text-sm">
            Already have an account?
          </span>
          <button
            onClick={() => setCurrentScreen("signin")}
            className="text-blue-600 text-xs sm:text-sm font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Get started free.
        </h1>
        <p className="text-gray-500 text-sm">
          Free forever. No credit card needed.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
        <div>
          <label className="text-xs text-gray-500 block mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm"
            placeholder="nicholas@ergemia.com"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm"
            placeholder="Nicholas Ergemia"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm pr-16 sm:pr-20"
              placeholder="••••••••••••••••••••"
            />
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <span className="text-green-500 text-xs font-medium">Strong</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg mb-5 sm:mb-6 shadow-lg">
        Sign up
      </button>

      <div className="text-center text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
        Or sign up with
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={handleGoogleAuth}
          className="flex items-center justify-center space-x-2 p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 text-xs sm:text-sm font-medium">
            Google
          </span>
        </button>

        <button
          onClick={handleFacebookAuth}
          className="flex items-center justify-center space-x-2 p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-blue-600 text-xs sm:text-sm font-medium">
            Facebook
          </span>
        </button>
      </div>
    </div>
  );
};

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
      <div className="w-full max-w-sm mx-auto min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-16 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-700"></div>
        </div>

        {/* Enhanced loading spinner */}
        <div className="relative">
          <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full"></div>
          <div className="animate-ping absolute inset-0 w-12 h-12 border-2 border-white/30 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-2xl">
      {/* Status Bar */}
      <div className="flex  items-center px-4 sm:px-6 py-3 text-white text-sm font-medium">
        <span className="font-semibold text-center">Laundry</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-end px-3 sm:px-4 pb-4">
        <AuthForm />
      </div>
    </div>
  );
}
