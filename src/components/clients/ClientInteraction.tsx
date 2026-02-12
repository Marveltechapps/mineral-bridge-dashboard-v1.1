import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  Users, 
  UserCheck, 
  Building, 
  Search, 
  Plus,
  MessageSquare,
  Filter,
  Grid,
  List,
  ArrowLeftRight
} from "lucide-react";

import { InquiryCard } from "./InquiryCard";
import { ChatInterface } from "./ChatInterface";
import { ProfileView } from "./ProfileView";
import { ActivityTimeline } from "./ActivityTimeline";
import { ClientFilters } from "./ClientFilters";
import { BuyersTable } from "./BuyersTable";
import { SellersTable } from "./SellersTable";
import { ExchangeTable } from "./ExchangeTable";

// Mock data for buyers
const mockBuyerEnquiries = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    property: {
      title: 'Modern Downtown Apartment',
      location: 'Downtown, NY',
      price: '$2,500/month',
      type: 'Apartment'
    },
    message: 'Hi! I\'m interested in this apartment. Can we schedule a viewing this weekend? I\'m looking for immediate move-in availability.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'new' as const,
    priority: 'high' as const,
    engagementLevel: 4,
    budget: '$2,000-$3,000/mo',
    preferredContactMethod: 'phone' as const
  },
  {
    id: '3',
    clientName: 'Emma Rodriguez',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    phone: '+1 (555) 234-5678',
    email: 'emma.rodriguez@email.com',
    property: {
      title: 'Cozy Studio Loft',
      location: 'Arts District, NY',
      price: '$1,800/month',
      type: 'Studio'
    },
    message: 'Is this studio still available? I\'d like to know more about the building amenities and parking options.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: 'contacted' as const,
    priority: 'medium' as const,
    engagementLevel: 3,
    budget: '$1,500-$2,000/mo',
    preferredContactMethod: 'email' as const
  },
  {
    id: '4',
    clientName: 'James Wilson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    phone: '+1 (555) 345-6789',
    email: 'james.wilson@email.com',
    property: {
      title: 'Luxury Penthouse Suite',
      location: 'Upper East Side, NY',
      price: '$5,200/month',
      type: 'Penthouse'
    },
    message: 'I\'m relocating for work and need a high-end apartment. This penthouse looks perfect. When can I view it?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'scheduled' as const,
    priority: 'high' as const,
    engagementLevel: 5,
    budget: '$5,000-$6,000/mo',
    preferredContactMethod: 'phone' as const
  },
  {
    id: '5',
    clientName: 'Lisa Anderson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    phone: '+1 (555) 456-7890',
    email: 'lisa.anderson@email.com',
    property: {
      title: 'Garden View Townhouse',
      location: 'Brooklyn Heights, NY',
      price: '$3,800/month',
      type: 'Townhouse'
    },
    message: 'Looking for a family-friendly property with outdoor space. Does this townhouse have a backyard?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'contacted' as const,
    priority: 'medium' as const,
    engagementLevel: 4,
    budget: '$3,500-$4,500/mo',
    preferredContactMethod: 'message' as const
  },
  {
    id: '6',
    clientName: 'Robert Kim',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    phone: '+1 (555) 567-8901',
    email: 'robert.kim@email.com',
    property: {
      title: 'Riverside Loft with Terrace',
      location: 'West Village, NY',
      price: '$4,200/month',
      type: 'Loft'
    },
    message: 'I love the industrial style! Is the terrace private? Also interested in lease terms.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'new' as const,
    priority: 'low' as const,
    engagementLevel: 3,
    budget: '$4,000-$5,000/mo',
    preferredContactMethod: 'email' as const
  },
  {
    id: '7',
    clientName: 'Michelle Turner',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michelle',
    phone: '+1 (555) 678-9012',
    email: 'michelle.turner@email.com',
    property: {
      title: 'Beachfront Condo',
      location: 'Miami Beach, FL',
      price: '$3,200/month',
      type: 'Condo'
    },
    message: 'Planning to move to Miami next month. Can you provide more photos of the ocean view?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    status: 'scheduled' as const,
    priority: 'high' as const,
    engagementLevel: 5,
    budget: '$3,000-$4,000/mo',
    preferredContactMethod: 'phone' as const
  },
  {
    id: '8',
    clientName: 'David Martinez',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    phone: '+1 (555) 789-0123',
    email: 'david.martinez@email.com',
    property: {
      title: 'Historic Brownstone Apartment',
      location: 'Park Slope, Brooklyn',
      price: '$2,900/month',
      type: 'Apartment'
    },
    message: 'I appreciate classic architecture. Does this unit have original hardwood floors?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'closed' as const,
    priority: 'low' as const,
    engagementLevel: 2,
    budget: '$2,500-$3,500/mo',
    preferredContactMethod: 'email' as const
  }
];

// Mock data for sellers
const mockSellerListings = [
  {
    id: 's1',
    sellerName: 'Michael Chen',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    phone: '+1 (555) 111-2222',
    email: 'michael.chen@email.com',
    property: {
      title: 'Luxury Family Villa with Pool',
      location: 'Beverly Hills, CA',
      askingPrice: '$2,450,000',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      sqft: '4,200 sqft',
      yearBuilt: 2015,
      description: 'Stunning modern villa with panoramic city views, infinity pool, and smart home features throughout.'
    },
    message: 'Looking to sell my family home. We\'ve maintained it meticulously and recently upgraded the kitchen and bathrooms.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'new' as const,
    priority: 'high' as const,
    reasonForSelling: 'Relocating for work to the East Coast',
    expectedTimeline: '3-6 months'
  },
  {
    id: 's2',
    sellerName: 'Jennifer Martinez',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer',
    phone: '+1 (555) 222-3333',
    email: 'jennifer.martinez@email.com',
    property: {
      title: 'Downtown Penthouse Apartment',
      location: 'Manhattan, NY',
      askingPrice: '$1,850,000',
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      sqft: '2,100 sqft',
      yearBuilt: 2018,
      description: 'Corner unit penthouse with floor-to-ceiling windows, private terrace, and building concierge.'
    },
    message: 'Premium penthouse in prime location. Great investment opportunity or luxury living space.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'reviewing' as const,
    priority: 'high' as const,
    reasonForSelling: 'Upgrading to larger property',
    expectedTimeline: 'Flexible'
  },
  {
    id: 's3',
    sellerName: 'Robert Thompson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    phone: '+1 (555) 333-4444',
    email: 'robert.thompson@email.com',
    property: {
      title: 'Commercial Office Building',
      location: 'Austin, TX',
      askingPrice: '$3,200,000',
      type: 'Commercial',
      sqft: '12,500 sqft',
      yearBuilt: 2010,
      description: 'Prime commercial property in tech district. Currently leased to multiple tenants with strong cash flow.'
    },
    message: 'Investment property with excellent ROI. All major systems recently updated.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: 'listed' as const,
    priority: 'medium' as const,
    reasonForSelling: 'Portfolio diversification',
    expectedTimeline: '6-12 months'
  },
  {
    id: 's4',
    sellerName: 'Amanda Lee',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda',
    phone: '+1 (555) 444-5555',
    email: 'amanda.lee@email.com',
    property: {
      title: 'Beachfront Vacation Home',
      location: 'Malibu, CA',
      askingPrice: '$4,750,000',
      type: 'Residential',
      bedrooms: 4,
      bathrooms: 3,
      sqft: '3,400 sqft',
      yearBuilt: 2012,
      description: 'Direct beach access with stunning ocean views from every room. Private deck and outdoor entertaining area.'
    },
    message: 'Rare beachfront opportunity. Perfect for vacation rental or primary residence.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
    status: 'under-negotiation' as const,
    priority: 'high' as const,
    reasonForSelling: 'Multiple property ownership',
    expectedTimeline: 'ASAP'
  },
  {
    id: 's5',
    sellerName: 'Steven Park',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=steven',
    phone: '+1 (555) 555-6666',
    email: 'steven.park@email.com',
    property: {
      title: 'Industrial Warehouse Complex',
      location: 'Phoenix, AZ',
      askingPrice: '$1,950,000',
      type: 'Warehouse',
      sqft: '25,000 sqft',
      yearBuilt: 2008,
      description: 'Large warehouse with modern loading docks, high ceilings, and ample parking. Zoned for multiple uses.'
    },
    message: 'Well-maintained warehouse facility in growing industrial area. Great for distribution or manufacturing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
    status: 'listed' as const,
    priority: 'medium' as const,
    reasonForSelling: 'Retiring from business',
    expectedTimeline: '3-6 months'
  },
  {
    id: 's6',
    sellerName: 'Patricia Davis',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia',
    phone: '+1 (555) 666-7777',
    email: 'patricia.davis@email.com',
    property: {
      title: 'Suburban Family Home',
      location: 'Portland, OR',
      askingPrice: '$725,000',
      type: 'Residential',
      bedrooms: 4,
      bathrooms: 2,
      sqft: '2,800 sqft',
      yearBuilt: 2005,
      description: 'Charming home in family-friendly neighborhood. Large backyard, updated kitchen, and excellent schools nearby.'
    },
    message: 'Perfect family home with lots of character. Well-loved and maintained over the years.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'new' as const,
    priority: 'low' as const,
    reasonForSelling: 'Downsizing after children moved out',
    expectedTimeline: '6-9 months'
  },
  {
    id: 's7',
    sellerName: 'Carlos Rodriguez',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    phone: '+1 (555) 777-8888',
    email: 'carlos.rodriguez@email.com',
    property: {
      title: 'Mountain View Plot',
      location: 'Denver, CO',
      askingPrice: '$425,000',
      type: 'Plot',
      sqft: '1.5 acres',
      description: 'Prime building lot with breathtaking mountain views. All utilities available at street. Perfect for custom dream home.'
    },
    message: 'Beautiful land with approved building permits. Ready for development.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
    status: 'reviewing' as const,
    priority: 'medium' as const,
    reasonForSelling: 'Changed development plans',
    expectedTimeline: 'Flexible'
  },
  {
    id: 's8',
    sellerName: 'Rebecca White',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rebecca',
    phone: '+1 (555) 888-9999',
    email: 'rebecca.white@email.com',
    property: {
      title: 'Historic Downtown Building',
      location: 'Charleston, SC',
      askingPrice: '$1,450,000',
      type: 'Commercial',
      sqft: '8,500 sqft',
      yearBuilt: 1895,
      description: 'Beautifully restored historic building in prime downtown location. Mixed-use zoning allows retail and residential.'
    },
    message: 'Incredible investment opportunity in historic district. Building has been completely renovated while maintaining original charm.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    status: 'listed' as const,
    priority: 'high' as const,
    reasonForSelling: 'Pursuing other ventures',
    expectedTimeline: '3-6 months'
  }
];

// Mock data for exchange requests
const mockExchangeRequests = [
  {
    id: 'e1',
    clientName: 'David Martinez',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=davidm',
    phone: '+1 (555) 121-2121',
    email: 'david.martinez@email.com',
    offeringProperty: {
      title: 'Downtown Loft Apartment',
      location: 'SoHo, Manhattan, NY',
      type: 'Apartment',
      estimatedValue: '$1,200,000',
      bedrooms: 2,
      bathrooms: 2,
      sqft: '1,800 sqft',
      description: 'Modern industrial loft with exposed brick, high ceilings, and large windows. Prime downtown location.'
    },
    seekingProperty: {
      preferredType: 'Villa or House',
      preferredLocation: 'Westchester County, NY',
      budgetRange: '$1,200,000 - $1,500,000',
      requirements: 'Looking for 3-4 bedroom house with yard for growing family. Good school district essential.'
    },
    message: 'We love city living but need more space with a baby on the way. Willing to exchange our loft for a family home in the suburbs.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    status: 'new' as const,
    priority: 'high' as const,
    exchangeReason: 'Growing family needs more space',
    flexibility: 'Flexible on timing'
  },
  {
    id: 'e2',
    clientName: 'Sophia Anderson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
    phone: '+1 (555) 232-3232',
    email: 'sophia.anderson@email.com',
    offeringProperty: {
      title: 'Suburban Family Villa',
      location: 'Naperville, IL',
      type: 'Villa',
      estimatedValue: '$850,000',
      bedrooms: 4,
      bathrooms: 3,
      sqft: '3,200 sqft',
      description: 'Spacious family home with finished basement, large backyard, and attached garage. Excellent schools nearby.'
    },
    seekingProperty: {
      preferredType: 'Penthouse or Luxury Apartment',
      preferredLocation: 'Downtown Chicago, IL',
      budgetRange: '$800,000 - $1,000,000',
      requirements: 'Looking for upscale downtown living. 2-3 bedrooms, building amenities, city views preferred.'
    },
    message: 'Empty nesters looking to downsize and enjoy urban lifestyle. Our home is perfect for a family.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'reviewing' as const,
    priority: 'medium' as const,
    exchangeReason: 'Downsizing after children moved out',
    flexibility: 'Prefer 3-6 months'
  },
  {
    id: 'e3',
    clientName: 'Marcus Johnson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    phone: '+1 (555) 343-4343',
    email: 'marcus.johnson@email.com',
    offeringProperty: {
      title: 'Beachfront Condo',
      location: 'Santa Monica, CA',
      type: 'Residential',
      estimatedValue: '$2,100,000',
      bedrooms: 3,
      bathrooms: 2,
      sqft: '2,000 sqft',
      description: 'Ocean view condo with private balcony, modern finishes, and resort-style amenities. Walk to beach.'
    },
    seekingProperty: {
      preferredType: 'Mountain Cabin or Rural Property',
      preferredLocation: 'Aspen or Lake Tahoe area',
      budgetRange: '$1,800,000 - $2,200,000',
      requirements: 'Seeking peaceful mountain retreat with scenic views. 3+ bedrooms, ski-in/ski-out access a plus.'
    },
    message: 'Looking to trade coastal living for mountain lifestyle. Health reasons and lifestyle change.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'matched' as const,
    priority: 'high' as const,
    exchangeReason: 'Lifestyle change and health considerations',
    flexibility: 'Ready immediately'
  },
  {
    id: 'e4',
    clientName: 'Elena Rodriguez',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    phone: '+1 (555) 454-5454',
    email: 'elena.rodriguez@email.com',
    offeringProperty: {
      title: 'Commercial Office Space',
      location: 'Financial District, SF',
      type: 'Commercial',
      estimatedValue: '$1,750,000',
      sqft: '5,000 sqft',
      description: 'Prime commercial space in high-rise building. Recently renovated with modern amenities and tech infrastructure.'
    },
    seekingProperty: {
      preferredType: 'Retail Space or Mixed-Use Building',
      preferredLocation: 'Union Square or SoMa, SF',
      budgetRange: '$1,600,000 - $2,000,000',
      requirements: 'Looking for ground-floor retail with foot traffic. Mixed-use with residential units above preferred.'
    },
    message: 'Pivoting business model from office to retail. Seeking high-traffic location for new concept store.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'negotiating' as const,
    priority: 'high' as const,
    exchangeReason: 'Business model change',
    flexibility: 'Within 6 months'
  },
  {
    id: 'e5',
    clientName: 'Thomas Wright',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
    phone: '+1 (555) 565-6565',
    email: 'thomas.wright@email.com',
    offeringProperty: {
      title: 'Rural Farmhouse with Land',
      location: 'Napa Valley, CA',
      type: 'Residential',
      estimatedValue: '$2,800,000',
      bedrooms: 5,
      bathrooms: 4,
      sqft: '4,500 sqft',
      description: 'Historic farmhouse on 10 acres with vineyard potential. Main house plus guest cottage and barn.'
    },
    seekingProperty: {
      preferredType: 'Urban Townhouse or Condo',
      preferredLocation: 'San Francisco or Oakland',
      budgetRange: '$2,500,000 - $3,000,000',
      requirements: 'Seeking low-maintenance urban property. 3-4 bedrooms, walkable neighborhood, modern amenities.'
    },
    message: 'Retiring from farming, want to be closer to family in the city. Property has incredible potential.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
    status: 'reviewing' as const,
    priority: 'medium' as const,
    exchangeReason: 'Retirement and proximity to family',
    flexibility: 'Flexible timing'
  },
  {
    id: 'e6',
    clientName: 'Nina Patel',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
    phone: '+1 (555) 676-7676',
    email: 'nina.patel@email.com',
    offeringProperty: {
      title: 'Historic Brownstone',
      location: 'Brooklyn Heights, NY',
      type: 'Residential',
      estimatedValue: '$3,500,000',
      bedrooms: 4,
      bathrooms: 3,
      sqft: '3,800 sqft',
      description: 'Beautifully restored 19th-century brownstone with original details, modern updates, and private garden.'
    },
    seekingProperty: {
      preferredType: 'Modern Waterfront Property',
      preferredLocation: 'Miami or Fort Lauderdale, FL',
      budgetRange: '$3,200,000 - $3,800,000',
      requirements: 'Seeking contemporary waterfront home with dock. 3-4 bedrooms, open floor plan, hurricane-resistant construction.'
    },
    message: 'Relocating to Florida for warmer climate. Our brownstone is meticulously maintained with high-end finishes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28),
    status: 'new' as const,
    priority: 'low' as const,
    exchangeReason: 'Climate and lifestyle preference',
    flexibility: '9-12 months'
  },
  {
    id: 'e7',
    clientName: 'Carlos Mendoza',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlosm',
    phone: '+1 (555) 787-8787',
    email: 'carlos.mendoza@email.com',
    offeringProperty: {
      title: 'Warehouse Conversion Loft',
      location: 'Arts District, LA',
      type: 'Apartment',
      estimatedValue: '$950,000',
      bedrooms: 2,
      bathrooms: 2,
      sqft: '2,400 sqft',
      description: 'Unique warehouse conversion with soaring ceilings, artist studio space, and industrial chic design.'
    },
    seekingProperty: {
      preferredType: 'Traditional House',
      preferredLocation: 'Pasadena or Glendale, CA',
      budgetRange: '$900,000 - $1,100,000',
      requirements: 'Looking for traditional single-family home with yard. 3 bedrooms minimum, garage, quiet neighborhood.'
    },
    message: 'Artist lifestyle changing as we start a family. Need more conventional space with outdoor area.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    status: 'matched' as const,
    priority: 'medium' as const,
    exchangeReason: 'Family expansion',
    flexibility: 'ASAP preferred'
  },
  {
    id: 'e8',
    clientName: 'Rachel Kim',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachelk',
    phone: '+1 (555) 898-9898',
    email: 'rachel.kim@email.com',
    offeringProperty: {
      title: 'Luxury Ski Chalet',
      location: 'Park City, UT',
      type: 'Villa',
      estimatedValue: '$2,650,000',
      bedrooms: 5,
      bathrooms: 4,
      sqft: '4,200 sqft',
      description: 'Stunning mountain retreat with ski-in/ski-out access, hot tub, home theater, and panoramic mountain views.'
    },
    seekingProperty: {
      preferredType: 'Golf Course Property',
      preferredLocation: 'Scottsdale or Palm Springs',
      budgetRange: '$2,400,000 - $2,800,000',
      requirements: 'Seeking warm-weather golf community home. 4+ bedrooms, golf course views, resort amenities.'
    },
    message: 'Shifting from winter sports to golf. Our chalet is turnkey with rental history.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'completed' as const,
    priority: 'low' as const,
    exchangeReason: 'Recreation preference change',
    flexibility: 'Completed exchange'
  }
];

// Mock data for other inquiry types
const mockInquiries = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    clientType: 'buyer' as const,
    status: 'new' as const,
    priority: 'high' as const,
    property: {
      title: 'Modern Downtown Apartment',
      location: 'Downtown, NY',
      price: '$2,500/month',
      type: 'Apartment'
    },
    message: 'Hi! I\'m interested in this apartment. Can we schedule a viewing this weekend?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    engagementLevel: 4,
    lastActivity: 'Sent message',
    unreadCount: 2
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    clientType: 'seller' as const,
    status: 'in-progress' as const,
    priority: 'medium' as const,
    property: {
      title: 'Family Villa with Garden',
      location: 'Suburb, NY',
      price: '$850,000',
      type: 'House'
    },
    message: 'Looking to sell my property. What\'s the current market rate for similar homes?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    engagementLevel: 5,
    lastActivity: 'Scheduled call'
  },
  {
    id: '3',
    clientName: 'Emma Rodriguez',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    clientType: 'buyer' as const,
    status: 'pending' as const,
    priority: 'low' as const,
    property: {
      title: 'Cozy Studio Loft',
      location: 'Arts District, NY',
      price: '$1,800/month',
      type: 'Studio'
    },
    message: 'Is this studio still available? I\'d like to know more about the building amenities.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    engagementLevel: 3,
    lastActivity: 'Viewed profile'
  },
  {
    id: '4',
    clientName: 'David Martinez',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    clientType: 'exchange' as const,
    status: 'new' as const,
    priority: 'high' as const,
    property: {
      title: 'Suburban Villa',
      location: 'Westside, NY',
      price: '$950,000',
      type: 'Villa'
    },
    message: 'Interested in exchanging my suburban villa for a downtown apartment. Open to discuss options.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    engagementLevel: 5,
    lastActivity: 'Requested exchange valuation',
    unreadCount: 1
  },
  {
    id: '5',
    clientName: 'Olivia Thompson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
    clientType: 'exchange' as const,
    status: 'in-progress' as const,
    priority: 'medium' as const,
    property: {
      title: 'Commercial Space',
      location: 'Business District, NY',
      price: '$1,200,000',
      type: 'Commercial'
    },
    message: 'Looking to exchange commercial property for residential. Need guidance on the process.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    engagementLevel: 4,
    lastActivity: 'Scheduled meeting'
  }
];

export function ClientInteraction() {
  const [activeTab, setActiveTab] = useState('buyers');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getTabData = (tab: string) => {
    switch (tab) {
      case 'buyers':
        return {
          inquiries: mockInquiries.filter(i => i.clientType === 'buyer'),
          icon: UserCheck,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'sellers':
        return {
          inquiries: mockInquiries.filter(i => i.clientType === 'seller'),
          icon: Building,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'exchange':
        return {
          inquiries: mockInquiries.filter(i => i.clientType === 'exchange'),
          icon: ArrowLeftRight,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        };
      case 'agents':
        return {
          inquiries: [], // Would contain agent-specific data
          icon: Users,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      default:
        return {
          inquiries: mockInquiries,
          icon: Users,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const handleReply = (inquiryId: string) => {
    setSelectedClient(inquiryId);
    // Switch to chat view logic here
  };

  const tabData = getTabData(activeTab);
  const TabIcon = tabData.icon;

  const filteredInquiries = tabData.inquiries.filter(inquiry =>
    inquiry.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1>Client Interactions</h1>
          <p className="text-muted-foreground">
            Manage inquiries, chat with clients, and track engagement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>



      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:grid-cols-4 mb-6 h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="buyers" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <UserCheck className="h-4 w-4" />
            Buyers
            <Badge className="ml-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {mockBuyerEnquiries.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sellers" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Building className="h-4 w-4" />
            Sellers
            <Badge className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {mockSellerListings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="exchange" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <ArrowLeftRight className="h-4 w-4" />
            Exchange
            <Badge className="ml-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
              {mockExchangeRequests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Users className="h-4 w-4" />
            Agents
            <Badge className="ml-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              0
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {activeTab === 'buyers' ? (
            // Show BuyersTable for buyers tab
            <BuyersTable enquiries={mockBuyerEnquiries} />
          ) : activeTab === 'sellers' ? (
            // Show SellersTable for sellers tab
            <SellersTable listings={mockSellerListings} />
          ) : activeTab === 'exchange' ? (
            // Show ExchangeTable for exchange tab
            <ExchangeTable requests={mockExchangeRequests} />
          ) : selectedClient ? (
            // Show detailed view when client is selected
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChatInterface />
                </div>
                <div className="space-y-6">
                  <ActivityTimeline />
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedClient(null)}
                    className="w-full"
                  >
                    Back to List
                  </Button>
                </div>
              </div>
              <ProfileView />
            </div>
          ) : (
            // Show inquiry cards
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${tabData.bgColor}`}>
                    <TabIcon className={`h-5 w-5 ${tabData.color}`} />
                  </div>
                  <div>
                    <h3 className="capitalize">{activeTab} Inquiries</h3>
                    <p className="text-muted-foreground">
                      {filteredInquiries.length} active conversations
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2 hover:bg-[var(--bio-green-light)]">
                  <MessageSquare className="h-4 w-4" />
                  Start Chat
                </Button>
              </div>

              {filteredInquiries.length === 0 ? (
                <Card className="p-8 text-center">
                  <TabIcon className={`h-12 w-12 mx-auto mb-4 ${tabData.color}`} />
                  <h3 className="mb-2">No {activeTab} inquiries</h3>
                  <p className="text-muted-foreground">
                    New inquiries will appear here when clients reach out.
                  </p>
                </Card>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredInquiries.map((inquiry) => (
                    <InquiryCard
                      key={inquiry.id}
                      inquiry={inquiry}
                      onReply={handleReply}
                      onCall={(id) => console.log('Call client:', id)}
                      onEmail={(id) => console.log('Email client:', id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
