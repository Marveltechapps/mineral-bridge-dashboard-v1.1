import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  TrendingUp,
  FileText,
  User,
  Globe,
  MoreHorizontal,
  ChevronRight,
  ExternalLink,
  Info,
  History,
  CheckCircle,
  FileBadge,
  LayoutGrid,
  Zap,
  UploadCloud
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner@2.0.3";

// --- Mock Data ---

const PIE_DATA = [
  { name: 'Restricted Minerals', value: 60, color: '#10b981' },
  { name: 'Docs Missing', value: 40, color: '#a7f3d0' },
];

const TREND_DATA = [
  { day: 'Mon', time: 2.1 },
  { day: 'Tue', time: 2.5 },
  { day: 'Wed', time: 2.2 },
  { day: 'Thu', time: 2.8 },
  { day: 'Fri', time: 2.3 },
  { day: 'Sat', time: 2.0 },
  { day: 'Sun', time: 2.3 },
];

const RECENT_ALERTS = [
  { id: 1, entity: "Seller XYZ", issue: "Restricted Mineral Flag (Gold from non-approved region)", status: "Open", admin: "JS" },
  { id: 2, entity: "Global Mine Corp", issue: "Expired Export License", status: "Resolved", admin: "AK" },
  { id: 3, entity: "Rajesh Kumar", issue: "Passport mismatch in KYC", status: "Open", admin: "JS" },
  { id: 4, entity: "EcoMiner S.A.", issue: "Sanctioned Entity Match (Partial)", status: "Open", admin: "AK" },
  { id: 5, entity: "Tanzania Gold Ltd", issue: "Audit Trail Incomplete", status: "Resolved", admin: "JS" },
];

const INITIAL_VERIFICATIONS = [
  { id: '101', name: 'Arjun Mehta', type: 'Individual', status: 'Approved', score: 92, country: 'IN', countryName: 'India', docs: 7, totalDocs: 7, issues: [], updated: '2h ago', avatar: 'AM' },
  { id: '102', name: 'Deep Earth Mining', type: 'Business', status: 'Pending', score: 78, country: 'AU', countryName: 'Australia', docs: 5, totalDocs: 7, issues: ['Missing License'], updated: '5h ago', avatar: 'DE' },
  { id: '103', name: 'Kwame Osei', type: 'Miner', status: 'Flagged', score: 64, country: 'GH', countryName: 'Ghana', docs: 4, totalDocs: 6, issues: ['Restricted List', 'Docs Incomplete'], updated: '1d ago', avatar: 'KO' },
  { id: '104', name: 'Zahara Minerals', type: 'Business', status: 'Rejected', score: 45, country: 'TZ', countryName: 'Tanzania', docs: 2, totalDocs: 8, issues: ['Fraudulent Doc'], updated: '3h ago', avatar: 'ZM' },
  { id: '105', name: 'Liam Wilson', type: 'Individual', status: 'Approved', score: 96, country: 'CA', countryName: 'Canada', docs: 5, totalDocs: 5, issues: [], updated: '12h ago', avatar: 'LW' },
  { id: '106', name: 'Indus Valley Trading', type: 'Business', status: 'Pending', score: 81, country: 'IN', countryName: 'India', docs: 6, totalDocs: 7, issues: ['Site Verify Pending'], updated: '6h ago', avatar: 'IV' },
  { id: '107', name: 'Chen Wei', type: 'Miner', status: 'Approved', score: 88, country: 'CN', countryName: 'China', docs: 4, totalDocs: 4, issues: [], updated: '45m ago', avatar: 'CW' },
  { id: '108', name: 'Southern Cross Ltd', type: 'Business', status: 'Flagged', score: 72, country: 'AU', countryName: 'Australia', docs: 9, totalDocs: 12, issues: ['Tax ID Missing'], updated: '8h ago', avatar: 'SC' },
  { id: '109', name: 'Priya Sharma', type: 'Individual', status: 'Pending', score: 84, country: 'IN', countryName: 'India', docs: 4, totalDocs: 5, issues: [], updated: '1h ago', avatar: 'PS' },
  { id: '110', name: 'Ouro Verde SA', type: 'Business', status: 'Approved', score: 91, country: 'BR', countryName: 'Brazil', docs: 8, totalDocs: 8, issues: [], updated: '15h ago', avatar: 'OV' },
];

// --- Sub-components ---

const StatCard = ({ title, value, badge, badgeColor, progress, trend, chart }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full"
  >
    <div className="flex justify-between items-start mb-4">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      {badge && (
        <Badge className={`${badgeColor} border-none`}>{badge}</Badge>
      )}
    </div>
    
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {trend && (
          <div className="flex items-center mt-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      
      {chart && (
        <div className="h-12 w-20">
          <ResponsiveContainer width="100%" height="100%">
            {chart}
          </ResponsiveContainer>
        </div>
      )}
    </div>

    {progress !== undefined && (
      <div className="mt-4">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">{progress}% complete</p>
      </div>
    )}
  </motion.div>
);

const DetailModal = ({ isOpen, onClose, entity }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleAiVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("AI Legality Check completed. Entity score updated.");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="relative w-full max-w-[800px] h-full bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col"
      >
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-emerald-100">
              <AvatarFallback className="bg-emerald-600 text-white font-bold">{entity.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{entity.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{entity.type}</Badge>
                <span className="text-xs text-slate-500">ID: MB-#{entity.id}829</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <XCircle className="h-6 w-6 text-slate-400" />
          </Button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
          {['overview', 'documents', 'history', 'related'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Compliance Score</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${entity.score > 85 ? 'text-emerald-600' : entity.score > 70 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {entity.score}%
                    </span>
                    <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${entity.score > 85 ? 'bg-emerald-500' : entity.score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${entity.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Current Status</p>
                  <div className="flex items-center gap-2">
                    {entity.status === 'Approved' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    {entity.status === 'Pending' && <Clock className="w-5 h-5 text-amber-500" />}
                    {entity.status === 'Flagged' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                    <span className="font-semibold text-slate-900 dark:text-white">{entity.status}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  Entity Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Origin Country</p>
                    <p className="font-medium flex items-center gap-2 mt-1">
                      <Globe className="w-4 h-4 text-slate-400" />
                      {entity.countryName} ({entity.country})
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Last Updated</p>
                    <p className="font-medium mt-1">{entity.updated}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Documents Submitted</p>
                    <p className="font-medium mt-1">{entity.docs} of {entity.totalDocs}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Associated Minerals</p>
                    <p className="font-medium mt-1">Gold, Copper Ore</p>
                  </div>
                </div>
              </div>

              {entity.issues.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  <h3 className="text-rose-700 dark:text-rose-400 text-sm font-bold flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    Detected Issues
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entity.issues.map((issue: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-none">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAiVerify} 
                  disabled={isVerifying}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isVerifying ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Zap className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Run AI Legality Check
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex-1 border-slate-200 h-12 rounded-xl">
                  Contact Entity
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <div className="grid grid-cols-2 gap-4">
              {['Passport ID', 'Business License', 'Export Permit', 'Test Report #92', 'SGS Cert'].map((doc, i) => (
                <div key={i} className="group relative bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="w-full aspect-[4/3] bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold truncate max-w-[120px]">{doc}</p>
                      <p className="text-[10px] text-slate-500">PDF • 2.4 MB</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none scale-75">Verified</Badge>
                  </div>
                </div>
              ))}
              <div className="bg-dashed bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-emerald-300 transition-all cursor-pointer">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-xs font-medium">Add Document</span>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {[
                { event: 'AI Legality Check Passed', time: '2h ago', user: 'System AI' },
                { event: 'SGS Certificate Uploaded', time: '5h ago', user: 'Entity' },
                { event: 'Verification Started', time: '1d ago', user: 'Admin JS' },
                { event: 'KYC Form Submitted', time: '2d ago', user: 'Entity' },
              ].map((h, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-600 z-10" />
                    {i !== 3 && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 -mt-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold">{h.event}</p>
                    <p className="text-xs text-slate-500 mt-1">{h.time} • by {h.user}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <Button onClick={() => {toast.success("Approved successfully"); onClose();}} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-lg">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve Entity
          </Button>
          <Button onClick={() => {toast.error("Rejected entity"); onClose();}} variant="destructive" className="flex-1 font-bold h-11 rounded-lg">
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export const ComplianceVerification = () => {
  const { state } = useDashboardStore();
  const registryPendingCount = state.registryUsers.filter((u) => u.status === "Under Review" || u.status === "Not Submitted").length;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const filteredVerifications = useMemo(() => {
    return verifications
      .filter(v => 
        (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         v.id.includes(searchTerm) || 
         v.countryName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'All' || v.status === statusFilter)
      )
      .sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchTerm, statusFilter, verifications, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBulkApprove = () => {
    toast.success("Bulk approval initiated for selected items.");
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-slate-300 font-medium">Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Compliance & Verification</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm">
            <Clock className="w-4 h-4 text-slate-400 mr-2" />
            <select className="text-xs font-semibold bg-transparent border-none outline-none cursor-pointer">
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
          <Button variant="outline" onClick={refreshData} className="border-slate-200 dark:border-slate-800 h-10 px-4 rounded-xl font-bold gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl shadow-lg shadow-emerald-500/20 gap-2">
            <Plus className="w-4 h-4" />
            New Batch Verify
          </Button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="User Registry (from User Mgmt)" 
          value={String(state.registryUsers.length)} 
          badge={registryPendingCount ? `${registryPendingCount} need review` : "In sync"} 
          badgeColor={registryPendingCount ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"} 
          progress={registryPendingCount ? Math.round((1 - registryPendingCount / state.registryUsers.length) * 100) : 100}
        />
        <StatCard 
          title="Total Verifications" 
          value="1,247" 
          badge="+12 today" 
          badgeColor="bg-emerald-100 text-emerald-700" 
          progress={85}
        />
        <StatCard 
          title="Pending KYC/KYB" 
          value="56" 
          badge="Action Required" 
          badgeColor="bg-amber-100 text-amber-700"
        />
        <StatCard 
          title="Compliance Issues" 
          value="23" 
          badge="Critical" 
          badgeColor="bg-rose-100 text-rose-700"
          chart={
            <PieChart>
              <Pie data={PIE_DATA} innerRadius={18} outerRadius={25} paddingAngle={2} dataKey="value">
                {PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          }
        />
        <StatCard 
          title="Avg Verification Time" 
          value="2.3 days" 
          trend="+3% vs last week"
          chart={
            <LineChart data={TREND_DATA}>
              <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          }
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              Quick Actions
            </h3>
            <button className="text-xs font-semibold text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Bulk Approve', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Run AI Check', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Upload Batch', icon: UploadCloud, color: 'text-blue-600 bg-blue-50' },
              { label: 'Audit Logs', icon: History, color: 'text-slate-600 bg-slate-50' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 hover:shadow-md transition-all group">
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Recent Compliance Alerts
            </h3>
            <Badge className="bg-rose-50 text-rose-600 border-none px-2">{RECENT_ALERTS.filter(a => a.status === 'Open').length} Active</Badge>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
            {RECENT_ALERTS.map((alert) => (
              <div key={alert.id} className="group flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${alert.status === 'Open' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {alert.entity} <span className="text-[10px] text-slate-400 ml-2 font-normal">ID: AL-{alert.id}93</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{alert.issue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex -space-x-2">
                    <Avatar className="w-6 h-6 border-2 border-white dark:border-slate-900">
                      <AvatarFallback className="text-[8px] bg-slate-200">{alert.admin}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-emerald-600">Review</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-slate-400">Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID, country..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 py-2.5 text-sm outline-none focus:ring-2 ring-emerald-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {['All', 'Approved', 'Pending', 'Flagged', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === status 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800">
              <LayoutGrid className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></th>
                <th className="px-6 py-4 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Entity <MoreHorizontal className="w-3 h-3 rotate-90" /></div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => handleSort('score')}>
                  <div className="flex items-center gap-2">Compliance Score <MoreHorizontal className="w-3 h-3 rotate-90" /></div>
                </th>
                <th className="px-6 py-4">Origin</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4">Issues</th>
                <th className="px-6 py-4 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => handleSort('updated')}>
                  <div className="flex items-center gap-2">Last Updated <MoreHorizontal className="w-3 h-3 rotate-90" /></div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence mode='popLayout'>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`loading-${i}`} className="animate-pulse">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-6 py-5"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredVerifications.length > 0 ? (
                  filteredVerifications.map((item) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                      <td className="px-6 py-4" onClick={() => setSelectedEntity(item)}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-800">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">{item.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{item.name}</p>
                            <Badge variant="outline" className="text-[9px] h-4 font-bold scale-90 -translate-x-1 origin-left uppercase">{item.type}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedEntity(item)}>
                        <Badge className={`
                          border-none text-[10px] font-bold rounded-full px-2 py-0.5
                          ${item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                            item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            item.status === 'Flagged' ? 'bg-rose-100 text-rose-700' : 'bg-rose-100 text-rose-700'}
                        `}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 min-w-[140px]" onClick={() => setSelectedEntity(item)}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold w-8">{item.score}%</span>
                          <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.score > 85 ? 'bg-emerald-500' : item.score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                              style={{ width: `${item.score}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedEntity(item)}>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <span className="text-lg opacity-80">{item.country === 'IN' ? '🇮🇳' : item.country === 'AU' ? '🇦🇺' : item.country === 'GH' ? '🇬🇭' : item.country === 'TZ' ? '🇹🇿' : item.country === 'CA' ? '🇨🇦' : '🌏'}</span>
                          {item.countryName}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedEntity(item)}>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-[10px] h-5">{item.docs}/{item.totalDocs}</Badge>
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                              <FileBadge key={i} className="w-4 h-4 text-slate-300" />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedEntity(item)}>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {item.issues.length > 0 ? (
                            item.issues.slice(0, 1).map((issue, i) => (
                              <Badge key={i} variant="outline" className="bg-rose-50 text-rose-600 border-rose-100 text-[9px] font-bold h-4">
                                {issue}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> None
                            </span>
                          )}
                          {item.issues.length > 1 && <span className="text-[10px] text-slate-400 font-bold">+{item.issues.length - 1}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedEntity(item)}>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {item.updated}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => setSelectedEntity(item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={handleBulkApprove}>
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-lg font-bold text-slate-900 dark:text-white">No verifications yet</p>
                        <p className="text-sm">Upload your first batch or adjust your filters.</p>
                        <Button className="mt-4 bg-emerald-600 text-white font-bold rounded-xl h-10 px-6">Upload First Batch</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 dark:text-white font-bold">{filteredVerifications.length}</span> of <span className="text-slate-900 dark:text-white font-bold">1,247</span> verifications</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg">1</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">2</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">3</Button>
            <span className="text-slate-300">...</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">25</Button>
            <Button variant="outline" size="sm" className="h-8 px-2 rounded-lg gap-1 text-[10px] font-bold">
              Next <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <DetailModal 
        isOpen={!!selectedEntity} 
        onClose={() => setSelectedEntity(null)} 
        entity={selectedEntity || INITIAL_VERIFICATIONS[0]} 
      />
    </div>
  );
};
