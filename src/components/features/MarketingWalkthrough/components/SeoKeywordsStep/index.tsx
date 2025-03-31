// src/components/features/MarketingWalkthrough/components/SeoKeywordsStep/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Plus, X, Sparkles, BarChart } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

// Define our interfaces for proper TypeScript typing
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

// Component props interface
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

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywordMetrics, setKeywordMetrics] = useState<{
    estimatedSearchVolume: string;
    competitionLevel: string;
    recommendedContent: string[];
  } | null>(null);

  // References for auto-focusing
  const primaryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const secondaryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const groupInputRefs = useRef<{ [groupIndex: number]: (HTMLInputElement | null)[] }>({});
  const [focusCounter, setFocusCounter] = useState(0);

  // State to track what to focus and where
  const [lastAddedPrimary, setLastAddedPrimary] = useState<number | null>(null);
  const [lastAddedSecondary, setLastAddedSecondary] = useState<number | null>(null);
  const [lastAddedGroup, setLastAddedGroup] = useState<{ groupIndex: number, keywordIndex: number } | null>(null);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setKeywordData(initialData);
    } else {
      // Try to load data from localStorage
      try {
        const savedData = localStorage.getItem('marketingSeoKeywords');
        if (savedData) {
          const parsedData = JSON.parse(savedData);

          // Convert old format to new format if needed
          if (parsedData.primaryKeywords && Array.isArray(parsedData.primaryKeywords)) {
            if (typeof parsedData.primaryKeywords[0] === 'string') {
              // Old format, convert to new format
              const updatedData = {
                primaryKeywords: parsedData.primaryKeywords.map((kw: string) => ({
                  term: kw,
                  volume: Math.floor(Math.random() * 5000) + 500 // Random volume for demo
                })),
                secondaryKeywords: parsedData.secondaryKeywords.map((kw: string) => ({
                  term: kw,
                  volume: Math.floor(Math.random() * 1000) + 100 // Random volume for demo
                })),
                keywordGroups: parsedData.keywordGroups.map((group: any) => ({
                  category: group.category,
                  keywords: group.keywords.map((kw: string) => ({
                    term: kw,
                    volume: Math.floor(Math.random() * 2000) + 200 // Random volume for demo
                  })),
                  totalVolume: Math.floor(Math.random() * 10000) + 1000 // Random total for demo
                }))
              };
              setKeywordData(updatedData);
            } else {
              // Already in new format
              setKeywordData(parsedData);
            }
          }
        }
      } catch (err) {
        console.error('Error loading saved keyword data:', err);
      }
    }
  }, [initialData]);

  // Effect for handling focus
  // Add these useEffect hooks after your existing effects
  useEffect(() => {
    // Focus the last added primary keyword input
    if (lastAddedPrimary !== null && primaryInputRefs.current[lastAddedPrimary]) {
      primaryInputRefs.current[lastAddedPrimary]?.focus();
      setLastAddedPrimary(null);
    }
  }, [lastAddedPrimary]);
  // Add this with your other useEffect hooks
  useEffect(() => {
    if (focusCounter > 0) {
      console.log("Focus counter changed:", focusCounter);
      setTimeout(() => {
        // For primary keywords
        const primaryInputs = document.querySelectorAll('input[placeholder="Enter a primary keyword"]');
        if (primaryInputs.length > 0) {
          const lastPrimary = primaryInputs[primaryInputs.length - 1] as HTMLInputElement;
          lastPrimary.focus();
          console.log("Focused on last primary input");
          return;
        }

        // For secondary keywords
        const secondaryInputs = document.querySelectorAll('input[placeholder="Enter a secondary keyword"]');
        if (secondaryInputs.length > 0) {
          const lastSecondary = secondaryInputs[secondaryInputs.length - 1] as HTMLInputElement;
          lastSecondary.focus();
          console.log("Focused on last secondary input");
          return;
        }

        // For group keywords
        const groupInputs = document.querySelectorAll('input[placeholder="Enter a keyword for this group"]');
        if (groupInputs.length > 0) {
          const lastGroup = groupInputs[groupInputs.length - 1] as HTMLInputElement;
          lastGroup.focus();
          console.log("Focused on last group input");
          return;
        }
      }, 100);
    }
  }, [focusCounter]);

  useEffect(() => {
    // Focus the last added secondary keyword input
    if (lastAddedSecondary !== null && secondaryInputRefs.current[lastAddedSecondary]) {
      secondaryInputRefs.current[lastAddedSecondary]?.focus();
      setLastAddedSecondary(null);
    }
  }, [lastAddedSecondary]);

  useEffect(() => {
    // Focus the last added group keyword input
    if (lastAddedGroup !== null &&
      groupInputRefs.current[lastAddedGroup.groupIndex] &&
      groupInputRefs.current[lastAddedGroup.groupIndex][lastAddedGroup.keywordIndex]) {
      groupInputRefs.current[lastAddedGroup.groupIndex][lastAddedGroup.keywordIndex]?.focus();
      setLastAddedGroup(null);
    }
  }, [lastAddedGroup]);

  // Convert any type to KeywordWithVolume format
  const ensureKeywordWithVolume = (value: any): KeywordWithVolume => {
    if (typeof value === 'string') {
      return {
        term: value,
        volume: Math.floor(Math.random() * 3000) + 100 // Random volume for demo
      };
    }
    if (typeof value === 'object' && value !== null) {
      // If it's already in the right format
      if (value.term) return value;

      // If it's using the keyword property
      if (value.keyword) {
        return {
          term: String(value.keyword),
          volume: value.volume || Math.floor(Math.random() * 3000) + 100
        };
      }

      // Handle other potential formats
      if (value.name) {
        return {
          term: String(value.name),
          volume: value.volume || Math.floor(Math.random() * 3000) + 100
        };
      }

      // Last resort
      return {
        term: JSON.stringify(value),
        volume: Math.floor(Math.random() * 3000) + 100
      };
    }

    // Default for anything else
    return {
      term: String(value || ''),
      volume: Math.floor(Math.random() * 3000) + 100
    };
  };

  // Function to generate keywords with AI
  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Get data from local storage to provide context for keyword generation
      let messages = [''];
      let personas = [''];
      let competitors = [''];
      let productInfo = {};

      // Log localStorage state for debugging
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
          ].filter(m => m.trim());
        }
      } catch (err) {
        console.error('Error loading messaging data:', err);
      }

      // Try to load persona data
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

      // Try to load competitor data
      try {
        const competitorData = localStorage.getItem('marketingCompetitors');
        if (competitorData) {
          const parsed = JSON.parse(competitorData);
          competitors = parsed.map((comp: any) => comp.name).filter((name: string) => name.trim());
        }
      } catch (err) {
        console.error('Error loading competitor data:', err);
      }

      // Try to load product info
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

      // Call the API with the collected context
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      // Process keywords to new format with search volume
      let processedData: SeoKeywordsData = {
        primaryKeywords: [],
        secondaryKeywords: [],
        keywordGroups: []
      };

      // Process primary keywords
      if (data.primaryKeywords && Array.isArray(data.primaryKeywords)) {
        processedData.primaryKeywords = data.primaryKeywords.map((keyword: any) =>
          ensureKeywordWithVolume(keyword)
        );
      }

      // Process secondary keywords
      if (data.secondaryKeywords && Array.isArray(data.secondaryKeywords)) {
        processedData.secondaryKeywords = data.secondaryKeywords.map((keyword: any) =>
          ensureKeywordWithVolume(keyword)
        );
      }

      // Process keyword groups
      if (data.keywordGroups && Array.isArray(data.keywordGroups)) {
        processedData.keywordGroups = data.keywordGroups.map((group: any) => {
          // Ensure group category is a string
          const category = typeof group.category === 'string' ? group.category : String(group.category || 'Group');

          // Process keywords in the group
          let groupKeywords: KeywordWithVolume[] = [];
          if (group.keywords && Array.isArray(group.keywords)) {
            groupKeywords = group.keywords.map((keyword: any) =>
              ensureKeywordWithVolume(keyword)
            );
          }

          // Calculate total volume for the group
          const totalVolume = groupKeywords.reduce((sum, kw) => {
            const vol = typeof kw.volume === 'number' ? kw.volume : parseInt(String(kw.volume) || '0', 10);
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

      // Save the metrics if provided
      if (data.metrics) {
        setKeywordMetrics({
          estimatedSearchVolume: data.metrics.estimatedSearchVolume || 'Unknown',
          competitionLevel: data.metrics.competitionLevel || 'Medium',
          recommendedContent: Array.isArray(data.metrics.recommendedContent) ?
            data.metrics.recommendedContent : []
        });
      }

      // Prepare fallback data if needed
      if (!processedData.primaryKeywords.length) {
        processedData.primaryKeywords = [{ term: '' }];
      }

      if (!processedData.secondaryKeywords.length) {
        processedData.secondaryKeywords = [{ term: '' }];
      }

      if (!processedData.keywordGroups.length) {
        processedData.keywordGroups = [{ category: '', keywords: [{ term: '' }] }];
      }

      // Update the state with the new keywords
      setKeywordData(processedData);

      // Also save to localStorage for persistence
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean up empty values
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

      // Save to localStorage
      try {
        localStorage.setItem('marketingSeoKeywords', JSON.stringify(cleanedData));
      } catch (storageErr) {
        console.error('Error saving to localStorage:', storageErr);
      }

      // If onSave prop is provided, call it
      if (onSave) {
        await onSave(cleanedData);
      }

      // If in walkthrough mode, continue to next step
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

  // Add a new keyword - with aggressive focus handling
  const addKeyword = (type: 'primary' | 'secondary') => {
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: [
        ...prev[type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'],
        { term: '', volume: 0 }
      ]
    }));

    // Trigger focus
    setFocusCounter(prev => prev + 1);
  };
  // Then force focus on a timer
  const timerCount = 5; // Try multiple times to catch the focus
  let attempts = 0;

  const focusTimer = setInterval(() => {
    // Try to find the input - the one that was just added will be the last one
    const selector = type === 'primary' ?
      'input[placeholder="Enter a primary keyword"]' :
      'input[placeholder="Enter a secondary keyword"]';

    const inputs = document.querySelectorAll(selector);
    if (inputs.length > 0) {
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
      lastInput.focus();
      console.log(`Focus set on ${type} keyword, attempt ${attempts + 1}`);
      clearInterval(focusTimer);
    }

    attempts++;
    if (attempts >= timerCount) {
      console.log(`Failed to focus ${type} keyword after ${timerCount} attempts`);
      clearInterval(focusTimer);
    }
  }, 50); // Try every 50ms
};

// Add a keyword to a group - with aggressive focus handling
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

  // Trigger focus
  setFocusCounter(prev => prev + 1);
};
// Then force focus on a timer
const timerCount = 5; // Try multiple times to catch the focus
let attempts = 0;

const focusTimer = setInterval(() => {
  // Try to find the input - look for inputs in the specific group
  const inputs = document.querySelectorAll('input[placeholder="Enter a keyword for this group"]');
  if (inputs.length > 0) {
    // Get the last input in the sequence
    const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
    lastInput.focus();
    console.log(`Focus set on group keyword, attempt ${attempts + 1}`);
    clearInterval(focusTimer);
  }

  attempts++;
  if (attempts >= timerCount) {
    console.log(`Failed to focus group keyword after ${timerCount} attempts`);
    clearInterval(focusTimer);
  }
}, 50); // Try every 50ms
  };

// Then use setTimeout to focus after the DOM has updated
setTimeout(() => {
  // Get the last input of the specified type
  const inputs = document.querySelectorAll(
    type === 'primary'
      ? '[data-primary-keyword]'
      : '[data-secondary-keyword]'
  );
  if (inputs.length > 0) {
    (inputs[inputs.length - 1] as HTMLInputElement).focus();
  }
}, 0);

// Set focus target to the newly added keyword field
setFocusTarget({
  type: type,
  index: keywordData[type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'].length
});

// Update a keyword
const updateKeyword = (type: 'primary' | 'secondary', index: number, value: string | number | KeywordWithVolume, field: 'term' | 'volume' = 'term') => {
  setKeywordData(prev => ({
    ...prev,
    [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
      type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
    ].map((k, i) => {
      if (i === index) {
        if (typeof value === 'object') {
          return value; // Replace entire object
        } else {
          const updatedKeyword = { ...k, [field]: value }; // Update specific field

          // If we're updating the term and it's a non-empty string, look up search volume
          if (field === 'term' && typeof value === 'string' && value.trim() !== '' && value !== k.term) {
            // Delay the volume lookup to avoid too many API calls while typing
            setTimeout(() => lookupSearchVolume(type, index, value), 1500);
          }

          return updatedKeyword;
        }
      }
      return k;
    })
  }));
};

// Function to lookup search volume for a keyword
const lookupSearchVolume = async (type: 'primary' | 'secondary', index: number, term: string) => {
  try {
    // Don't look up very short terms
    if (term.length < 3) return;

    // Check if we have an API key first (mock for now)
    const hasSearchVolumeAPI = true; // This would check if API access is configured

    if (!hasSearchVolumeAPI) return;

    console.log(`Looking up search volume for: ${term}`);

    // In a real implementation, we would call an API like Google Keywords API, SEMrush, Ahrefs, etc.
    // For now, we'll simulate a lookup with a random value based on the term length and characters
    // which creates the appearance of an API lookup

    // Create a deterministic but seemingly random volume based on the term length and characters
    const baseVolume = term.length * 100;
    const characterSum = term.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const searchVolume = baseVolume + (characterSum % 1000); // A pseudo-random volume between term.length*100 and term.length*100+999

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Update the keyword with the new search volume
    setKeywordData(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
        type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
      ].map((k, i) => {
        if (i === index && k.term === term) { // Only update if the term hasn't changed during the API call
          return { ...k, volume: searchVolume };
        }
        return k;
      })
    }));

  } catch (error) {
    console.error('Error looking up search volume:', error);
  }
};

// Remove a keyword
const removeKeyword = (type: 'primary' | 'secondary', index: number) => {
  setKeywordData(prev => ({
    ...prev,
    [type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords']: prev[
      type === 'primary' ? 'primaryKeywords' : 'secondaryKeywords'
    ].filter((_, i) => i !== index)
  }));
};

// Add a new keyword group
const addKeywordGroup = () => {
  setKeywordData(prev => ({
    ...prev,
    keywordGroups: [...prev.keywordGroups, { category: '', keywords: [{ term: '' }] }]
  }));
};

// Update a keyword group
const updateKeywordGroup = (groupIndex: number, field: 'category' | 'keywords' | 'totalVolume', value: any) => {
  setKeywordData(prev => ({
    ...prev,
    keywordGroups: prev.keywordGroups.map((group, i) =>
      i === groupIndex ? { ...group, [field]: value } : group
    )
  }));
};

// Remove a keyword group
const removeKeywordGroup = (index: number) => {
  setKeywordData(prev => ({
    ...prev,
    keywordGroups: prev.keywordGroups.filter((_, i) => i !== index)
  }));
};

// Update a keyword in a group
const updateKeywordInGroup = (groupIndex: number, keywordIndex: number, value: string | number, field: 'term' | 'volume' = 'term') => {
  setKeywordData(prev => {
    const updatedGroups = [...prev.keywordGroups];
    if (updatedGroups[groupIndex]?.keywords[keywordIndex]) {
      // Create a new keyword object with the updated field
      const updatedKeyword = {
        ...updatedGroups[groupIndex].keywords[keywordIndex],
        [field]: value
      };

      // If we're updating the term and it's a non-empty string, look up search volume
      if (field === 'term' && typeof value === 'string' && value.trim() !== '' &&
        value !== updatedGroups[groupIndex].keywords[keywordIndex].term) {
        // Delay the volume lookup to avoid too many API calls while typing
        setTimeout(() => lookupSearchVolumeForGroup(groupIndex, keywordIndex, value), 1500);
      }

      // Update the keywords array
      const updatedKeywords = [...updatedGroups[groupIndex].keywords];
      updatedKeywords[keywordIndex] = updatedKeyword;

      // Update the group with new keywords
      updatedGroups[groupIndex] = {
        ...updatedGroups[groupIndex],
        keywords: updatedKeywords
      };

      // Calculate new total volume
      const totalVolume = updatedKeywords.reduce((sum, kw) => {
        const vol = typeof kw.volume === 'number' ? kw.volume : parseInt(String(kw.volume) || '0', 10);
        return sum + (isNaN(vol) ? 0 : vol);
      }, 0);

      updatedGroups[groupIndex].totalVolume = totalVolume;
    }
    return { ...prev, keywordGroups: updatedGroups };
  });
};

// Function to lookup search volume for a keyword in a group
const lookupSearchVolumeForGroup = async (groupIndex: number, keywordIndex: number, term: string) => {
  try {
    // Don't look up very short terms
    if (term.length < 3) return;

    // Check if we have an API key first (mock for now)
    const hasSearchVolumeAPI = true; // This would check if API access is configured

    if (!hasSearchVolumeAPI) return;

    console.log(`Looking up search volume for group keyword: ${term}`);

    // In a real implementation, we would call an API like Google Keywords API, SEMrush, Ahrefs, etc.
    // For now, we'll simulate a lookup with a random value based on the term

    // Create a deterministic but seemingly random volume based on the term length and characters
    const baseVolume = term.length * 100;
    const characterSum = term.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const searchVolume = baseVolume + (characterSum % 1000);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Update the keyword with the new search volume
    setKeywordData(prev => {
      const updatedGroups = [...prev.keywordGroups];
      if (updatedGroups[groupIndex]?.keywords[keywordIndex] &&
        updatedGroups[groupIndex].keywords[keywordIndex].term === term) {
        // Only update if the term hasn't changed during the API call
        const updatedKeywords = [...updatedGroups[groupIndex].keywords];
        updatedKeywords[keywordIndex] = {
          ...updatedKeywords[keywordIndex],
          volume: searchVolume
        };

        // Update the group
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          keywords: updatedKeywords
        };

        // Recalculate total volume
        const totalVolume = updatedKeywords.reduce((sum, kw) => {
          const vol = typeof kw.volume === 'number' ? kw.volume : parseInt(String(kw.volume) || '0', 10);
          return sum + (isNaN(vol) ? 0 : vol);
        }, 0);

        updatedGroups[groupIndex].totalVolume = totalVolume;
      }
      return { ...prev, keywordGroups: updatedGroups };
    });

  } catch (error) {
    console.error('Error looking up search volume for group keyword:', error);
  }
};

// Remove a keyword from a group
const removeKeywordFromGroup = (groupIndex: number, keywordIndex: number) => {
  setKeywordData(prev => {
    const updatedGroups = [...prev.keywordGroups];
    if (updatedGroups[groupIndex]) {
      // Create a new keywords array without the removed keyword
      const updatedKeywords = updatedGroups[groupIndex].keywords.filter((_, i) => i !== keywordIndex);

      // Calculate new total volume
      const totalVolume = updatedKeywords.reduce((sum, kw) => {
        const vol = typeof kw.volume === 'number' ? kw.volume : parseInt(String(kw.volume) || '0', 10);
        return sum + (isNaN(vol) ? 0 : vol);
      }, 0);

      // Update the group
      updatedGroups[groupIndex] = {
        ...updatedGroups[groupIndex],
        keywords: updatedKeywords,
        totalVolume
      };
    }
    return { ...prev, keywordGroups: updatedGroups };
  });
};

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
                  data-primary-keyword={index} // Add this attribute
                />
                <input
                  type="number"
                  value={keyword.volume || 0}
                  onChange={(e) => updateKeyword('primary', index, parseInt(e.target.value) || 0, 'volume')}
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

            {/* Column Headers */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 text-sm font-medium text-gray-700">Keyword</div>
              <div className="w-24 text-sm font-medium text-gray-700 flex items-center">
                <BarChart className="w-4 h-4 mr-1" />
                <span>Volume</span>
              </div>
              <div className="w-8"></div> {/* Spacer for delete button */}
            </div>

            {keywordData.secondaryKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={keyword.term}
                  onChange={(e) => updateKeyword('secondary', index, e.target.value, 'term')}
                  className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a secondary keyword"
                  data-secondary-keyword={index} // Add this attribute
                />
                <input
                  type="number"
                  value={keyword.volume || 0}
                  onChange={(e) => updateKeyword('secondary', index, parseInt(e.target.value) || 0, 'volume')}
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
                      <span className="ml-2 font-medium text-blue-700">{group.totalVolume || 0}</span>
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
                          onChange={(e) => updateKeywordInGroup(groupIndex, keywordIndex, e.target.value, 'term')}
                          className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter a keyword for this group"
                          data-group-keyword={groupIndex} // Add this attribute
                        />
                        <input
                          type="text"
                          value={keyword.term}
                          onChange={(e) => updateKeywordInGroup(groupIndex, keywordIndex, e.target.value, 'term')}
                          className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter a keyword for this group"
                          ref={el => {
                            if (!groupInputRefs.current[groupIndex]) {
                              groupInputRefs.current[groupIndex] = [];
                            }
                            groupInputRefs.current[groupIndex][keywordIndex] = el;
                          }}
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

export default SeoKeywordsStep;