import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, CheckCircle, Mail, Shield, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ForgotPasswordFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = "email" | "verification" | "newPassword" | "success";

export function ForgotPasswordFlow({ onBack, onComplete }: ForgotPasswordFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep("verification");
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setCurrentStep("newPassword");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep("success");
  };

  const handleComplete = () => {
    onComplete();
    onBack(); // Return to login
  };

  const renderEmailStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800 text-center">Reset Password</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Enter your email address and we'll send you a verification code to reset your password.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reset_email" className="text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="reset_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pl-10"
                placeholder="admin@builtglory.com"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </CardContent>
    </>
  );

  const renderVerificationStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800">Enter Verification Code</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleVerificationSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="verification_code" className="text-slate-700">
              Verification Code
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="verification_code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pl-10 text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              Code expires in 10 minutes
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button 
            type="button"
            className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
          >
            Resend Code
          </button>
          <div>
            <button 
              type="button"
              onClick={() => setCurrentStep("email")}
              className="text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
            >
              <ArrowLeft size={14} />
              Change Email
            </button>
          </div>
        </div>
      </CardContent>
    </>
  );

  const renderNewPasswordStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800">Create New Password</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Choose a strong password for your BuiltGlory Admin account.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-slate-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-slate-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pr-10"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          </div>

          {/* Password requirements */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-slate-700">Password requirements:</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                At least 8 characters
              </li>
              <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-slate-300'}`} />
                One uppercase letter
              </li>
              <li className={`flex items-center gap-2 ${/\d/.test(newPassword) ? 'text-green-600' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-slate-300'}`} />
                One number
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setCurrentStep("verification")}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
          >
            <ArrowLeft size={14} />
            Back to Verification
          </button>
        </div>
      </CardContent>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-slate-800">Password Updated!</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Your password has been successfully updated. You can now log in with your new password.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Button
          onClick={handleComplete}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          Continue to Login
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Keep your password secure and don't share it with others.
          </p>
        </div>
      </CardContent>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "email":
        return renderEmailStep();
      case "verification":
        return renderVerificationStep();
      case "newPassword":
        return renderNewPasswordStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900" />
        <div className="relative z-10 p-8 xl:p-12 flex flex-col justify-between h-full">
          {/* Logo and tagline */}
          <div className="space-y-2">
            <h1 className="text-2xl xl:text-3xl text-white tracking-wider">
              BuiltGlory Admin
            </h1>
            <p className="text-slate-200 text-lg">
              Precision in Property Management
            </p>
          </div>




        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile header */}
          <div className="lg:hidden text-center space-y-2">
            <h1 className="text-slate-700 tracking-wider">BuiltGlory Admin</h1>
            <p className="text-sm text-slate-600">Precision in Property Management</p>
          </div>

          {/* Password reset card */}
          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm shadow-2xl">
            {renderCurrentStep()}
          </Card>

          {/* Mobile image */}
          <div className="lg:hidden">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1639503547276-90230c4a4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHNoaWVsZCUyMGxvY2slMjBjeWJlcnNlY3VyaXR5fGVufDF8fHx8MTc1OTE0MzcxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Security and cybersecurity concept" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500">
              Secure access. GDPR & RERA compliant.
            </p>
            <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
              <span>🔒</span>
              <span>SSL Secured</span>
              <span>•</span>
              <span>📋</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>🏢</span>
              <span>RERA Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}