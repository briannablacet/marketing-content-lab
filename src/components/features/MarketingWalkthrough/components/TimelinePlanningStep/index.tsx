// TimelinePlanningStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface Event {
  name: string;
  quarter: number;
  type: string;
}

const TimelinePlanningStep = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = () => {
    setEvents([...events, { name: '', quarter: 1, type: 'Content' }]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(quarter => (
          <Card key={quarter} className="p-4">
            <h3 className="font-semibold mb-4">Q{quarter}</h3>
            {events
              .filter(event => event.quarter === quarter)
              .map((event, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                  <input
                    value={event.name}
                    onChange={(e) => {
                      const newEvents = [...events];
                      newEvents[events.indexOf(event)].name = e.target.value;
                      setEvents(newEvents);
                    }}
                    className="w-full p-1 border rounded mb-1"
                    placeholder="Event name"
                  />
                  <select
                    value={event.type}
                    onChange={(e) => {
                      const newEvents = [...events];
                      newEvents[events.indexOf(event)].type = e.target.value;
                      setEvents(newEvents);
                    }}
                    className="w-full p-1 border rounded"
                  >
                    <option>Content</option>
                    <option>Event</option>
                    <option>Campaign</option>
                  </select>
                </div>
              ))}
          </Card>
        ))}
      </div>
      <button
        onClick={addEvent}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg"
      >
        + Add Event
      </button>
    </div>
  );
};

export default TimelinePlanningStep;