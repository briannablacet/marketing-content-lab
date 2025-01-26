//components/features/SDRModule/index.tsx


import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SDRModule = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedLead, setSelectedLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  // Sample lead data
  const [leads] = useState([
    {
      id: 1,
      name: 'John Smith',
      company: 'Tech Corp',
      score: 85,
      priority: 'high',
      lastAction: 'Webinar Attendance',
      status: 'new',
      addedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Growth Inc',
      score: 72,
      priority: 'normal',
      lastAction: 'Email Open',
      status: 'in-progress',
      addedAt: '2024-01-21T10:00:00Z'
    }
  ]);

  const addActivity = (type, details) => {
    setActivities(prev => [
      {
        id: Date.now(),
        type,
        details,
        timestamp: new Date().toISOString(),
        status: 'pending'
      },
      ...prev
    ]);
  };

  const LeadQueue = () => (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          All Leads
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded ${
            filter === 'high' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          Fast Track
        </button>
      </div>

      {leads
        .filter(lead => filter === 'all' || lead.priority === filter)
        .map(lead => (
          <div
            key={lead.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedLead?.id === lead.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedLead(lead)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                <p className="text-sm text-slate-600">{lead.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  lead.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {lead.priority === 'high' ? 'Fast Track' : 'Standard'}
                </span>
                <span className="text-lg font-semibold text-blue-600">{lead.score}</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-slate-600">Last Action: {lead.lastAction}</p>
              <p className="text-xs text-slate-500 mt-1">
                Added {new Date(lead.addedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
    </div>
  );

  const QuickActions = () => (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => addActivity('Email', 'Sent follow-up email')}
        className="p-4 bg-white border border-slate-200 rounded hover:border-blue-300"
      >
        <span className="block text-lg mb-1">📧</span>
        <span className="text-sm font-medium">Send Email</span>
      </button>
      <button
        onClick={() => addActivity('Call', 'Attempted phone call')}
        className="p-4 bg-white border border-slate-200 rounded hover:border-blue-300"
      >
        <span className="block text-lg mb-1">📞</span>
        <span className="text-sm font-medium">Make Call</span>
      </button>
      <button
        onClick={() => addActivity('Meeting', 'Scheduled discovery call')}
        className="p-4 bg-white border border-slate-200 rounded hover:border-blue-300"
      >
        <span className="block text-lg mb-1">📅</span>
        <span className="text-sm font-medium">Schedule Meeting</span>
      </button>
      <button
        onClick={() => addActivity('Note', 'Added internal note')}
        className="p-4 bg-white border border-slate-200 rounded hover:border-blue-300"
      >
        <span className="block text-lg mb-1">📝</span>
        <span className="text-sm font-medium">Add Note</span>
      </button>
    </div>
  );

  const ActivityLog = () => (
    <div className="space-y-4">
      {activities.map(activity => (
        <div
          key={activity.id}
          className="p-4 bg-slate-50 rounded border border-slate-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-slate-900">{activity.type}</p>
              <p className="text-sm text-slate-600">{activity.details}</p>
            </div>
            <span className="text-xs text-slate-500">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'queue':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lead Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <LeadQueue />
                </CardContent>
              </Card>
            </div>
            {selectedLead && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuickActions />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityLog />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
      case 'templates':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Follow-up', 'Meeting Request', 'Event Follow-up'].map((template, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h3 className="font-medium mb-2">{template}</h3>
                    <p className="text-sm text-slate-600">Template content here...</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'scripts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Call Scripts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Introduction', 'Discovery', 'Demo Setup'].map((script, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h3 className="font-medium mb-2">{script} Script</h3>
                    <p className="text-sm text-slate-600">Script content here...</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const content = (
    <>
      <div className="mb-8 border-b">
        {['queue', 'templates', 'scripts', 'objections'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderContent()}
    </>
  );

  // If being used in a walkthrough, wrap with ScreenTemplate
  if (typeof ScreenTemplate !== 'undefined') {
    return (
      <ScreenTemplate
        title="SDR Workspace"
        subtitle="Manage your sales development activities"
        aiInsights={[
          "5 high-priority leads require immediate follow-up",
          "Best contact time for your region: 10am - 2pm",
          "Top performing template: Product Demo Request"
        ]}
      >
        {content}
      </ScreenTemplate>
    );
  }

  // Standalone version
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">SDR Workspace</h1>
      {content}
    </div>
  );
};

export default SDRModule;