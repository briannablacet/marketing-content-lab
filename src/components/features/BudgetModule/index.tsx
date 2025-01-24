import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CHANNEL_BENCHMARKS = {
  B2B_TECH: {
    'Content Marketing': {
      allocation: 0.25,
      subChannels: {
        'Blog Content': 0.30,
        'White Papers': 0.25,
        'Case Studies': 0.25,
        'Video Content': 0.20
      }
    },
    'Paid Search': {
      allocation: 0.15,
      subChannels: {
        'Google Ads': 0.70,
        'Bing Ads': 0.20,
        'Retargeting': 0.10
      }
    },
    'Events': {
      allocation: 0.25,
      subChannels: {
        'Trade Shows': {
          allocation: 0.50,
          details: {
            costRanges: {
              'Booth Space': '5000-15000',
              'Setup & Materials': '2000-5000',
              'Staff Travel': '3000-8000'
            },
            leadProjections: {
              'Booth Visitors': '200-500',
              'Qualified Leads': '50-100'
            }
          }
        },
        'Webinars': {
          allocation: 0.30,
          details: {
            costRanges: {
              'Platform': '500-1000',
              'Promotion': '1000-3000',
              'Content Development': '2000-4000'
            },
            leadProjections: {
              'Registrants': '150-300',
              'Attendees': '75-150'
            }
          }
        },
        'Partner Events': {
          allocation: 0.20,
          details: {
            costRanges: {
              'Sponsorship': '3000-10000',
              'Materials': '1000-3000'
            },
            leadProjections: {
              'Attendees': '100-200',
              'Qualified Leads': '20-40'
            }
          }
        }
      }
    },
    'Social Media': {
      allocation: 0.15,
      subChannels: {
        'LinkedIn Ads': 0.50,
        'Twitter Ads': 0.20,
        'Content Promotion': 0.30
      }
    },
    'Email Marketing': {
      allocation: 0.10,
      subChannels: {
        'Newsletter': 0.30,
        'Nurture Campaigns': 0.40,
        'Account-Based': 0.30
      }
    },
    'Partner Marketing': {
      allocation: 0.10,
      subChannels: {
        'Co-marketing': 0.40,
        'Partner Enablement': 0.30,
        'Joint Campaigns': 0.30
      }
    }
  }
};

const BudgetModule = () => {
  const [budget, setBudget] = useState({
    totalBudget: '50000',
    channelAllocation: {},
    events: {
      'Trade Shows': [],
      'Webinars': [],
      'Partner Events': []
    },
    expectedROI: '2.4'
  });
  const [activeChannel, setActiveChannel] = useState(null);
  const [showEventPlanner, setShowEventPlanner] = useState(false);

  const ChannelAllocation = ({ value, onChange, benchmarks }) => (
    <div className="space-y-4">
      {Object.entries(benchmarks).map(([channel, data]) => (
        <div key={channel} className="space-y-2">
          <div className="flex items-center space-x-4">
            <label className="w-32 text-sm font-medium text-slate-900">{channel}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value[channel]?.allocation || data.allocation * 100}
              onChange={(e) => onChange(channel, parseInt(e.target.value))}
              className="flex-grow"
            />
            <span className="w-16 text-sm text-slate-600">
              {value[channel]?.allocation || Math.round(data.allocation * 100)}%
            </span>
            {data.subChannels && (
              <button
                onClick={() => setActiveChannel(channel)}
                className="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                Details →
              </button>
            )}
          </div>
          {activeChannel === channel && data.subChannels && (
            <div className="ml-8 p-4 bg-slate-50 rounded">
              <h4 className="text-sm font-medium mb-2">{channel} Breakdown</h4>
              {Object.entries(data.subChannels).map(([subChannel, subData]) => (
                <div key={subChannel} className="flex items-center space-x-4 mb-2">
                  <label className="w-32 text-sm text-slate-600">{subChannel}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value[channel]?.subChannels?.[subChannel] || subData.allocation * 100}
                    onChange={(e) => onChange(`${channel}.${subChannel}`, parseInt(e.target.value))}
                    className="flex-grow"
                  />
                  <span className="w-16 text-sm text-slate-600">
                    {value[channel]?.subChannels?.[subChannel] || Math.round(subData.allocation * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const EventPlanner = ({ events, onUpdate }) => {
    const addEvent = (type) => {
      const typeData = CHANNEL_BENCHMARKS.B2B_TECH.Events.subChannels[type];
      onUpdate({
        ...events,
        [type]: [...events[type], {
          name: `${type} ${events[type].length + 1}`,
          budget: 0,
          projectedLeads: typeData.details.leadProjections['Qualified Leads'].split('-')[0],
          quarter: Math.floor(events[type].length / 3) + 1,
          details: {}
        }]
      });
    };

    return (
      <div className="mt-6 p-6 bg-white rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold mb-4">Event Planning</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(events).map(([type, typeEvents]) => (
            <div key={type} className="space-y-4">
              <h4 className="font-medium">{type}</h4>
              {typeEvents.map((event, index) => (
                <div key={index} className="p-4 border rounded">
                  <input
                    type="text"
                    value={event.name}
                    onChange={(e) => {
                      const newEvents = {...events};
                      newEvents[type][index].name = e.target.value;
                      onUpdate(newEvents);
                    }}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-slate-600">Budget</label>
                      <input
                        type="number"
                        value={event.budget}
                        onChange={(e) => {
                          const newEvents = {...events};
                          newEvents[type][index].budget = Number(e.target.value);
                          onUpdate(newEvents);
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Quarter</label>
                      <select
                        value={event.quarter}
                        onChange={(e) => {
                          const newEvents = {...events};
                          newEvents[type][index].quarter = Number(e.target.value);
                          onUpdate(newEvents);
                        }}
                        className="w-full p-2 border rounded"
                      >
                        {[1,2,3,4].map(q => (
                          <option key={q} value={q}>Q{q}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addEvent(type)}
                className="w-full p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                + Add {type}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BudgetProjections = ({ totalBudget, allocation, events }) => {
    const calculateTotalEventBudget = () => {
      return Object.values(events).reduce((total, typeEvents) =>
        total + typeEvents.reduce((sum, event) => sum + event.budget, 0), 0
      );
    };

    const eventBudget = calculateTotalEventBudget();
    const remainingBudget = totalBudget - eventBudget;

    const chartData = Object.entries(allocation).map(([channel, value]) => ({
      name: channel,
      budget: (remainingBudget * (value.allocation / 100)).toFixed(2)
    }));

    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-600">Total Budget</p>
                <p className="text-2xl font-bold text-slate-900">${parseInt(totalBudget).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Event Budget</p>
                <p className="text-2xl font-bold text-blue-600">${eventBudget.toLocaleString()}</p>
                <p className="text-sm text-slate-600">
                  ({Math.round(eventBudget / totalBudget * 100)}%)
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Channel Budget</p>
                <p className="text-2xl font-bold text-blue-600">${remainingBudget.toLocaleString()}</p>
                <p className="text-sm text-slate-600">
                  ({Math.round(remainingBudget / totalBudget * 100)}%)
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Projected ROI</p>
                <p className="text-2xl font-bold text-green-600">2.4x</p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="budget" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Budget Allocation</h1>
        <p className="text-slate-600">Plan your marketing budget across channels and events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">$</span>
            <input
              type="number"
              value={budget.totalBudget}
              onChange={(e) => setBudget(prev => ({
                ...prev,
                totalBudget: e.target.value
              }))}
              className="w-48 p-2 border rounded"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Channel Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Channel Distribution</h3>
            <button
              onClick={() => setShowEventPlanner(!showEventPlanner)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showEventPlanner ? 'Hide Event Planner' : 'Plan Events →'}
            </button>
          </div>

          <ChannelAllocation
            value={budget.channelAllocation}
            onChange={(channel, value) => {
              setBudget(prev => ({
                ...prev,
                channelAllocation: {
                  ...prev.channelAllocation,
                  [channel]: { allocation: value }
                }
              }));
            }}
            benchmarks={CHANNEL_BENCHMARKS.B2B_TECH}
          />
        </CardContent>
      </Card>

      {showEventPlanner && (
        <EventPlanner
          events={budget.events}
          onUpdate={(newEvents) => setBudget(prev => ({
            ...prev,
            events: newEvents
          }))}
        />
      )}

      <BudgetProjections
        totalBudget={Number(budget.totalBudget)}
        allocation={budget.channelAllocation}
        events={budget.events}
      />
    </div>
  );
};

export default BudgetModule;
