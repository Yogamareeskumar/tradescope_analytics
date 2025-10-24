import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, FileText, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const PrivacyPolicy = () => {
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
              <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
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
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Your Privacy Matters</h2>
                <p className="text-muted-foreground">
                  At TradeScope Analytics, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                </p>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Information We Collect
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-medium mb-3">Personal Information</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>• Name and email address</li>
                <li>• Account credentials and authentication data</li>
                <li>• Profile information and preferences</li>
                <li>• Communication history and support requests</li>
              </ul>
              
              <h3 className="font-medium mb-3">Trading Data</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>• Trading performance metrics and analytics</li>
                <li>• Portfolio information and positions</li>
                <li>• Transaction history and trade records</li>
                <li>• Risk management settings and preferences</li>
              </ul>

              <h3 className="font-medium mb-3">Technical Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• IP address and device information</li>
                <li>• Browser type and operating system</li>
                <li>• Usage patterns and application interactions</li>
                <li>• Performance and error logs</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              How We Use Your Information
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Service Provision</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Provide trading analytics and insights</li>
                    <li>• Maintain and improve platform functionality</li>
                    <li>• Process transactions and manage accounts</li>
                    <li>• Deliver customer support services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Communication</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Send important account notifications</li>
                    <li>• Provide platform updates and announcements</li>
                    <li>• Respond to support requests</li>
                    <li>• Share relevant trading insights (with consent)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Data Protection & Security
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Encryption</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Access Control</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    We implement strict access controls and authentication mechanisms to protect your data.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Regular Audits</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Our security practices are regularly audited and updated to meet industry standards.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Data Access & Control</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Request access to your personal data</li>
                    <li>• Update or correct your information</li>
                    <li>• Delete your account and associated data</li>
                    <li>• Export your data in a portable format</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Communication Preferences</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Opt-out of marketing communications</li>
                    <li>• Manage notification preferences</li>
                    <li>• Control data sharing settings</li>
                    <li>• Withdraw consent where applicable</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Data Retention
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Account Information</span>
                  <span className="text-muted-foreground">Until account deletion</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Trading Data</span>
                  <span className="text-muted-foreground">7 years (regulatory requirement)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Support Communications</span>
                  <span className="text-muted-foreground">3 years</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Analytics & Logs</span>
                  <span className="text-muted-foreground">1 year</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Us
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">privacy@tradescope.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Data Protection Officer</p>
                    <p className="text-sm text-muted-foreground">dpo@tradescope.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Policy Updates</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              We may update this Privacy Policy from time to time. We will notify you of any material changes via email or platform notification at least 30 days before the changes take effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;