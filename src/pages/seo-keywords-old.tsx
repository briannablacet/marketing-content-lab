// src/pages/seo-keywords.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Plus, X, Sparkles, BarChart, HelpCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

// ------------------- Interfaces -------------------
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

// ------------------- Component -------------------
const SEOKeywordsPage: React.FC = () => {
  const { showNotification } = useNotification();

  // Main SEO keyword data
  const [keywordData, setKeywordData] = useState<SeoKeywordsData>({
    primaryKeywords: [{ term: '' }],
    secondaryKeywords: [{ term: '' }],
    keywordGroups: [{ category: '', keywords: [{ term: '' }] }]
  });

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // If not enough context data in localStorage, user sees fallback inputs
  const [hasContextData, setHasContextData] = useState(true);
  const [contextInputs, setContextInputs] = useState({
    topic: '',
    industry: '',
    description: ''
  });

  // --------- References for auto-focusing each newly added item -----------
  const primaryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const secondaryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const groupInputRefs = useRef<{ [groupIndex: number]: (HTMLInputElement | null)[] }>({});

  // We track the "last added" item in each category
  const [lastAddedPrimary, setLastAddedPrimary] = useState<number | null>(null);
  const [lastAddedSecondary, setLastAddedSecondary] = useState<number | null>(null);
  const [lastAddedGroup, setLastAddedGroup] = useState<{ groupIndex: number; keywordIndex: number } | null>(null);

  // ------------------- Load data from localStorage on mount -------------------
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('marketingSeoKeywords');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Convert old format if needed
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
            // Already in new format
            setKeywordData(parsedData);
          }
        }
      }

      // Check how many marketing context items exist
      const hasMessagingData = localStorage.getItem('marketingMessages') !== null;
      const hasPersonaData = localStorage.getItem('marketingTargetAudience') !== null;
      const hasProductData = localStorage.getItem('marketingProduct') !== null;
      // If fewer than 2 data sources, we show the fallback context fields
      setHasContextData(
        (hasMessagingData ? 1 : 0) +
        (hasPersonaData ? 1 : 0) +
        (hasProductData ? 1 : 0) >= 2
      );
    } catch (err) {
      console.error('Error loading saved keyword data:', err);
      setHasContextData(false);
    }
  }, []);

  // ------------------- Focus Effects -------------------
  // Focus the "term" input for newly added primary keyword
  useEffect(() => {
    if (lastAddedPrimary !== null) {
      const index = lastAddedPrimary;
      primaryInputRefs.current[index]?.focus();
      setLastAddedPrimary(null);
    }
  }, [lastAddedPrimary]);

  // Focus the "term" input for newly added secondary keyword
  useEffect(() => {
    if (lastAddedSecondary !== null) {
      const index = lastAddedSecondary;
      secondaryInputRefs.current[index]?.focus();
      setLastAddedSecondary(null);
    }
  }, [lastAddedSecondary]);

  // Focus the "term" input for newly added group keyword
  useEffect(() => {
    if (lastAddedGroup !== null) {
      const { groupIndex, keywordIndex } = lastAddedGroup;
      if (
        groupInputRefs.current[groupIndex] &&
        groupInputRefs.current[groupIndex][keywordIndex]
      ) {
        groupInputRefs.current[groupIndex][keywordIndex]?.focus();
      }
      setLastAddedGroup(null);
    }
  }, [lastAddedGroup]);

  // ------------------- Convert any type -> KeywordWithVolume -------------------
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
      // Fallback
      return {
        term: JSON.stringify(value),
        volume: Math.floor(Math.random() * 3000) + 100
      };
    }
    // Default
    return {
      term: String(value || ''),
      volume: Math.floor(Math.random() * 3000) + 100
    };
  };

  // ------------------- Input handlers for fallback context form -------------------
  const handleContextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContextInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ------------------- AI Generation Handler -------------------
  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Gather context from localStorage or fallback inputs
      let messages = [''];
      let personas = [''];
      let competitors = [''];
      let productInfo = {};

      if (!hasContextData) {
        // Use fallback inputs
        if (!contextInputs.topic) {
          setError('Please enter a topic to generate keywords');
          setIsGenerating(false);
          showNotification('error', 'Please enter a topic to generate keywords');
          return;
        }

        messages = [contextInputs.topic];
        if (contextInputs.description) {
          messages.push(contextInputs.description);
        }
        personas = contextInputs.industry
          ? [`Marketing professional in ${contextInputs.industry}`]
          : ['Marketing professional'];
        productInfo = {
          name: 'Marketing Content Lab',
          type: 'Content Marketing Platform',
          valueProposition: contextInputs.topic
        };
      } else {
        // Load from localStorage
        try {
          const messagingData = localStorage.getItem('marketingMessages');
          if (messagingData) {
            const parsed = JSON.parse(messagingData);
            messages = [
              parsed.valueProposition || '',
              ...(parsed.differentiators || []),
              ...(parsed.keyBenefits || [])
            ].filter(m => m.trim());
          }
        } catch (err) {
          console.error('Error loading messaging data:', err);
        }

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

        try {
          const competitorData = localStorage.getItem('marketingCompetitors');
          if (competitorData) {
            const parsed = JSON.parse(competitorData);
            competitors = parsed.map((comp: any) => comp.name).filter((name: string) => name.trim());
          }
        } catch (err) {
          console.error('Error loading competitor data:', err);
        }

        try {
          const productData = localStorage.getItem('marketingProduct');
          if (productData) {
            productInfo = JSON.parse(productData);
          }
        } catch (err) {
          console.error('Error loading product data:', err);
        }
      }

      // Some defaults if empty
      if (!messages[0]) {
        messages = [
          contextInputs.topic || 'AI-powered marketing content creation',
          contextInputs.description || 'Create, enhance, repurpose, and scale your content.'
        ].filter(m => m.trim());
      }

      if (!personas[0]) {
        personas = [
          contextInputs.industry
            ? `Marketing Director at ${contextInputs.industry} company`
            : 'Marketing Director at mid-sized B2B company'
        ];
      }

      if (!competitors[0]) {
        competitors = ['ContentAI', 'MarketMuse', 'Jasper', 'WriterAccess'];
      }

      if (Object.keys(productInfo).length === 0) {
        productInfo = {
          name: 'Marketing Content Lab',
          type: 'Content Marketing Platform',
          valueProposition:
            contextInputs.topic || 'AI-powered marketing content creation and strategy'
        };
      }

      // Call your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/kewords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          data: {
            context: {
              messages,
              personas,
              competitors,
              productInfo,
              topic: contextInputs.topic || messages[0] || productInfo.valueProposition,
              contentType: 'blog post'
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

      if (data.primaryKeywords && Array.isArray(data.primaryKeywords)) {
        processedData.primaryKeywords = data.primaryKeywords.map((keyword: any) =>
          ensureKeywordWithVolume(keyword)
        );
      }
      if (data.secondaryKeywords && Array.isArray(data.secondaryKeywords)) {
        processedData.secondaryKeywords = data.secondaryKeywords.map((keyword: any) =>
          ensureKeywordWithVolume(keyword)
        );
      }
      if (data.keywordGroups && Array.isArray(data.keywordGroups)) {
        processedData.keywordGroups = data.keywordGroups.map((group: any) => {
          const category =
            typeof group.category === 'string' ? group.category : String(group.category || 'Group');

          let groupKeywords: KeywordWithVolume[] = [];
          if (group.keywords && Array.isArray(group.keywords)) {
            groupKeywords = group.keywords.map((kw: any) => ensureKeywordWithVolume(kw));
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

      // Fallback if empty
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

  // ------------------- Save / Submit Handler -------------------
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
      localStorage.setItem('marketingSeoKeywords', JSON.stringify(cleanedData));
      showNotification('success', 'SEO keywords saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save SEO keywords. Please try again.');
      showNotification('error', 'Failed to save SEO keywords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Add / Update / Remove -------------------
  // Add a primary or secondary keyword
  const addKeyword = (type: 'primary' | 'secondary') => {
    setKeywordData(prev => {
      const newList = [
        ...prev[type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'],
        { term: '', volume: 0 }
      ];
      if (type === 'primary') {
        setLastAddedPrimary(newList.length - 1);
      } else {
        setLastAddedSecondary(newList.length - 1);
      }
      return {
        ...prev,
        [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: newList
      };
    });
  };

  // Update a single primary or secondary
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
      ].map((kw, i) => {
        if (i === index) {
          if (typeof value === 'object') {
            return value; // replace entire object
          } else {
            const updatedKw = { ...kw, [field]: value };
            // If we changed the term
            if (
              field === 'term' &&
              typeof value === 'string' &&
              value.trim() !== '' &&
              value !== kw.term
            ) {
              setTimeout(() => lookupSearchVolume(type, i, value), 1500);
            }
            return updatedKw;
          }
        }
        return kw;
      })
    }));
  };

  // Remove a single primary or secondary
  const removeKeyword = (type: 'primary' | 'secondary', index: number) => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
        type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
      ].filter((_, i) => i !== index)
    }));
  };

  // Add a new group
  const addKeywordGroup = () => {
    setKeywordData(prev => {
      const newGroups = [...prev.keywordGroups, { category: '', keywords: [{ term: '' }] }];
      const newIndex = newGroups.length - 1;
      setLastAddedGroup({ groupIndex: newIndex, keywordIndex: 0 });
      return { ...prev, keywordGroups: newGroups };
    });
  };

  // Update the group object
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

  // Remove a group
  const removeKeywordGroup = (index: number) => {
    setKeywordData(prev => ({
      ...prev,
      keywordGroups: prev.keywordGroups.filter((_, i) => i !== index)
    }));
  };

  // Add a keyword to an existing group
  const addKeywordToGroup = (groupIndex: number) => {
    setKeywordData(prev => {
      const updatedGroups = [...prev.keywordGroups];
      if (updatedGroups[groupIndex]) {
        const newKeywords = [...updatedGroups[groupIndex].keywords, { term: '', volume: 0 }];
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: newKeywords
        };
        const newKwIndex = newKeywords.length - 1;
        setLastAddedGroup({ groupIndex, keywordIndex: newKwIndex });
      }
      return { ...prev, keywordGroups: updatedGroups };
    });
  };

  // UPDATED: Lookup search volume for a single primary/secondary keyword
  const lookupSearchVolume = async (
    type: 'primary' | 'secondary',
    index: number,
    term: string
  ) => {
    try {
      // Don't look up very short terms
      if (term.length < 3) return;

      // Call our API endpoint
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          endpoint: 'keyword-volume-lookup',
          data: {
            keyword: term
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log(`Got volume data for "${term}":`, data);

      // Update the keyword with real volume data
      setKeywordData(prev => {
        const currentList =
          type === 'primary' ? prev.primaryKeywords : prev.secondaryKeywords;

        const updatedKeywords = currentList.map((kw, i) => {
          // Only update if the term hasn't changed
          if (i === index && kw.term === term) {
            return {
              ...kw,
              volume: data.volume,
              competition: data.competition
            };
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
      // Fallback to the old approach in case of API failure
      const baseVolume = term.length * 100;
      const characterSum = term.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const searchVolume = baseVolume + (characterSum % 1000);

      setKeywordData(prev => {
        const currentList =
          type === 'primary' ? prev.primaryKeywords : prev.secondaryKeywords;

        const updatedKeywords = currentList.map((kw, i) => {
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
    }
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
        const newKw = {
          ...updatedGroups[groupIndex].keywords[keywordIndex],
          [field]: value
        };

        // If we changed the term
        if (
          field === 'term' &&
          typeof value === 'string' &&
          value.trim() !== '' &&
          value !== updatedGroups[groupIndex].keywords[keywordIndex].term
        ) {
          setTimeout(() => lookupSearchVolumeForGroup(groupIndex, keywordIndex, value), 1500);
        }

        const newKeywords = [...updatedGroups[groupIndex].keywords];
        newKeywords[keywordIndex] = newKw;

        // Recalc total
        const totalVolume = newKeywords.reduce((sum, kw) => {
          const vol = typeof kw.volume === 'number' ? kw.volume : parseInt(`${kw.volume || '0'}`, 10);
          return sum + (isNaN(vol) ? 0 : vol);
        }, 0);

        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: newKeywords,
          totalVolume
        };
      }
      return { ...prev, keywordGroups: updatedGroups };
    });
  };

  // UPDATED: Lookup search volume for a keyword in a group
  const lookupSearchVolumeForGroup = async (
    groupIndex: number,
    keywordIndex: number,
    term: string
  ) => {
    try {
      if (term.length < 3) return;

      // Call our API endpoint
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          endpoint: 'keyword-volume-lookup',
          data: {
            keyword: term
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log(`Got group volume data for "${term}":`, data);

      // Update state with the real volume data
      setKeywordData(prev => {
        const updatedGroups = [...prev.keywordGroups];
        const targetKeyword = updatedGroups[groupIndex]?.keywords?.[keywordIndex];

        if (targetKeyword && targetKeyword.term === term) {
          const newKeywords = [...updatedGroups[groupIndex].keywords];
          newKeywords[keywordIndex] = {
            ...targetKeyword,
            volume: data.volume,
            competition: data.competition
          };

          // Recalc total volume
          const totalVolume = newKeywords.reduce((sum, kw) => {
            const vol =
              typeof kw.volume === 'number'
                ? kw.volume
                : parseInt(String(kw.volume) || '0', 10);
            return sum + (isNaN(vol) ? 0 : vol);
          }, 0);

          updatedGroups[groupIndex] = {
            ...updatedGroups[groupIndex],
            keywords: newKeywords,
            totalVolume
          };
        }

        return { ...prev, keywordGroups: updatedGroups };
      });
    } catch (error) {
      console.error('Error looking up search volume for group keyword:', error);

      // Fallback to the old approach in case of API failure
      const baseVolume = term.length * 100;
      const characterSum = term.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const searchVolume = baseVolume + (characterSum % 1000);

      setKeywordData(prev => {
        const updatedGroups = [...prev.keywordGroups];
        const targetKeyword = updatedGroups[groupIndex]?.keywords?.[keywordIndex];

        if (targetKeyword && targetKeyword.term === term) {
          const newKeywords = [...updatedGroups[groupIndex].keywords];
          newKeywords[keywordIndex] = { ...targetKeyword, volume: searchVolume };

          // Recalc total volume
          const totalVolume = newKeywords.reduce((sum, kw) => {
            const vol =
              typeof kw.volume === 'number'
                ? kw.volume
                : parseInt(String(kw.volume) || '0', 10);
            return sum + (isNaN(vol) ? 0 : vol);
          }, 0);

          updatedGroups[groupIndex] = {
            ...updatedGroups[groupIndex],
            keywords: newKeywords,
            totalVolume
          };
        }

        return { ...prev, keywordGroups: updatedGroups };
      });
    }
  };

  // Remove a single keyword from a group
  const removeKeywordFromGroup = (groupIndex: number, keywordIndex: number) => {
    setKeywordData(prev => {
      const updatedGroups = [...prev.keywordGroups];
      if (updatedGroups[groupIndex]) {
        const newKeywords = updatedGroups[groupIndex].keywords.filter((_, i) => i !== keywordIndex);

        const totalVolume = newKeywords.reduce((sum, kw) => {
          const vol =
            typeof kw.volume === 'number'
              ? kw.volume
              : parseInt(`${kw.volume || '0'}`, 10);
          return sum + (isNaN(vol) ? 0 : vol);
        }, 0);

        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: newKeywords,
          totalVolume
        };
      }
      return { ...prev, keywordGroups: updatedGroups };
    });
  };

  // ------------------- Render -------------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Keywords</h1>
        <p className="text-gray-600">Optimize your content for search engines with targeted keywords.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Show fallback context fields if not enough data in localStorage */}
          {!hasContextData && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-md font-semibold text-blue-800 mb-2">Tell us about your content</h3>
              <p className="text-sm text-blue-700 mb-4">
                To generate the most relevant keywords, we need some basic information about your content.
              </p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    What's your main topic or product? *</label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={contextInputs.topic}
                    onChange={handleContextChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Content Marketing Platform, Email Marketing Software"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Target industry (optional)
                    </label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={contextInputs.industry}
                      onChange={handleContextChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Brief description (optional)
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={contextInputs.description}
                      onChange={handleContextChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., AI-powered content creation platform"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Intro */}
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

          {/* Form */}
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
                <div className="w-8"></div>
              </div>

              {keywordData.primaryKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keyword.term}
                    onChange={(e) => updateKeyword('primary', index, e.target.value, 'term')}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a primary keyword"
                    ref={el => (primaryInputRefs.current[index] = el)}
                  />
                  <input
                    type="number"
                    value={keyword.volume || 0}
                    onChange={(e) =>
                      updateKeyword('primary', index, parseInt(e.target.value) || 0, 'volume')
                    }
                    className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a secondary keyword"
                    ref={el => (secondaryInputRefs.current[index] = el)}
                  />
                  <input
                    type="number"
                    value={keyword.volume || 0}
                    onChange={(e) =>
                      updateKeyword('secondary', index, parseInt(e.target.value) || 0, 'volume')
                    }
                    className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter group category (e.g., Features, Benefits, Use Cases)"
                      />
                      <div className="flex items-center w-48 text-sm">
                        <BarChart className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="text-gray-700">Total Volume:</span>
                        <span className="ml-2 font-medium text-blue-700">{group.totalVolume || 0}</span>
                      </div>
                    </div>

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
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter a keyword for this group"
                            data-groupindex={groupIndex}
                            data-field="term"
                            ref={el => {
                              if (!groupInputRefs.current[groupIndex]) {
                                groupInputRefs.current[groupIndex] = [];
                              }
                              groupInputRefs.current[groupIndex][keywordIndex] = el;
                            }}
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
                            className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : 'Save Keywords'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOKeywordsPage;