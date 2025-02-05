# MarketMultiplier.ai

## Project Overview
MarketMultiplier.ai is a sophisticated marketing program builder designed for SMBs, with a focus on B2B tech and cybersecurity sectors. Built with Next.js, React, and Tailwind CSS.

## Directory Structure
```
project-root/
├── .env.local                      # Environment variables (API keys)
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── ContentStrategyModule/
│   │   │   │   └── index.tsx       # Content strategy selection
│   │   │   ├── CreationHub/
│   │   │   │   └── index.tsx       # Content creation interface
│   │   │   └── ContentCreator/
│   │   │       └── index.tsx       # Individual content type creator
│   │   ├── shared/
│   │   │   ├── AutosaveIndicator.tsx
│   │   │   └── UIComponents.tsx
│   │   └── ui/                     # shadcn/ui components
│   ├── context/
│   │   ├── ContentContext.tsx      # Content management state
│   │   └── MarketingContext.tsx    # Marketing program state
│   ├── services/
│   │   └── contentService.tsx      # Content generation API client
│   └── pages/
│       ├── api/
│       │   └── generate-content.ts  # Content generation API endpoint
│       ├── content-strategy.tsx     # Content strategy page
│       └── creation-hub.tsx        # Content creation page
```

## Features

### Content Strategy
- Selection of content types
- AI-assisted content creation
- Dual rendering support (standalone and walkthrough)

### Content Creation
- API-based content generation
- Support for multiple content types
- Real-time content preview
- Integration with OpenAI's GPT-4

## Setup Requirements
1. Node.js and npm installed
2. OpenAI API key
3. Environment variables configured

## Environment Setup
1. Create `.env.local` in project root:
```
OPENAI_API_KEY=your_api_key_here
```

2. Install dependencies:
```bash
npm install openai
```

## API Routes
The application uses Next.js API routes for server-side functionality:

### /api/generate-content
- Purpose: Generates content using OpenAI's GPT-4
- Method: POST
- Body: 
  ```typescript
  {
    contentType: string;
    topic: string;
    keywords: string[];
  }
  ```
- Response: Generated content as string

## Services
Content generation is handled through a dedicated service layer:

### contentService
- Location: `src/services/contentService.tsx`
- Purpose: Client-side API wrapper for content generation
- Methods:
  - generateContent(): Handles content generation requests

## Testing
To test the content generation:
1. Ensure environment variables are set
2. Navigate to the Creation Hub
3. Use the test button in the interface
4. Check console for any errors

## Development Notes
- Keep API keys secure and never commit .env files
- Content generation uses GPT-4 for optimal results
- API routes should be monitored for rate limiting

## Future Enhancements
- Additional content type support
- Enhanced error handling
- Content revision history
- Template management