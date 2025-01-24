// src/components/features/LeadScoringModule/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../../shared/UIComponents';

interface ScoringCriteria {
  description: string;
  weights: Record<string, number>;
}

const SCORING_CRITERIA: Record<string, ScoringCriteria> = {
  'Budget Match': {
    description: 'Does their budget align with our solution?',
    weights: {
      'Above Target': 30,
      'At Target': 25,
      'Below Target': 10
    }
  },
  'Industry Fit': {
    description: 'How well do they match our target industries?',
    weights: {
      'Perfect Match': 20,
      'Related Industry': 15,
      'Different Industry': 5
    }
  },
  'Engagement Level': {
    description: 'How engaged are they with our content?',
    weights: {
      'High': 25,
      'Medium': 15,
      'Low': 5
    }
  },
  'Decision Timeline': {
    description: 'When are they planning to make a decision?',
    weights: {
      '0-3 months': 25,
      '3-6 months': 15,
      '6+ months': 5
    }
  }
};

const LeadScoringModule: React.FC = () => {
  const router = useRouter();
  const isWalkthrough = router.pathname.includes('/walkthrough');
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      console.log('Auto-saving lead scoring data...', scores);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [scores]);

  const handleScoreChange = (criteria: string, level: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [criteria]: score
    }));
  };

  const content = (
    <>
      <div className="space-y-4">
        {Object.entries(SCORING_CRITERIA).map(([name, criteria]) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{criteria.description}</p>
              <div className="space-y-3">
                {Object.entries(criteria.weights).map(([level, score]) => (
                  <div key={level} className="flex items-center space-x-4">
                    <input
                      type="radio"
                      name={name}
                      id={`${name}-${level}`}
                      value={score}
                      checked={scores[name] === score}
                      onChange={(e) => handleScoreChange(name, level, parseInt(e.target.value))}
                      className="text-blue-600"
                    />
                    <label htmlFor={`${name}-${level}`} className="flex-grow text-sm text-slate-700">
                      {level}
                    </label>
                    <span className="text-sm font-medium text-slate-900">{score} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {Object.values(scores).reduce((a, b) => a + b, 0)} pts
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <ScreenTemplate
      title="Let's set up your lead scoring system 📊"
      subtitle="We'll help you identify and prioritize your most promising leads."
      isWalkthrough={isWalkthrough}
      currentStep={isWalkthrough ? 6 : undefined}
      totalSteps={isWalkthrough ? 9 : undefined}
      aiInsights={[
        "Based on your budget allocation and target persona, we've customized the scoring weights to align with your goals."
      ]}
      onNext={isWalkthrough ? () => router.push('/walkthrough/7') : undefined}
      onBack={isWalkthrough ? () => router.back() : undefined}
    >
      {content}
    </ScreenTemplate>
  );
};

export default LeadScoringModule;