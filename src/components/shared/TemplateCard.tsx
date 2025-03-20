// src/components/shared/TemplateCard.tsx
import React from 'react';
import { Template } from '../../data/templates';
import Link from 'next/link';

interface TemplateCardProps {
  template: Template;
  compact?: boolean; // For displaying in a more compact form if needed
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, compact = false }) => {
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
  
  if (compact) {
    return (
      <Link 
        href={`/templates/${template.id}`}
        className="block p-4 border rounded-lg hover:shadow-md transition-shadow hover:border-blue-200"
      >
        <div className="flex items-start">
          <div className="flex-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(template.category)}`}>
              {template.category}
            </span>
            <h3 className="font-medium mt-1">{template.title}</h3>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            template.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
            template.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
            'bg-red-50 text-red-700'
          }`}>
            {template.difficulty}
          </span>
        </div>
      </Link>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/templates/${template.id}`} className="block p-6">
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
      </Link>
    </div>
  );
};

export default TemplateCard;