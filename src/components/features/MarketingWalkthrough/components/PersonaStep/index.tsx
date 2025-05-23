// src/components/features/MarketingWalkthrough/components/PersonaStep/index.tsx
// Fixed version with proper API endpoint format and better error handling

import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../../../context/NotificationContext';
import { Sparkles, Plus, X, Loader } from 'lucide-react';

interface TargetAudience {
  role: string;
  industry: string;
  challenges: string[];
}

interface PersonaStepProps {
  onNext: () => void;
  onBack: () => void;
  isWalkthrough?: boolean;
  formData: any;
  setFormData: (data: any) => void;
}

const PersonaStep: React.FC<PersonaStepProps> = ({ onNext, onBack, formData, setFormData }) => {
  const { showNotification } = useNotification();

  const [personas, setPersonas] = useState<TargetAudience[]>(() => {
    const saved = localStorage.getItem('marketingTargetAudiences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [{ role: '', industry: '', challenges: [''] }];
      }
    }
    return [{ role: '', industry: '', challenges: [''] }];
  });

  const [suggestions, setSuggestions] = useState<TargetAudience[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('marketingTargetAudiences', JSON.stringify(personas));
    if (personas.length > 0) {
      localStorage.setItem('marketingTargetAudience', JSON.stringify(personas[0]));
      const { role, industry } = personas[0];
      const audienceString = [role, industry].filter(Boolean).join(' in ');
      setFormData({
        ...formData,
        personas,
        targetAudience: audienceString
      });
    }
  }, [personas]);

  const handleTextChange = (index: number, field: keyof TargetAudience, value: string) => {
    const updated = [...personas];
    updated[index][field] = value;
    setPersonas(updated);
  };

  const handleChallengeChange = (personaIndex: number, challengeIndex: number, value: string) => {
    const updated = [...personas];
    updated[personaIndex].challenges[challengeIndex] = value;
    setPersonas(updated);
  };

  const addChallenge = (personaIndex: number) => {
    const updated = [...personas];
    updated[personaIndex].challenges.push('');
    setPersonas(updated);
  };

  const removeChallenge = (personaIndex: number, challengeIndex: number) => {
    const updated = [...personas];
    updated[personaIndex].challenges.splice(challengeIndex, 1);
    setPersonas(updated);
  };

  const addPersona = () => {
    setPersonas([...personas, { role: '', industry: '', challenges: [''] }]);
  };

  const removePersona = (index: number) => {
    if (personas.length <= 1) return;
    const updated = personas.filter((_, i) => i !== index);
    setPersonas(updated);
  };

  // FIXED: This is the main bug fix - proper API request format
  const handleAISuggestion = async () => {
    const productData = localStorage.getItem('marketingProduct');
    if (!productData) {
      showNotification('Please fill in your product information first', 'error');
      return;
    }

    let parsedProductData;
    try {
      parsedProductData = JSON.parse(productData);
    } catch (error) {
      console.error('Error parsing product data:', error);
      showNotification('Invalid product data. Please check your product information.', 'error');
      return;
    }

    const { name, type } = parsedProductData;

    // Validate that we have the required data
    if (!name || !type) {
      showNotification('Please ensure product name and type are filled in', 'error');
      return;
    }

    setLoading(true);
    console.log('Starting AI suggestion with product data:', { name, type });

    try {

      const requestBody = {
        type: 'personaGenerator',
        data: {
          productName: name,
          productType: type,
          currentPersona: personas[0] || { role: '', industry: '', challenges: [] },
        }
      };
      console.log('Sending request with correct format:', requestBody);

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Removed Authorization header since your API doesn't seem to require it
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      // Better error handling for different status codes
      if (!response.ok) {
        let errorMessage = 'Failed to generate personas';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.log('Error response data:', errorData);
        } catch (parseError) {
          console.log('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Success response data:', result);

      // Check if we got personas in the response
      if (result.personas && Array.isArray(result.personas) && result.personas.length > 0) {
        setSuggestions(result.personas);
        showNotification(`Generated ${result.personas.length} customer profiles successfully!`, 'success');
      } else {
        console.log('No personas in response or empty array');
        showNotification('No customer profiles were generated. Please try with different product information.', 'warning');
      }
    } catch (err) {
      console.error('Error fetching ideal customer suggestions:', err);
      // More specific error messages
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          showNotification('Network error. Please check your connection and try again.', 'error');
        } else {
          showNotification(`Failed to generate suggestions: ${err.message}`, 'error');
        }
      } else {
        showNotification('An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const addSuggestion = (suggestion: TargetAudience) => {
    const firstEmptyIndex = personas.findIndex(p => !p.role && !p.industry && p.challenges.every(c => !c));
    if (firstEmptyIndex >= 0) {
      const updated = [...personas];
      updated[firstEmptyIndex] = {
        role: suggestion.role,
        industry: suggestion.industry,
        challenges: [...suggestion.challenges]
      };
      setPersonas(updated);
    } else {
      setPersonas([...personas, {
        role: suggestion.role,
        industry: suggestion.industry,
        challenges: [...suggestion.challenges]
      }]);
    }
    setSuggestions([]);
    showNotification('Customer profile added successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {personas.map((persona, idx) => (
        <div key={idx} className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-semibold">Profile #{idx + 1}</h3>
            {personas.length > 1 && (
              <button
                onClick={() => removePersona(idx)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Job Role (e.g., Marketing Manager, CEO, Sales Director)"
            value={persona.role}
            onChange={(e) => handleTextChange(idx, 'role', e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Industry (e.g., Technology, Healthcare, Manufacturing)"
            value={persona.industry}
            onChange={(e) => handleTextChange(idx, 'industry', e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {persona.challenges.map((challenge, cIdx) => (
            <div key={cIdx} className="flex space-x-2">
              <input
                type="text"
                placeholder="Business challenge they face"
                value={challenge}
                onChange={(e) => handleChallengeChange(idx, cIdx, e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {persona.challenges.length > 1 && (
                <button
                  onClick={() => removeChallenge(idx, cIdx)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors px-2"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addChallenge(idx)}
            className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
          >
            + Add challenge
          </button>
        </div>
      ))}

      <div className="space-x-4">
        <button
          onClick={addPersona}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
        >
          + Add another profile
        </button>
        <button
          onClick={handleAISuggestion}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded inline-flex items-center transition-colors"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={16} />
              Help me identify my ideal customer
            </>
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-blue-50">
          <h4 className="font-semibold mb-2">AI-Generated Customer Profiles</h4>
          <p className="text-sm text-gray-600 mb-3">
            Here are some suggested customer profiles based on your product information:
          </p>
          {suggestions.map((s, i) => (
            <div key={i} className="p-3 border rounded bg-white shadow-sm mb-3">
              <p><strong>Role:</strong> {s.role}</p>
              <p><strong>Industry:</strong> {s.industry}</p>
              <p><strong>Challenges:</strong> {s.challenges.join(', ')}</p>
              <button
                onClick={() => addSuggestion(s)}
                className="text-sm text-green-600 hover:text-green-800 mt-2 font-medium transition-colors"
              >
                + Add this customer profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonaStep;