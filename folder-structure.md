
├── components
│   ├── features
│   │   ├── BudgetModule
│   │   │   └── index.tsx
│   │   ├── CompetitorAnalysisDashboard
│   │   │   └── index.tsx
│   │   ├── ContentCreator
│   │   │   └── index.tsx
│   │   ├── ContentEngine
│   │   │   ├── index.tsx
│   │   │   └── screens
│   │   │       ├── CompetitorInput.tsx
│   │   │       ├── ContentPreview.tsx
│   │   │       ├── KeyMessages.tsx
│   │   │       └── UploadScreen.tsx
│   │   ├── ContentEnhancer
│   │   │   ├── contentGuidelines.tsx
│   │   │   ├── index-backup.tsx
│   │   │   └── index.tsx
│   │   ├── ContentStrategyModule
│   │   │   └── index.tsx
│   │   ├── CreationHub
│   │   │   └── index.tsx
│   │   ├── DemoWalkthrough
│   │   │   └── index.tsx
│   │   ├── LeadScoringModule
│   │   │   └── index.tsx
│   │   ├── MarketingROICalculator
│   │   │   └── index.tsx
│   │   ├── MarketingWalkthrough
│   │   │   ├── components
│   │   │   │   ├── BudgetStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── ChannelSelectionStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── CompetitiveStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── ContentStrategyStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── MessagingStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── PersonaStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── ReviewStep
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── TimelinePlanningStep
│   │   │   │   │   └── index.tsx
│   │   │   │   └── WelcomeStep
│   │   │   │       └── index.tsx
│   │   │   └── index.tsx
│   │   ├── PipelineForecast
│   │   │   └── index.tsx
│   │   ├── PipelinePlanner
│   │   │   └── index.tsx
│   │   ├── SDRModule
│   │   │   ├── LeadQueue.tsx
│   │   │   ├── SDRActions.tsx
│   │   │   └── index.tsx
│   │   ├── ThoughtLeadershipCreator
│   │   │   └── index.tsx
│   │   ├── TimelinePlanner
│   │   │   └── index.tsx
│   │   └── WalkthroughCompletion
│   │       └── index.tsx
│   ├── shared
│   │   ├── AutosaveIndicator.tsx
│   │   ├── DemoModeToggle.tsx
│   │   ├── Navbar
│   │   │   └── index.tsx
│   │   ├── SuccessModal.tsx
│   │   └── UIComponents.js
│   └── ui
│       └── card.tsx
├── content-strategy.tsx
├── context
│   ├── AppContext.tsx
│   ├── ContentContext.tsx
│   ├── DemoModeContext.tsx
│   ├── MarketingContext.tsx
│   ├── MarketingProgramContext.js
│   ├── SDRContext.tsx
│   ├── StyleGuideContext.tsx
│   ├── TimelineContext.tsx
│   └── WalkthroughContext.tsx
├── data
│   └── contentTypesData.js
├── pages
│   ├── DemoWalkThrough
│   │   ├── [step].js
│   │   └── index.tsx
│   ├── [step].js
│   ├── _app.js
│   ├── api
│   │   └── generate-content.ts
│   ├── budget.js
│   ├── channel-mix.tsx
│   ├── competitor-analysis.tsx
│   ├── content-engine.tsx
│   ├── content-strategy.tsx
│   ├── creation-hub.tsx
│   ├── demo
│   │   ├── [step].js
│   │   └── index.tsx
│   ├── dev
│   │   ├── content-test.tsx
│   │   └── test-enhancer.tsx
│   ├── index.tsx
│   ├── lead-scoring.tsx
│   ├── marketing-roi.tsx
│   ├── pipeline-forecast.tsx
│   ├── sdr.tsx
│   ├── test.tsx.ts
│   ├── timeline.tsx
│   └── walkthrough
│       ├── [step].tsx
│       └── complete.tsx
├── services
│   └── contentService.tsx
└── styles
    └── globals.css