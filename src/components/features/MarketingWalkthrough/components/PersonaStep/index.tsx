// src/components/features/MarketingWalkthrough/components/PersonaStep/index.tsx
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

  const handleAISuggestion = async () => {
    const productData = localStorage.getItem('marketingProduct');
    if (!productData) {
      showNotification('Please fill in your product information first', 'error');
      return;
    }
    const { name, type } = JSON.parse(productData);

    setLoading(true);
    console.log('Starting AI suggestion with product data:', { name, type });

    try {
      const requestBody = {
        type: 'personaGenerator',
        data: {
          productName: name,
          productType: type,
          currentPersona: personas[0],
        }
      };
      console.log('Sending request:', requestBody);

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate personas');
      }

      if (result.personas?.length) {
        setSuggestions(result.personas);
        showNotification('Generated customer profiles successfully!', 'success');
      } else {
        showNotification('No suggestions were generated. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Error fetching ideal customer suggestions:', err);
      showNotification('Failed to generate suggestions. Please try again.', 'error');
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
  };

  return (
    <div className="space-y-6">
      {personas.map((persona, idx) => (
        <div key={idx} className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-semibold">Profile #{idx + 1}</h3>
            {personas.length > 1 && (
              <button onClick={() => removePersona(idx)} className="text-red-500">Remove</button>
            )}
          </div>
          <input
            type="text"
            placeholder="Role"
            value={persona.role}
            onChange={(e) => handleTextChange(idx, 'role', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Industry"
            value={persona.industry}
            onChange={(e) => handleTextChange(idx, 'industry', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {persona.challenges.map((challenge, cIdx) => (
            <div key={cIdx} className="flex space-x-2">
              <input
                type="text"
                placeholder="Challenge"
                value={challenge}
                onChange={(e) => handleChallengeChange(idx, cIdx, e.target.value)}
                className="w-full p-2 border rounded"
              />
              {persona.challenges.length > 1 && (
                <button onClick={() => removeChallenge(idx, cIdx)} className="text-sm text-red-500">X</button>
              )}
            </div>
          ))}
          <button onClick={() => addChallenge(idx)} className="text-sm text-blue-500">+ Add challenge</button>
        </div>
      ))}

      <div className="space-x-4">
        <button onClick={addPersona} className="bg-gray-200 px-4 py-2 rounded">+ Add another profile</button>
        <button
          onClick={handleAISuggestion}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center"
        >
          {loading ? <Loader className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />} Help me identify my ideal customer
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-blue-50">
          <h4 className="font-semibold mb-2">Suggestions</h4>
          {suggestions.map((s, i) => (
            <div key={i} className="p-2 border rounded bg-white shadow-sm mb-2">
              <p><strong>Role:</strong> {s.role}</p>
              <p><strong>Industry:</strong> {s.industry}</p>
              <p><strong>Challenges:</strong> {s.challenges.join(', ')}</p>
              <button onClick={() => addSuggestion(s)} className="text-sm text-green-600 mt-1">+ Add this customer profile</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonaStep;
