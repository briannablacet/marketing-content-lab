// src/components/shared/RelevantTemplates.tsx
import React from 'react';
import { templates } from '../../data/templates';
import Link from 'next/link';
import { FileText } from 'lucide-react';

interface RelevantTemplatesProps {
  contentType: string; // e.g., 'case-study', 'blog-post', etc.
  limit?: number;
}

const RelevantTemplates: React.FC<RelevantTemplatesProps> = ({ 
  contentType, 
  limit = 3 
}) => {
  // Filter templates relevant to this content type
  const relevantTemplates = templates.filter(template => 
    template.id.includes(contentType) || 
    template.title.toLowerCase().includes(contentType)
  ).slice(0, limit);
  
  if (relevantTemplates.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Suggested Templates</h3>
      <div className="space-y-2">
        {relevantTemplates.map(template => (
          <Link 
            key={template.id}
            href={`/templates/${template.id}`}
            className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium">{template.title}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelevantTemplates;