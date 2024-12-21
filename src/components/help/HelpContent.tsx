import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Settings,
  Search,
  Video,
  Book,
  HelpCircle,
  ExternalLink,
  Download,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface HelpContentProps {
  onShowQuickStart: () => void;
}

export const HelpContent = ({ onShowQuickStart }: HelpContentProps) => {
  const [activeTab, setActiveTab] = useState<'guides' | 'videos' | 'faq' | 'contact'>('guides');
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      title: 'Getting Started',
      icon: Book,
      sections: [
        { 
          title: 'System Overview', 
          content: 'KiwiHR is a comprehensive HR management system designed for NZ businesses...',
          videoUrl: '#getting-started'
        },
        { 
          title: 'First-Time Setup', 
          content: 'Follow these steps to set up your organization...',
          downloadUrl: '/docs/getting-started.pdf'
        },
      ],
    },
    {
      title: 'Employee Management',
      icon: Users,
      sections: [
        { 
          title: 'Adding Employees', 
          content: 'Step-by-step guide to adding new employees...',
          videoUrl: '#add-employees'
        },
        { 
          title: 'Employment Agreements', 
          content: 'Creating and managing NZ-compliant employment agreements...',
          downloadUrl: '/docs/employment-agreements.pdf'
        },
      ],
    },
    // Add more guides...
  ];

  const videos = [
    {
      title: 'Getting Started with KiwiHR',
      thumbnail: 'https://example.com/thumbnail1.jpg',
      duration: '5:30',
      description: 'Overview of key features and initial setup',
      url: '#video1',
    },
    // Add more videos...
  ];

  const faqs = [
    {
      question: 'What are the minimum wage requirements in NZ?',
      answer: 'As of April 1, 2024, the minimum wage in New Zealand is $22.70 per hour...',
      category: 'Payroll',
    },
    // Add more FAQs...
  ];

  const handleDownload = (url: string) => {
    // In a real app, this would download the actual document
    toast.success('Documentation downloaded successfully');
  };

  const handleVideoPlay = (url: string) => {
    // In a real app, this would play the video
    toast.success('Opening video tutorial');
  };

  const handleContact = (method: 'email' | 'phone' | 'chat') => {
    switch (method) {
      case 'email':
        window.location.href = 'mailto:support@kiwihr.co.nz';
        break;
      case 'phone':
        window.location.href = 'tel:0800549447';
        break;
      case 'chat':
        toast.success('Live chat initiated');
        break;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Help & Documentation</h2>
        <p className="text-gray-500">Get help with KiwiHR features and NZ compliance</p>
      </div>

      {/* Search and Navigation */}
      <div className="border-b">
        <div className="px-6 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <nav className="px-6 flex space-x-4">
          {['guides', 'videos', 'faq', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === tab
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'guides' && <Book size={16} className="mr-2" />}
              {tab === 'videos' && <Video size={16} className="mr-2" />}
              {tab === 'faq' && <HelpCircle size={16} className="mr-2" />}
              {tab === 'contact' && <MessageCircle size={16} className="mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides
              .filter(guide =>
                guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.sections.some(section =>
                  section.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
              )
              .map((guide) => {
                const Icon = guide.icon;
                return (
                  <div key={guide.title} className="border rounded-lg">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Icon className="text-indigo-600 mr-2" size={20} />
                          <h3 className="font-medium">{guide.title}</h3>
                        </div>
                        {guide.sections.some(s => s.downloadUrl) && (
                          <Download
                            size={16}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => handleDownload(guide.sections[0].downloadUrl!)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {guide.sections.map((section) => (
                        <div key={section.title} className="mb-4 last:mb-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {section.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {section.content.substring(0, 100)}...
                          </p>
                          <div className="flex space-x-4">
                            {section.videoUrl && (
                              <button
                                onClick={() => handleVideoPlay(section.videoUrl!)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                              >
                                <Video size={14} className="mr-1" />
                                Watch Video
                              </button>
                            )}
                            {section.downloadUrl && (
                              <button
                                onClick={() => handleDownload(section.downloadUrl!)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                              >
                                <Download size={14} className="mr-1" />
                                Download PDF
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.title} className="border rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleVideoPlay(video.url)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-60"
                  >
                    <Video className="text-white" size={48} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.description}</p>
                  <p className="text-sm text-gray-400 mt-2">Duration: {video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            {faqs
              .filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <HelpCircle className="text-indigo-600 mt-1 mr-2 flex-shrink-0" size={16} />
                    <div>
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium">Need Additional Help?</h3>
              <p className="text-gray-500">Our support team is here to help you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => handleContact('email')}
                className="p-6 border rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <Mail className="mx-auto text-indigo-600 mb-4" size={24} />
                <h4 className="font-medium mb-2">Email Support</h4>
                <p className="text-sm text-gray-500">support@kiwihr.co.nz</p>
                <p className="text-xs text-gray-400 mt-2">24/7 Response</p>
              </button>

              <button
                onClick={() => handleContact('phone')}
                className="p-6 border rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <Phone className="mx-auto text-indigo-600 mb-4" size={24} />
                <h4 className="font-medium mb-2">Phone Support</h4>
                <p className="text-sm text-gray-500">0800 KIWIHR</p>
                <p className="text-xs text-gray-400 mt-2">9am-5pm NZST</p>
              </button>

              <button
                onClick={() => handleContact('chat')}
                className="p-6 border rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <MessageCircle className="mx-auto text-indigo-600 mb-4" size={24} />
                <h4 className="font-medium mb-2">Live Chat</h4>
                <p className="text-sm text-gray-500">Chat with an Expert</p>
                <p className="text-xs text-gray-400 mt-2">Online Now</p>
              </button>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium mb-4">Common Support Topics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="text-left p-4 border rounded-lg bg-white hover:border-indigo-500">
                  <h5 className="font-medium text-sm mb-1">Technical Issues</h5>
                  <p className="text-xs text-gray-500">Problems with login, loading, etc.</p>
                </button>
                <button className="text-left p-4 border rounded-lg bg-white hover:border-indigo-500">
                  <h5 className="font-medium text-sm mb-1">Billing Questions</h5>
                  <p className="text-xs text-gray-500">Subscription and payment help</p>
                </button>
                <button className="text-left p-4 border rounded-lg bg-white hover:border-indigo-500">
                  <h5 className="font-medium text-sm mb-1">Feature Requests</h5>
                  <p className="text-xs text-gray-500">Suggest new features</p>
                </button>
                <button className="text-left p-4 border rounded-lg bg-white hover:border-indigo-500">
                  <h5 className="font-medium text-sm mb-1">Compliance Help</h5>
                  <p className="text-xs text-gray-500">NZ employment law guidance</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {format(new Date(), 'dd MMMM yyyy')}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.employment.govt.nz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
            >
              <ExternalLink size={14} className="mr-1" />
              Employment NZ
            </a>
            <a
              href="https://www.worksafe.govt.nz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
            >
              <ExternalLink size={14} className="mr-1" />
              WorkSafe NZ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};