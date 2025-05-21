# A/B Testing Implementation Guide

This guide covers the implementation of A/B testing functionality within Market Multiplier.

## Files Overview

1. **ab-testing.tsx** - Page component for creating A/B tests
2. **ABTestResultsTracker/index.tsx** - Component for tracking and analyzing test results
3. **ab-testing-dashboard.tsx** - Page component that combines creation and results in a tabbed interface
4. **api_endpoints.ts** - API endpoint handling, updated with A/B testing support

## Step-by-Step Installation Instructions

### 1. Install Required Dependencies

Install @headlessui/react for the tabbed interface:

```bash
npm install @headlessui/react
```

### 2. Update API File

Replace the contents of your `src/pages/api/api_endpoints.ts` file with the version provided. This adds support for the 'generate-variations' endpoint.

### 3. Create Components

1. Create or update `src/pages/ab-testing.tsx` with the provided code
2. Create a new folder: `src/components/features/ABTestResultsTracker`
3. Create `src/components/features/ABTestResultsTracker/index.tsx` with the code provided
4. Create `src/pages/ab-testing-dashboard.tsx` to serve as the main entry point

### 4. Add Link to Navigation

Add a link to the A/B Testing Dashboard in your navigation:

```tsx
<Link href="/ab-testing-dashboard">A/B Testing</Link>
```

### 5. Testing the Implementation

1. Start your local development server: `npm run dev`
2. Visit `/ab-testing-dashboard` in your browser
3. Try creating a new A/B test and generating variations
4. Switch to the Results tab to view and manage test results

## Customization Options

### Add More Content Types

To add more content types for testing, modify the `CONTENT_TYPES` array in `ab-testing.tsx`:

```typescript
const CONTENT_TYPES = [
  // Existing types...
  {
    id: 'new_type',
    name: 'New Type Name',
    description: 'Description of the new test type',
    examples: ['Example 1', 'Example 2', 'Example 3']
  }
];
```

Also update the `getPromptPrefix` function in `api_endpoints.ts` to handle the new type.

### Connecting to Real Test Data

The current implementation uses mock data for test results. To connect to real data:

1. Create a database schema for A/B tests
2. Implement API endpoints for CRUD operations on tests
3. Update the `ABTestResultsTracker` component to fetch data from these endpoints
4. Add tracking functionality to record impressions and conversions

## Troubleshooting

### API Issues

If variations aren't being generated:

1. Check your OpenAI API key in `.env.local`
2. Verify the API response in browser developer tools
3. Look for error messages in server logs

### Component Integration

If components aren't displaying correctly:

1. Check console for React errors
2. Verify all imports are correct
3. Ensure the component is properly mounted in the component tree

## Next Steps

1. **Implement Storage**: Create proper database storage for tests and results
2. **Add Authentication**: Restrict access to authorized users
3. **Export Results**: Add functionality to export test results as CSV
4. **Statistical Analysis**: Implement more sophisticated statistical analysis of results
5. **Test Scheduling**: Add ability to schedule tests to start and end automatically