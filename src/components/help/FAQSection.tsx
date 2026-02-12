import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { 
  Search,
  ThumbsUp,
  ThumbsDown,
  Tag,
  TrendingUp,
  Star,
  Filter,
  MessageCircle
} from "lucide-react";

const faqCategories = [
  { id: "all", name: "All Categories", count: 45 },
  { id: "getting-started", name: "Getting Started", count: 12 },
  { id: "properties", name: "Property Management", count: 15 },
  { id: "clients", name: "Client Relations", count: 8 },
  { id: "billing", name: "Billing & Payments", count: 6 },
  { id: "security", name: "Security", count: 4 }
];

const faqData = [
  {
    id: "1",
    question: "How do I add a new property listing?",
    answer: "To add a new property listing, navigate to the Properties section from the main dashboard. Click the 'Add Property' button and fill out the required information including property details, pricing, images, and amenities. Once completed, click 'Save' to publish your listing.",
    category: "properties",
    helpful: 45,
    notHelpful: 2,
    trending: true,
    featured: true
  },
  {
    id: "2",
    question: "How can I manage client communications?",
    answer: "The Client Interaction module provides comprehensive communication tools. You can view all client messages in the centralized inbox, use the real-time chat interface for instant messaging, track communication history through activity timelines, and set up automated responses for common inquiries.",
    category: "clients",
    helpful: 38,
    notHelpful: 1,
    trending: false,
    featured: false
  },
  {
    id: "3",
    question: "What security features are available?",
    answer: "Our platform includes enterprise-grade security features such as two-factor authentication (2FA), data encryption at rest and in transit, audit logging for all user activities, IP whitelisting, session management, and GDPR compliance tools to protect your data and maintain privacy.",
    category: "security",
    helpful: 32,
    notHelpful: 0,
    trending: true,
    featured: true
  },
  {
    id: "4",
    question: "How do I set up my first dashboard?",
    answer: "After logging in, you'll be guided through the initial setup process. Start by configuring your company information in Settings, then add your first property listing, and customize your dashboard widgets to display the KPIs most important to your business. The system will automatically populate data as you add more listings.",
    category: "getting-started",
    helpful: 28,
    notHelpful: 3,
    trending: false,
    featured: false
  },
  {
    id: "5",
    question: "What payment methods are supported?",
    answer: "We support all major payment methods including credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and ACH payments. Payment processing is handled securely through our integrated payment gateways with PCI DSS compliance.",
    category: "billing",
    helpful: 25,
    notHelpful: 1,
    trending: false,
    featured: false
  },
  {
    id: "6",
    question: "How do I export my data and reports?",
    answer: "Data export is available from multiple sections of the platform. In Analytics, use the export buttons to download reports in PDF, CSV, or Excel formats. You can also schedule automated reports to be sent to your email. Property data can be exported from the Properties section, and client information from the Clients module.",
    category: "properties",
    helpful: 22,
    notHelpful: 2,
    trending: true,
    featured: false
  },
  {
    id: "7",
    question: "Can I customize user roles and permissions?",
    answer: "Yes, the Role Management system allows you to create custom roles with specific permissions. You can control access to different features, set up approval workflows, and manage user groups. The system includes pre-defined roles like Admin, Manager, Agent, and Viewer, which you can modify or use as templates.",
    category: "security",
    helpful: 19,
    notHelpful: 0,
    trending: false,
    featured: false
  },
  {
    id: "8",
    question: "How do I integrate with third-party services?",
    answer: "Integration options are available in the Settings panel under Integrations. We support popular services like Google Calendar, Microsoft 365, Slack, and various CRM systems. Each integration includes step-by-step setup instructions and can be configured with API keys or OAuth authentication.",
    category: "getting-started",
    helpful: 17,
    notHelpful: 1,
    trending: false,
    featured: false
  }
];

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredFAQs = faqData.filter(faq => faq.featured);
  const trendingFAQs = faqData.filter(faq => faq.trending);

  const handleVote = (id: string, helpful: boolean) => {
    console.log(`Voted ${helpful ? 'helpful' : 'not helpful'} for FAQ ${id}`);
    // Here you would handle the voting logic
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search FAQ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-1"
              >
                <Tag className="h-3 w-3" />
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured FAQs */}
      {selectedCategory === "all" && !searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Featured Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredFAQs.map((faq) => (
                <div key={faq.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm leading-tight">{faq.question}</h4>
                    <Badge variant="secondary" className="text-xs ml-2">Featured</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {faq.answer}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {faqCategories.find(cat => cat.id === faq.category)?.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="h-3 w-3" />
                      {faq.helpful}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending FAQs */}
      {selectedCategory === "all" && !searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Trending Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingFAQs.map((faq) => (
                <div key={faq.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{faq.question}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {faqCategories.find(cat => cat.id === faq.category)?.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {faq.helpful} found helpful
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <Badge variant="secondary" className="text-xs">Trending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {searchTerm ? `Search Results (${filteredFAQs.length})` : 
               selectedCategory === "all" ? "All Questions" : 
               faqCategories.find(cat => cat.id === selectedCategory)?.name}
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Sort
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No questions found matching your search.</p>
              <p className="text-sm">Try different keywords or browse categories.</p>
            </div>
          ) : (
            <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg mb-3 px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start justify-between w-full mr-4">
                      <div className="text-left">
                        <h4 className="font-medium">{faq.question}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {faqCategories.find(cat => cat.id === faq.category)?.name}
                          </Badge>
                          {faq.trending && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Trending
                            </Badge>
                          )}
                          {faq.featured && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(faq.id, true)}
                              className="gap-1 hover:bg-green-50 hover:text-green-600"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="text-xs">{faq.helpful}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(faq.id, false)}
                              className="gap-1 hover:bg-red-50 hover:text-red-600"
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span className="text-xs">{faq.notHelpful}</span>
                            </Button>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="text-xs">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Contact Suggestion */}
      <Card className="bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-medium mb-2">Can't find what you're looking for?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Ask the Community
            </Button>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}