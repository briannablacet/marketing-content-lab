// src/components/features/ContentEngine/screens/UploadScreen.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UploadScreenProps {
  onFilesSelected: (files: { messaging: File | null; styleGuide: File | null }) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState({ messaging: null, styleGuide: null });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <h3 className="font-semibold mb-2">Messaging Document</h3>
              <p className="text-sm text-slate-600 mb-4">Upload your messaging document to inform our AI</p>
              <input type="file" className="hidden" id="messagingDoc" />
              <label htmlFor="messagingDoc" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
                Select File
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <h3 className="font-semibold mb-2">Style Guide</h3>
              <p className="text-sm text-slate-600 mb-4">Upload your style guide for brand consistency</p>
              <input type="file" className="hidden" id="styleGuide" />
              <label htmlFor="styleGuide" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
                Select File
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">CEO Preferences</h4>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Add any specific preferences or guidelines from leadership..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadScreen;