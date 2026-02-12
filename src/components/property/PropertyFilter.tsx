import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Filter, X, RotateCcw, ChevronDown } from "lucide-react";

export interface PropertyFilters {
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  status: string;
  minSqft: number;
  maxSqft: number;
}

interface PropertyFilterProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  activeFilterCount: number;
}

export function PropertyFilter({ filters, onFiltersChange, activeFilterCount }: PropertyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof PropertyFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    const defaultFilters: PropertyFilters = {
      location: "",
      propertyType: "",
      minPrice: 0,
      maxPrice: 2000000,
      bedrooms: "",
      bathrooms: "",
      status: "",
      minSqft: 0,
      maxSqft: 10000
    };
    onFiltersChange(defaultFilters);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 relative ${activeFilterCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600 text-white">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute top-full left-0 right-0 z-50 mt-2">
        <Card className="fixed top-0 right-0 w-96 shadow-lg px-[12px] py-[0px] z-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filter Properties</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Enter city, state, or ZIP"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label>Property Type</Label>
              <div className="relative">
                <select 
                  value={filters.propertyType} 
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-md text-sm"
                >
                  <option value="">All types</option>
                  <option value="plot">Plot</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="apartment">Apartment</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label>Price Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice === 2000000 ? '' : filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 2000000)}
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <select 
                  value={filters.bedrooms} 
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-md text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <select 
                  value={filters.bathrooms} 
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-md text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="1.5">1.5+</option>
                  <option value="2">2+</option>
                  <option value="2.5">2.5+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-input-background rounded-md text-sm"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="archived">Archived</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Square Footage */}
            <div className="space-y-3">
              <Label>Square Footage</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min sqft"
                  value={filters.minSqft || ''}
                  onChange={(e) => handleFilterChange('minSqft', parseInt(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  placeholder="Max sqft"
                  value={filters.maxSqft === 10000 ? '' : filters.maxSqft}
                  onChange={(e) => handleFilterChange('maxSqft', parseInt(e.target.value) || 10000)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setIsOpen(false)} 
                className="flex-1"
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}