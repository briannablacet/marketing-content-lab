// src/components/features/MarketingWalkthrough/components/SeoKeywordsStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../../components/ui/card';
import { HelpCircle, Plus, X, Sparkles } from 'lucide-react';

interface KeywordGroup {
  category: string;
  keywords: string[];
}

interface SeoKeywordsData {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  keywordGroups: KeywordGroup[];
}

interface SeoKeywordsStepProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: SeoKeywordsData) => void;
  initialData?: SeoKeywordsData;
}

const SeoKeywordsStep: React.FC<SeoKeywordsStepProps> = ({ onNext, onBack, onSave, initialData }) => {
  const [keywordData, setKeywordData] = useState<SeoKeywordsData>({
    primaryKeywords: [''],
    secondaryKeywords: [''],
    keywordGroups: [{ category: '', keywords: [''] }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setKeywordData(initialData);
    }
  }, [initialData]);

  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // We'll get this context from our global state later
          context: {
            messages: ['Value prop 1', 'Value prop 2'],
            personas: ['Persona 1', 'Persona 2'],
            competitors: ['Competitor 1', 'Competitor 2']
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const data = await response.json();
      setKeywordData(data);
    } catch (err) {
      setError('Failed to generate keywords. Please try manual entry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean up empty values
      const cleanedData = {
        primaryKeywords: keywordData.primaryKeywords.filter(k => k.trim() !== ''),
        secondaryKeywords: keywordData.secondaryKeywords.filter(k => k.trim() !== ''),
        keywordGroups: keywordData.keywordGroups
          .filter(group => group.category.trim() !== '')
          .map(group => ({
            ...group,
            keywords: group.keywords.filter(k => k.trim() !== '')
          }))
      };

      await onSave(cleanedData);
    } catch (err) {
      setError('Failed to save SEO keywords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = (type: 'primary' | 'secondary') => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: [
        ...prev[type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'],
        ''
      ]
    }));
  };

  const updateKeyword = (type: 'primary' | 'secondary', index: number, value: string) => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
        type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
      ].map((k, i) => (i === index ? value : k))
    }));
  };

  const removeKeyword = (type: 'primary' | 'secondary', index: number) => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
        type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
      ].filter((_, i) => i !== index)
    }));
  };

  const addKeywordGroup = () => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: [...prev.keywordGroups, { category: '', keywords: [''] }]
    }));
  };

  const updateKeywordGroup = (index: number, field: 'category' | 'keywords', value: string | string[]) => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: prev.keywordGroups.map((group, i) =>
        i === index ? { ...group, [field]: value } : group
      )
    }));
  };

  const removeKeywordGroup = (index: number) => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: prev.keywordGroups.filter((_, i) => i !== index)
    }));
  };

  const addKeywordToGroup = (groupIndex: number) => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: prev.keywordGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, keywords: [...group.keywords, ''] }
          : group
      )
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Let's optimize your content for search! 🔍
            </h2>
            <p className="text-gray-600">
              Enter your keywords if you have them, or let AI suggest the perfect keywords based on your strategy.
            </p>
          </div>

          {/* AI Generation Button */}
          <button
            type="button"
            onClick={handleGenerateKeywords}
            disabled={isGenerating}
            className="w-full mb-8 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:bg-blue-400"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            {isGenerating ? 'Analyzing Your Strategy...' : 'Do This For Me'}
          </button>

          <div className="mb-6 text-center text-gray-600">
            - or enter keywords manually below -
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rest of the form content remains the same */}
            {/* Primary Keywords */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">
                Primary Keywords
              </label>
              <p className="text-sm text-gray-600 mb-4">
                These are your main target keywords that directly relate to your core offering.
              </p>
              {keywordData.primaryKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword('primary', index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a primary keyword"
                  />
                  {keywordData.primaryKeywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyword('primary', index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addKeyword('primary')}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Primary Keyword
              </button>
            </div>

            {/* Secondary Keywords */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">
                Secondary Keywords
              </label>
              <p className="text-sm text-gray-600 mb-4">
                These support your primary keywords and capture related search intent.
              </p>
              {keywordData.secondaryKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword('secondary', index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a secondary keyword"
                  />
                  {keywordData.secondaryKeywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyword('secondary', index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addKeyword('secondary')}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Secondary Keyword
              </button>
            </div>

            {/* Keyword Groups */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900">
                  Keyword Groups
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Organize related keywords into themed groups for better content planning.
                </p>
              </div>
              {keywordData.keywordGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border rounded-lg p-4 relative">
                  {keywordData.keywordGroups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeywordGroup(groupIndex)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) => updateKeywordGroup(groupIndex, 'category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter group category (e.g., Features, Benefits, Use Cases)"
                    />
                    
                    <div className="space-y-2">
                      {group.keywords.map((keyword, keywordIndex) => (
                        <div key={keywordIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={keyword}
                            onChange={(e) => {
                              const newKeywords = [...group.keywords];
                              newKeywords[keywordIndex] = e.target.value;
                              updateKeywordGroup(groupIndex, 'keywords', newKeywords);
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter a keyword for this group"
                          />
                            
                          {group.keywords.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newKeywords = group.keywords.filter((_, i) => i !== keywordIndex);
                                updateKeywordGroup(groupIndex, 'keywords', newKeywords);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addKeywordToGroup(groupIndex)}
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Keyword to Group
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addKeywordGroup}
                className="w-full p-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Another Keyword Group
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center">
                <HelpCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoKeywordsStep;