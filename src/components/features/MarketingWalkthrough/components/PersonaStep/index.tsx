// src/components/features/MarketingWalkthrough/components/PersonaStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X, Loader, User, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

// Interface for a target audience persona
interface TargetAudience {
  role: string;
  industry: string;
  challenges: string[];
}

// PersonaStep component with enhanced Add Customer button
const PersonaStep = () => {
  const { showNotification } = useNotification();

  // List of personas
  const [personas, setPersonas] = useState<TargetAudience[]>([{
    role: '',
    industry: '',
    challenges: ['']
  }]);

  // Track which personas are expanded/collapsed
  const [expandedPersonas, setExpandedPersonas] = useState<boolean[]>([true]);

  // Component state
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedAudiences, setSuggestedAudiences] = useState<TargetAudience[]>([]);
  const [productInfo, setProductInfo] = useState<{ name: string, type: string } | null>(null);
  const [generatingForIndex, setGeneratingForIndex] = useState<number | null>(null);

  // Load previously saved audience data if available
  useEffect(() => {
    try {
      const savedAudiences = localStorage.getItem('marketingTargetAudiences');
      if (savedAudiences) {
        const parsed = JSON.parse(savedAudiences);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Make sure all personas have the correct structure
          const validPersonas = parsed.filter(p =>
            p && p.role && p.industry && Array.isArray(p.challenges) && p.challenges.length > 0
          );

          if (validPersonas.length > 0) {
            setPersonas(validPersonas);
            // Initialize all personas as expanded
            setExpandedPersonas(validPersonas.map(() => true));
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved audiences:', error);
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

  // Auto-save all personas when they change
  useEffect(() => {
    // Skip initial render with empty data
    if (personas.length === 1 &&
      !personas[0].role &&
      !personas[0].industry &&
      personas[0].challenges.length === 1 &&
      !personas[0].challenges[0]) {
      return;
    }

    try {
      localStorage.setItem('marketingTargetAudiences', JSON.stringify(personas));
      console.log("Auto-saved audience data:", personas);

      // Also save the first persona in the old format for backward compatibility
      if (personas.length > 0) {
        localStorage.setItem('marketingTargetAudience', JSON.stringify(personas[0]));
      }
    } catch (error) {
      console.error("Error auto-saving audiences:", error);
    }
  }, [personas]);

  const updatePersona = (index: number, updates: Partial<TargetAudience>) => {
    const updatedPersonas = [...personas];
    updatedPersonas[index] = {
      ...updatedPersonas[index],
      ...updates
    };
    setPersonas(updatedPersonas);
  };

  const handleTextChange = (index: number, field: keyof TargetAudience, value: string) => {
    updatePersona(index, { [field]: value });
  };

  const handleChallengeChange = (personaIndex: number, challengeIndex: number, value: string) => {
    const persona = personas[personaIndex];
    const newChallenges = [...persona.challenges];
    newChallenges[challengeIndex] = value;
    updatePersona(personaIndex, { challenges: newChallenges });
  };

  const addChallenge = (personaIndex: number) => {
    const persona = personas[personaIndex];
    updatePersona(personaIndex, {
      challenges: [...persona.challenges, '']
    });
  };

  const removeChallenge = (personaIndex: number, challengeIndex: number) => {
    const persona = personas[personaIndex];
    updatePersona(personaIndex, {
      challenges: persona.challenges.filter((_, i) => i !== challengeIndex)
    });
  };

  // Add a new persona
  const addPersona = () => {
    const newPersonas = [...personas, {
      role: '',
      industry: '',
      challenges: ['']
    }];
    setPersonas(newPersonas);

    // Set the new persona as expanded
    setExpandedPersonas([...expandedPersonas, true]);

    showNotification('success', 'Added a new ideal customer profile');
  };

  // Remove a persona
  const removePersona = (index: number) => {
    // Don't allow removing the last persona
    if (personas.length <= 1) {
      showNotification('error', 'You must have at least one ideal customer');
      return;
    }

    const updatedPersonas = personas.filter((_, i) => i !== index);
    setPersonas(updatedPersonas);

    // Update expanded state
    const updatedExpandedState = expandedPersonas.filter((_, i) => i !== index);
    setExpandedPersonas(updatedExpandedState);

    showNotification('success', 'Removed customer profile');
  };

  // Toggle expanded/collapsed state of a persona
  const togglePersona = (index: number) => {
    const newExpandedState = [...expandedPersonas];
    newExpandedState[index] = !newExpandedState[index];
    setExpandedPersonas(newExpandedState);
  };

  // Generate audience suggestions for a specific persona
  const generateAudienceSuggestions = async (personaIndex: number) => {
    if (!productInfo) {
      showNotification('error', 'Product information is missing. Please complete the previous step first.');
      return;
    }

    setIsGenerating(true);
    setGeneratingForIndex(personaIndex);
    setSuggestedAudiences([]);

    try {
      // Prepare the API request
      const requestBody = {
        data: {
          productName: productInfo.name,
          productType: productInfo.type,
          currentPersona: {
            role: personas[personaIndex].role || '',
            industry: personas[personaIndex].industry || '',
            challenges: personas[personaIndex].challenges.filter(c => c.trim())
          }
        }
      };

      console.log("Sending API request:", requestBody);

      // Make the API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/personal-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
      showNotification('error', `Failed to generate suggestions: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGenerating(false);
      setGeneratingForIndex(null);
    }
  };

  // Apply a suggested audience to a specific persona
  const applySuggestion = (personaIndex: number, suggestion: TargetAudience) => {
    const updatedPersonas = [...personas];
    updatedPersonas[personaIndex] = suggestion;
    setPersonas(updatedPersonas);
    setSuggestedAudiences([]);
    showNotification('success', 'Applied suggested audience to profile');
  };

  // Add a suggestion as a new persona
  const addSuggestionAsNewPersona = (suggestion: TargetAudience) => {
    setPersonas([...personas, suggestion]);
    setExpandedPersonas([...expandedPersonas, true]);
    setSuggestedAudiences([]);
    showNotification('success', 'Added suggestion as a new customer profile');
  };

  return (
    <div className="space-y-6">
      {/* Customer Personas Section */}
      {personas.map((persona, index) => (
        <Card key={index} className="p-6 border-l-4 border-l-blue-500">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => togglePersona(index)}
          >
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold">
                {persona.role ? persona.role : `Ideal Customer ${index + 1}`}
                {persona.industry ? ` (${persona.industry})` : ''}
              </h3>
            </div>
            <div className="flex items-center">
              {index > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the toggle
                    removePersona(index);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm mr-4"
                >
                  Remove
                </button>
              )}
              {expandedPersonas[index] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* Persona Form (conditionally rendered based on expanded state) */}
          {expandedPersonas[index] && (
            <div className="mt-4 space-y-4">
              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium mb-1">Primary Role</label>
                <input
                  type="text"
                  value={persona.role}
                  onChange={(e) => handleTextChange(index, 'role', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. CTO, Marketing Director"
                />
              </div>

              {/* Industry Field */}
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <input
                  type="text"
                  value={persona.industry}
                  onChange={(e) => handleTextChange(index, 'industry', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. SaaS, Healthcare"
                />
              </div>

              {/* Key Challenges */}
              <div>
                <label className="block text-sm font-medium mb-1">Key Challenges</label>
                <div className="space-y-3">
                  {persona.challenges.map((challenge, challengeIndex) => (
                    <div key={challengeIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={challenge}
                        onChange={(e) => handleChallengeChange(index, challengeIndex, e.target.value)}
                        className="flex-1 p-2 border rounded"
                        placeholder={`Challenge ${challengeIndex + 1}`}
                      />
                      {persona.challenges.length > 1 && (
                        <button
                          onClick={() => removeChallenge(index, challengeIndex)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addChallenge(index)}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Challenge
                  </button>
                </div>
              </div>

              {/* AI Suggestion Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => generateAudienceSuggestions(index)}
                  disabled={isGenerating || !productInfo}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating && generatingForIndex === index ? (
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
            </div>
          )}
        </Card>
      ))}

      {/* Enhanced Add Another Customer Button */}
      <Card className="p-4 border border-dashed border-green-300 bg-green-50 hover:bg-green-100 transition-colors">
        <button
          onClick={addPersona}
          className="w-full flex items-center justify-center text-green-700 hover:text-green-800 font-medium"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Another Customer Profile
        </button>
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
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      if (generatingForIndex !== null) {
                        applySuggestion(generatingForIndex, suggestedAudience);
                      } else if (personas.length > 0) {
                        applySuggestion(0, suggestedAudience);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Use This Audience
                  </button>
                  <button
                    onClick={() => addSuggestionAsNewPersona(suggestedAudience)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Add as New Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PersonaStep;