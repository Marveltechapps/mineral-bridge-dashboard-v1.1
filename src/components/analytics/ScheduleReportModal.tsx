import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { 
  Clock, 
  Mail, 
  FileText, 
  Calendar,
  Users,
  Settings,
  X
} from "lucide-react";

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (reportConfig: any) => void;
}

export function ScheduleReportModal({ isOpen, onClose, onSchedule }: ScheduleReportModalProps) {
  const [reportName, setReportName] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [format, setFormat] = useState("pdf");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [notes, setNotes] = useState("");
  const [includeSections, setIncludeSections] = useState({
    salesTrends: true,
    propertyTypes: true,
    regionalData: true,
    userEngagement: true,
    summary: true
  });

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" }
  ];

  const formats = [
    { value: "pdf", label: "PDF Report" },
    { value: "excel", label: "Excel Spreadsheet" },
    { value: "email", label: "Email Summary" }
  ];

  const sections = [
    { key: "salesTrends", label: "Sales Trends", description: "Revenue and transaction analytics" },
    { key: "propertyTypes", label: "Property Types", description: "Distribution and performance by type" },
    { key: "regionalData", label: "Regional Data", description: "Geographic performance analysis" },
    { key: "userEngagement", label: "User Engagement", description: "Website and app usage metrics" },
    { key: "summary", label: "Executive Summary", description: "Key insights and recommendations" }
  ];

  const handleAddRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSectionToggle = (sectionKey: string) => {
    setIncludeSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey as keyof typeof prev]
    }));
  };

  const handleSchedule = () => {
    const reportConfig = {
      name: reportName,
      frequency,
      format,
      recipients,
      notes,
      sections: includeSections,
      createdAt: new Date()
    };

    onSchedule?.(reportConfig);
    onClose();
    
    // Reset form
    setReportName("");
    setFrequency("weekly");
    setFormat("pdf");
    setRecipients([]);
    setNewRecipient("");
    setNotes("");
    setIncludeSections({
      salesTrends: true,
      propertyTypes: true,
      regionalData: true,
      userEngagement: true,
      summary: true
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSchedule = reportName.trim() && recipients.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Schedule Analytics Report
          </DialogTitle>
          <DialogDescription>Configure the frequency and recipients for this automated analytics report.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Name */}
          <div className="space-y-2">
            <Label htmlFor="reportName">Report Name</Label>
            <Input
              id="reportName"
              placeholder="e.g., Weekly Sales Performance Report"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          {/* Frequency and Format */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {freq.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {fmt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Recipients
            </Label>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
              />
              <Button 
                onClick={handleAddRecipient}
                disabled={!newRecipient || !isValidEmail(newRecipient)}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email}
                    <button
                      onClick={() => handleRemoveRecipient(email)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Report Sections */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Include Sections
            </Label>
            
            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={section.key}
                    checked={includeSections[section.key as keyof typeof includeSections]}
                    onCheckedChange={() => handleSectionToggle(section.key)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={section.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {section.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific requirements or notes for this report..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Schedule Preview */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Preview
            </h4>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Report:</span> {reportName || "Untitled Report"}</p>
              <p><span className="text-muted-foreground">Frequency:</span> {frequencies.find(f => f.value === frequency)?.label}</p>
              <p><span className="text-muted-foreground">Format:</span> {formats.find(f => f.value === format)?.label}</p>
              <p><span className="text-muted-foreground">Recipients:</span> {recipients.length} email(s)</p>
              <p><span className="text-muted-foreground">Sections:</span> {Object.values(includeSections).filter(Boolean).length} of {sections.length}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!canSchedule}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Schedule Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}