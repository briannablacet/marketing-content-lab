// src/components/features/ContentStrategyModule/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../../shared/UIComponents';
import { useRouter } from 'next/router';

interface ContentType {
  description: string;
  frequency: string;
  effort: 'Low' | 'Medium' | 'High';
  channels: string[];
}

const CONTENT_TYPES: Record<string, ContentType> = {
  'Blog Posts': {
    description: 'In-depth articles and thought leadership',
    frequency: 'Weekly',
    effort: 'Medium',
    channels: ['Website', 'LinkedIn', 'Email']
  },
  'Case Studies': {
    description: 'Customer success stories and results',
    frequency: 'Monthly',
    effort: 'High',
    channels: ['Website', 'Sales Collateral']
  },
  'Social Posts': {
    description: 'Short-form updates and engagement',
    frequency: 'Daily',
    effort: 'Low',
    channels: ['LinkedIn', 'Twitter']
  },
  'White Papers': {
    description: 'Technical deep-dives and research',
    frequency: 'Quarterly',
    effort: 'High',
    channels: ['Website', 'Lead Magnets']
  },
  'Email Campaigns': {
    description: 'Nurture sequences and newsletters',
    frequency: 'Bi-weekly',
    effort: 'Medium',
    channels: ['Email', 'Marketing Automation']
  }
};

interface ContentTypeCardProps {
  title: string;
  details: ContentType;
  isSelected: boolean;
  onToggle: () => void;
}

const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  title,
  details,
  isSelected,
  onToggle
}) => (
  <div
    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
    }`}
    onClick={onToggle}
  >
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">{details.description}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
      }`}>
        {isSelected && <span className="text-white">✓</span>}
      </div>
    </div>
    <div className="mt-4 flex gap-4">
      <div>
        <p className="text-xs text-slate-500">Frequency</p>
        <p className="text-sm text-slate-700">{details.frequency}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Effort Level</p>
        <p className="text-sm text-slate-700">{details.effort}</p>
      </div>
    </div>
    <div className="mt-2 flex gap-2">
      {details.channels.map(channel => (
        <span
          key={channel}
          className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600"
        >
          {channel}
        </span>
      ))}
    </div>
  </div>
);

interface PublishingCalendarProps {
  selectedTypes: string[];
}

const PublishingCalendar: React.FC<PublishingCalendarProps> = ({ selectedTypes }) => (
  <div className="p-6 bg-white rounded-lg border border-slate-200">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Publishing Calendar</h3>
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array(28).fill(null).map((_, i) => (
          <div
            key={i}
            className="aspect-square border border-slate-200 rounded p-1 text-xs"
          >
            {selectedTypes.includes('Social Posts') && i % 2 === 0 && (
              <div className="bg-blue-100 rounded px-1 text-blue-700 mb-1">Social</div>
            )}
            {selectedTypes.includes('Blog Posts') && i % 7 === 3 && (
              <div className="bg-green-100 rounded px-1 text-green-700">Blog</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContentStrategyModule = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const router = useRouter();
  
  // Determine if we're in walkthrough mode
  const isWalkthrough = router.pathname.includes('/walkthrough');

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      console.log('Auto-saving content strategy...', selectedTypes);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [selectedTypes]);

  const toggleContentType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const content = (
    <>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {Object.entries(CONTENT_TYPES).map(([type, details]) => (
          <ContentTypeCard
            key={type}
            title={type}
            details={details}
            isSelected={selectedTypes.includes(type)}
            onToggle={() => toggleContentType(type)}
          />
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <div className="mt-8">
          <PublishingCalendar selectedTypes={selectedTypes} />
        </div>
      )}
    </>
  );

  return (
    <ScreenTemplate
      title="Let's plan your content strategy 📝"
      subtitle="Choose the content types that will resonate with your audience and support your goals."
      isWalkthrough={isWalkthrough}
      currentStep={isWalkthrough ? 8 : undefined}
      totalSteps={isWalkthrough ? 9 : undefined}
      aiInsights={[
        "Based on your persona and budget allocation, we recommend focusing on thought leadership content and case studies to establish authority in your space."
      ]}
       >
      {content}
    </ScreenTemplate>
  );
};

export default ContentStrategyModule;