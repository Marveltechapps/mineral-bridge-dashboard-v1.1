import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { 
  Filter, 
  X, 
  MapPin, 
  Users, 
  TrendingUp,
  RefreshCw
} from "lucide-react";

interface FilterState {
  clientType: string[];
  status: string[];
  location: string[];
  engagementLevel: number[];
  budgetRange: number[];
  lastActivity: string;
  tags: string[];
}

interface ClientFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  activeFilters?: FilterState;
}

const defaultFilters: FilterState = {
  clientType: [],
  status: [],
  location: [],
  engagementLevel: [1, 5],
  budgetRange: [0, 10000],
  lastActivity: 'all',
  tags: []
};

const clientTypes = ['buyer', 'seller', 'renter'];
const statuses = ['active', 'inactive', 'potential'];
const locations = ['Downtown', 'Midtown', 'Upper East Side', 'Brooklyn', 'Queens', 'Bronx'];
const availableTags = ['High Priority', 'Quick Decision Maker', 'Referral Source', 'First Time Buyer', 'Investor', 'Relocating'];

export function ClientFilters({ onFiltersChange, activeFilters = defaultFilters }: ClientFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(activeFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const toggleArrayFilter = (category: keyof FilterState, value: string) => {
    const currentArray = filters[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [category]: newArray });
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.clientType.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.engagementLevel[0] > 1 || filters.engagementLevel[1] < 5) count++;
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) count++;
    if (filters.lastActivity !== 'all') count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <Card className="bg-[var(--bio-sage-light)]/30 border-[var(--bio-sage)]/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[var(--bio-green)]" />
            Filters
            {activeCount > 0 && (
              <Badge className="bg-[var(--bio-green)] text-white ml-2">
                {activeCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="gap-1 text-xs hover:bg-[var(--bio-earth-light)]"
              >
                <RefreshCw className="h-3 w-3" />
                Clear
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-[var(--bio-green-light)]"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Always visible filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Client Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Users className="h-3 w-3 text-[var(--bio-green)]" />
              Client Type
            </label>
            <div className="flex flex-wrap gap-1">
              {clientTypes.map((type) => {
                const isSelected = filters.clientType.includes(type);
                return (
                  <Badge
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${
                      isSelected 
                        ? 'bg-[var(--bio-green)] hover:bg-[var(--bio-green)]/90' 
                        : 'hover:bg-[var(--bio-green-light)] hover:border-[var(--bio-green)]'
                    }`}
                    onClick={() => toggleArrayFilter('clientType', type)}
                  >
                    {type}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex flex-wrap gap-1">
              {statuses.map((status) => {
                const isSelected = filters.status.includes(status);
                return (
                  <Badge
                    key={status}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${
                      isSelected 
                        ? 'bg-[var(--bio-sage)] hover:bg-[var(--bio-sage)]/90' 
                        : 'hover:bg-[var(--bio-sage-light)] hover:border-[var(--bio-sage)]'
                    }`}
                    onClick={() => toggleArrayFilter('status', status)}
                  >
                    {status}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Last Activity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Activity</label>
            <Select
              value={filters.lastActivity}
              onValueChange={(value) => updateFilters({ lastActivity: value })}
            >
              <SelectTrigger className="border-[var(--bio-sage)]/30 focus:border-[var(--bio-green)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expandable filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-[var(--bio-sage)]/20">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[var(--bio-green)]" />
                Location
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {locations.map((location) => {
                  const isSelected = filters.location.includes(location);
                  return (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleArrayFilter('location', location)}
                        className="data-[state=checked]:bg-[var(--bio-green)] data-[state=checked]:border-[var(--bio-green)]"
                      />
                      <label
                        htmlFor={`location-${location}`}
                        className="text-xs cursor-pointer"
                      >
                        {location}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Engagement Level */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-[var(--bio-green)]" />
                Engagement Level ({filters.engagementLevel[0]} - {filters.engagementLevel[1]} stars)
              </label>
              <Slider
                value={filters.engagementLevel}
                onValueChange={(value) => updateFilters({ engagementLevel: value })}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Budget Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Budget Range (${filters.budgetRange[0].toLocaleString()} - ${filters.budgetRange[1].toLocaleString()})
              </label>
              <Slider
                value={filters.budgetRange}
                onValueChange={(value) => updateFilters({ budgetRange: value })}
                max={10000}
                min={0}
                step={500}
                className="w-full"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-1">
                {availableTags.map((tag) => {
                  const isSelected = filters.tags.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer text-xs ${
                        isSelected 
                          ? 'bg-[var(--bio-earth)] hover:bg-[var(--bio-earth)]/90' 
                          : 'hover:bg-[var(--bio-earth-light)] hover:border-[var(--bio-earth)]'
                      }`}
                      onClick={() => toggleArrayFilter('tags', tag)}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active filters summary */}
        {activeCount > 0 && (
          <div className="pt-3 border-t border-[var(--bio-sage)]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {activeCount} filter{activeCount !== 1 ? 's' : ''} applied
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="gap-1 text-xs hover:bg-[var(--bio-earth-light)]"
              >
                <X className="h-3 w-3" />
                Clear all
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}