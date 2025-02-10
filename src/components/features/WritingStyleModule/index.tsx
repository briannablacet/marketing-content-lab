//src.components.features.BrandVoiceModule.index.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useStyleGuide } from '../../../context/StyleGuideContext';
import { Upload, FileText, X } from 'lucide-react';

const BrandVoiceModule = () => {
  const { styleGuide, updateStyleGuide, addUploadedGuide, removeUploadedGuide } = useStyleGuide();
  const [fileError, setFileError] = useState('');

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) { // 5MB limit
      setFileError('File size must be less than 5MB');
      return;
    }

    try {
      const content = await file.text();
      addUploadedGuide({
        name: file.name,
        content,
        type: 'messaging-doc'
      });
      setFileError('');
    } catch (error) {
      setFileError('Error reading file. Please try again.');
    }
  };

  // Handle form updates
  const handleBrandVoiceUpdate = (field: string, value: string) => {
    updateStyleGuide({
      brandVoice: {
        ...styleGuide.brandVoice,
        [field]: value
      }
    });
  };

  const handleGuidelineUpdate = (type: 'preferred' | 'avoided', value: string) => {
    const terms = value.split(',').map(term => term.trim()).filter(Boolean);
    updateStyleGuide({
      contentGuidelines: {
        ...styleGuide.contentGuidelines,
        [type]: terms
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Brand Voice Section */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Voice & Tone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand Voice</label>
              <input
                type="text"
                placeholder="e.g., Authoritative but approachable, Technical yet clear"
                value={styleGuide.brandVoice.tone}
                onChange={(e) => handleBrandVoiceUpdate('tone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Communication Style</label>
              <input
                type="text"
                placeholder="e.g., Direct and solution-focused, Educational and consultative"
                value={styleGuide.brandVoice.style}
                onChange={(e) => handleBrandVoiceUpdate('style', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primary Audience</label>
              <input
                type="text"
                placeholder="e.g., Technical Decision Makers, C-Suite Executives"
                value={styleGuide.brandVoice.audience}
                onChange={(e) => handleBrandVoiceUpdate('audience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Terms Section */}
      <Card>
        <CardHeader>
          <CardTitle>Key Terms & Messaging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Key Terms to Emphasize (comma-separated)</label>
              <textarea
                placeholder="e.g., enterprise security, advanced threat protection, zero-trust architecture"
                value={styleGuide.contentGuidelines.preferred.join(', ')}
                onChange={(e) => handleGuidelineUpdate('preferred', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Terms to Avoid (comma-separated)</label>
              <textarea
                placeholder="e.g., basic security, simple solution, entry-level"
                value={styleGuide.contentGuidelines.avoided.join(', ')}
                onChange={(e) => handleGuidelineUpdate('avoided', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messaging Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Messaging Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".doc,.docx,.pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">Upload your company messaging document</span>
                <span className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (max 5MB)</span>
              </label>
            </div>

            {fileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                {fileError}
              </div>
            )}

            {/* Uploaded Files List */}
            <div className="space-y-2">
              {styleGuide.uploadedGuides.map((guide) => (
                <div 
                  key={guide.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{guide.name}</span>
                  </div>
                  <button
                    onClick={() => removeUploadedGuide(guide.name)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandVoiceModule;