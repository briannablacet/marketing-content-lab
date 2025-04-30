// src/pages/index.tsx

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { GetStaticProps } from 'next';
import AnimatedHeader from '../components/AnimatedHeader';

interface CheckIconProps {
  className?: string;
}

const CheckIcon = (props: CheckIconProps) => (
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

interface MarketingState {
  currentStep: number;
  completedSteps: number[];
}

interface HomeProps {
  initialMarketingState: MarketingState;
}

export default function Home({ initialMarketingState }: HomeProps) {
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

  interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    isNew?: boolean;
  }

  const renderToolCard = ({ title, description, href, isNew = false }: ToolCardProps) => (
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
    <div className="bg-[#FFFFFF]">
      <div className="text-center my-8">
        <AnimatedHeader />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Start with strategy. Scale with intention.
        </h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-base text-gray-600 font-normal mb-8">
            Marketing Content Lab turns your voice, messaging, and goals into content that connects &mdash; aligned, reusable, and actually worth publishing.
            Finally, a content-marketing solution that understands how real-world content marketing actually works.
          </p>
        </div>
        <Link
          href="/walkthrough/1"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Build Your Stellar Strategy →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Strategic Analysis Tools */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl pt-2 px-8 pb-8 border border-blue-100">
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
          {renderToolCard({
            title: "Competitive Analysis",
            description: "Analyze competitor messaging and identify market opportunities in minutes",
            href: "/competitive-analysis",
            isNew: true
          })}

          {renderToolCard({
            title: "Product Definition",
            description: "Define your product features and benefits to build compelling value propositions",
            href: "/product",
            isNew: true
          })}

          {renderToolCard({
            title: "Messaging Framework",
            description: "Generate comprehensive messaging frameworks that resonate",
            href: "/key-messages",
            isNew: true
          })}
        </div>
      </div>

      {/* Content Tools Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Content Tools</h2>
        <p className="text-gray-600 mb-6">AI-powered, human-led content creation: quality, authenticity and scale</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderToolCard({
            title: "Content Creation Hub",
            description: "Create high-quality content with AI assistance and human oversight",
            href: "/creation-hub"
          })}

          {renderToolCard({
            title: "Content Humanizer",
            description: "Ensure your AI-generated content maintains a natural, human touch",
            href: "/content-humanizer",
            isNew: true
          })}

          {renderToolCard({
            title: "Content Repurposer",
            description: "Scale your content by transforming existing pieces into multiple formats",
            href: "/content-repurposer",
            isNew: true
          })}

          {renderToolCard({
            title: "Set Your Style",
            description: "Automatically set and verify content against your brand style guidelines",
            href: "/style-checker",
            isNew: true
          })}

          {renderToolCard({
            title: "Campaign Builder",
            description: "Set a theme and create multiple pieces of content for any funnel stage",
            href: "/campaign-builder"
          })}
        </div>
      </div>

      {/* Progress Section - Show if walkthrough in progress */}
      {
        marketingState.currentStep > 1 && (
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
        )
      }
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