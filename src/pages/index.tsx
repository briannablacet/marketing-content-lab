// src/pages/index.tsx

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { GetStaticProps } from 'next';

// Define the SVG check icon as a React component
const CheckIcon = (props) => (
  <svg 
    className={props.className || "h-6 w-6 text-blue-500 mr-2"} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
);

export default function Home({ initialMarketingState }) {
  // Instead of using the context directly, start with the initial state
  // and only enhance with context on the client side
  const [marketingState, setMarketingState] = React.useState(initialMarketingState || { 
    currentStep: 0,
    completedSteps: []
  });
  
  // Only use context on the client side to avoid SSR issues
  React.useEffect(() => {
    // Import dynamically to avoid SSR issues
    const importModule = async () => {
      try {
        const { useMarketing } = await import('../context/MarketingContext');
        const { useContent } = await import('../context/ContentContext');
        
        // Now we can safely use the context
        if (typeof useMarketing === 'function') {
          const { state } = useMarketing();
          if (state) {
            setMarketingState(state);
          }
        }
      } catch (error) {
        console.error('Error loading context:', error);
      }
    };
    
    importModule();
  }, []);

  // Function to render tool cards with optional icon
  const renderToolCard = (title, description, href, isNew = false) => (
    <Link href={href} key={title}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative">
        {isNew && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            New
          </span>
        )}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Enhanced Hero Section */}
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Marketing Content Lab
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 mb-4">
            The only solution by content marketers for content marketers. 
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Create, enhance, repurpose, and scale your content with AI assistance. Automate tedious tasks and close skills gaps while preserving your authentic voice and your unique, human touch.
          </p>
        </div>
        <Link 
          href="/walkthrough/1" 
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Start Building Your Program →
        </Link>
      </div>

      {/* Value Proposition Sections */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Strategic Analysis Tools */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Strategic Analysis</h2>
          <p className="text-blue-800 mb-6">
            Transform hours of competitive research into minutes of actionable insights
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 text-blue-500 mr-2" />
              <span>Automated competitive messaging analysis</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 text-blue-500 mr-2" />
              <span>AI-assisted value proposition development</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 text-blue-500 mr-2" />
              <span>Intelligent market positioning insights</span>
            </li>
          </ul>
        </div>

        {/* Content Creation Tools */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-green-100">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Content Excellence</h2>
          <p className="text-green-800 mb-6">
            Enhance your team's capabilities while maintaining authentic human creativity
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 text-green-500 mr-2" />
              <span>AI-assisted content creation with human oversight</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 text-green-500 mr-2" />
              <span>Brand voice preservation and enhancement</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 text-green-500 mr-2" />
              <span>Quality-focused content optimization</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Strategic Tools Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Strategic Tools</h2>
        <p className="text-gray-600 mb-6">Transform your product marketing strategy with AI-powered insights</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderToolCard(
            "Competitive Analysis",
            "Analyze competitor messaging and identify market opportunities in minutes",
            "/competitive-analysis",
            true
          )}
          
          {renderToolCard(
            "Product Definition",
            "Define your product features and benefits to build compelling value propositions",
            "/product",
            true
          )}

          {renderToolCard(
            "Messaging Framework",
            "Generate comprehensive messaging frameworks that resonate",
            "/key-messages",
            true
          )}
        </div>
      </div>

      {/* Content Tools Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Content Tools</h2>
        <p className="text-gray-600 mb-6">AI-powered, human-led content creation: quality, authenticity and scale</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderToolCard(
            "Content Creation Hub",
            "Create high-quality content with AI assistance and human oversight",
            "/creation-hub"
          )}
          
          {renderToolCard(
            "Content Humanizer",
            "Ensure your AI-generated content maintains a natural, human touch",
            "/content-humanizer",
            true
          )}

          {renderToolCard(
            "Content Repurposer",
            "Scale your content by transforming existing pieces into multiple formats",
            "/content-repurposer",
            true
          )}

          {renderToolCard(
            "Set Your Style",
            "Automatically set and verify content against your brand style guidelines",
            "/style-checker",
            true
          )}

          {renderToolCard(
            "SEO Keywords",
            "Discover high-value keywords to target in your content marketing",
            "/seo-keywords",
            true
          )}

          {renderToolCard(
            "Campaign Builder",
            "Set a theme and create multiple pieces of content for any funnel stage",
            "/brand-voice"
          )}
        </div>
      </div>
      
      {/* Progress Section - Show if walkthrough in progress */}
      {marketingState.currentStep > 1 && (
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Continue Your Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Walkthrough Progress:</span>
              <span className="font-medium">
                {marketingState.completedSteps.length} steps completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(marketingState.completedSteps.length / 8) * 100}%` 
                }}
              ></div>
            </div>
            <Link 
              href={`/walkthrough/${marketingState.currentStep}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mt-4"
            >
              Continue Walkthrough →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Switch to getStaticProps to avoid SSR issues with context
export const getStaticProps = async () => {
  return {
    props: {
      initialMarketingState: {
        currentStep: 0,
        completedSteps: []
      }
    }
  };
};