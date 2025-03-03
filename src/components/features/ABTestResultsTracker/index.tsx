// src/components/features/ABTestResultsTracker/index.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TestResult {
  id: string;
  name: string;
  contentType: string;
  variations: {
    id: string;
    text: string;
    impressions: number; 
    conversions: number;
    conversionRate: number;
  }[];
  startDate: string;
  endDate: string | null;
  status: 'active' | 'completed' | 'draft';
}

const ABTestResultsTracker: React.FC = () => {
  // In a real app, you'd fetch this data from an API
  const [tests, setTests] = useState<TestResult[]>([
    {
      id: '1',
      name: 'Homepage CTA Test',
      contentType: 'cta',
      variations: [
        {
          id: 'var1',
          text: 'Get Started Now',
          impressions: 1200,
          conversions: 120,
          conversionRate: 10
        },
        {
          id: 'var2',
          text: 'Start Your Free Trial',
          impressions: 1150,
          conversions: 138,
          conversionRate: 12
        }
      ],
      startDate: '2024-02-15',
      endDate: null,
      status: 'active'
    },
    {
      id: '2',
      name: 'Email Subject Line Test',
      contentType: 'email_subject',
      variations: [
        {
          id: 'var1',
          text: 'Last chance to save 20% on your subscription',
          impressions: 5000,
          conversions: 750,
          conversionRate: 15
        },
        {
          id: 'var2',
          text: 'Your exclusive 20% discount expires today',
          impressions: 5000,
          conversions: 800,
          conversionRate: 16
        },
        {
          id: 'var3',
          text: 'Don\'t miss out: 20% off ends at midnight',
          impressions: 5000,
          conversions: 900,
          conversionRate: 18
        }
      ],
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      status: 'completed'
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  // Function to update test impressions and conversions
  const updateTestMetrics = (testId: string, variationId: string, field: 'impressions' | 'conversions', value: number) => {
    setTests(prevTests => {
      return prevTests.map(test => {
        if (test.id === testId) {
          const updatedVariations = test.variations.map(variation => {
            if (variation.id === variationId) {
              const updatedVariation = { ...variation, [field]: value };
              // Recalculate conversion rate
              if (field === 'impressions' || field === 'conversions') {
                updatedVariation.conversionRate = 
                  updatedVariation.impressions > 0 
                    ? (updatedVariation.conversions / updatedVariation.impressions) * 100 
                    : 0;
              }
              return updatedVariation;
            }
            return variation;
          });
          
          return { ...test, variations: updatedVariations };
        }
        return test;
      });
    });

    // If we're updating the currently selected test, update that too
    if (selectedTest?.id === testId) {
      setSelectedTest(prevTest => {
        if (!prevTest) return null;
        
        const updatedVariations = prevTest.variations.map(variation => {
          if (variation.id === variationId) {
            const updatedVariation = { ...variation, [field]: value };
            // Recalculate conversion rate
            if (field === 'impressions' || field === 'conversions') {
              updatedVariation.conversionRate = 
                updatedVariation.impressions > 0 
                  ? (updatedVariation.conversions / updatedVariation.impressions) * 100 
                  : 0;
            }
            return updatedVariation;
          }
          return variation;
        });
        
        return { ...prevTest, variations: updatedVariations };
      });
    }
  };

  // Complete a test
  const completeTest = (testId: string) => {
    setTests(prevTests => {
      return prevTests.map(test => {
        if (test.id === testId) {
          return { 
            ...test, 
            status: 'completed', 
            endDate: new Date().toISOString().split('T')[0] 
          };
        }
        return test;
      });
    });

    // Update selected test if it's the one being completed
    if (selectedTest?.id === testId) {
      setSelectedTest(prevTest => {
        if (!prevTest) return null;
        return { 
          ...prevTest, 
          status: 'completed', 
          endDate: new Date().toISOString().split('T')[0] 
        };
      });
    }
  };

  // Identify winning variation
  const getWinningVariation = (test: TestResult) => {
    if (test.variations.length === 0) return null;
    
    return test.variations.reduce((prev, current) => 
      (prev.conversionRate > current.conversionRate) ? prev : current
    );
  };

  // Calculate statistical significance
  const isStatisticallySignificant = (test: TestResult) => {
    // This is a simplified check - in a real app you'd want a proper statistical test
    // For now, we'll just check if the difference is > 1% and both have sufficient sample size
    if (test.variations.length < 2) return false;
    
    const sorted = [...test.variations].sort((a, b) => b.conversionRate - a.conversionRate);
    const best = sorted[0];
    const secondBest = sorted[1];
    
    const hasSufficientSamples = best.impressions > 100 && secondBest.impressions > 100;
    const hasMeaningfulDifference = (best.conversionRate - secondBest.conversionRate) > 1;
    
    return hasSufficientSamples && hasMeaningfulDifference;
  };

  // Test summary list
  const renderTestList = () => (
    <div className="space-y-4">
      {tests.map(test => (
        <Card 
          key={test.id}
          className={`cursor-pointer hover:shadow-md transition-all ${
            selectedTest?.id === test.id ? 'border-2 border-blue-500' : ''
          }`}
          onClick={() => setSelectedTest(test)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{test.name}</h3>
                <p className="text-sm text-slate-600">
                  Content Type: {test.contentType} • {test.variations.length} variations
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                test.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : test.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-800'
              }`}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-600">
              <span>Started: {test.startDate}</span>
              {test.endDate && <span>Ended: {test.endDate}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Detailed test view with results
  const renderTestDetails = () => {
    if (!selectedTest) return null;
    
    const winningVariation = getWinningVariation(selectedTest);
    const isSignificant = isStatisticallySignificant(selectedTest);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{selectedTest.name}</h2>
            <p className="text-slate-600">
              {selectedTest.status === 'active' ? 'Running since' : 'Ran from'} {selectedTest.startDate}
              {selectedTest.endDate ? ` to ${selectedTest.endDate}` : ''}
            </p>
          </div>
          {selectedTest.status === 'active' && (
            <button
              onClick={() => completeTest(selectedTest.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Complete Test
            </button>
          )}
        </div>

        {/* Results visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedTest.variations.map(v => ({
                    name: v.text.length > 30 ? v.text.substring(0, 30) + '...' : v.text,
                    'Conversion Rate': v.conversionRate
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Bar dataKey="Conversion Rate" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Winner banner - only show if test is completed and there's a significant result */}
            {selectedTest.status === 'completed' && isSignificant && winningVariation && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">Winner: Variation "{winningVariation.text}"</h4>
                <p className="text-green-700">
                  This variation had a {winningVariation.conversionRate.toFixed(1)}% conversion rate, 
                  which was significantly better than the alternatives.
                </p>
              </div>
            )}
            
            {/* Inconclusive banner */}
            {selectedTest.status === 'completed' && !isSignificant && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Results Inconclusive</h4>
                <p className="text-yellow-700">
                  The differences between variations weren't statistically significant. 
                  Consider running the test longer or with more traffic to reach a conclusion.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Detailed metrics table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left bg-slate-50">
                    <th className="p-2 border">Variation</th>
                    <th className="p-2 border">Impressions</th>
                    <th className="p-2 border">Conversions</th>
                    <th className="p-2 border">Conv. Rate</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTest.variations.map((variation, index) => (
                    <tr key={variation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border">{variation.text}</td>
                      <td className="p-2 border">
                        {selectedTest.status === 'active' ? (
                          <input
                            type="number"
                            value={variation.impressions}
                            onChange={(e) => updateTestMetrics(
                              selectedTest.id, 
                              variation.id,
                              'impressions',
                              parseInt(e.target.value) || 0
                            )}
                            className="w-24 p-1 border rounded"
                            min="0"
                          />
                        ) : (
                          variation.impressions
                        )}
                      </td>
                      <td className="p-2 border">
                        {selectedTest.status === 'active' ? (
                          <input
                            type="number"
                            value={variation.conversions}
                            onChange={(e) => updateTestMetrics(
                              selectedTest.id, 
                              variation.id,
                              'conversions',
                              parseInt(e.target.value) || 0
                            )}
                            className="w-24 p-1 border rounded"
                            min="0"
                          />
                        ) : (
                          variation.conversions
                        )}
                      </td>
                      <td className="p-2 border font-medium">
                        {variation.conversionRate.toFixed(1)}%
                      </td>
                      <td className="p-2 border">
                        {winningVariation?.id === variation.id && selectedTest.status === 'completed' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Winner
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Back button */}
        <button
          onClick={() => setSelectedTest(null)}
          className="mt-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to test list
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">A/B Test Results</h2>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-600">
          Track and analyze the performance of your A/B tests
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Test
        </button>
      </div>
      
      <div className="space-y-6">
        {selectedTest ? renderTestDetails() : renderTestList()}
      </div>
    </div>
  );
};

export default ABTestResultsTracker;