// src/components/features/CompetitorAnalysisDashboard/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ScreenTemplate from "@/components/shared/UIComponents"
import { AutosaveIndicator } from '../../shared/AutosaveIndicator';

interface Competitor {
  name: string;
  marketPosition: { x: number; y: number };
  features: Record<string, any>;
  wins: number;
  losses: number;
}

interface CompetitorAnalysisDashboardProps {
  initialCompetitors?: Competitor[];
}

const CompetitorAnalysisDashboard: React.FC<CompetitorAnalysisDashboardProps> = ({ 
  initialCompetitors = [] 
}) => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Only set the initial state after component mounts (client-side only)
  useEffect(() => {
    if (initialCompetitors.length > 0) {
      setCompetitors(initialCompetitors);
    } else {
      // Default competitors if none provided
      setCompetitors([
        {
          name: 'Your Company',
          marketPosition: { x: 50, y: 50 },
          features: {},
          wins: 7,
          losses: 2
        },
        {
          name: 'Competitor A',
          marketPosition: { x: 30, y: 40 },
          features: {},
          wins: 5,
          losses: 2
        },
        {
          name: 'Competitor B',
          marketPosition: { x: 70, y: 60 },
          features: {},
          wins: 3,
          losses: 4
        }
      ]);
    }
    setIsClient(true);
  }, [initialCompetitors]);

  const MarketPositionChart = () => (
    <div className="relative h-96 w-full border rounded-lg bg-white p-4">
      {isClient && (
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
      )}
      <div className="absolute bottom-4 left-4">Market Share</div>
      <div className="absolute left-4 top-1/2 -rotate-90">Price Point</div>
    </div>
  );

  const StrengthWeaknessAnalysis = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Strength Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm truncate">{competitor.name}</div>
                <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${(competitor.wins / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-sm ml-2">{competitor.wins}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm truncate">{competitor.name}</div>
                <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${(competitor.losses / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-sm ml-2">{competitor.losses}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Market Position Map</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketPositionChart />
        </CardContent>
      </Card>

      {isClient && competitors.length > 0 && (
        <>
          <StrengthWeaknessAnalysis />
          
          <Card>
            <CardHeader>
              <CardTitle>Competitor Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">{competitor.name}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-600">Strengths:</span>
                        <span className="ml-2 font-medium">{competitor.wins}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Gaps:</span>
                        <span className="ml-2 font-medium">{competitor.losses}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={() => window.location.href = '/competitive-analysis'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add/Edit Competitors
        </button>
      </div>
      
      <AutosaveIndicator />
    </div>
  );
};

export default CompetitorAnalysisDashboard;