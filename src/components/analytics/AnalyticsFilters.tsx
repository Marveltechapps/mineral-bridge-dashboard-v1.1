import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  Calendar as CalendarIcon,
  Filter, 
  Download,
  Clock,
  RefreshCw,
  FileText,
  Mail
} from "lucide-react";

interface AnalyticsFiltersProps {
  onFiltersChange?: (filters: any) => void;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  onScheduleReport?: () => void;
}

export function AnalyticsFilters({ onFiltersChange, onExport, onScheduleReport }: AnalyticsFiltersProps) {
  const [timeRange, setTimeRange] = useState("last30days");
  const [propertyType, setPropertyType] = useState("all");
  const [region, setRegion] = useState("all");
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  const [showCustomDate, setShowCustomDate] = useState(false);

  const timeRanges = [
    { value: "last7days", label: "Last 7 days" },
    { value: "last30days", label: "Last 30 days" },
    { value: "last90days", label: "Last 90 days" },
    { value: "last6months", label: "Last 6 months" },
    { value: "lastyear", label: "Last year" },
    { value: "custom", label: "Custom range" }
  ];

  const propertyTypes = [
    { value: "all", label: "All Property Types" },
    { value: "apartment", label: "Apartments" },
    { value: "house", label: "Houses" },
    { value: "condo", label: "Condos" },
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" }
  ];

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "downtown", label: "Downtown" },
    { value: "midtown", label: "Midtown" },
    { value: "uptown", label: "Uptown" },
    { value: "suburbs", label: "Suburbs" }
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { timeRange, propertyType, region, [key]: value };
    
    if (key === 'timeRange') {
      setTimeRange(value);
      if (value === 'custom') {
        setShowCustomDate(true);
      } else {
        setShowCustomDate(false);
      }
    } else if (key === 'propertyType') {
      setPropertyType(value);
    } else if (key === 'region') {
      setRegion(value);
    }

    onFiltersChange?.(newFilters);
  };

  const handleRefresh = () => {
    onFiltersChange?.({ timeRange, propertyType, region, refresh: Date.now() });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (propertyType !== 'all') count++;
    if (region !== 'all') count++;
    if (timeRange !== 'last30days') count++;
    return count;
  };

  const formatDateRange = (dateRange: {from?: Date; to?: Date}) => {
    if (!dateRange.from) return "Pick a date range";
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };

    if (dateRange.to) {
      return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
    }
    return formatDate(dateRange.from);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <Select value={timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Property Type</label>
            <Select value={propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select value={region} onValueChange={(value) => handleFilterChange('region', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((reg) => (
                  <SelectItem key={reg.value} value={reg.value}>
                    {reg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {showCustomDate && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDateRange(dateRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Export and Scheduling */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Export Data:</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport?.('pdf')}
              className="gap-1"
            >
              <FileText className="h-3 w-3" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport?.('excel')}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport?.('csv')}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              CSV
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onScheduleReport}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}