import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Eye, EyeOff, Building2, Lock, Mail, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
    otp: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful! Welcome back.");
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration/Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 space-y-6">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <Building2 className="h-16 w-16 text-white" />
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BuiltGlory Admin
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Manage multiple real estate marketplaces from one powerful dashboard
            </p>
          </div>

          {/* Floating cards animation */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <p className="text-2xl mb-1">24</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <p className="text-2xl mb-1">1.2K</p>
                <p className="text-xs text-muted-foreground">Properties</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <p className="text-2xl mb-1">98%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="border-border/50 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            {/* Logo for mobile */}
            <div className="flex lg:hidden items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl">Welcome Back</h2>
              <p className="text-muted-foreground">
                Sign in to access your admin dashboard
              </p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  loginMethod === "email"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setLoginMethod("mobile")}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  loginMethod === "mobile"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Mobile
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email or Mobile Input */}
              <div className="space-y-2">
                <Label htmlFor={loginMethod}>
                  {loginMethod === "email" ? "Email Address" : "Mobile Number"}
                </Label>
                <div className="relative">
                  {loginMethod === "email" ? (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                  <Input
                    id={loginMethod}
                    type={loginMethod === "email" ? "email" : "tel"}
                    placeholder={
                      loginMethod === "email"
                        ? "admin@builtglory.com"
                        : "+91 98765 43210"
                    }
                    className="pl-10"
                    value={loginMethod === "email" ? formData.email : formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [loginMethod]: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* OTP Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <Label htmlFor="otp-toggle" className="cursor-pointer">
                  Login with OTP instead
                </Label>
                <Switch
                  id="otp-toggle"
                  checked={useOTP}
                  onCheckedChange={setUseOTP}
                />
              </div>

              {/* Password or OTP Input */}
              {!useOTP ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      className="text-center tracking-widest text-lg"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({ ...formData, otp: e.target.value })
                      }
                      required
                    />
                    <Button type="button" variant="outline">
                      Send OTP
                    </Button>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-border/50 text-center text-sm text-muted-foreground">
              © 2025 BuiltGlory. Enterprise Real Estate Platform.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
