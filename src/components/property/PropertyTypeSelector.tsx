import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Home, 
  Building, 
  Building2, 
  Castle, 
  Warehouse,
  LandPlot,
  Leaf
} from "lucide-react";

interface PropertyType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface PropertyTypeSelectorProps {
  selectedType: string | null;
  onTypeSelect: (typeId: string) => void;
}

const propertyTypes: PropertyType[] = [
  {
    id: 'Apartment',
    name: 'Apartment',
    icon: Building,
    description: 'Multi-story residential units'
  },
  {
    id: 'Villa',
    name: 'Villa',
    icon: Castle,
    description: 'Luxury detached residence'
  },
  {
    id: 'Organic Home',
    name: 'Organic Home',
    icon: Leaf,
    description: 'Eco-friendly sustainable home'
  },
  {
    id: 'Plot',
    name: 'Plot',
    icon: LandPlot,
    description: 'Land for development'
  },
  {
    id: 'Commercial',
    name: 'Commercial',
    icon: Building2,
    description: 'Business and retail spaces'
  }
];

export function PropertyTypeSelector({ selectedType, onTypeSelect }: PropertyTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Property Type</h3>
        {selectedType && (
          <Badge variant="secondary">
            {propertyTypes.find(t => t.id === selectedType)?.name}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {propertyTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <CardContent className="p-4 text-center">
                <IconComponent 
                  className={`h-8 w-8 mx-auto mb-2 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <h4 className={`font-medium text-sm mb-1 ${
                  isSelected ? 'text-primary' : ''
                }`}>
                  {type.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}