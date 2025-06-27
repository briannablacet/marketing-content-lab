// Test page to verify style guide integration
import React, { useState } from 'react';
import { useWritingStyle } from '../../context/WritingStyleContext';
import { useNotification } from '../../context/NotificationContext';
import StrategicDataService from '../../services/StrategicDataService';

const StyleGuideTestPage: React.FC = () => {
  const { writingStyle, saveWritingStyle } = useWritingStyle();
  const { showNotification } = useNotification();
  const [testContent, setTestContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const testStyleGuideIntegration = async () => {
    setIsGenerating(true);
    
    try {
      // Get strategic data
      const strategicData = await StrategicDataService.getAllStrategicData();
      
      console.log('🔍 Current writing style:', writingStyle);
      console.log('🔍 Strategic data:', strategicData);

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'enhance',
          data: {
            campaignData: {
              name: 'Style Guide Test',
              type: 'blog-post',
              goal: 'Test style guide integration',
              targetAudience: 'developers',
              keyMessages: ['Style guides work', 'Content is consistent']
            },
            contentTypes: ['blog-post'],
            writingStyle: writingStyle,
            strategicData: strategicData
          }
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log('✅ Generated content with style guide:', data);
      
      setGeneratedContent(data['blog-post']?.content || 'No content generated');
      showNotification('Style guide test completed successfully!', 'success');
    } catch (error) {
      console.error('❌ Style guide test failed:', error);
      showNotification('Style guide test failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const testKeyMessagesWithStyleGuide = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🔍 Testing key messages with style guide:', writingStyle);

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'keyMessages',
          data: {
            productInfo: {
              name: 'Test Product',
              description: 'A test product for style guide verification',
              targetAudience: 'developers',
              benefits: ['Easy to use', 'Fast performance', 'Great support']
            },
            competitors: [],
            industry: 'technology',
            focusAreas: ['user', 'business'],
            tone: 'professional'
          },
          writingStyle: writingStyle
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log('✅ Generated key messages with style guide:', data);
      
      setGeneratedContent(JSON.stringify(data, null, 2));
      showNotification('Key messages test completed successfully!', 'success');
    } catch (error) {
      console.error('❌ Key messages test failed:', error);
      showNotification('Key messages test failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const setTestStyleGuide = () => {
    const testStyle = {
      styleGuide: {
        primary: 'AP Style',
        customRules: ['Use active voice', 'Keep sentences short'],
        completed: true
      },
      formatting: {
        headingCase: 'title',
        numberFormat: 'numerals',
        dateFormat: 'american',
        listStyle: 'bullets'
      },
      punctuation: {
        oxfordComma: true,
        quotationMarks: 'double',
        hyphenation: 'standard'
      },
      completed: true
    };

    saveWritingStyle();
    showNotification('Test style guide set to AP Style', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Style Guide Integration Test</h1>
      
      <div className="space-y-8">
        {/* Current Style Guide Display */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Style Guide</h2>
          <pre className="bg-white p-4 rounded border text-sm overflow-auto">
            {JSON.stringify(writingStyle, null, 2)}
          </pre>
        </div>

        {/* Test Controls */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-4">
            <button
              onClick={setTestStyleGuide}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Test Style Guide (AP Style)
            </button>
            
            <button
              onClick={testStyleGuideIntegration}
              disabled={isGenerating}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isGenerating ? 'Testing...' : 'Test Content Generation with Style Guide'}
            </button>

            <button
              onClick={testKeyMessagesWithStyleGuide}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {isGenerating ? 'Testing...' : 'Test Key Messages with Style Guide'}
            </button>
          </div>
        </div>

        {/* Generated Content */}
        {generatedContent && (
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Generated Content (with Style Guide)</h2>
            <div className="bg-white p-4 rounded border prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Test</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to the Style Guide page and set a style guide (e.g., AP Style, Chicago Manual)</li>
            <li>Save the style guide</li>
            <li>Click "Set Test Style Guide" to ensure the context is loaded</li>
            <li>Click "Test Style Guide Integration" to generate content</li>
            <li>Check the generated content to see if it follows the selected style guide</li>
            <li>Try the "Test Key Messages" to see style guide applied to messaging framework</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StyleGuideTestPage; 