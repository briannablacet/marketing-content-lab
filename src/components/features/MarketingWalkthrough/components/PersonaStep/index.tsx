// src/components/features/MarketingWalkthrough/components/PersonaStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X, Loader } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

// A clean PersonaStep component without debug panel
const PersonaStep = () => {
  const { showNotification } = useNotification();

  // Basic form state
  const [audience, setAudience] = useState({
    role: '',
    industry: '',
    challenges: ['']
  });

  // Component state
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedAudiences, setSuggestedAudiences] = useState([]);
  const [productInfo, setProductInfo] = useState(null);

  // Load previously saved audience data if available
  useEffect(() => {
    try {
      const savedAudience = localStorage.getItem('marketingTargetAudience');
      if (savedAudience) {
        const parsed = JSON.parse(savedAudience);
        if (parsed && parsed.role && parsed.industry && Array.isArray(parsed.challenges)) {
          setAudience(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading saved audience:', error);
    }
  }, []);

  // Load product info on component mount
  useEffect(() => {
    try {
      const productData = localStorage.getItem('marketingProduct');

      if (productData) {
        try {
          const parsedData = JSON.parse(productData);
          console.log("Found product data:", parsedData);

          if (parsedData && parsedData.name && parsedData.type) {
            setProductInfo({
              name: parsedData.name,
              type: parsedData.type
            });
          }
        } catch (e) {
          console.error("Error parsing product data:", e);
        }
      } else {
        console.log("No product info found in localStorage");
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
  }, []);

  // Auto-save audience data when it changes
  useEffect(() => {
    // Skip initial render with empty data
    if (!audience.role && !audience.industry && audience.challenges.length === 1 && !audience.challenges[0]) {
      return;
    }

    try {
      localStorage.setItem('marketingTargetAudience', JSON.stringify(audience));
      console.log("Auto-saved audience data:", audience);
    } catch (error) {
      console.error("Error auto-saving audience:", error);
    }
  }, [audience]);

  const handleTextChange = (field, value) => {
    setAudience(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChallengeChange = (index, value) => {
    const newChallenges = [...audience.challenges];
    newChallenges[index] = value;
    setAudience(prev => ({
      ...prev,
      challenges: newChallenges
    }));
  };

  const addChallenge = () => {
    setAudience(prev => ({
      ...prev,
      challenges: [...prev.challenges, '']
    }));
  };

  const removeChallenge = (index) => {
    setAudience(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  };

  // Generate audience suggestions
  const generateAudienceSuggestions = async () => {
    if (!productInfo) {
      showNotification('error', 'Product information is missing. Please complete the previous step first.');
      return;
    }

    setIsGenerating(true);
    setSuggestedAudiences([]);

    try {
      // Prepare the API request
      const requestBody = {
        endpoint: 'persona-generator',
        data: {
          productName: productInfo.name,
          productType: productInfo.type,
          currentPersona: {
            role: audience.role || '',
            industry: audience.industry || '',
            challenges: audience.challenges.filter(c => c.trim())
          }
        }
      };

      console.log("Sending API request:", requestBody);

      // Make the API call
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get response text for debugging
      const responseText = await response.text();
      console.log("API response text:", responseText);

      try {
        // Parse the JSON response
        const data = JSON.parse(responseText);
        console.log("Parsed API response:", data);

        if (data.personas && Array.isArray(data.personas)) {
          setSuggestedAudiences(data.personas);
          showNotification('success', 'Generated audience suggestions');
        } else {
          throw new Error('Invalid response format - missing personas array');
        }
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        throw new Error(`Failed to parse API response: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      showNotification('error', `Failed to generate suggestions: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Select a suggested audience
  const selectSuggestedAudience = (suggestedAudience) => {
    setAudience(suggestedAudience);
    setSuggestedAudiences([]);
    showNotification('success', 'Selected audience applied');
  };

  return (
    <div className="space-y-6">
      {/* Main Form - No debug panel */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Who are we delighting with your solution? 🎯</h2>

        <div className="space-y-4">
          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Primary Role</label>
            <input
              type="text"
              value={audience.role}
              onChange={(e) => handleTextChange('role', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g. CTO, Marketing Director"
            />
          </div>

          {/* Industry Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input
              type="text"
              value={audience.industry}
              onChange={(e) => handleTextChange('industry', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g. SaaS, Healthcare"
            />
          </div>

          {/* Key Challenges */}
          <div>
            <label className="block text-sm font-medium mb-1">Key Challenges</label>
            <div className="space-y-3">
              {audience.challenges.map((challenge, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={challenge}
                    onChange={(e) => handleChallengeChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder={`Challenge ${index + 1}`}
                  />
                  {audience.challenges.length > 1 && (
                    <button
                      onClick={() => removeChallenge(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addChallenge}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Another Challenge
              </button>
            </div>
          </div>
        </div>

        {/* AI Suggestion Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={generateAudienceSuggestions}
            disabled={isGenerating || !productInfo}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Finding potential audiences...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Help Me Identify My Ideal Customer
              </>
            )}
          </button>
        </div>
      </Card>

      {/* AI Suggested Audiences */}
      {suggestedAudiences.length > 0 && (
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-center mb-4">
            <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800">Suggested Target Audiences</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            Based on your product information, here are potential customers who might benefit from your solution:
          </p>

          <div className="space-y-4">
            {suggestedAudiences.map((suggestedAudience, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-900">{suggestedAudience.role}</h4>
                  <span className="text-sm text-blue-700">{suggestedAudience.industry}</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Key Challenges:</p>
                  <ul className="pl-5 list-disc text-sm text-gray-600 space-y-1">
                    {suggestedAudience.challenges.map((challenge, i) => (
                      <li key={i}>{challenge}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => selectSuggestedAudience(suggestedAudience)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Use This Audience
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PersonaStep;