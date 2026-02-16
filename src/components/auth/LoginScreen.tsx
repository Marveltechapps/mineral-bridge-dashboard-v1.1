import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Eye, EyeOff, Gem, Lock, ShieldCheck } from "lucide-react";
import type { AdminUser } from "../../contexts/RoleContext";
import { useRoleOptional } from "../../contexts/RoleContext";
import { toast } from "sonner";

interface LoginScreenProps {
  onLogin: (user: AdminUser) => void;
  onForgotPassword: () => void;
  onRequestAccess: () => void;
}

export function LoginScreen({ onLogin, onForgotPassword, onRequestAccess }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code2fa, setCode2fa] = useState("");
  const [language, setLanguage] = useState("en");
  const [loginError, setLoginError] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const roleContext = useRoleOptional();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (step === "2fa") {
      if (code2fa.trim().length >= 6 && pendingUser) {
        onLogin(pendingUser);
        setStep("credentials");
        setPendingUser(null);
        setCode2fa("");
      } else {
        setLoginError("Enter your 6-digit 2FA code.");
      }
      return;
    }
    if (!email?.trim() || !password) {
      setLoginError("Enter email and password.");
      return;
    }
    const admin = roleContext?.getAdminByCredentials(email.trim(), password);
    if (admin) {
      setPendingUser(admin);
      setStep("2fa");
      setCode2fa("");
      setLoginError("");
    } else {
      setLoginError("Invalid email or password, or account inactive.");
      toast.error("Login failed", { description: "Check your email and password." });
    }
  };

  const handleDemoLogin = () => {
    setEmail("admin@mineralbridge.com");
    setPassword("demo123");
    setCode2fa("123456");
    setLoginError("");
    setStep("credentials");
    setPendingUser(null);
    const admin = roleContext?.getAdminByCredentials("admin@mineralbridge.com", "demo123");
    setTimeout(() => {
      if (admin) {
        setPendingUser(admin);
        setStep("2fa");
      } else {
        onLogin({ id: "1", name: "Admin", email: "admin@mineralbridge.com", role: "ceo" });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Side - Brand / Image */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop" 
          alt="Mineral Texture" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 text-center space-y-4 max-w-lg px-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Gem className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Mineral Bridge</h1>
          <p className="text-slate-300 text-lg">
            The world's most trusted platform for secure, verified mineral trading and supply chain transparency.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400 pt-8">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span>ISO 27001 Certified</span>
             </div>
             <div className="w-1 h-1 bg-slate-600 rounded-full" />
             <div className="flex items-center gap-2">
               <Lock className="w-4 h-4 text-emerald-500" />
               <span>End-to-End Encrypted</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="space-y-1 text-center">
            <div className="lg:hidden w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Gem className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Admin Portal</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {step === "credentials" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Username</Label>
                    <Input 
                      id="email" 
                      placeholder="admin@mineralbridge.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white dark:bg-slate-900 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
                  <Label htmlFor="2fa">2FA Code</Label>
                  <Input 
                    id="2fa" 
                    placeholder="• • • • • •" 
                    maxLength={6}
                    value={code2fa}
                    onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, ""))}
                    className="bg-white dark:bg-slate-900 tracking-widest text-center font-mono text-lg"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setStep("credentials"); setPendingUser(null); setCode2fa(""); setLoginError(""); }}
                    className="text-xs text-muted-foreground hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    ← Back to credentials
                  </button>
                </div>
              )}
              {loginError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {loginError}
                </p>
              )}
              
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20">
                {step === "2fa" ? "Verify & Sign In" : "Sign In"}
              </Button>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Demo Access</span>
                  <Button variant="outline" size="sm" type="button" onClick={handleDemoLogin} className="h-7 text-xs">
                    Auto Fill
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Email: admin@mineralbridge.com</p>
                  <p>Pass: demo123</p>
                </div>
              </div>

              <div className="text-center text-sm">
                <a onClick={onForgotPassword} className="text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer">
                  Forgot your password?
                </a>
              </div>
            </form>
            
            <div className="mt-8 flex justify-center">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-24 h-8 text-xs bg-transparent border-slate-200 dark:border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}