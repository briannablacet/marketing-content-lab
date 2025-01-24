import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PipelinePlanner = () => {
  const [conversionRates, setConversionRates] = useState({
    // Digital channel rates
    MQL_TO_SQL: 0.3,
    SQL_TO_OPP: 0.4,
    OPP_TO_CLOSED: 0.25,

    // Event-specific rates
    'Trade Shows': {
      VISITOR_TO_MQL: 0.4,
      MQL_TO_SQL: 0.5,
      SQL_TO_OPP: 0.4,
      OPP_TO_CLOSED: 0.3
    },
    'Webinars': {
      REGISTRANT_TO_ATTENDEE: 0.5,
      ATTENDEE_TO_MQL: 0.3,
      MQL_TO_SQL: 0.4,
      SQL_TO_OPP: 0.3
    },
    'Partner Events': {
      VISITOR_TO_MQL: 0.3,
      MQL_TO_SQL: 0.45,
      SQL_TO_OPP: 0.35,
      OPP_TO_CLOSED: 0.3
    }
  });

  const [viewMode, setViewMode] = useState('combined');
  const [timeframe, setTimeframe] = useState('monthly');
  const monthlyBudget = 10000;

  // Sample event data - in production this would come from your event planning module
  const eventData = {
    'Trade Shows': [
      { name: 'Industry Conference Q2', budget: 15000, projectedLeads: 300, quarter: 2 },
      { name: 'Security Summit Q3', budget: 20000, projectedLeads: 400, quarter: 3 }
    ],
    'Webinars': [
      { name: 'Product Demo Series', budget: 5000, projectedLeads: 200, quarter: 2 },
      { name: 'Industry Trends', budget: 5000, projectedLeads: 250, quarter: 3 }
    ],
    'Partner Events': [
      { name: 'Partner Summit', budget: 10000, projectedLeads: 150, quarter: 4 }
    ]
  };

  // Generate projections combining digital and event data
  const generateProjections = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Generate base digital projections
    const digitalProjections = months.map(month => {
      const leads = Math.round(monthlyBudget * 0.05);
      const mqls = Math.round(leads * 0.4);
      const sqls = Math.round(mqls * conversionRates.MQL_TO_SQL);
      const opportunities = Math.round(sqls * conversionRates.SQL_TO_OPP);
      const closed = Math.round(opportunities * conversionRates.OPP_TO_CLOSED);

      return {
        month,
        leads,
        mqls,
        sqls,
        opportunities,
        closed,
        source: 'Digital'
      };
    });

    // Add event projections
    Object.entries(eventData).forEach(([eventType, events]) => {
      events.forEach(event => {
        const monthIndex = (event.quarter - 1) * 3;
        const rates = conversionRates[eventType];
        
        let leads = event.projectedLeads;
        let mqls = eventType === 'Webinars'
          ? leads * rates.REGISTRANT_TO_ATTENDEE * rates.ATTENDEE_TO_MQL
          : leads * rates.VISITOR_TO_MQL;
        let sqls = mqls * rates.MQL_TO_SQL;
        let opportunities = sqls * rates.SQL_TO_OPP;
        let closed = opportunities * rates.OPP_TO_CLOSED;

        // Add to existing month's totals
        digitalProjections[monthIndex] = {
          ...digitalProjections[monthIndex],
          leads: digitalProjections[monthIndex].leads + leads,
          mqls: digitalProjections[monthIndex].mqls + mqls,
          sqls: digitalProjections[monthIndex].sqls + sqls,
          opportunities: digitalProjections[monthIndex].opportunities + opportunities,
          closed: digitalProjections[monthIndex].closed + closed,
          events: [...(digitalProjections[monthIndex].events || []), {
            type: eventType,
            name: event.name,
            leads,
            mqls,
            opportunities,
            closed
          }]
        };
      });
    });

    return digitalProjections;
  };

  const projections = generateProjections();

  // Convert to quarterly if needed
  const getDisplayData = () => {
    if (timeframe === 'monthly') return projections;

    // Aggregate to quarters
    return [0,1,2,3].map(q => {
      const quarterMonths = projections.slice(q * 3, (q + 1) * 3);
      return {
        quarter: `Q${q + 1}`,
        leads: quarterMonths.reduce((sum, month) => sum + month.leads, 0),
        mqls: quarterMonths.reduce((sum, month) => sum + month.mqls, 0),
        sqls: quarterMonths.reduce((sum, month) => sum + month.sqls, 0),
        opportunities: quarterMonths.reduce((sum, month) => sum + month.opportunities, 0),
        closed: quarterMonths.reduce((sum, month) => sum + month.closed, 0)
      };
    });
  };

  // Conversion Rate Editor Component
  const ConversionRateEditor = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Conversion Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Digital Channels</h3>
            <div className="space-y-4">
              {Object.entries(conversionRates)
                .filter(([key]) => !['Trade Shows', 'Webinars', 'Partner Events'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value * 100}
                      onChange={(e) => setConversionRates(prev => ({
                        ...prev,
                        [key]: Number(e.target.value) / 100
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-slate-600">{(value * 100).toFixed(1)}%</span>
                  </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Channels</h3>
            {Object.entries(conversionRates)
              .filter(([key]) => ['Trade Shows', 'Webinars', 'Partner Events'].includes(key))
              .map(([eventType, rates]) => (
                <div key={eventType} className="mb-6">
                  <h4 className="font-medium mb-2">{eventType}</h4>
                  <div className="space-y-3">
                    {Object.entries(rates).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm text-slate-600">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value * 100}
                          onChange={(e) => setConversionRates(prev => ({
                            ...prev,
                            [eventType]: {
                              ...prev[eventType],
                              [key]: Number(e.target.value) / 100
                            }
                          }))}
                          className="w-full"
                        />
                        <span className="text-sm text-slate-600">{(value * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-slate-900">Pipeline Projections</h1>
        <p className="mt-2 text-slate-600">
          Combined forecast including digital channels and events
        </p>
      </div>

      {/* View Controls */}
      <div className="mt-8 flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => setViewMode('combined')}
            className={`px-4 py-2 rounded ${
              viewMode === 'combined' ? 'bg-blue-600 text-white' : 'bg-slate-100'
            }`}
          >
            Combined View
          </button>
          <button
            onClick={() => setTimeframe(prev => prev === 'monthly' ? 'quarterly' : 'monthly')}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded"
          >
            {timeframe === 'monthly' ? 'Show Quarterly' : 'Show Monthly'}
          </button>
        </div>
      </div>

      {/* Pipeline Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pipeline Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getDisplayData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeframe === 'monthly' ? 'month' : 'quarter'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mqls" stroke="#60a5fa" name="MQLs" />
                <Line type="monotone" dataKey="opportunities" stroke="#2563eb" name="Opportunities" />
                <Line type="monotone" dataKey="closed" stroke="#1e40af" name="Closed Deals" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Event Impact Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {Object.entries(eventData).map(([type, events]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded">
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-slate-600">Q{event.quarter}</p>
                    <div className="mt-2">
                      <p className="text-sm text-slate-600">Projected Leads</p>
                      <p className="text-lg font-bold text-slate-900">
                        {event.projectedLeads}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Rate Editor */}
      <ConversionRateEditor />
    </div>
  );
};

export default PipelinePlanner;
