// src/components/features/IdealCustomerTool/index.tsx
// Standalone Ideal Customer/Persona builder tool with StrategicDataService integration

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Save, Download, Upload, AlertCircle, CheckCircle, Sparkles, Loader } from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';

interface Persona {
  id: string;
  role: string;
  industry: string;
  companySize: string;
  challenges: string[];
  goals: string[];
  painPoints: string[];
  demographics: {
    age?: string;
    location?: string;
    education?: string;
  };
  behaviorTraits: string[];
  preferredChannels: string[];
  notes: string;
}

const IdealCustomerTool: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Load personas from StrategicDataService and localStorage on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        // First try to get data from StrategicDataService
        const audiences = await StrategicDataService.getTargetAudiences();
        if (audiences && audiences.length > 0) {
          // Convert from StrategicDataService format to our detailed format
          const convertedPersonas = audiences.map((audience: any, index: number) => ({
            id: audience.id || `audience-${index}`,
            role: audience.role || '',
            industry: audience.industry || '',
            companySize: audience.companySize || '',
            challenges: audience.challenges || [''],
            goals: audience.goals || [''],
            painPoints: audience.painPoints || [''],
            demographics: audience.demographics || {},
            behaviorTraits: audience.behaviorTraits || [''],
            preferredChannels: audience.preferredChannels || [''],
            notes: audience.notes || ''
          }));
          setPersonas(convertedPersonas);
          if (convertedPersonas.length > 0) {
            setActivePersona(convertedPersonas[0].id);
          }
        } else {
          // Fallback to localStorage if no StrategicDataService data
          const savedPersonas = localStorage.getItem('idealCustomerPersonas');
          if (savedPersonas) {
            const parsedPersonas = JSON.parse(savedPersonas);
            setPersonas(parsedPersonas);
            if (parsedPersonas.length > 0) {
              setActivePersona(parsedPersonas[0].id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
        // Fallback to localStorage on error
        try {
          const savedPersonas = localStorage.getItem('idealCustomerPersonas');
          if (savedPersonas) {
            const parsedPersonas = JSON.parse(savedPersonas);
            setPersonas(parsedPersonas);
            if (parsedPersonas.length > 0) {
              setActivePersona(parsedPersonas[0].id);
            }
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    };

    loadExistingData();
  }, []);

  // Create a new persona
  const createNewPersona = () => {
    const newPersona: Persona = {
      id: Date.now().toString(),
      role: '',
      industry: '',
      companySize: '',
      challenges: [''],
      goals: [''],
      painPoints: [''],
      demographics: {},
      behaviorTraits: [''],
      preferredChannels: [''],
      notes: ''
    };

    const updatedPersonas = [...personas, newPersona];
    setPersonas(updatedPersonas);
    setActivePersona(newPersona.id);
    savePersonas(updatedPersonas);
  };

  // Delete a persona
  const deletePersona = (personaId: string) => {
    if (personas.length <= 1) {
      alert('You must have at least one persona');
      return;
    }

    const updatedPersonas = personas.filter(p => p.id !== personaId);
    setPersonas(updatedPersonas);
    
    if (activePersona === personaId) {
      setActivePersona(updatedPersonas[0]?.id || null);
    }
    
    savePersonas(updatedPersonas);
  };

  // Update active persona
  const updatePersona = (field: string, value: any) => {
    const updatedPersonas = personas.map(persona => {
      if (persona.id === activePersona) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...persona,
            [parent]: {
              ...persona[parent as keyof Persona],
              [child]: value
            }
          };
        }
        return { ...persona, [field]: value };
      }
      return persona;
    });

    setPersonas(updatedPersonas);
    savePersonas(updatedPersonas);
  };

  // Add item to array field
  const addArrayItem = (field: string) => {
    const current = getCurrentPersona();
    if (current) {
      const currentArray = current[field as keyof Persona] as string[];
      updatePersona(field, [...currentArray, '']);
    }
  };

  // Remove item from array field
  const removeArrayItem = (field: string, index: number) => {
    const current = getCurrentPersona();
    if (current) {
      const currentArray = current[field as keyof Persona] as string[];
      const newArray = currentArray.filter((_, i) => i !== index);
      updatePersona(field, newArray);
    }
  };

  // Update array item
  const updateArrayItem = (field: string, index: number, value: string) => {
    const current = getCurrentPersona();
    if (current) {
      const currentArray = current[field as keyof Persona] as string[];
      const newArray = [...currentArray];
      newArray[index] = value;
      updatePersona(field, newArray);
    }
  };

  // Save personas to localStorage
  const savePersonas = async (personasToSave: Persona[]) => {
    try {
      setIsSaving(true);
      localStorage.setItem('idealCustomerPersonas', JSON.stringify(personasToSave));
      
      // Also save to the walkthrough format for compatibility
      const walkthroughFormat = personasToSave.map(p => ({
        role: p.role,
        industry: p.industry,
        challenges: p.challenges.filter(c => c.trim() !== '')
      }));
      localStorage.setItem('marketingTargetAudiences', JSON.stringify(walkthroughFormat));
      
              setSaveMessage('Customer profiles saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving personas:', error);
              setSaveMessage('Error saving customer profiles');
    } finally {
      setIsSaving(false);
    }
  };

  // Export personas
  const exportPersonas = () => {
    const dataStr = JSON.stringify(personas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ideal-customer-profiles.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // AI suggestion functionality (updated to use StrategicDataService)
  const handleAISuggestion = async () => {
    try {
      // Get product data from StrategicDataService first
      const productData = await StrategicDataService.getProductInfo();
      if (!productData || !productData.name) {
        setSaveMessage('Please set up your product information first');
        return;
      }
      
      setIsLoadingAI(true);
      
      const requestBody = {
        endpoint: 'persona-generator',
        data: {
          productName: productData.name,
          productType: productData.description || productData.type || '',
          currentPersona: getCurrentPersona() ? {
            role: getCurrentPersona()?.role,
            industry: getCurrentPersona()?.industry,
            challenges: getCurrentPersona()?.challenges?.filter(c => c.trim() !== '') || []
          } : undefined,
        }
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate suggestions');
      }

      if (result.personas?.length) {
        setAiSuggestions(result.personas);
        setSaveMessage('Generated customer profile suggestions!');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('No suggestions were generated. Please try again.');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
      setSaveMessage('Failed to generate suggestions. Please try again.');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Apply AI suggestion to create new persona
  const applySuggestion = (suggestion: any) => {
    const newPersona: Persona = {
      id: Date.now().toString(),
      role: suggestion.role || '',
      industry: suggestion.industry || '',
      companySize: '',
      challenges: suggestion.challenges || [''],
      goals: [''],
      painPoints: [''],
      demographics: {},
      behaviorTraits: [''],
      preferredChannels: [''],
      notes: ''
    };

    const updatedPersonas = [...personas, newPersona];
    setPersonas(updatedPersonas);
    setActivePersona(newPersona.id);
    savePersonas(updatedPersonas);
    setAiSuggestions([]); // Clear suggestions after applying
  };

  // Get current active persona
  const getCurrentPersona = () => {
    return personas.find(p => p.id === activePersona) || null;
  };

  const currentPersona = getCurrentPersona();

  // Create first persona if none exist
  useEffect(() => {
    if (personas.length === 0) {
      createNewPersona();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Ideal Customer Builder
              </h1>
              <p className="text-gray-600 mt-1">
                Define and manage your target audience personas
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAISuggestion}
                disabled={isLoadingAI}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isLoadingAI ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isLoadingAI ? 'Generating...' : 'Help Me Find My Ideal Customer'}
              </button>
              <button
                onClick={exportPersonas}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => savePersonas(personas)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Save message */}
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm">{saveMessage}</span>
            </div>
          )}
        </div>
      </div>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* AI Suggestions Section */}
        {aiSuggestions.length > 0 && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">AI-Generated Customer Profiles</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="space-y-2 mb-3">
                    <p><strong>Role:</strong> {suggestion.role}</p>
                    <p><strong>Industry:</strong> {suggestion.industry}</p>
                    <p><strong>Key Challenges:</strong> {suggestion.challenges?.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => applySuggestion(suggestion)}
                    className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    + Add This Profile
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setAiSuggestions([])}
              className="mt-4 text-sm text-purple-600 hover:text-purple-700"
            >
              Clear Suggestions
            </button>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          
          {/* Persona List Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Your Customers</h3>
                <button
                  onClick={createNewPersona}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {personas.map((persona, index) => (
                  <div
                    key={persona.id}
                    className={`p-3 rounded-md cursor-pointer border ${
                      activePersona === persona.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setActivePersona(persona.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {persona.role || `Customer ${index + 1}`}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {persona.industry || 'Industry not specified'}
                        </p>
                      </div>
                      {personas.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePersona(persona.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="col-span-12 lg:col-span-9">
            {currentPersona && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">
                    {currentPersona.role || 'New Persona'} Details
                  </h2>
                </div>

                <div className="p-6 space-y-8">
                  
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Role/Title *
                      </label>
                      <input
                        type="text"
                        value={currentPersona.role}
                        onChange={(e) => updatePersona('role', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Marketing Director, CEO, Product Manager"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry *
                      </label>
                      <input
                        type="text"
                        value={currentPersona.industry}
                        onChange={(e) => updatePersona('industry', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Technology, Healthcare, Finance"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        value={currentPersona.companySize}
                        onChange={(e) => updatePersona('companySize', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Demographics (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age Range
                        </label>
                        <input
                          type="text"
                          value={currentPersona.demographics.age || ''}
                          onChange={(e) => updatePersona('demographics.age', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 25-35, 40-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={currentPersona.demographics.location || ''}
                          onChange={(e) => updatePersona('demographics.location', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., North America, Global"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Education
                        </label>
                        <input
                          type="text"
                          value={currentPersona.demographics.education || ''}
                          onChange={(e) => updatePersona('demographics.education', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Bachelor's, MBA, Technical"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Lists */}
                  {[
                    { key: 'challenges', label: 'Key Challenges', placeholder: 'What problems do they face?' },
                    { key: 'goals', label: 'Business Goals', placeholder: 'What are they trying to achieve?' },
                    { key: 'painPoints', label: 'Pain Points', placeholder: 'What frustrates them most?' },
                    { key: 'behaviorTraits', label: 'Behavior Traits', placeholder: 'How do they make decisions?' },
                    { key: 'preferredChannels', label: 'Preferred Communication Channels', placeholder: 'Email, LinkedIn, Phone, etc.' }
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium">{label}</h3>
                        <button
                          onClick={() => addArrayItem(key)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(currentPersona[key as keyof Persona] as string[]).map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayItem(key, index, e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={placeholder}
                            />
                            <button
                              onClick={() => removeArrayItem(key, index)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={currentPersona.notes}
                      onChange={(e) => updatePersona('notes', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              placeholder="Any additional insights about this customer profile..."
                    />
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips - moved inside the main content area and aligned with the form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Empty space to align with sidebar */}
          <div className="col-span-12 lg:col-span-3"></div>
          
          {/* Tips section aligned with main form */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Tips for Better Customer Profiles</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Be specific - "Marketing Director at 50-person SaaS company" vs "Business person"</li>
                    <li>• Focus on job-related challenges rather than personal traits</li>
                    <li>• Include both emotional and logical motivations</li>
                    <li>• Consider where and how they consume information</li>
                    <li>• Update customer profiles regularly based on customer feedback</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdealCustomerTool;