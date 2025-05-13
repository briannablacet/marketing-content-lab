// pages/dev/content-test.tsx
import React, { useState } from 'react';
import { ScreenTemplate } from '../../components/shared/UIComponents';
import { ContentProvider } from '../../context/ContentContext';

export default function ContentTestPage() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testContentGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          contentType: 'Blog Posts',
          topic: 'Digital Marketing Trends',
          keywords: ['AI', 'automation', 'personalization'],
        }),
      });

      const data = await response.json();
      setTestResult(data.content);
    } catch (error) {
      setTestResult('Error: ' + (error as Error).message);
    }
    setIsLoading(false);
  };

  return (
    <ContentProvider>
      <ScreenTemplate
        title="Content Generation Test"
        subtitle="Test the content generation API endpoints"
        aiInsights={[
          "This is a development-only page for testing content generation"
        ]}
      >
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Basic Content Generation</h2>
            <button 
              onClick={testContentGeneration}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Test Content Generation'}
            </button>
            
            {testResult && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <h3 className="font-bold mb-2">Generated Content:</h3>
                <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
              </div>
            )}
          </div>
        </div>
      </ScreenTemplate>
    </ContentProvider>
  );
}