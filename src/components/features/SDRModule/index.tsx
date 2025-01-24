import React, { useState } from 'react';
import { useSDR } from '@/contexts/SDRContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LeadQueue from './LeadQueue';
import SDRActions from './SDRActions';

const SDRModule = () => {
  const { leadQueue, addToQueue, updateLeadStatus } = useSDR();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedLead, setSelectedLead] = useState(null);

  // Keep your existing phoneScripts and objectionHandling data...

  // Keep your existing TemplateManager component...

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">SDR Workspace</h1>

      <div className="mb-8 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'queue' ? 'border-b-2 border-blue-600' : ''
          }`}
          onClick={() => setActiveTab('queue')}
        >
          Lead Queue
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'templates' ? 'border-b-2 border-blue-600' : ''
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Email Templates
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'scripts' ? 'border-b-2 border-blue-600' : ''
          }`}
          onClick={() => setActiveTab('scripts')}
        >
          Phone Scripts
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'objections' ? 'border-b-2 border-blue-600' : ''
          }`}
          onClick={() => setActiveTab('objections')}
        >
          Objection Handling
        </button>
      </div>

      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LeadQueue onSelectLead={setSelectedLead} />
          {selectedLead && <SDRActions lead={selectedLead} />}
        </div>
      )}
      {activeTab === 'templates' && <TemplateManager />}
      {/* Add other tab content components */}
    </div>
  );
};

export default SDRModule;
