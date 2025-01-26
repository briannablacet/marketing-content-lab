// src/components/features/MarketingWalkthrough/components/PersonaStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const PersonaStep = () => {
  const [persona, setPersona] = useState({
    role: '',
    industry: '',
    challenges: []
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Who are we targeting? 🎯</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Role</label>
            <input
              type="text"
              value={persona.role}
              onChange={(e) => setPersona({...persona, role: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g. CTO, Marketing Director"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input
              type="text"
              value={persona.industry}
              onChange={(e) => setPersona({...persona, industry: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g. SaaS, Healthcare"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Key Challenges</label>
            <textarea
              value={persona.challenges.join('\n')}
              onChange={(e) => setPersona({...persona, challenges: e.target.value.split('\n')})}
              className="w-full p-2 border rounded"
              placeholder="One challenge per line"
              rows={3}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonaStep;