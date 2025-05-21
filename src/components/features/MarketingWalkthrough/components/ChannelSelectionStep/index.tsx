import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility function for calculations
const calculateMetrics = (channel) => {
  const cpl = channel.leads > 0 ? channel.spend / channel.leads : 0;
  const cpo = channel.opportunities > 0 ? channel.spend / channel.opportunities : 0;
  const cpd = channel.deals > 0 ? channel.spend / channel.deals : 0;
  const roi = channel.spend > 0 ? (channel.revenue - channel.spend) / channel.spend : 0;
  const conversionRate = channel.leads > 0 ? (channel.deals / channel.leads) * 100 : 0;

  return {
    cpl: cpl.toFixed(2),
    cpo: cpo.toFixed(2),
    cpd: cpd.toFixed(2),
    roi: (roi * 100).toFixed(1),
    conversionRate: conversionRate.toFixed(1)
  };
};

const AIInsightPanel = ({ channels }) => {
  const insights = useMemo(() => {
    if (!channels.length) return [];
    
    const insights = [];
    const totalSpend = channels.reduce((sum, channel) => sum + channel.spend, 0);
    const bestROI = channels.reduce((best, channel) => {
      const roi = channel.revenue > 0 ? (channel.revenue - channel.spend) / channel.spend : 0;
      return roi > best.roi ? { name: channel.name, roi } : best;
    }, { name: '', roi: -Infinity });
    
    const avgCPL = channels.reduce((sum, channel) => {
      return sum + (channel.leads > 0 ? channel.spend / channel.leads : 0);
    }, 0) / channels.length;

    // Add budget allocation insight
    insights.push({
      icon: "💰",
      text: `Total marketing investment of $${totalSpend.toLocaleString()} across ${channels.length} channels`
    });

    // Add ROI performance insight
    if (bestROI.roi > 0) {
      insights.push({
        icon: "🎯",
        text: `${bestROI.name} is your best performing channel with ${(bestROI.roi * 100).toFixed(1)}% ROI`
      });
    }

    // Add cost efficiency insight
    insights.push({
      icon: "📊",
      text: `Average cost per lead across channels is $${avgCPL.toFixed(2)}`
    });

    // Add optimization recommendation
    const lowPerformers = channels.filter(channel => {
      const metrics = calculateMetrics(channel);
      return parseFloat(metrics.roi) < 50;
    });

    if (lowPerformers.length > 0) {
      insights.push({
        icon: "💡",
        text: `Consider optimizing ${lowPerformers.length} channels showing ROI below 50%`
      });
    }

    return insights;
  }, [channels]);

  return (
    <Card className="mb-8 bg-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-blue-600">✨</span>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-lg">{insight.icon}</span>
              <p className="text-slate-600">{insight.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MarketingROICalculator = () => {
  const [channels, setChannels] = useState([
    {
      name: 'Content Marketing',
      spend: 5000,
      leads: 250,
      opportunities: 50,
      deals: 10,
      revenue: 50000,
      timeframe: 'Q1'
    },
    {
      name: 'Paid Search',
      spend: 3000,
      leads: 150,
      opportunities: 30,
      deals: 6,
      revenue: 30000,
      timeframe: 'Q1'
    }
  ]);

  const handleChannelUpdate = (index, field, value) => {
    const updatedChannels = [...channels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: Number(value)
    };
    setChannels(updatedChannels);
  };

  const ChannelMetrics = ({ channel, index }) => {
    const metrics = calculateMetrics(channel);

    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold text-slate-900">
            {channel.name}
          </CardTitle>
          <span className="text-sm text-slate-500">{channel.timeframe}</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-600">Cost per Lead</p>
              <p className="text-2xl font-bold text-slate-900">${metrics.cpl}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Cost per Opportunity</p>
              <p className="text-2xl font-bold text-slate-900">${metrics.cpo}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Cost per Deal</p>
              <p className="text-2xl font-bold text-slate-900">${metrics.cpd}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">ROI</p>
              <p className="text-2xl font-bold text-green-600">{metrics.roi}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-50 rounded">
              <label className="text-sm text-slate-600">Spend</label>
              <input
                type="number"
                value={channel.spend}
                onChange={(e) => handleChannelUpdate(index, 'spend', e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-white"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <label className="text-sm text-slate-600">Leads</label>
              <input
                type="number"
                value={channel.leads}
                onChange={(e) => handleChannelUpdate(index, 'leads', e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-white"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <label className="text-sm text-slate-600">Opportunities</label>
              <input
                type="number"
                value={channel.opportunities}
                onChange={(e) => handleChannelUpdate(index, 'opportunities', e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-white"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <label className="text-sm text-slate-600">Deals</label>
              <input
                type="number"
                value={channel.deals}
                onChange={(e) => handleChannelUpdate(index, 'deals', e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-white"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <label className="text-sm text-slate-600">Revenue</label>
              <input
                type="number"
                value={channel.revenue}
                onChange={(e) => handleChannelUpdate(index, 'revenue', e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PerformanceChart = () => {
    const chartData = channels.map(channel => ({
      name: channel.name,
      roi: parseFloat(calculateMetrics(channel).roi),
      cpl: parseFloat(calculateMetrics(channel).cpl),
      conversionRate: parseFloat(calculateMetrics(channel).conversionRate)
    }));

    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="roi"
              stroke="#22c55e"
              name="ROI %"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cpl"
              stroke="#3b82f6"
              name="Cost per Lead ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversionRate"
              stroke="#f59e0b"
              name="Conversion Rate %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Marketing ROI Calculator
        </h1>
        <button
          onClick={() => setChannels([...channels, {
            name: `Channel ${channels.length + 1}`,
            spend: 0,
            leads: 0,
            opportunities: 0,
            deals: 0,
            revenue: 0,
            timeframe: 'Q1'
          }])}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Channel
        </button>
      </div>

      <AIInsightPanel channels={channels} />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceChart />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {channels.map((channel, index) => (
          <ChannelMetrics key={index} channel={channel} index={index} />
        ))}
      </div>
    </div>
  );
};

export default MarketingROICalculator;