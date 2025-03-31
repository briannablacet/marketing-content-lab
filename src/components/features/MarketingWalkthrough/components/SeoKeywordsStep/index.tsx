// src/components/features/MarketingWalkthrough/components/SeoKeywordsStep/index.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Plus, X, Sparkles, BarChart } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

interface KeywordWithVolume {
  term: string;
  volume?: number | string;
  competition?: string;
}

interface KeywordGroup {
  category: string;
  keywords: KeywordWithVolume[];
  totalVolume?: number | string;
}

interface SeoKeywordsData {
  primaryKeywords: KeywordWithVolume[];
  secondaryKeywords: KeywordWithVolume[];
  keywordGroups: KeywordGroup[];
}

interface SeoKeywordsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onSave?: (data: SeoKeywordsData) => void;
  initialData?: SeoKeywordsData;
  showSubmitButton?: boolean;
  isWalkthrough?: boolean;
}

const SeoKeywordsStep: React.FC<SeoKeywordsStepProps> = ({
  onNext,
  onBack,
  onSave,
  initialData,
  showSubmitButton = false,
  isWalkthrough = true
}) => {
  const { showNotification } = useNotification();

  // Main keyword data state
  const [keywordData, setKeywordData] = useState<SeoKeywordsData>({
    primaryKeywords: [{ term: '' }],
    secondaryKeywords: [{ term: '' }],
    keywordGroups: [{ category: '', keywords: [{ term: '' }] }]
  });

  // Additional UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywordMetrics, setKeywordMetrics] = useState<{
    estimatedSearchVolume: string;
    competitionLevel: string;
    recommendedContent: string[];
  } | null>(null);

  /**
   * A single piece of state that tracks *where* we want to focus next.
   * Example:
   *   { section: 'primary' }
   *   { section: 'secondary' }
   *   { section: 'group', groupIndex: 2 }
   */
  const [focusTarget, setFocusTarget] = useState<
    | { section: 'primary' }
    | { section: 'secondary' }
    | { section: 'group'; groupIndex: number }
    | null
  >(null);

  /**
   * Load initial data from props or localStorage
   */
  useEffect(() => {
    if (initialData) {
      setKeywordData(initialData);
    } else {
      try {
        const savedData = localStorage.getItem('marketingSeoKeywords');
        if (savedData) {
          const parsedData = JSON.parse(savedData);

          // Convert old format to new if needed
          if (parsedData.primaryKeywords && Array.isArray(parsedData.primaryKeywords)) {
            if (typeof parsedData.primaryKeywords[0] === 'string') {
              // Old format
              const updatedData = {
                primaryKeywords: parsedData.primaryKeywords.map((kw: string) => ({
                  term: kw,
                  volume: Math.floor(Math.random() * 5000) + 500
                })),
                secondaryKeywords: parsedData.secondaryKeywords.map((kw: string) => ({
                  term: kw,
                  volume: Math.floor(Math.random() * 1000) + 100
                })),
                keywordGroups: parsedData.keywordGroups.map((group: any) => ({
                  category: group.category,
                  keywords: group.keywords.map((kw: string) => ({
                    term: kw,
                    volume: Math.floor(Math.random() * 2000) + 200
                  })),
                  totalVolume: Math.floor(Math.random() * 10000) + 1000
                }))
              };
              setKeywordData(updatedData);
            } else {
              // Already new format
              setKeywordData(parsedData);
            }
          }
        }
      } catch (err) {
        console.error('Error loading saved keyword data:', err);
      }
    }
  }, [initialData]);

  /**
   * Single effect that focuses whichever field we said we just added
   */
  useEffect(() => {
    if (!focusTarget) return;

    const timer = setTimeout(() => {
      if (focusTarget.section === 'primary') {
        const primaryInputs = document.querySelectorAll('input[placeholder="Enter a primary keyword"]');
        if (primaryInputs.length > 0) {
          (primaryInputs[primaryInputs.length - 1] as HTMLInputElement).focus();
        }
      } else if (focusTarget.section === 'secondary') {
        const secondaryInputs = document.querySelectorAll('input[placeholder="Enter a secondary keyword"]');
        if (secondaryInputs.length > 0) {
          (secondaryInputs[secondaryInputs.length - 1] as HTMLInputElement).focus();
        }
      } else if (focusTarget.section === 'group') {
        // Focus only the newly added "term" input in that group
        const groupIndex = focusTarget.groupIndex;
        const termInputs = document.querySelectorAll(
          `input[data-groupindex="${groupIndex}"][data-field="term"]`
        );
        if (termInputs.length > 0) {
          const lastTermInput = termInputs[termInputs.length - 1] as HTMLInputElement;
          lastTermInput.focus();
        }
      }

      // Reset so it doesn't keep focusing
      setFocusTarget(null);
    }, 50);

    return () => clearTimeout(timer);
  }, [focusTarget]);

  /**
   * Helper: Convert any type to KeywordWithVolume
   */
  const ensureKeywordWithVolume = (value: any): KeywordWithVolume => {
    if (typeof value === 'string') {
      return {
        term: value,
        volume: Math.floor(Math.random() * 3000) + 100
      };
    }
    if (typeof value === 'object' && value !== null) {
      if (value.term) return value;
      if (value.keyword) {
        return {
          term: String(value.keyword),
          volume: value.volume || Math.floor(Math.random() * 3000) + 100
        };
      }
      if (value.name) {
        return {
          term: String(value.name),
          volume: value.volume || Math.floor(Math.random() * 3000) + 100
        };
      }
      return {
        term: JSON.stringify(value),
        volume: Math.floor(Math.random() * 3000) + 100
      };
    }
    return {
      term: String(value || ''),
      volume: Math.floor(Math.random() * 3000) + 100
    };
  };

  /**
   * AI Generation Handler
   */
  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    setError('');

    try {
      let messages = [''];
      let personas = [''];
      let competitors = [''];
      let productInfo = {};

      console.log('SEO Step - localStorage content:', {
        messagingData: localStorage.getItem('marketingMessages'),
        personaData: localStorage.getItem('marketingTargetAudience'),
        competitorData: localStorage.getItem('marketingCompetitors'),
        productData: localStorage.getItem('marketingProduct')
      });

      // Try to load messaging data
      try {
        const messagingData = localStorage.getItem('marketingMessages');
        if (messagingData) {
          const parsed = JSON.parse(messagingData);
          messages = [
            parsed.valueProposition || '',
            ...(parsed.differentiators || []),
            ...(parsed.keyBenefits || [])
          ].filter((m: string) => m.trim());
        }
      } catch (err) {
        console.error('Error loading messaging data:', err);
      }

      // Persona data
      try {
        const personaData = localStorage.getItem('marketingTargetAudience');
        if (personaData) {
          const parsed = JSON.parse(personaData);
          personas = [`${parsed.role || ''} in ${parsed.industry || ''}`];
          if (Array.isArray(parsed.challenges)) {
            personas = [...personas, ...parsed.challenges];
          }
        }
      } catch (err) {
        console.error('Error loading persona data:', err);
      }

      // Competitor data
      try {
        const competitorData = localStorage.getItem('marketingCompetitors');
        if (competitorData) {
          const parsed = JSON.parse(competitorData);
          competitors = parsed.map((comp: any) => comp.name).filter((name: string) => name.trim());
        }
      } catch (err) {
        console.error('Error loading competitor data:', err);
      }

      // Product info
      try {
        const productData = localStorage.getItem('marketingProduct');
        if (productData) {
          productInfo = JSON.parse(productData);
        }
      } catch (err) {
        console.error('Error loading product data:', err);
      }

      console.log('API request context:', {
        messages,
        personas,
        competitors,
        productInfo
      });

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: 'generate-keywords',
          data: {
            context: {
              messages: messages.length ? messages : ['Your value proposition'],
              personas: personas.length ? personas : ['Your target audience'],
              competitors: competitors.length ? competitors : ['Your competitors'],
              productInfo
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response for keywords:', data);

      let processedData: SeoKeywordsData = {
        primaryKeywords: [],
        secondaryKeywords: [],
        keywordGroups: []
      };

      // Primary
      if (data.primaryKeywords && Array.isArray(data.primaryKeywords)) {
        processedData.primaryKeywords = data.primaryKeywords.map((keyword: any) =>
          ensureKeywordWithVolume(keyword)
        );
      }

      // Secondary
      if (data.secondaryKeywords && Array.isArray(data.secondaryKeywords)) {
        processedData.secondaryKeywords = data.secondaryKeywords.map((keyword: any) =>
          ensureKeywordWithVolume(keyword)
        );
      }

      // Groups
      if (data.keywordGroups && Array.isArray(data.keywordGroups)) {
        processedData.keywordGroups = data.keywordGroups.map((group: any) => {
          const category =
            typeof group.category === 'string'
              ? group.category
              : String(group.category || 'Group');

          let groupKeywords: KeywordWithVolume[] = [];
          if (group.keywords && Array.isArray(group.keywords)) {
            groupKeywords = group.keywords.map((keyword: any) =>
              ensureKeywordWithVolume(keyword)
            );
          }

          const totalVolume = groupKeywords.reduce((sum, kw) => {
            const vol =
              typeof kw.volume === 'number'
                ? kw.volume
                : parseInt(String(kw.volume) || '0', 10);
            return sum + (isNaN(vol) ? 0 : vol);
          }, 0);

          return {
            category,
            keywords: groupKeywords,
            totalVolume
          };
        });
      }

      console.log('Processed keyword data:', processedData);

      if (data.metrics) {
        setKeywordMetrics({
          estimatedSearchVolume: data.metrics.estimatedSearchVolume || 'Unknown',
          competitionLevel: data.metrics.competitionLevel || 'Medium',
          recommendedContent: Array.isArray(data.metrics.recommendedContent)
            ? data.metrics.recommendedContent
            : []
        });
      }

      // Fallback
      if (!processedData.primaryKeywords.length) {
        processedData.primaryKeywords = [{ term: '' }];
      }
      if (!processedData.secondaryKeywords.length) {
        processedData.secondaryKeywords = [{ term: '' }];
      }
      if (!processedData.keywordGroups.length) {
        processedData.keywordGroups = [{ category: '', keywords: [{ term: '' }] }];
      }

      setKeywordData(processedData);
      localStorage.setItem('marketingSeoKeywords', JSON.stringify(processedData));
      showNotification('success', 'Keywords generated successfully!');
    } catch (err) {
      console.error('Error generating keywords:', err);
      setError('Failed to generate keywords. Please try manual entry.');
      showNotification('error', 'Failed to generate keywords. Please try manual entry.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedData = {
        primaryKeywords: keywordData.primaryKeywords.filter(k => k.term.trim() !== ''),
        secondaryKeywords: keywordData.secondaryKeywords.filter(k => k.term.trim() !== ''),
        keywordGroups: keywordData.keywordGroups
          .filter(group => group.category.trim() !== '')
          .map(group => ({
            ...group,
            keywords: group.keywords.filter(k => k.term.trim() !== '')
          }))
      };

      try {
        localStorage.setItem('marketingSeoKeywords', JSON.stringify(cleanedData));
      } catch (storageErr) {
        console.error('Error saving to localStorage:', storageErr);
      }

      if (onSave) {
        await onSave(cleanedData);
      }

      if (!showSubmitButton && onNext) {
        showNotification('success', 'SEO keywords saved successfully!');
        onNext();
      }
    } catch (err) {
      setError('Failed to save SEO keywords. Please try again.');
      showNotification('error', 'Failed to save SEO keywords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   *  Add / Update / Remove
   */

  // Add a new primary or secondary
  const addKeyword = (type: 'primary' | 'secondary') => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: [
        ...prev[type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'],
        { term: '', volume: 0 }
      ]
    }));
    setFocusTarget({ section: type }); // so we know to focus the new keyword
  };

  // Add a new group at the end, then focus the new group's keyword
  const addKeywordGroup = () => {
    setKeywordData(prev => {
      const newIndex = prev.keywordGroups.length;
      return {
        ...prev,
        keywordGroups: [
          ...prev.keywordGroups,
          { category: '', keywords: [{ term: '' }] }
        ]
      };
    });
    const nextIndex = keywordData.keywordGroups.length;
    setFocusTarget({ section: 'group', groupIndex: nextIndex });
  };

  // Add a keyword to an existing group
  const addKeywordToGroup = (groupIndex: number) => {
    setKeywordData(prev => {
      const updatedGroups = [...prev.keywordGroups];
      if (updatedGroups[groupIndex]) {
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: [...updatedGroups[groupIndex].keywords, { term: '', volume: 0 }]
        };
      }
      return { ...prev, keywordGroups: updatedGroups };
    });
    setFocusTarget({ section: 'group', groupIndex });
  };

  // Update a primary/secondary
  const updateKeyword = (
    type: 'primary' | 'secondary',
    index: number,
    value: string | number | KeywordWithVolume,
    field: 'term' | 'volume' = 'term'
  ) => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
        type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
      ].map((k, i) => {
        if (i === index) {
          if (typeof value === 'object') {
            return value; // Replace entire object
          } else {
            const updatedKeyword = { ...k, [field]: value };
            // If we’re updating the term and it changed
            if (field === 'term' && typeof value === 'string' && value.trim() !== '' && value !== k.term) {
              setTimeout(() => lookupSearchVolume(type, index, value), 1500);
            }
            return updatedKeyword;
          }
        }
        return k;
      })
    }));
  };

  // Lookup search volume for primary/secondary
  const lookupSearchVolume = async (
    type: 'primary' | 'secondary',
    index: number,
    term: string
  ) => {
    try {
      if (term.length < 3) return;
      const hasSearchVolumeAPI = true;
      if (!hasSearchVolumeAPI) return;

      const baseVolume = term.length * 100;
      const characterSum = term.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const searchVolume = baseVolume + (characterSum % 1000);

      await new Promise(resolve => setTimeout(resolve, 600));

      setKeywordData(prev => {
        const currentKeywords =
          type === 'primary' ? prev.primaryKeywords : prev.secondaryKeywords;

        const updatedKeywords = currentKeywords.map((kw, i) => {
          if (i === index && kw.term === term) {
            return { ...kw, volume: searchVolume };
          }
          return kw;
        });

        return {
          ...prev,
          [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: updatedKeywords
        };
      });
    } catch (error) {
      console.error('Error looking up search volume:', error);
    }
  };

  // Remove a primary/secondary
  const removeKeyword = (type: 'primary' | 'secondary', index: number) => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
        type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
      ].filter((_, i) => i !== index)
    }));
  };

  // Update the group object (like changing category)
  const updateKeywordGroup = (
    groupIndex: number,
    field: 'category' | 'keywords' | 'totalVolume',
    value: any
  ) => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: prev.keywordGroups.map((group, i) =>
        i === groupIndex ? { ...group, [field]: value } : group
      )
    }));
  };

  // Remove an entire group
  const removeKeywordGroup = (index: number) => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: prev.keywordGroups.filter((_, i) => i !== index)
    }));
  };

  // Update a single keyword within a group
  const updateKeywordInGroup = (
    groupIndex: number,
    keywordIndex: number,
    value: string | number,
    field: 'term' | 'volume' = 'term'
  ) => {
    setKeywordData(prev => {
      const updatedGroups = [...prev.keywordGroups];
      if (updatedGroups[groupIndex]?.keywords[keywordIndex]) {
        const updatedKeyword = {
          ...updatedGroups[groupIndex].keywords[keywordIndex],
          [field]: value
        };

        // If we’re updating the term
        if (
          field === 'term' &&
          typeof value === 'string' &&
          value.trim() !== '' &&
          value !== updatedGroups[groupIndex].keywords[keywordIndex].term
        ) {
          setTimeout(() => lookupSearchVolumeForGroup(groupIndex, keywordIndex, value), 1500);
        }

        const updatedKeywords = [...updatedGroups[groupIndex].keywords];
        updatedKeywords[keywordIndex] = updatedKeyword;

        // Recalc total volume
        const totalVolume = updatedKeywords.reduce((sum, kw) => {
          const vol =
            typeof kw.volume === 'number'
              ? kw.volume
              : parseInt(String(kw.volume) || '0', 10);
          return sum + (isNaN(vol) ? 0 : vol);
        }, 0);

        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: updatedKeywords,
          totalVolume
        };
      }
      return { ...prev, keywordGroups: updatedGroups };
    });
  };

  // Lookup search volume in a group
  const lookupSearchVolumeForGroup = async (
    groupIndex: number,
    keywordIndex: number,
    term: string
  ) => {
    try {
      if (term.length < 3) return;
      const hasSearchVolumeAPI = true;
      if (!hasSearchVolumeAPI) return;

      const baseVolume = term.length * 100;
      const characterSum = term.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const searchVolume = baseVolume + (characterSum % 1000);

      await new Promise(resolve => setTimeout(resolve, 600));

      setKeywordData(prev => {
        const updatedGroups = [...prev.keywordGroups];
        if (
          updatedGroups[groupIndex]?.keywords[keywordIndex] &&
          updatedGroups[groupIndex].keywords[keywordIndex].term === term
        ) {
          const updatedKeywords = [...updatedGroups[groupIndex].keywords];
          updatedKeywords[keywordIndex] = {
            ...updatedKeywords[keywordIndex],
            volume: searchVolume
          };

          // Recalc total volume
          const totalVolume = updatedKeywords.reduce((sum, kw) => {
            const vol =
              typeof kw.volume === 'number'
                ? kw.volume
                : parseInt(String(kw.volume) || '0', 10);
            return sum + (isNaN(vol) ? 0 : vol);
          }, 0);

          updatedGroups[groupIndex] = {
            ...updatedGroups[groupIndex],
            keywords: updatedKeywords,
            totalVolume
          };
        }
        return { ...prev, keywordGroups: updatedGroups };
      });
    } catch (error) {
      console.error('Error looking up search volume for group keyword:', error);
    }
  };

  // Remove a single keyword from a group
  const removeKeywordFromGroup = (groupIndex: number, keywordIndex: number) => {
    setKeywordData(prev => {
      const updatedGroups = [...prev.keywordGroups];
      if (updatedGroups[groupIndex]) {
        const updatedKeywords = updatedGroups[groupIndex].keywords.filter((_, i) => i !== keywordIndex);

        // Recalc total volume
        const totalVolume = updatedKeywords.reduce((sum, kw) => {
          const vol =
            typeof kw.volume === 'number'
              ? kw.volume
              : parseInt(String(kw.volume) || '0', 10);
          return sum + (isNaN(vol) ? 0 : vol);
        }, 0);

        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: updatedKeywords,
          totalVolume
        };
      }
      return { ...prev, keywordGroups: updatedGroups };
    });
  };

  /*******************************************************
   *  Render
   *******************************************************/
  return (
    <div className="w-full">
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
            {/* Primary Keywords */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">
                Primary Keywords
              </label>
              <p className="text-sm text-gray-600 mb-4">
                These are your main target keywords that directly relate to your core offering.
              </p>

              {/* Column Headers */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 text-sm font-medium text-gray-700">Keyword</div>
                <div className="w-24 text-sm font-medium text-gray-700 flex items-center">
                  <BarChart className="w-4 h-4 mr-1" />
                  <span>Volume</span>
                </div>
                <div className="w-8"></div> {/* Spacer for delete button */}
              </div>

              {keywordData.primaryKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keyword.term}
                    onChange={(e) => updateKeyword('primary', index, e.target.value, 'term')}
                    className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a primary keyword"
                  />
                  <input
                    type="number"
                    value={keyword.volume || 0}
                    onChange={(e) =>
                      updateKeyword('primary', index, parseInt(e.target.value) || 0, 'volume')
                    }
                    className="w-24 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Volume"
                    min="0"
                  />
                  {keywordData.primaryKeywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyword('primary', index)}
                      className="text-gray-400 hover:text-gray-600 w-8"
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

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 text-sm font-medium text-gray-700">Keyword</div>
                <div className="w-24 text-sm font-medium text-gray-700 flex items-center">
                  <BarChart className="w-4 h-4 mr-1" />
                  <span>Volume</span>
                </div>
                <div className="w-8"></div>
              </div>

              {keywordData.secondaryKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keyword.term}
                    onChange={(e) => updateKeyword('secondary', index, e.target.value, 'term')}
                    className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a secondary keyword"
                  />
                  <input
                    type="number"
                    value={keyword.volume || 0}
                    onChange={(e) =>
                      updateKeyword('secondary', index, parseInt(e.target.value) || 0, 'volume')
                    }
                    className="w-24 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Volume"
                    min="0"
                  />
                  {keywordData.secondaryKeywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyword('secondary', index)}
                      className="text-gray-400 hover:text-gray-600 w-8"
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
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => updateKeywordGroup(groupIndex, 'category', e.target.value)}
                        className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter group category (e.g., Features, Benefits, Use Cases)"
                      />
                      <div className="flex items-center w-48 text-sm">
                        <BarChart className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="text-gray-700">Total Volume:</span>
                        <span className="ml-2 font-medium text-blue-700">
                          {group.totalVolume || 0}
                        </span>
                      </div>
                    </div>

                    {/* Column Headers */}
                    <div className="flex items-center gap-2 mb-2 pl-2">
                      <div className="flex-1 text-sm font-medium text-gray-700">Keyword</div>
                      <div className="w-24 text-sm font-medium text-gray-700 flex items-center">
                        <BarChart className="w-4 h-4 mr-1" />
                        <span>Volume</span>
                      </div>
                      <div className="w-8"></div>
                    </div>

                    <div className="space-y-2">
                      {group.keywords.map((keyword, keywordIndex) => (
                        <div key={keywordIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={keyword.term}
                            onChange={(e) =>
                              updateKeywordInGroup(groupIndex, keywordIndex, e.target.value, 'term')
                            }
                            className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter a keyword for this group"
                            data-groupindex={groupIndex}
                            data-field="term"  // so we can specifically focus this
                          />
                          <input
                            type="number"
                            value={keyword.volume || 0}
                            onChange={(e) =>
                              updateKeywordInGroup(
                                groupIndex,
                                keywordIndex,
                                parseInt(e.target.value) || 0,
                                'volume'
                              )
                            }
                            className="w-24 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Volume"
                            min="0"
                            data-groupindex={groupIndex}
                            data-field="volume"
                          />
                          {group.keywords.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeKeywordFromGroup(groupIndex, keywordIndex)}
                              className="text-gray-400 hover:text-gray-600 w-8"
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

            {/* Submit button for standalone page */}
            {showSubmitButton && (
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? 'Saving...' : 'Save Keywords'}
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoKeywordsStep;
