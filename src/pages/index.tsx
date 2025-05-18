//pages/index.tsx

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { GetStaticProps } from 'next';
import AnimatedHeader from '../components/AnimatedHeader';
import Image from 'next/image';

interface MarketingState {
  currentStep: number;
  completedSteps: number[];
}

interface HomeProps {
  initialMarketingState: MarketingState;
}

export default function Home({ initialMarketingState }: HomeProps) {
  const [marketingState, setMarketingState] = React.useState(initialMarketingState || {
    currentStep: 0,
    completedSteps: []
  });

  React.useEffect(() => {
    const importModule = async () => {
      try {
        const { useMarketing } = await import('../context/MarketingContext');
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

  const renderModuleCard = (title: string, description: string, href: string) => (
    <Link href={href} key={title}>
      <Card className="p-6 min-h-[220px] bg-white shadow-lg hover:shadow-2xl border border-gray-200 rounded-xl transition-shadow cursor-pointer">


        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </Card>
    </Link>
  );

  return (
    <div className="bg-white">
      <div className="text-center my-8">
        <div className="-mb-32">
          <Image
            src="/images/mcl-logo-new.png"
            alt="Marketing Content Lab"
            width={400}
            height={216}
            className="mx-auto"
          />
        </div>

        <AnimatedHeader />

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-14">
          Start with strategy. Scale with intention.
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link href="/walkthrough/1">
            <span className="inline-block bg-blue-600 text-white px-6 py-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg">
              Use a Magical Branding Wizard
            </span>
          </Link>
          <Link href="/creation-hub">
            <span className="inline-block bg-green-600 text-white px-6 py-4 rounded-md hover:bg-green-700 transition-colors text-lg font-semibold shadow-lg">
              Craft Awesome Content Now
            </span>
          </Link>
        </div>

        {/* Modules Preview */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderModuleCard(
              "Brandscape",
              "Strategic foundation: messaging framework, brand personality, competitive analysis, and style guides.",
              "/brandscape"
            )}
            {renderModuleCard(
              "Creation Hub",
              "Generate high-quality assets with AI-powered speed and voice-aligned clarity.",
              "/creation-hub"
            )}
            {renderModuleCard(
              "Enhancement Studio",
              "Polish your work: rewrite, refine, and check brand compliance fast.",
              "/content-enhancer-tools"
            )}
          </div>
        </div>

        {/* Overview Modules with deep links */}
        <div className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded shadow-sm text-left">
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">🧭 Strategy, Meet Execution</h3>
            <p className="text-blue-900 mb-2">
              Use our <Link href="/walkthrough/1" className="underline text-blue-700 hover:text-blue-900">brand walkthrough</Link> to clarify your <Link href="/walkthrough/3" className="underline text-blue-700 hover:text-blue-900">value proposition</Link>, <Link href="/walkthrough/4" className="underline text-blue-700 hover:text-blue-900">ideal customer</Link>, and <Link href="/brandscape/personality" className="underline text-blue-700 hover:text-blue-900">voice</Link>.
            </p>
            <p className="text-blue-900">
              Then turn that into a full <Link href="/brandscape/messaging-framework" className="underline text-blue-700 hover:text-blue-900">messaging framework</Link> and <Link href="/brandscape/style-guide-builder" className="underline text-blue-700 hover:text-blue-900">style guide</Link> you’ll actually use.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded shadow-sm text-left">
            <h3 className="text-2xl font-semibold text-green-800 mb-2">🛠️ Build on Brand Intelligence</h3>
            <p className="text-green-900">
              Whether it’s one asset or a whole campaign, our generators and enhancers work with your strategy—not around it.
              Create in the <Link href="/creation-hub/campaign" className="underline text-green-700 hover:text-green-900">Campaign Builder</Link>, transform with the <Link href="/creation-hub/repurposer" className="underline text-green-700 hover:text-green-900">Content Repurposer</Link>, or fine-tune in the <Link href="/content-enhancer-tools" className="underline text-green-700 hover:text-green-900">Enhancement Studio</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
