import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PipelineForecast = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [pipelineData, setPipelineData] = useState([
    { month: 'Jan', leads: 120, mql: 60, sql: 30, opportunities: 15, deals: 5 },
    { month: 'Feb', leads: 150, mql: 75, sql: 38, opportunities: 19, deals: 7 },
    { month: 'Mar', leads: 180, mql: 90, sql: 45, opportunities: 23, deals: 9 }
  ]);

  const AIInsights = () => (
    <Card className="mb-6 bg-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-blue-600">✨</span>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">📈</span>
            <p className="text-slate-600">Lead-to-opportunity conversion showing upward trend, currently at 12.8%</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🎯</span>
            <p className="text-slate-600">On track to exceed quarterly pipeline goals by 15%</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-slate-600">Consider increasing top-of-funnel activities to maintain growth momentum</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PipelineMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {['Leads', 'MQLs', 'SQLs', 'Opportunities', 'Deals'].map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-600">{metric}</h3>
            <p className="text-2xl font-bold text-slate-900">
              {pipelineData[pipelineData.length - 1][metric.toLowerCase()]}
            </p>
            <p className="text-sm text-green-600">
              +{Math.floor(Math.random() * 20 + 10)}% vs prev
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const PipelineChart = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pipelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="leads" stroke="#94a3b8" name="Leads" />
          <Line type="monotone" dataKey="mql" stroke="#60a5fa" name="MQLs" />
          <Line type="monotone" dataKey="sql" stroke="#3b82f6" name="SQLs" />
          <Line type="monotone" dataKey="opportunities" stroke="#2563eb" name="Opportunities" />
          <Line type="monotone" dataKey="deals" stroke="#1d4ed8" name="Deals" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const ConversionMetrics = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Conversion Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded">
            <p className="text-sm text-slate-600">Lead → MQL</p>
            <p className="text-2xl font-bold text-slate-900">50%</p>
          </div>
          <div className="p-4 bg-slate-50 rounded">
            <p className="text-sm text-slate-600">MQL → SQL</p>
            <p className="text-2xl font-bold text-slate-900">50%</p>
          </div>
          <div className="p-4 bg-slate-50 rounded">
            <p className="text-sm text-slate-600">SQL → Opportunity</p>
            <p className="text-2xl font-bold text-slate-900">50%</p>
          </div>
          <div className="p-4 bg-slate-50 rounded">
            <p className="text-sm text-slate-600">Opportunity → Deal</p>
            <p className="text-2xl font-bold text-slate-900">33%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const content = (
    <div className="space-y-6">
      <AIInsights />
      <PipelineMetrics />
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <PipelineChart />
        </CardContent>
      </Card>
      <ConversionMetrics />
    </div>
  );

  // If being used in a walkthrough, wrap with ScreenTemplate
  if (typeof ScreenTemplate !== 'undefined') {
    return (
      <ScreenTemplate
        title="Pipeline Forecast"
        subtitle="Track and project your marketing pipeline"
        aiInsights={[
          "Lead-to-opportunity conversion showing strong momentum",
          "Q1 pipeline projections exceed targets by 15%",
          "Recommended focus on top-of-funnel optimization"
        ]}
      >
        {content}
      </ScreenTemplate>
    );
  }

  // Standalone version
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Pipeline Forecast</h1>
      {content}
    </div>
  );
};

export default PipelineForecast;