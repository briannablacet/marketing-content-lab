# Market Multiplier Technical Documentation

## Project Overview
Market Multiplier is a Next.js application designed to help businesses create sophisticated marketing programs. Built with React, TypeScript, and MongoDB, it uses Tailwind CSS for styling.

## Technical Stack
- **Frontend**: Next.js with TypeScript
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **API**: Next.js API Routes

## Project Structure
```
market-multiplier/
├── src/
│   ├── pages/
│   │   ├── _app.tsx                 # App configuration and providers
│   │   ├── api/
│   │   │   ├── test-connection.ts   # MongoDB connection test
│   │   │   └── writing-style.ts     # Writing style CRUD operations
│   │   └── test-writing-style.tsx   # Test page for MongoDB operations
│   ├── lib/
│   │   └── mongodb.ts               # MongoDB connection configuration
│   ├── types/
│   │   └── writingStyle.ts          # TypeScript interfaces and types
│   ├── context/
│   │   ├── StyleGuideContext.tsx    # Style guide state management
│   │   └── MarketingContext.tsx     # Marketing program state management
│   └── styles/
│       └── globals.css              # Global styles
├── .env.local                       # Environment variables (not in git)
├── .env.example                     # Example environment variables
└── tsconfig.json                    # TypeScript configuration
```

## Database Configuration
- **Platform**: MongoDB Atlas
- **Connection**: Environment variables in `.env.local`
- **Collections**:
  - `writingStyles`: Writing style preferences and rules

## API Routes
### Writing Style API (`/api/writing-style`)
- **GET**: Retrieve writing style
- **POST**: Create new writing style
- **PUT**: Update existing writing style

## Context Providers
1. **MarketingProgramProvider**
   - Manages marketing program state
   - Required for all pages using marketing features

2. **StyleGuideProvider**
   - Manages writing style preferences
   - Integrates with MongoDB for persistence

## Environment Variables
Required variables in `.env.local`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

## Recent Updates (February 12, 2025)
1. **MongoDB Integration**
   - Set up MongoDB Atlas cluster
   - Configured database connection
   - Added connection testing endpoint
   - Created first collection (writingStyles)

2. **Type Definitions**
   - Added WritingStyle interface
   - Created StyleGuideType enum
   - Added API response types

3. **Testing**
   - Added test page for writing style operations
   - Implemented basic CRUD operations
   - Added error handling and loading states

## Development Guidelines
1. **File Naming**
   - TypeScript files: camelCase (`writingStyle.ts`)
   - Page components: kebab-case (`test-writing-style.tsx`)
   - React components: PascalCase (`TestWritingStyle`)

2. **Database Operations**
   - Use provided MongoDB client from `lib/mongodb.ts`
   - Always include error handling
   - Use TypeScript interfaces for data validation

3. **Environment Variables**
   - Never commit `.env.local`
   - Use `.env.example` for documentation
   - Always validate environment variables before use

## Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env.local` with MongoDB credentials
4. Run development server: `npm run dev`
5. Visit http://localhost:3000

## Testing
- MongoDB connection: `/api/test-connection`
- Writing style operations: `/test-writing-style`

## Notes
- MongoDB passwords should not contain special characters like `@` to avoid connection string parsing issues
- All API routes should include proper error handling and type checking
- Context providers must wrap components using their hooks

## Next Steps
1. Complete MVP feature definition
2. Migrate existing localStorage data to MongoDB
3. Implement remaining API routes
4. Add user authentication