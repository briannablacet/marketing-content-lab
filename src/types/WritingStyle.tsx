// src/types/writingStyle.ts

// Enum for predefined style guides
export enum StyleGuideType {
  AP = 'AP',
  Chicago = 'Chicago',
  Custom = 'Custom'
}

// Interface for writing style data
export interface WritingStyle {
  _id?: string;                    // MongoDB ID
  userId: string;                  // Future: for user authentication
  styleGuideType: StyleGuideType;  // Which style guide they're using
  customRules?: string;            // For custom style guide rules
  preferences?: {                  // Additional style preferences
    tone?: string;
    vocabulary?: string;
    formatting?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Interface for API responses
export interface WritingStyleResponse {
  success: boolean;
  data?: WritingStyle;
  error?: string;
}