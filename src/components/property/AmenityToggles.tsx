import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { 
  Wifi, 
  Car, 
  Waves, 
  Dumbbell, 
  TreePine, 
  Utensils,
  Shirt,
  AirVent,
  Shield,
  Zap,
  Flame,
  Snowflake
} from "lucide-react";

interface Amenity {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'essential' | 'lifestyle' | 'safety';
  enabled: boolean;
}

interface AmenityTogglesProps {
  amenities: Amenity[];
  onAmenityChange: (amenityId: string, enabled: boolean) => void;
}

const defaultAmenities: Amenity[] = [
  { id: 'wifi', name: 'WiFi', icon: Wifi, category: 'essential', enabled: false },
  { id: 'parking', name: 'Parking', icon: Car, category: 'essential', enabled: false },
  { id: 'pool', name: 'Swimming Pool', icon: Waves, category: 'lifestyle', enabled: false },
  { id: 'gym', name: 'Gym/Fitness', icon: Dumbbell, category: 'lifestyle', enabled: false },
  { id: 'garden', name: 'Garden/Yard', icon: TreePine, category: 'lifestyle', enabled: false },
  { id: 'kitchen', name: 'Full Kitchen', icon: Utensils, category: 'essential', enabled: false },
  { id: 'laundry', name: 'Laundry', icon: Shirt, category: 'essential', enabled: false },
  { id: 'ac', name: 'Air Conditioning', icon: AirVent, category: 'essential', enabled: false },
  { id: 'security', name: 'Security System', icon: Shield, category: 'safety', enabled: false },
  { id: 'generator', name: 'Backup Power', icon: Zap, category: 'safety', enabled: false },
  { id: 'heating', name: 'Central Heating', icon: Flame, category: 'essential', enabled: false },
  { id: 'cooling', name: 'Climate Control', icon: Snowflake, category: 'essential', enabled: false }
];

export function AmenityToggles({ amenities = defaultAmenities, onAmenityChange }: AmenityTogglesProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'lifestyle': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'safety': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'essential': return 'Essential Amenities';
      case 'lifestyle': return 'Lifestyle & Recreation';
      case 'safety': return 'Safety & Security';
      default: return 'Other';
    }
  };

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  const enabledCount = amenities.filter(a => a.enabled).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Property Amenities</CardTitle>
          <Badge variant="secondary">
            {enabledCount} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{getCategoryTitle(category)}</h4>
              <Badge variant="secondary" className={`text-xs ${getCategoryColor(category)}`}>
                {category}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryAmenities.map((amenity) => {
                const IconComponent = amenity.icon;
                return (
                  <div
                    key={amenity.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-4 w-4 ${amenity.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm ${amenity.enabled ? 'font-medium' : ''}`}>
                        {amenity.name}
                      </span>
                    </div>
                    <Switch
                      checked={amenity.enabled}
                      onCheckedChange={(checked) => onAmenityChange(amenity.id, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Summary */}
        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            {amenities.filter(a => a.enabled).map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <Badge key={amenity.id} variant="secondary" className="flex items-center gap-1">
                  <IconComponent className="h-3 w-3" />
                  {amenity.name}
                </Badge>
              );
            })}
          </div>
          {enabledCount === 0 && (
            <p className="text-sm text-muted-foreground">No amenities selected</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}