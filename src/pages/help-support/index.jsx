import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const HelpSupport = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I connect my broker account?',
          answer: 'Go to Integrations page and select your broker (Zerodha, Upstox, MT5). Follow the API setup instructions provided for each platform.'
        },
        {
          question: 'How do I import my existing trades?',
          answer: 'After connecting your broker, use the Import Trades feature in the Trade Management section. You can import historical data up to 3 years.'
        },
        {
          question: 'Can I manually add trades?',
          answer: 'Yes, use the "Add Trade" button in Trade Management to manually enter trade details including entry/exit prices, quantities, and timestamps.'
        }
      ]
    },
    {
      category: 'Analytics & Reports',
      questions: [
        {
          question: 'What metrics are available in analytics?',
          answer: 'Track P&L, win rate, risk-reward ratios, drawdown, Sharpe ratio, and strategy performance across different timeframes and market conditions.'
        },
        {
          question: 'How do I export my trading data?',
          answer: 'Use the Export feature in Analytics to download your data in CSV or PDF format for tax reporting or further analysis.'
        },
        {
          question: 'Can I compare different strategies?',
          answer: 'Yes, tag your trades with strategy names and use the Strategy Comparison tool in Analytics to evaluate performance side by side.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I enable two-factor authentication?',
          answer: 'Go to Security Settings and enable 2FA using Google Authenticator or similar apps for enhanced account protection.'
        },
        {
          question: 'Is my trading data secure?',
          answer: 'Yes, all data is encrypted and stored securely. We use industry-standard security measures and never store your broker passwords.'
        },
        {
          question: 'How do I change my password?',
          answer: 'Visit Security Settings to update your password. Ensure it\'s at least 8 characters with a mix of letters, numbers, and symbols.'
        }
      ]
    }
  ];

  const handleContactSubmit = (e) => {
    e?.preventDefault();
    // Simulate form submission
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ subject: '', category: 'general', message: '', priority: 'medium' });
    }, 3000);
  };

  const filteredFAQs = faqData?.map(category => ({
    ...category,
    questions: category?.questions?.filter(item =>
      item?.question?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      item?.answer?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  }))?.filter(category => category?.questions?.length > 0);

  const supportCategories = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'integration', label: 'Broker Integration' },
    { value: 'data', label: 'Data & Analytics' },
    { value: 'feature', label: 'Feature Request' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="/help-support" />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
            <p className="text-muted-foreground">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'faq' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'contact' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Contact Support
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'resources' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Resources
            </button>
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQ Categories */}
              {filteredFAQs?.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{category?.category}</h2>
                  <div className="space-y-4">
                    {category?.questions?.map((item, index) => (
                      <details key={index} className="group">
                        <summary className="flex items-center justify-between cursor-pointer p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <span className="font-medium text-foreground">{item?.question}</span>
                          <Icon name="ChevronDown" size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="mt-3 p-4 text-muted-foreground leading-relaxed bg-background/50 rounded-lg">
                          {item?.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}

              {filteredFAQs?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try searching with different keywords or contact support for help.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
                
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="CheckCircle" size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Category
                        </label>
                        <select
                          value={contactForm?.category}
                          onChange={(e) => setContactForm(prev => ({ ...prev, category: e?.target?.value }))}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          {supportCategories?.map(cat => (
                            <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Priority
                        </label>
                        <select
                          value={contactForm?.priority}
                          onChange={(e) => setContactForm(prev => ({ ...prev, priority: e?.target?.value }))}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          {priorities?.map(priority => (
                            <option key={priority?.value} value={priority?.value}>{priority?.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        value={contactForm?.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e?.target?.value }))}
                        placeholder="Brief description of your question or issue"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        value={contactForm?.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e?.target?.value }))}
                        placeholder="Please provide detailed information about your question or issue"
                        rows={6}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Other ways to reach us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Mail" size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@tradescope.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Icon name="Clock" size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Response Time</p>
                        <p className="text-sm text-muted-foreground">Within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Icon name="MessageCircle" size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Before contacting support</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Check our FAQ section for quick answers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Include your account email in the message</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Provide screenshots for technical issues</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Be specific about the problem you're facing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'User Guide',
                  description: 'Complete guide to using TradeScope features',
                  icon: 'Book',
                  color: 'bg-blue-500',
                  items: ['Getting Started', 'Broker Setup', 'Analytics Guide']
                },
                {
                  title: 'API Documentation',
                  description: 'Technical documentation for developers',
                  icon: 'Code',
                  color: 'bg-green-500',
                  items: ['REST API', 'WebSocket', 'SDKs']
                },
                {
                  title: 'Video Tutorials',
                  description: 'Step-by-step video guides',
                  icon: 'Play',
                  color: 'bg-purple-500',
                  items: ['Platform Overview', 'Advanced Features', 'Tips & Tricks']
                },
                {
                  title: 'Trading Strategies',
                  description: 'Learn about different trading approaches',
                  icon: 'TrendingUp',
                  color: 'bg-orange-500',
                  items: ['Day Trading', 'Swing Trading', 'Risk Management']
                },
                {
                  title: 'Market Data',
                  description: 'Understanding market data and symbols',
                  icon: 'BarChart',
                  color: 'bg-red-500',
                  items: ['NSE/BSE Symbols', 'Options Chain', 'Historical Data']
                },
                {
                  title: 'System Status',
                  description: 'Check platform status and uptime',
                  icon: 'Activity',
                  color: 'bg-teal-500',
                  items: ['Current Status', 'Maintenance Schedule', 'Incident History']
                }
              ]?.map((resource, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 ${resource?.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={resource?.icon} size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{resource?.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{resource?.description}</p>
                  <ul className="space-y-2">
                    {resource?.items?.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2">
                        <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full mt-4" size="sm">
                    Explore {resource?.title}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;