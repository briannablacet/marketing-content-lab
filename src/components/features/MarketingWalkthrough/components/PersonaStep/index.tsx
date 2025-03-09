// src/components/features/MarketingWalkthrough/components/PersonaStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X, Loader } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

interface TargetAudience {
  role: string;
  industry: string;
  challenges: string[];
}

interface PersonaStepProps {
  onNext?: () => void;
  onBack?: () => void;
  isWalkthrough?: boolean;
}

const PersonaStep: React.FC<PersonaStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const { showNotification } = useNotification();
  const [audience, setAudience] = useState<TargetAudience>({
    role: '',
    industry: '',
    challenges: ['']
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedAudiences, setSuggestedAudiences] = useState<TargetAudience[]>([]);
  const [productInfo, setProductInfo] = useState({ name: 'Marketing Product', type: 'Marketing Tool' });

  // Fetch product info to help with audience suggestions
  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await fetch('/api/api_endpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: 'product-info',
            data: { userId: 'user123' }
          })
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setProductInfo({
            name: data.data.name || 'Marketing Product',
            type: data.data.type || 'Marketing Tool'
          });
        }
      } catch (error) {
        console.error('Error fetching product info:', error);
        // Use defaults if API fails
        setProductInfo({
          name: 'Marketing Product',
          type: 'Marketing Tool'
        });
      }
    };

    fetchProductInfo();
  }, []);

  const handleTextChange = (field: keyof TargetAudience, value: string) => {
    setAudience(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChallengeChange = (index: number, value: string) => {
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

  const removeChallenge = (index: number) => {
    setAudience(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  };

  const generateAudienceSuggestions = async () => {
    console.log("Generate audience suggestions triggered");
    console.log("Product info:", productInfo);
    
    setIsGenerating(true);
    setSuggestedAudiences([]);

    try {
      console.log("Preparing to fetch from API");
      const requestBody = {
        endpoint: 'persona-generator',
        data: {
          productName: productInfo.name,
          productType: productInfo.type,
          currentPersona: audience
        }
      };
      console.log("Request body:", requestBody);
      
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("API response received:", response);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API data:", data);
      
      if (data.personas && Array.isArray(data.personas)) {
        setSuggestedAudiences(data.personas);
        showNotification('success', 'Audience suggestions based on your product.');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating audience suggestions:', error);
      showNotification('error', 'Failed to generate audience suggestions. Using fallback suggestions.');
      
      // Fallback default audiences if API fails
      console.log("Using fallback audiences");
      setSuggestedAudiences([
        {
          role: 'Marketing Director',
          industry: productInfo.type || 'Technology',
          challenges: [
            'Scaling content creation with limited resources',
            'Demonstrating ROI from content marketing efforts',
            'Maintaining consistent brand voice across channels'
          ]
        },
        {
          role: 'Content Manager',
          industry: productInfo.type || 'Technology',
          challenges: [
            'Meeting aggressive content deadlines',
            'Producing high-quality content consistently',
            'Optimizing content for multiple channels'
          ]
        }
      ]);
    } finally {
      console.log("Setting isGenerating to false");
      setIsGenerating(false);
    }
  };

  const selectSuggestedAudience = (suggestedAudience: TargetAudience) => {
    setAudience(suggestedAudience);
    setSuggestedAudiences([]);
    showNotification('success', 'Selected audience applied to your profile');
  };

  const saveAndContinue = async () => {
    // Basic validation
    if (!audience.role.trim() || !audience.industry.trim() || audience.challenges.filter(c => c.trim()).length === 0) {
      showNotification('error', 'Please fill in the required fields');
      return;
    }

    try {
      // Simplified for demo purposes - in a real app, you'd save to a database
      localStorage.setItem('marketingTargetAudience', JSON.stringify(audience));
      showNotification('success', 'Target audience saved successfully!');
      if (onNext) onNext();
    } catch (error) {
      console.error('Error saving target audience:', error);
      showNotification('error', 'Failed to save target audience. Continuing anyway.');
      if (onNext) onNext(); // Continue even if save fails
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Who are we delighting with your solution? 🎯</h2>
        
        {/* Target Audience Entry Form */}
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
            disabled={isGenerating}
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

      {/* Navigation Buttons (only when not in walkthrough) */}
      {!isWalkthrough && (
        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={saveAndContinue}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonaStep;