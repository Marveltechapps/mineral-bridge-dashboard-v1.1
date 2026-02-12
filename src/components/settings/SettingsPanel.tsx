import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  Settings,
  Bell,
  Shield,
  Plug,
  Save,
  RotateCcw,
  Info,
  Globe,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  MessageCircle,
  Clock,
  Database,
  Key,
  Users,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Palette,
  Languages,
  Calendar,
  Volume2,
  Eye,
  EyeOff
} from "lucide-react";

// Settings state structure
interface SettingsState {
  general: {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    companyName: string;
    autoSave: boolean;
    compactMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    weeklyReports: boolean;
    newListings: boolean;
    clientMessages: boolean;
    systemAlerts: boolean;
    maintenanceUpdates: boolean;
    marketingEmails: boolean;
    frequency: string;
    quietHours: boolean;
    quietStart: string;
    quietEnd: string;
  };
  integrations: {
    googleCalendar: boolean;
    outlook365: boolean;
    slackWorkspace: boolean;
    webhooksEnabled: boolean;
    apiAccess: boolean;
    thirdPartyAnalytics: boolean;
    crmSync: boolean;
    emailMarketing: boolean;
    paymentGateway: string;
    cloudStorage: string;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: string;
    passwordExpiry: string;
    ipWhitelist: boolean;
    auditLogging: boolean;
    dataEncryption: boolean;
    backupFrequency: string;
    gdprCompliance: boolean;
    accessReview: boolean;
  };
}

const initialSettings: SettingsState = {
  general: {
    theme: "system",
    language: "en-US",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    companyName: "Property Management Co.",
    autoSave: true,
    compactMode: false,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    newListings: true,
    clientMessages: true,
    systemAlerts: true,
    maintenanceUpdates: true,
    marketingEmails: false,
    frequency: "immediate",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
  },
  integrations: {
    googleCalendar: true,
    outlook365: false,
    slackWorkspace: true,
    webhooksEnabled: false,
    apiAccess: true,
    thirdPartyAnalytics: false,
    crmSync: true,
    emailMarketing: false,
    paymentGateway: "stripe",
    cloudStorage: "aws",
  },
  security: {
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: "24h",
    passwordExpiry: "90d",
    ipWhitelist: false,
    auditLogging: true,
    dataEncryption: true,
    backupFrequency: "daily",
    gdprCompliance: true,
    accessReview: false,
  },
};

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<string[]>([]);

  const updateSetting = (section: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    setHasChanges(false);
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    toast.info("Settings reset to defaults");
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light": return Sun;
      case "dark": return Moon;
      default: return Monitor;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-7 w-7 text-blue-600" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your application preferences and system settings
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <Card>
          <CardContent className="p-0">
            <Accordion type="multiple" value={activeSection} onValueChange={setActiveSection} className="w-full">
              
              {/* General Preferences */}
              <AccordionItem value="general" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">General Preferences</h3>
                      <p className="text-sm text-muted-foreground">Theme, language, and display settings</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    
                    {/* Theme Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Theme</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Choose your preferred color scheme</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "light", label: "Light", icon: Sun },
                            { value: "dark", label: "Dark", icon: Moon },
                            { value: "system", label: "System", icon: Monitor }
                          ].map((theme) => {
                            const ThemeIcon = theme.icon;
                            return (
                              <Button
                                key={theme.value}
                                variant={settings.general.theme === theme.value ? "default" : "outline"}
                                onClick={() => updateSetting("general", "theme", theme.value)}
                                className="gap-2 justify-start"
                              >
                                <ThemeIcon className="h-4 w-4" />
                                {theme.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Language</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select your preferred language</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select 
                          value={settings.general.language} 
                          onValueChange={(value) => updateSetting("general", "language", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Languages className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es-ES">Spanish</SelectItem>
                            <SelectItem value="fr-FR">French</SelectItem>
                            <SelectItem value="de-DE">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Time and Format Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select 
                          value={settings.general.timezone} 
                          onValueChange={(value) => updateSetting("general", "timezone", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select 
                          value={settings.general.dateFormat} 
                          onValueChange={(value) => updateSetting("general", "dateFormat", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select 
                          value={settings.general.currency} 
                          onValueChange={(value) => updateSetting("general", "currency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Company Settings */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={settings.general.companyName}
                          onChange={(e) => updateSetting("general", "companyName", e.target.value)}
                          placeholder="Enter your company name"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Label>Auto Save</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Automatically save changes as you work</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-sm text-muted-foreground">Save changes automatically</p>
                        </div>
                        <Switch
                          checked={settings.general.autoSave}
                          onCheckedChange={(checked) => updateSetting("general", "autoSave", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                        </div>
                        <Switch
                          checked={settings.general.compactMode}
                          onCheckedChange={(checked) => updateSetting("general", "compactMode", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Notifications */}
              <AccordionItem value="notifications" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
                      <Bell className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Configure how you receive updates</p>
                    </div>
                    {Object.values(settings.notifications).filter(v => typeof v === 'boolean' && v).length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {Object.values(settings.notifications).filter(v => typeof v === 'boolean' && v).length} active
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    
                    {/* Notification Channels */}
                    <div>
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Notification Channels
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: "emailNotifications", label: "Email", icon: Mail, description: "Receive updates via email" },
                          { key: "pushNotifications", label: "Push", icon: Smartphone, description: "Browser and mobile notifications" },
                          { key: "smsNotifications", label: "SMS", icon: MessageCircle, description: "Text message alerts" }
                        ].map((channel) => {
                          const ChannelIcon = channel.icon;
                          return (
                            <div key={channel.key} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <ChannelIcon className="h-4 w-4" />
                                  <span className="font-medium">{channel.label}</span>
                                </div>
                                <Switch
                                  checked={settings.notifications[channel.key as keyof typeof settings.notifications] as boolean}
                                  onCheckedChange={(checked) => updateSetting("notifications", channel.key, checked)}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">{channel.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Notification Types */}
                    <div>
                      <h4 className="font-medium mb-4">Notification Types</h4>
                      <div className="space-y-3">
                        {[
                          { key: "weeklyReports", label: "Weekly Reports", description: "Summary of activities and metrics" },
                          { key: "newListings", label: "New Listings", description: "Alerts for new property listings" },
                          { key: "clientMessages", label: "Client Messages", description: "New messages from clients" },
                          { key: "systemAlerts", label: "System Alerts", description: "Important system notifications" },
                          { key: "maintenanceUpdates", label: "Maintenance Updates", description: "System maintenance notifications" },
                          { key: "marketingEmails", label: "Marketing Emails", description: "Promotional content and offers" }
                        ].map((type) => (
                          <div key={type.key} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <Label>{type.label}</Label>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                            <Switch
                              checked={settings.notifications[type.key as keyof typeof settings.notifications] as boolean}
                              onCheckedChange={(checked) => updateSetting("notifications", type.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Notification Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Notification Frequency</Label>
                        <Select 
                          value={settings.notifications.frequency} 
                          onValueChange={(value) => updateSetting("notifications", "frequency", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Quiet Hours</Label>
                            <p className="text-sm text-muted-foreground">Disable notifications during these hours</p>
                          </div>
                          <Switch
                            checked={settings.notifications.quietHours}
                            onCheckedChange={(checked) => updateSetting("notifications", "quietHours", checked)}
                          />
                        </div>
                        
                        {settings.notifications.quietHours && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-sm">Start</Label>
                              <Input
                                type="time"
                                value={settings.notifications.quietStart}
                                onChange={(e) => updateSetting("notifications", "quietStart", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">End</Label>
                              <Input
                                type="time"
                                value={settings.notifications.quietEnd}
                                onChange={(e) => updateSetting("notifications", "quietEnd", e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Integrations */}
              <AccordionItem value="integrations" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg">
                      <Plug className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Integrations</h3>
                      <p className="text-sm text-muted-foreground">Connect with third-party services</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {Object.values(settings.integrations).filter(v => typeof v === 'boolean' && v).length} connected
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    
                    {/* Popular Integrations */}
                    <div>
                      <h4 className="font-medium mb-4">Popular Integrations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { 
                            key: "googleCalendar", 
                            label: "Google Calendar", 
                            description: "Sync appointments and events",
                            status: "connected",
                            color: "bg-blue-500"
                          },
                          { 
                            key: "outlook365", 
                            label: "Microsoft 365", 
                            description: "Email and calendar integration",
                            status: "available",
                            color: "bg-orange-500"
                          },
                          { 
                            key: "slackWorkspace", 
                            label: "Slack", 
                            description: "Team communication and alerts",
                            status: "connected",
                            color: "bg-pink-500"
                          },
                          { 
                            key: "crmSync", 
                            label: "CRM System", 
                            description: "Customer relationship management",
                            status: "connected",
                            color: "bg-green-500"
                          }
                        ].map((integration) => {
                          const isConnected = settings.integrations[integration.key as keyof typeof settings.integrations] as boolean;
                          
                          return (
                            <div key={integration.key} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 ${integration.color} rounded-lg flex items-center justify-center`}>
                                    <Plug className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium">{integration.label}</h5>
                                      {isConnected && <CheckCircle className="h-4 w-4 text-green-600" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={isConnected}
                                  onCheckedChange={(checked) => updateSetting("integrations", integration.key, checked)}
                                />
                              </div>
                              {isConnected && (
                                <div className="mt-3 pt-3 border-t">
                                  <Button variant="outline" size="sm" className="gap-2">
                                    <ExternalLink className="h-3 w-3" />
                                    Configure
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* API & Developer Settings */}
                    <div>
                      <h4 className="font-medium mb-4">API & Developer Settings</h4>
                      <div className="space-y-4">
                        {[
                          { key: "webhooksEnabled", label: "Webhooks", description: "HTTP callbacks for real-time events" },
                          { key: "apiAccess", label: "API Access", description: "Enable REST API for integrations" },
                          { key: "thirdPartyAnalytics", label: "Third-party Analytics", description: "Allow external analytics tracking" }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <Label>{setting.label}</Label>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Switch
                              checked={settings.integrations[setting.key as keyof typeof settings.integrations] as boolean}
                              onCheckedChange={(checked) => updateSetting("integrations", setting.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Service Providers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Payment Gateway</Label>
                        <Select 
                          value={settings.integrations.paymentGateway} 
                          onValueChange={(value) => updateSetting("integrations", "paymentGateway", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="authorize">Authorize.Net</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Cloud Storage</Label>
                        <Select 
                          value={settings.integrations.cloudStorage} 
                          onValueChange={(value) => updateSetting("integrations", "cloudStorage", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aws">Amazon S3</SelectItem>
                            <SelectItem value="gcp">Google Cloud</SelectItem>
                            <SelectItem value="azure">Microsoft Azure</SelectItem>
                            <SelectItem value="dropbox">Dropbox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Security */}
              <AccordionItem value="security" className="border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-950/20 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Security</h3>
                      <p className="text-sm text-muted-foreground">Authentication and data protection</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {settings.security.twoFactorAuth && settings.security.dataEncryption ? "High" : "Medium"} Security
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    
                    {/* Authentication */}
                    <div>
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Authentication
                      </h4>
                      <div className="space-y-4">
                        {[
                          { 
                            key: "twoFactorAuth", 
                            label: "Two-Factor Authentication", 
                            description: "Add an extra layer of security with 2FA",
                            critical: true
                          },
                          { 
                            key: "loginAlerts", 
                            label: "Login Alerts", 
                            description: "Get notified of new login attempts" 
                          }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-start gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Label>{setting.label}</Label>
                                  {setting.critical && <Badge variant="destructive" className="text-xs">Critical</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={settings.security[setting.key as keyof typeof settings.security] as boolean}
                              onCheckedChange={(checked) => updateSetting("security", setting.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Session Management */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Session Timeout</Label>
                        <Select 
                          value={settings.security.sessionTimeout} 
                          onValueChange={(value) => updateSetting("security", "sessionTimeout", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="8h">8 Hours</SelectItem>
                            <SelectItem value="24h">24 Hours</SelectItem>
                            <SelectItem value="7d">7 Days</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Password Expiry</Label>
                        <Select 
                          value={settings.security.passwordExpiry} 
                          onValueChange={(value) => updateSetting("security", "passwordExpiry", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30d">30 Days</SelectItem>
                            <SelectItem value="90d">90 Days</SelectItem>
                            <SelectItem value="180d">6 Months</SelectItem>
                            <SelectItem value="365d">1 Year</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Data Protection */}
                    <div>
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Data Protection
                      </h4>
                      <div className="space-y-4">
                        {[
                          { key: "dataEncryption", label: "Data Encryption", description: "Encrypt sensitive data at rest and in transit", critical: true },
                          { key: "auditLogging", label: "Audit Logging", description: "Log all system activities for security monitoring" },
                          { key: "gdprCompliance", label: "GDPR Compliance", description: "Enable privacy controls for EU users" },
                          { key: "accessReview", label: "Access Review", description: "Periodic review of user permissions" },
                          { key: "ipWhitelist", label: "IP Whitelist", description: "Restrict access to specific IP addresses" }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <div className="flex items-center gap-2">
                                <Label>{setting.label}</Label>
                                {setting.critical && <Badge variant="destructive" className="text-xs">Critical</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Switch
                              checked={settings.security[setting.key as keyof typeof settings.security] as boolean}
                              onCheckedChange={(checked) => updateSetting("security", setting.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Backup Settings */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Backup Frequency</Label>
                        <Select 
                          value={settings.security.backupFrequency} 
                          onValueChange={(value) => updateSetting("security", "backupFrequency", value)}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Danger Zone */}
                      <div className="pt-6 border-t border-red-200 dark:border-red-900">
                        <h4 className="font-medium mb-4 flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          Danger Zone
                        </h4>
                        <div className="space-y-3">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="gap-2">
                                <Trash2 className="h-4 w-4" />
                                Reset All Settings
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will reset all your settings to their default values. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleReset}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Reset Settings
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>

        {/* Floating Save Button for Mobile */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 md:hidden">
            <Button onClick={handleSave} size="lg" className="rounded-full shadow-lg gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}