// src/types/WritingStyle.tsx
import React from 'react';

export interface WritingStyleData {
  styleGuide: {
    primary: string;
    overrides: boolean;
  };
  formatting: {
    headings: string;
    numbers: string;
    dates: string;
    lists: string;
  };
  punctuation: {
    oxfordComma: boolean;
    bulletPoints: string;
    quotes: string;
  };
}

export interface WritingStyleProps {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}