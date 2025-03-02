// src/components/features/CompetitorAnalysisDashboard/index.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../../shared/UIComponents';
import { AutosaveIndicator } from '../../shared/AutosaveIndicator';

const CompetitorAnalysisDashboard: React.FC = () => {
  const [competitors, setCompetitors] = useState([
    {
      name: '',
      marketPosition: { x: 50, y: 50 },
      features: {},
      wins: 0,
      losses: 0
    }
  ]);

  const MarketPositionChart = () => (
    <div className="relative h-96 w-full border rounded-lg bg-white p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        {competitors.map((competitor, index) => (
          <div
            key={index}
            style={{
              left: `${competitor.marketPosition.x}%`,
              top: `${competitor.marketPosition.y}%`
            }}
            className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
            title={competitor.name}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-4">Market Share</div>
      <div className="absolute left-4 top-1/2 -rotate-90">Price Point</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Market Position Map</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketPositionChart />
        </CardContent>
      </Card>
      <AutosaveIndicator />
    </div>
  );
};

export default CompetitorAnalysisDashboard;