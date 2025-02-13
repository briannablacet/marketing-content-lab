// src/utils/WritingStyleValidation.tsx
import { WritingStyleData } from '../types/WritingStyle';

interface ValidationError {
  field: string;
  message: string;
}

export const validateWritingStyle = (data: WritingStyleData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Custom date format validation regex
  const dateFormatRegex = /^(MM|DD|YYYY|Month)[\/-\s]*(MM|DD|YYYY|Month)?[\/-\s]*(MM|DD|YYYY|Month)?$/;

  // Only validate if values are provided (since fields are optional)
  if (data.formatting.dates && !dateFormatRegex.test(data.formatting.dates)) {
    errors.push({
      field: 'dates',
      message: 'Date format must be a valid pattern using MM, DD, YYYY, or Month'
    });
  }

  // Validate heading consistency if heading style is provided
  if (data.formatting.headings === 'Custom' && !data.formatting.headingCustom) {
    errors.push({
      field: 'headings',
      message: 'Please specify your custom heading style rules'
    });
  }

  // Validate bullet point style consistency
  if (data.punctuation.bulletPoints === 'Period if complete sentence' && 
      data.formatting.lists && 
      !data.formatting.lists.includes('sentence')) {
    errors.push({
      field: 'bulletPoints',
      message: 'Bullet point style conflicts with list formatting rules'
    });
  }

  // Style guide specific validations
  if (data.styleGuide.primary === 'Custom Style Guide' && 
      !data.styleGuide.customRules?.length) {
    errors.push({
      field: 'styleGuide',
      message: 'Please define at least one custom style rule'
    });
  }

  return errors;
};

// Helper function to get field-specific error message
export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  const error = errors.find(err => err.field === field);
  return error?.message;
};

// Check if a specific field has an error
export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(err => err.field === field);
};

// Format validation error for display
export const formatValidationError = (error: ValidationError): string => {
  return `${error.message} (${error.field})`;
};