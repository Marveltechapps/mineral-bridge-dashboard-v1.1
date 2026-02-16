import { HelpCircle, FileText, ExternalLink, MessageSquare, ShieldCheck, DollarSign, Gem } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQ_ITEMS = [
  {
    q: "How do I release a payment for a transaction?",
    a: "Go to Financial & Reporting → Transactions, open the transaction, and follow the 6-step flow (Send QR → Call Buyer → Reserve Escrow → Testing → LC Issued → Release Payment). Complete the Release step to mark the payment as released.",
  },
  {
    q: "Where can I see all activity and audit trail?",
    a: "Use the Audit & Activity Log from the sidebar (under Settings) or from the dashboard. It shows app and dashboard actions with links to related orders, transactions, and users.",
  },
  {
    q: "How do I change my admin profile or password?",
    a: "Click your avatar in the header → My Account. There you can update your name, email, and password. Changes are saved to the admin registry and persist across sessions.",
  },
  {
    q: "How do I filter financial data by date?",
    a: "On the Financial & Reporting page, use the Date range dropdown (e.g. Jan 2026, Feb 2026, YTD 2026). Metrics and transaction lists are filtered by the selected range.",
  },
  {
    q: "Can I export transactions in bulk?",
    a: "Yes. On the Transactions page (Financial & Reporting → Transactions), select rows using the checkboxes, then use Bulk export (CSV) to download the selected transactions.",
  },
  {
    q: "How do I send an email or SMS to a user?",
    a: "From Enquiry & Support, open an enquiry and use the reply or send options. From User Management you can trigger email/SMS where the UI offers it. These actions are logged in the Audit log.",
  },
];

export function HelpPage() {
  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="h-7 w-7 text-[#A855F7]" />
          Help & Documentation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          FAQ and quick links. Use the sidebar to jump between Orders, Transactions, Users, and Enquiries.
        </p>
      </div>

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Frequently asked questions
          </CardTitle>
          <CardDescription>Common tasks and where to find them</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Quick links</CardTitle>
          <CardDescription>Related sections that work together</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-[#A855F7]" />
              <span>Buy Management & Sell Management — list and manage minerals and sell submissions.</span>
            </li>
            <li className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>Orders & Settlements and Financial & Reporting — orders, transactions, 6-step flow, revenue, and PDF export.</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span>Enquiry & Support — replies and email/SMS actions are linked to users and logged in Audit log.</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>Compliance & Verification and User Management — KYC, verification, and user status.</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            For full API and integration docs, refer to your deployment or internal documentation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
