import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TimelinePlanner = () => {
  const [phases, setPhases] = useState([
    {
      id: 1,
      name: 'Content Development',
      duration: 4,
      dependencies: [],
      tasks: [
        { name: 'Create eBooks', duration: 3 },
        { name: 'Develop Case Studies', duration: 2 },
        { name: 'Write Blog Posts', duration: 4 }
      ]
    },
    {
      id: 2,
      name: 'Campaign Setup',
      duration: 2,
      dependencies: [1],
      tasks: [
        { name: 'Set up Marketing Automation', duration: 1 },
        { name: 'Configure Lead Scoring', duration: 1 },
        { name: 'Build Email Templates', duration: 1 }
      ]
    },
    {
      id: 3,
      name: 'Channel Launch',
      duration: 3,
      dependencies: [2],
      tasks: [
        { name: 'Launch Paid Campaigns', duration: 1 },
        { name: 'Initiate Content Promotion', duration: 2 },
        { name: 'Begin Social Media Strategy', duration: 3 }
      ]
    }
  ]);

  const generateTimeline = () => {
    const processedPhases = new Set();
    const timelinePhases = [];

    while (timelinePhases.length < phases.length) {
      phases.forEach(phase => {
        if (!processedPhases.has(phase.id)) {
          const dependenciesProcessed = phase.dependencies.every(depId =>
            processedPhases.has(depId)
          );

          if (dependenciesProcessed) {
            const dependencyEndWeek = Math.max(
              0,
              ...phase.dependencies.map(depId => {
                const dep = timelinePhases.find(p => p.id === depId);
                return dep ? dep.endWeek : 0;
              })
            );

            timelinePhases.push({
              ...phase,
              startWeek: dependencyEndWeek,
              endWeek: dependencyEndWeek + phase.duration,
              tasks: phase.tasks.map(task => ({
                ...task,
                startWeek: dependencyEndWeek,
                endWeek: dependencyEndWeek + task.duration
              }))
            });
            processedPhases.add(phase.id);
          }
        }
      });
    }

    return timelinePhases;
  };

  const timeline = useMemo(() => generateTimeline(), [phases]);
  const totalWeeks = Math.max(...timeline.map(phase => phase.endWeek));

  const TimelineBar = ({ startWeek, endWeek, color = "bg-blue-500" }) => {
    const width = `${((endWeek - startWeek) / totalWeeks) * 100}%`;
    const marginLeft = `${(startWeek / totalWeeks) * 100}%`;
    
    return (
      <div
        className={`h-6 rounded ${color} absolute`}
        style={{ width, left: marginLeft }}
      />
    );
  };

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
            <span className="text-lg">📅</span>
            <p className="text-slate-600">Project duration: {totalWeeks} weeks</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">⚡</span>
            <p className="text-slate-600">Critical path: Content Development → Campaign Setup</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📊</span>
            <p className="text-slate-600">Resource utilization peaks in week {Math.floor(totalWeeks / 2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TimelineChart = () => (
    <div className="mt-8">
      {/* Timeline Header */}
      <div className="flex mb-2">
        <div className="w-48"></div>
        <div className="flex-1 flex">
          {Array.from({ length: totalWeeks }).map((_, week) => (
            <div key={week} className="flex-1 text-center text-sm text-slate-600">
              W{week + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Phase Timelines */}
      {timeline.map(phase => (
        <div key={phase.id} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{phase.name}</h3>
          
          {/* Phase Timeline */}
          <div className="flex items-center mb-2">
            <div className="w-48 pr-4 text-sm text-slate-600">Phase Timeline</div>
            <div className="flex-1 relative h-6">
              <TimelineBar startWeek={phase.startWeek} endWeek={phase.endWeek} />
            </div>
          </div>

          {/* Task Timelines */}
          {phase.tasks.map((task, taskIndex) => (
            <div key={taskIndex} className="flex items-center mb-1">
              <div className="w-48 pr-4 text-sm text-slate-600 pl-4">
                {task.name}
              </div>
              <div className="flex-1 relative h-6">
                <TimelineBar
                  startWeek={task.startWeek}
                  endWeek={task.endWeek}
                  color="bg-blue-300"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const ResourceAllocation = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Content Creator', 'Designer', 'Campaign Manager'].map(resource => (
            <div key={resource} className="p-4 bg-slate-50 rounded">
              <h4 className="font-medium mb-2">{resource}</h4>
              <div className="space-y-2">
                {timeline.flatMap(phase => 
                  phase.tasks.map(task => ({
                    phase: phase.name,
                    task: task.name,
                    weeks: task.endWeek - task.startWeek
                  }))
                ).map((allocation, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{allocation.task}</span>
                    <span className="text-slate-600">{allocation.weeks} weeks</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const content = (
    <>
      <AIInsights />
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">Total Duration</p>
              <p className="text-2xl font-bold text-slate-900">{totalWeeks} weeks</p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">Total Phases</p>
              <p className="text-2xl font-bold text-slate-900">{phases.length}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {phases.reduce((sum, phase) => sum + phase.tasks.length, 0)}
              </p>
            </div>
          </div>

          {/* Timeline Chart */}
          <TimelineChart />
        </CardContent>
      </Card>
      <ResourceAllocation />
    </>
  );

  // If being used in a walkthrough, wrap with ScreenTemplate
  if (typeof ScreenTemplate !== 'undefined') {
    return (
      <ScreenTemplate
        title="Marketing Timeline"
        subtitle="Plan and track your marketing program timeline"
        aiInsights={[
          `Total project duration: ${totalWeeks} weeks`,
          "Critical path identified through content and campaign setup",
          "Resource allocation optimized for efficiency"
        ]}
      >
        {content}
      </ScreenTemplate>
    );
  }

  // Standalone version
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Marketing Timeline</h1>
      {content}
    </div>
  );
};

export default TimelinePlanner;