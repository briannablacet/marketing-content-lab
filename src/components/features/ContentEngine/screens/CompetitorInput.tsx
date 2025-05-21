// src/components/features/ContentEngine/screens/CompetitorInput.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Competitor {
  name: string;
  differentiators: string;
  strengths: string;
  weaknesses: string;
}

const CompetitorInput: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [currentCompetitor, setCurrentCompetitor] = useState<Competitor>({
    name: '',
    differentiators: '',
    strengths: '',
    weaknesses: ''
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Competitor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Competitor Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentCompetitor.name}
                onChange={(e) => setCurrentCompetitor({ ...currentCompetitor, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Key Differentiators</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={currentCompetitor.differentiators}
                onChange={(e) => setCurrentCompetitor({ ...currentCompetitor, differentiators: e.target.value })}
              />
            </div>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                setCompetitors([...competitors, currentCompetitor]);
                setCurrentCompetitor({ name: '', differentiators: '', strengths: '', weaknesses: '' });
              }}
            >
              Add Competitor
            </button>
          </div>
        </CardContent>
      </Card>

      {competitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Competitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <div key={index} className="p-4 border rounded">
                  <h3 className="font-semibold">{competitor.name}</h3>
                  <p className="text-sm text-slate-600 mt-2">{competitor.differentiators}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompetitorInput;