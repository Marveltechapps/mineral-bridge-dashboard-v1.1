import { useState } from "react";
import { useDashboardStore } from "../../store/dashboardStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, CheckCircle, User, Building, Shield, FileText, Clock } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface RequestAccessFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = "personal" | "role" | "justification" | "review" | "success";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  department: string;
  requestedRole: string;
  accessLevel: string;
  businessJustification: string;
  dataAccess: string[];
  supervisor: string;
  supervisorEmail: string;
  startDate: string;
}

export function RequestAccessFlow({ onBack, onComplete }: RequestAccessFlowProps) {
  const { dispatch } = useDashboardStore();
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    department: "",
    requestedRole: "",
    accessLevel: "",
    businessJustification: "",
    dataAccess: [],
    supervisor: "",
    supervisorEmail: "",
    startDate: ""
  });

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) return;
    setCurrentStep("role");
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requestedRole || !formData.accessLevel) return;
    setCurrentStep("justification");
  };

  const handleJustificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessJustification || !formData.supervisor) return;
    setCurrentStep("review");
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    const requestId = `REQ-${Date.now().toString().slice(-6)}`;
    dispatch({
      type: "ADD_ACCESS_REQUEST",
      payload: {
        id: requestId,
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        company: formData.company,
        requestedRole: formData.requestedRole || "User",
        submittedAt: new Date().toISOString(),
        status: "pending",
      },
    });
    setIsLoading(false);
    setCurrentStep("success");
  };

  const handleComplete = () => {
    onComplete();
    onBack(); // Return to login
  };

  const toggleDataAccess = (access: string) => {
    const current = formData.dataAccess;
    const updated = current.includes(access) 
      ? current.filter(item => item !== access)
      : [...current, access];
    updateFormData("dataAccess", updated);
  };

  const renderPersonalStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800 text-center">Request Access</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Provide your personal and professional information to request access to BuiltGlory Admin.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handlePersonalSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-700">
                First Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pl-10"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Business Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="john.doe@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-700">
              Company/Organization *
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => updateFormData("company", e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pl-10"
                placeholder="Acme Real Estate"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-slate-700">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
                placeholder="Property Manager"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-slate-700">
                Department
              </Label>
              <Select value={formData.department} onValueChange={(value) => updateFormData("department", value)}>
                <SelectTrigger className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="it">IT/Technology</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="customer-service">Customer Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.company}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Continue to Role Selection
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

  const renderRoleStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800 text-center">Role & Access Level</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Select the role and access level you need for your work responsibilities.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleRoleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="requestedRole" className="text-slate-700">
              Requested Role *
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Select value={formData.requestedRole} onValueChange={(value) => updateFormData("requestedRole", value)}>
                <SelectTrigger className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pl-10">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property-manager">Property Manager</SelectItem>
                  <SelectItem value="sales-agent">Sales Agent</SelectItem>
                  <SelectItem value="leasing-consultant">Leasing Consultant</SelectItem>
                  <SelectItem value="marketing-specialist">Marketing Specialist</SelectItem>
                  <SelectItem value="financial-analyst">Financial Analyst</SelectItem>
                  <SelectItem value="operations-manager">Operations Manager</SelectItem>
                  <SelectItem value="regional-manager">Regional Manager</SelectItem>
                  <SelectItem value="admin-assistant">Administrative Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessLevel" className="text-slate-700">
              Access Level Required *
            </Label>
            <Select value={formData.accessLevel} onValueChange={(value) => updateFormData("accessLevel", value)}>
              <SelectTrigger className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                <SelectItem value="editor">Editor - Read and edit access</SelectItem>
                <SelectItem value="manager">Manager - Full management access</SelectItem>
                <SelectItem value="admin">Administrator - System administration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-700">Data Access Requirements</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Property Listings",
                "Financial Reports",
                "Client Information",
                "Transaction History",
                "Analytics Dashboard",
                "User Management",
                "System Settings",
                "Compliance Reports"
              ].map((access) => (
                <button
                  key={access}
                  type="button"
                  onClick={() => toggleDataAccess(access)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.dataAccess.includes(access)
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{access}</span>
                    {formData.dataAccess.includes(access) && (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-700">
              Requested Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData("startDate", e.target.value)}
              className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
            />
          </div>

          <Button
            type="submit"
            disabled={!formData.requestedRole || !formData.accessLevel}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Continue to Justification
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setCurrentStep("personal")}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
          >
            <ArrowLeft size={14} />
            Back to Personal Info
          </button>
        </div>
      </CardContent>
    </>
  );

  const renderJustificationStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800 text-center">Business Justification</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Provide details about why you need access and supervisor approval information.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleJustificationSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="businessJustification" className="text-slate-700">
              Business Justification *
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Textarea
                id="businessJustification"
                value={formData.businessJustification}
                onChange={(e) => updateFormData("businessJustification", e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20 pl-10 min-h-[120px]"
                placeholder="Explain why you need access to BuiltGlory Admin and how it relates to your job responsibilities..."
                required
              />
            </div>
            <p className="text-xs text-slate-500">
              Minimum 50 characters. Be specific about your business needs and responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor" className="text-slate-700">
                Direct Supervisor *
              </Label>
              <Input
                id="supervisor"
                type="text"
                value={formData.supervisor}
                onChange={(e) => updateFormData("supervisor", e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
                placeholder="Jane Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisorEmail" className="text-slate-700">
                Supervisor Email *
              </Label>
              <Input
                id="supervisorEmail"
                type="email"
                value={formData.supervisorEmail}
                onChange={(e) => updateFormData("supervisorEmail", e.target.value)}
                className="border-slate-300 bg-slate-50 focus:border-blue-600 focus:ring-blue-600/20"
                placeholder="jane.smith@company.com"
                required
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-amber-800 text-sm">Approval Process</h4>
                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                  Your supervisor will receive an email to approve this access request. 
                  Access will be granted within 24-48 hours of supervisor approval.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!formData.businessJustification || !formData.supervisor || !formData.supervisorEmail}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Review Request
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setCurrentStep("role")}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
          >
            <ArrowLeft size={14} />
            Back to Role Selection
          </button>
        </div>
      </CardContent>
    </>
  );

  const renderReviewStep = () => (
    <>
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl text-slate-800 text-center">Review Your Request</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Please review all information before submitting your access request.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="text-slate-800 text-lg">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Name:</span>
                <p className="text-slate-800">{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <span className="text-slate-600">Email:</span>
                <p className="text-slate-800">{formData.email}</p>
              </div>
              <div>
                <span className="text-slate-600">Company:</span>
                <p className="text-slate-800">{formData.company}</p>
              </div>
              <div>
                <span className="text-slate-600">Job Title:</span>
                <p className="text-slate-800">{formData.jobTitle || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Role and Access */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="text-slate-800 text-lg">Role & Access</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Requested Role:</span>
                <p className="text-slate-800">{formData.requestedRole}</p>
              </div>
              <div>
                <span className="text-slate-600">Access Level:</span>
                <p className="text-slate-800">{formData.accessLevel}</p>
              </div>
            </div>
            {formData.dataAccess.length > 0 && (
              <div>
                <span className="text-slate-600 text-sm">Data Access:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.dataAccess.map((access) => (
                    <Badge key={access} variant="secondary" className="text-xs">
                      {access}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Supervisor */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="text-slate-800 text-lg">Supervisor Approval</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Supervisor:</span>
                <p className="text-slate-800">{formData.supervisor}</p>
              </div>
              <div>
                <span className="text-slate-600">Supervisor Email:</span>
                <p className="text-slate-800">{formData.supervisorEmail}</p>
              </div>
            </div>
          </div>

          {/* Business Justification */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="text-slate-800 text-lg">Business Justification</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{formData.businessJustification}</p>
          </div>
        </div>

        <Button
          onClick={handleFinalSubmit}
          disabled={isLoading}
          className="w-full bg-green-700 hover:bg-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isLoading ? "Submitting Request..." : "Submit Access Request"}
        </Button>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setCurrentStep("justification")}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
          >
            <ArrowLeft size={14} />
            Back to Justification
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
        <CardTitle className="text-2xl text-slate-800 text-center">Request Submitted!</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          Your access request has been successfully submitted and is now pending supervisor approval.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="text-blue-800">What happens next?</h4>
          <ul className="text-blue-700 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">1.</span>
              <span>Your supervisor ({formData.supervisor}) will receive an approval email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">2.</span>
              <span>IT Security will review your request after supervisor approval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">3.</span>
              <span>You'll receive login credentials within 24-48 hours of approval</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-slate-700 text-sm">
            <strong>Request ID:</strong> REQ-{Date.now().toString().slice(-6)}
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Save this ID for reference when following up on your request.
          </p>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          Return to Login
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Questions? Contact IT Support at support@builtglory.com
          </p>
        </div>
      </CardContent>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "personal":
        return renderPersonalStep();
      case "role":
        return renderRoleStep();
      case "justification":
        return renderJustificationStep();
      case "review":
        return renderReviewStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderPersonalStep();
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

          {/* Request access card */}
          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm shadow-2xl">
            {renderCurrentStep()}
          </Card>

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