import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, Scale, DollarSign, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
              <p className="text-muted-foreground mt-1">Last updated: {new Date()?.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          
          {/* Introduction */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-primary mt-1" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using TradeScope Analytics, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                </p>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Service Description
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                TradeScope Analytics provides trading analytics, portfolio management, and performance tracking services. Our platform includes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Core Features</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Trade tracking and analysis</li>
                    <li>• Portfolio performance metrics</li>
                    <li>• Risk management tools</li>
                    <li>• Market data and insights</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Advanced Analytics</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Strategy backtesting</li>
                    <li>• Performance benchmarking</li>
                    <li>• Custom reporting</li>
                    <li>• Data visualization</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              User Responsibilities
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Account Security</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Maintain the confidentiality of your account credentials</li>
                    <li>• Notify us immediately of any unauthorized access</li>
                    <li>• Use strong passwords and enable two-factor authentication</li>
                    <li>• Keep your contact information up to date</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Acceptable Use</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Use the service only for lawful purposes</li>
                    <li>• Provide accurate and complete information</li>
                    <li>• Respect other users and their privacy</li>
                    <li>• Comply with all applicable financial regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Prohibited Activities
            </h2>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-800 dark:text-red-300 mb-4 font-medium">
                The following activities are strictly prohibited:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-3">Technical Violations</h3>
                  <ul className="space-y-2 text-red-700 dark:text-red-400 text-sm">
                    <li>• Attempting to hack or breach security</li>
                    <li>• Reverse engineering or decompiling</li>
                    <li>• Introducing malware or viruses</li>
                    <li>• Automated data scraping or harvesting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-3">Content Violations</h3>
                  <ul className="space-y-2 text-red-700 dark:text-red-400 text-sm">
                    <li>• Sharing false or misleading information</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Harassment or abusive behavior</li>
                    <li>• Market manipulation or insider trading</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Disclaimers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Financial Disclaimers
            </h2>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Not Financial Advice</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    TradeScope Analytics provides tools and analytics for informational purposes only. We do not provide investment advice, and our services should not be considered as recommendations to buy or sell securities.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Risk Warning</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Trading and investing involve substantial risk of loss. Past performance does not guarantee future results. You should carefully consider your financial situation and consult with qualified professionals before making investment decisions.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Data Accuracy</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of all data. Users should verify information independently.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, TradeScope Analytics and its affiliates shall not be liable for:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium mb-1">Direct Damages</h4>
                  <p className="text-sm text-muted-foreground">Any direct financial losses resulting from use of our services</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium mb-1">Indirect Damages</h4>
                  <p className="text-sm text-muted-foreground">Consequential, incidental, or punitive damages</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium mb-1">Service Interruptions</h4>
                  <p className="text-sm text-muted-foreground">Damages resulting from service downtime or technical issues</p>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription and Billing */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Subscription and Billing
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Subscription Terms</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Subscriptions auto-renew unless canceled</li>
                    <li>• Changes to pricing with 30-day notice</li>
                    <li>• Pro-rated refunds for early cancellation</li>
                    <li>• Access continues until end of billing period</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Payment Terms</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Payment due at start of billing period</li>
                    <li>• Failed payments may suspend service</li>
                    <li>• All fees are non-refundable unless required by law</li>
                    <li>• Taxes are additional where applicable</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Termination</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">By You</h3>
                  <p className="text-muted-foreground text-sm">
                    You may terminate your account at any time through your account settings or by contacting support. Your data will be deleted according to our Privacy Policy.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">By Us</h3>
                  <p className="text-muted-foreground text-sm">
                    We may terminate or suspend your account immediately if you violate these terms, engage in prohibited activities, or for other legitimate business reasons.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Effect of Termination</h3>
                  <p className="text-muted-foreground text-sm">
                    Upon termination, your right to use the service ceases immediately. Data may be retained for legal and regulatory compliance purposes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <p className="text-blue-800 dark:text-blue-300 mb-3 font-medium">
                We reserve the right to modify these Terms of Service at any time.
              </p>
              <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
                <li>• Material changes will be communicated with 30 days notice</li>
                <li>• Continued use constitutes acceptance of new terms</li>
                <li>• Previous versions will be archived and available upon request</li>
                <li>• You may terminate your account if you disagree with changes</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Legal Department</p>
                    <p className="text-sm text-muted-foreground">legal@tradescope.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Compliance</p>
                    <p className="text-sm text-muted-foreground">compliance@tradescope.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="font-medium mb-2">Governing Law</h3>
            <p className="text-sm text-muted-foreground">
              These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes will be resolved through binding arbitration or in courts of competent jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;