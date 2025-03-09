import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SDRActions = ({ lead }) => {
  const [activities, setActivities] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

  const ActivityLog = () => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
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

  const TemplateSelector = () => {
    const templates = {
      email: [
        { id: 1, name: 'Follow-up Email', type: 'email' },
        { id: 2, name: 'Meeting Request', type: 'email' },
        { id: 3, name: 'Post-Event Follow-up', type: 'email' }
      ],
      call: [
        { id: 4, name: 'Introduction Call', type: 'call' },
        { id: 5, name: 'Discovery Call', type: 'call' },
        { id: 6, name: 'Post-Event Call', type: 'call' }
      ]
    };

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Templates</h3>
        <div className="space-y-4">
          {Object.entries(templates).map(([type, items]) => (
            <div key={type}>
              <h4 className="text-sm font-medium text-slate-600 mb-2 capitalize">
                {type} Templates
              </h4>
              <div className="space-y-2">
                {items.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className="w-full p-3 text-left bg-white border border-slate-200 rounded hover:border-blue-300"
                  >
                    <p className="font-medium">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
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
          <CardTitle>Templates & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateSelector />
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
  );
};

export default SDRActions;
