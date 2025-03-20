// src/pages/templates/[id].tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getTemplateById, Template } from '../../data/templates';
import { NotificationProvider } from '../../context/NotificationContext';
import { useNotification } from '../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Download, Copy } from 'lucide-react';
import Link from 'next/link';

const TemplateDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showNotification } = useNotification();
  
  // Get template data
  const template = typeof id === 'string' ? getTemplateById(id) : null;
  
  // State for form values
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  if (!template) {
    return (
      <NotificationProvider>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Template Not Found</h1>
            <p className="text-gray-600 mb-8">The template you're looking for doesn't exist or has been removed.</p>
            <Link href="/templates" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Templates
            </Link>
          </div>
        </div>
      </NotificationProvider>
    );
  }
  
  // Handle input change
  const handleInputChange = (sectionIndex: number, fieldIndex: number, value: any) => {
    const fieldId = `section${sectionIndex}_field${fieldIndex}`;
    setFormValues({
      ...formValues,
      [fieldId]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Here you would save the template with values to the user's account
    // or generate content based on the template
    
    showNotification('success', 'Template saved successfully!');
    
    // Navigate to content creation or wherever appropriate
    setTimeout(() => {
      router.push('/creation-hub');
    }, 1500);
  };
  
  return (
    <NotificationProvider>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/templates" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Link>
        </div>
        
        {/* Template Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              template.category === 'Content Creation' ? 'bg-blue-100 text-blue-800' :
              template.category === 'Content Strategy' ? 'bg-green-100 text-green-800' :
              template.category === 'Content Optimization' ? 'bg-purple-100 text-purple-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {template.category}
            </span>
            <span className="ml-3 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {template.difficulty}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
          <p className="text-gray-600 mb-4">{template.description}</p>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Created by: {template.creator}</span>
          </div>
        </div>
        
        {/* Template Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {template.templateContent.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="mb-8">
              <CardHeader className="pb-2">
                <CardTitle>{section.title}</CardTitle>
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
                        
                        {field.type === 'multiselect' && (
                          <div className="space-y-2">
                            {field.options?.map((option, optionIndex) => (
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
                        
                        {field.type === 'checkbox' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={fieldId}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300"
                              checked={formValues[fieldId] || false}
                              onChange={(e) => handleInputChange(sectionIndex, fieldIndex, e.target.checked)}
                            />
                            <label
                              htmlFor={fieldId}
                              className="ml-2 block text-sm text-gray-900"
                            >
                              {field.label}
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Link href="/templates" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </Link>
            
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center"
                onClick={() => showNotification('info', 'Template saved as draft')}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Create Content
              </button>
            </div>
          </div>
        </form>
      </div>
    </NotificationProvider>
  );
};

export default TemplateDetailPage;