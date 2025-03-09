import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LeadQueue = () => {
  const [queue, setQueue] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sample data structure for a lead
  const sampleLeads = [
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
    // Add more sample leads as needed
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from your backend
    setQueue(sampleLeads);
  }, []);

  const LeadCard = ({ lead, isSelected, onClick }) => (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
      }`}
      onClick={() => onClick(lead)}
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
  );

  const LeadDetails = ({ lead }) => {
    if (!lead) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-semibold">{lead.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Company</p>
                <p className="font-semibold">{lead.company}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Lead Score</p>
                <p className="font-semibold text-blue-600">{lead.score}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <p className="font-semibold capitalize">{lead.status}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Recommended Actions</h4>
              <div className="space-y-2">
                {lead.priority === 'high' ? (
                  <button className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Immediate Follow-up Required
                  </button>
                ) : (
                  <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Schedule Follow-up
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="mb-4 flex space-x-4">
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
        <div className="space-y-4">
          {queue
            .filter(lead => filter === 'all' || lead.priority === filter)
            .map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isSelected={selectedLead?.id === lead.id}
                onClick={setSelectedLead}
              />
            ))}
        </div>
      </div>
      <div>
        <LeadDetails lead={selectedLead} />
      </div>
    </div>
  );
};

export default LeadQueue;
