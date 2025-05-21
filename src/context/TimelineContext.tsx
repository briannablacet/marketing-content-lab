// src/contexts/TimelineContext.tsx
import React, { createContext, useContext, useState } from 'react';

const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
  const [timeline, setTimeline] = useState({
    events: [],
    tasks: [],
    dependencies: {}
  });

  const [resources, setResources] = useState({
    budget: {},
    personnel: {},
    materials: {}
  });

  const addEvent = (event) => {
    const { type, date, requirements } = event;
    
    // Calculate resource allocation
    const resourceNeeds = calculateResourceNeeds(type, requirements);
    
    // Check for conflicts
    const conflicts = checkResourceConflicts(date, resourceNeeds);
    
    if (conflicts.length > 0) {
      return { success: false, conflicts };
    }

    setTimeline(prev => ({
      ...prev,
      events: [...prev.events, {
        ...event,
        id: generateEventId(),
        resources: resourceNeeds
      }]
    }));

    // Update resource allocation
    allocateResources(date, resourceNeeds);
    
    return { success: true };
  };

  const updateEvent = (eventId, updates) => {
    // Handle resource reallocation
    const event = timeline.events.find(e => e.id === eventId);
    if (event) {
      deallocateResources(event.date, event.resources);
    }

    setTimeline(prev => ({
      ...prev,
      events: prev.events.map(e => 
        e.id === eventId ? { ...e, ...updates } : e
      )
    }));

    // Allocate new resources
    if (updates.date || updates.requirements) {
      const updatedEvent = {
        ...event,
        ...updates
      };
      allocateResources(
        updatedEvent.date, 
        calculateResourceNeeds(updatedEvent.type, updatedEvent.requirements)
      );
    }
  };

  // Helper functions
  const calculateResourceNeeds = (type, requirements) => {
    // Implementation for calculating resource needs
    return {};
  };

  const checkResourceConflicts = (date, resources) => {
    // Implementation for checking conflicts
    return [];
  };

  const allocateResources = (date, resources) => {
    // Implementation for allocating resources
    return true;
  };

  const deallocateResources = (date, resources) => {
    // Implementation for deallocating resources
    return true;
  };

  const generateEventId = () => {
    return Date.now().toString();
  };

  return (
    <TimelineContext.Provider value={{
      timeline,
      resources,
      addEvent,
      updateEvent
    }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => useContext(TimelineContext);
