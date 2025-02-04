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

  const [features, setFeatures] = useState([
    'UI/UX', 'Performance', 'Support', 'Price', 'Features'
  ]);

  // Market Position Chart Component
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

  // Feature Comparison Matrix Component
  const FeatureMatrix = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">Features</th>
            {competitors.map((comp, i) => (
              <th key={i} className="p-2 border">{comp.name || `Competitor ${i + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i}>
              <td className="p-2 border font-medium">{feature}</td>
              {competitors.map((comp, j) => (
                <td key={j} className="p-2 border">
                  <select
                    className="w-full p-1 rounded border"
                    value={comp.features[feature as keyof typeof comp.features] || ''}
                    onChange={(e) => {
                      const newCompetitors = [...competitors];
                      newCompetitors[j] = {
                        ...comp,
                        features: {
                          ...comp.features,
                          [feature]: e.target.value
                        }
                      };
                      setCompetitors(newCompetitors);
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="strong">Strong</option>
                    <option value="medium">Medium</option>
                    <option value="weak">Weak</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Win/Loss Tracker Component
  const WinLossTracker = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map((comp, i) => (
        <Card key={i} className="p-4">
          <CardHeader>
            <CardTitle>{comp.name || `Competitor ${i + 1}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Wins</p>
                <p className="text-2xl font-bold text-green-600">{comp.wins}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Losses</p>
                <p className="text-2xl font-bold text-red-600">{comp.losses}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Win Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {comp.wins + comp.losses > 0
                    ? `${Math.round((comp.wins / (comp.wins + comp.losses)) * 100)}%`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <ScreenTemplate
        title="Competitive Analysis"
        subtitle="Analyze your competition and track win rates"
        aiInsights={[
          "Your top competitor shows weaknesses in support and UI/UX - consider highlighting these areas",
          "Win rates suggest opportunity in the enterprise segment where you're outperforming competitors",
          "Feature comparison reveals potential gaps in mobile capabilities across the market"
        ]}
        isWalkthrough={false}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Market Position Map</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketPositionChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureMatrix />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Win/Loss Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <WinLossTracker />
            </CardContent>
          </Card>
        </div>
      </ScreenTemplate>
      <AutosaveIndicator />
    </>
  );
};

export default CompetitorAnalysisDashboard;