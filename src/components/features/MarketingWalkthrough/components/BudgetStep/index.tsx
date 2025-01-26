// BudgetStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const BudgetStep = () => {
  const [budget, setBudget] = useState({
    totalBudget: '',
    allocation: {
      'Content Marketing': 30,
      'Digital Advertising': 25,
      'Events': 20,
      'Social Media': 15,
      'Partner Marketing': 10
    }
  });

  const handleAllocationChange = (channel: string, value: number) => {
    setBudget(prev => ({
      ...prev,
      allocation: {
        ...prev.allocation,
        [channel]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Total Budget</h3>
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">$</span>
          <input
            type="number"
            value={budget.totalBudget}
            onChange={(e) => setBudget({...budget, totalBudget: e.target.value})}
            className="flex-1 p-2 border rounded"
            placeholder="Enter total budget"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Channel Allocation</h3>
        {Object.entries(budget.allocation).map(([channel, percentage]) => (
          <div key={channel} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{channel}</span>
              <span>{percentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => handleAllocationChange(channel, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default BudgetStep;