// src/pages/content-creator/case-study.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileText, LayoutTemplate } from 'lucide-react';
import { getTemplateById } from '../../data/templates';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NotificationProvider } from '../../context/NotificationContext';
import { useNotification } from '../../context/NotificationContext';

const CaseStudyCreator = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Get the case study template
  const caseStudyTemplate = getTemplateById('case-study');
  
  // Pre-fill some form fields for demonstration (you can remove this in production)
  useEffect(() => {
    // Optional: pre-fill some fields for demonstration
    setFormValues({
      'section0_field0': 'Acme Inc.',
      'section0_field1': 'Technology'
    });
  }, []);
  
  // Handle input change for any field
  const handleInputChange = (sectionIndex: number, fieldIndex: number, value: any) => {
    const fieldId = `section${sectionIndex}_field${fieldIndex}`;
    setFormValues({
      ...formValues,
      [fieldId]: value
    });
  };
  
  // Function to check if required fields in a section are filled
  const isSectionComplete = (sectionIndex: number) => {
    if (!caseStudyTemplate) return false;
    
    const section = caseStudyTemplate.templateContent.sections[sectionIndex];
    if (!section) return false;
    
    return section.fields.every((field, fieldIndex) => {
      if (!field.required) return true;
      const fieldId = `section${sectionIndex}_field${fieldIndex}`;
      return formValues[fieldId] && formValues[fieldId].trim() !== '';
    });
  };
  
  // Handle generation of content with AI assistance
  const handleGenerateContent = async (sectionIndex: number) => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, you would call your API endpoint
      // to generate content based on the formValues
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay
      
      // Example: If this is the "Results & Outcomes" section, generate a sample result
      if (sectionIndex === 3) { // Assuming index 3 is Results section
        const clientName = formValues['section0_field0'] || 'the client';
        const industry = formValues['section0_field1'] || 'their industry';
        const challenge = formValues['section1_field1'] || 'their challenge';
        
        // Sample generated text
        const generatedResult = `After implementing our solution, ${clientName} saw remarkable results in ${industry}. The company achieved:\n\n- 35% increase in overall conversion rate\n- 45% reduction in customer acquisition costs\n- 67% improvement in ${challenge.toLowerCase()} metrics\n- 3x faster time-to-market for new initiatives`;
        
        // Set this generated content in the appropriate field
        handleInputChange(3, 0, generatedResult);
        
        showNotification('success', 'AI-generated results created successfully!');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      showNotification('error', 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle saving the case study
  const handleSave = () => {
    // Here you would save the case study to your system
    showNotification('success', 'Case study saved successfully!');
    
    // Redirect back to content hub or another appropriate page
    setTimeout(() => {
      router.push('/creation-hub');
    }, 1000);
  };
  
  // If template isn't found, show error
  if (!caseStudyTemplate) {
    return (
      <NotificationProvider>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Template Not Found</h1>
            <p className="text-gray-600 mb-8">The case study template could not be loaded.</p>
            <Link href="/creation-hub" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Return to Creation Hub
            </Link>
          </div>
        </div>
      </NotificationProvider>
    );
  }
  
  return (
    <NotificationProvider>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Case Study</h1>
            <p className="text-gray-600 mt-2">
              Document your success stories with compelling case studies
            </p>
          </div>
          <Link href="/creation-hub">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Hub</span>
            </button>
          </Link>
        </div>
        
        {/* Template info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start">
          <LayoutTemplate className="text-blue-600 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h2 className="font-medium text-blue-800">Using Case Study Template</h2>
            <p className="text-blue-700 text-sm">
              This form is based on our proven case study template to help you create compelling success stories.
              <Link 
                href={`/templates/${caseStudyTemplate.id}`} 
                className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                View original template
                <FileText className="w-3 h-3 ml-1" />
              </Link>
            </p>
          </div>
        </div>
        
        {/* Case Study Form based on template */}
        {caseStudyTemplate.templateContent.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{section.title}</span>
                {isSectionComplete(sectionIndex) && (
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Complete
                  </span>
                )}
              </CardTitle>
              {section.description && (
                <p className="text-sm text-gray-600">{section.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => {
                  const fieldId = `section${sectionIndex}_field${fieldIndex}`;
                  
                  return (
                    <div key={fieldIndex} className="space-y-2">
                      <label htmlFor={fieldId} className="block text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          id={fieldId}
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border rounded-md"
                          required={field.required}
                          value={formValues[fieldId] || ''}
                          onChange={(e) => handleInputChange(sectionIndex, fieldIndex, e.target.value)}
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          id={fieldId}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                          required={field.required}
                          value={formValues[fieldId] || ''}
                          onChange={(e) => handleInputChange(sectionIndex, fieldIndex, e.target.value)}
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <select
                          id={fieldId}
                          className="w-full px-3 py-2 border rounded-md"
                          required={field.required}
                          value={formValues[fieldId] || ''}
                          onChange={(e) => handleInputChange(sectionIndex, fieldIndex, e.target.value)}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {field.type === 'multiselect' && field.options && (
                        <div className="space-y-2">
                          {field.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`${fieldId}_${optionIndex}`}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                checked={
                                  formValues[fieldId]
                                    ? (formValues[fieldId] as string[]).includes(option)
                                    : false
                                }
                                onChange={(e) => {
                                  const currentValues = formValues[fieldId] || [];
                                  const newValues = e.target.checked
                                    ? [...currentValues, option]
                                    : currentValues.filter(v => v !== option);
                                  
                                  handleInputChange(sectionIndex, fieldIndex, newValues);
                                }}
                              />
                              <label
                                htmlFor={`${fieldId}_${optionIndex}`}
                                className="ml-2 block text-sm text-gray-900"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* AI-assisted content generation button */}
                {(sectionIndex === 2 || sectionIndex === 3) && ( // Add AI button for certain sections like solution details and results
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleGenerateContent(sectionIndex)}
                      disabled={isGenerating || !isSectionComplete(sectionIndex - 1)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isGenerating ? 'Generating...' : `AI-assist with ${section.title}`}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      {!isSectionComplete(sectionIndex - 1) 
                        ? 'Complete the previous section first to enable AI assistance' 
                        : 'Let AI help generate content based on your inputs'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <Link href="/creation-hub">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                showNotification('info', 'Case study saved as draft');
              }}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Save Draft
            </button>
            
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default function CaseStudyCreatorPage() {
  return (
    <NotificationProvider>
      <CaseStudyCreator />
    </NotificationProvider>
  );
}