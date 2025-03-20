// src/pages/templates.tsx
import React, { useState } from 'react';
import { templates, Template, getAllCategories } from '../data/templates';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, Star, Clock } from 'lucide-react';
import { NotificationProvider } from '../context/NotificationContext';

const TemplatesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getAllCategories();
  
  // Filter templates based on selected category
  const filteredTemplates = selectedCategory 
    ? templates.filter(template => template.category === selectedCategory)
    : templates;
  
  return (
    <NotificationProvider>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Templates</h1>
          <p className="text-gray-600">Ready-to-use templates to accelerate your content marketing</p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === null 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Templates
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        
        {/* All Templates Section */}
        {categories.map(category => {
          const categoryTemplates = templates.filter(t => t.category === category);
          if (selectedCategory && selectedCategory !== category) return null;
          
          return (
            <div key={category} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{category}</h2>
                <Link href={`/templates/category/${category}`} className="text-blue-600 hover:text-blue-800">
                  Browse all
                </Link>
              </div>
              <p className="text-gray-600 mb-6">
                Explore templates that help you plan and create more engaging content
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </NotificationProvider>
  );
};

// Template Card Component
const TemplateCard: React.FC<{ template: Template }> = ({ template }) => {
  // Function to get appropriate background color based on category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Content Creation': return 'bg-blue-50 text-blue-700';
      case 'Content Strategy': return 'bg-green-50 text-green-700';
      case 'Content Optimization': return 'bg-purple-50 text-purple-700';
      case 'SEO Optimization': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };
  
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <Link href={`/templates/${template.id}`} className="block">
          <div className="p-6">
            {/* Category Label */}
            <div className="mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
            </div>
            
            {/* Template Title & Description */}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {template.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {template.description}
            </p>
            
            {/* Footer with Creator & Difficulty */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                  {template.creator.split(' ').map(word => word[0]).join('')}
                </div>
                <span className="ml-2 text-sm text-gray-700">{template.creator}</span>
              </div>
              
              <div className="flex items-center">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  template.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                  template.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {template.difficulty}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TemplatesPage;