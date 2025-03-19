//src/pages/seo-keywords.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { useNotification } from '../context/NotificationContext';

interface SEOKeywordsPageProps {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

// No OpenAI initialization during build time - this will fix the Vercel build error
const SEOKeywordsPage: React.FC<SEOKeywordsPageProps> = ({ isWalkthrough, onNext, onBack }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  // Check if this is being accessed as part of walkthrough
  const isInWalkthrough = isWalkthrough || router.pathname.includes('/walkthrough');
  
  const [keywords, setKeywords] = useState({
    primaryKeywords: [],
    secondaryKeywords: [],
    keywordGroups: [],
    metrics: {
      estimatedSearchVolume: '',
      competitionLevel: '',
      recommendedContent: []
    },
    loading: false,
    error: null
  });

  // Function to generate keywords using the API endpoint
  const generateKeywords = async () => {
    setKeywords(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'generate-keywords',
          data: {
            context: {
              messages: [
                "AI-powered marketing content creation and strategy",
                "Streamline your content marketing workflow",
                "Create consistent, on-brand content at scale"
              ],
              personas: [
                "Marketing Director at mid-sized B2B company",
                "Content Manager at enterprise SaaS organization"
              ],
              competitors: [
                "ContentAI",
                "MarketMuse",
                "Jasper",
                "WriterAccess"
              ],
              productInfo: {
                name: "Marketing Content Lab",
                type: "Content Marketing Platform",
                valueProposition: "AI-powered marketing content creation and strategy"
              }
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const data = await response.json();
      
      setKeywords({
        primaryKeywords: data.primaryKeywords || [],
        secondaryKeywords: data.secondaryKeywords || [],
        keywordGroups: data.keywordGroups || [],
        metrics: data.metrics || {
          estimatedSearchVolume: '',
          competitionLevel: '',
          recommendedContent: []
        },
        loading: false,
        error: null
      });
      
      showNotification('success', 'Keywords generated successfully');
    } catch (error) {
      console.error('Error generating keywords:', error);
      setKeywords(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to generate keywords. Please try again.'
      }));
      showNotification('error', 'Failed to generate keywords');
    }
  };

  return (
    <ScreenTemplate
      title="SEO Keyword Research"
      subtitle="Discover high-value keywords to target in your content marketing"
      aiInsights={[
        "Using primary and secondary keywords improves your content's search visibility",
        "Long-tail keywords typically have lower competition but higher conversion rates",
        "Search intent matching is more important than keyword volume alone"
      ]}
      // Only pass walkthrough props if this is being used in the walkthrough
      isWalkthrough={isInWalkthrough}
      onNext={onNext}
      onBack={onBack}
      nextButtonText={isInWalkthrough ? "Next" : undefined}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Keyword Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Our AI can analyze your product information, target audience, and existing content to generate targeted keyword recommendations for your marketing efforts.
            </p>
            
            <button
              onClick={generateKeywords}
              disabled={keywords.loading}
              className={`px-4 py-2 rounded bg-blue-600 text-white ${
                keywords.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {keywords.loading ? 'Generating...' : 'Generate Keyword Recommendations'}
            </button>
            
            {keywords.error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                {keywords.error}
              </div>
            )}
          </CardContent>
        </Card>
        
        {(keywords.primaryKeywords.length > 0 || keywords.secondaryKeywords.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Primary Keywords */}
                <div>
                  <h3 className="font-medium text-lg mb-2">Primary Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.primaryKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Secondary Keywords */}
                <div>
                  <h3 className="font-medium text-lg mb-2">Secondary Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.secondaryKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Keyword Groups */}
                {keywords.keywordGroups?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg mb-2">Keyword Categories</h3>
                    <div className="space-y-4">
                      {keywords.keywordGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="border-l-4 border-purple-200 pl-4">
                          <h4 className="font-medium text-md mb-1">{group.category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {group.keywords.map((keyword, keywordIndex) => (
                              <span
                                key={keywordIndex}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* SEO Metrics Information */}
                {keywords.metrics && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-lg mb-2">SEO Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Estimated Search Volume</p>
                        <p className="font-medium">{keywords.metrics.estimatedSearchVolume || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Competition Level</p>
                        <p className="font-medium">{keywords.metrics.competitionLevel || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Recommended Content</p>
                        <div className="flex flex-wrap gap-1">
                          {keywords.metrics.recommendedContent?.map((content, index) => (
                            <span key={index} className="text-sm font-medium">
                              {content}{index < keywords.metrics.recommendedContent.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScreenTemplate>
  );
};

// For use with static page routes
export default SEOKeywordsPage;