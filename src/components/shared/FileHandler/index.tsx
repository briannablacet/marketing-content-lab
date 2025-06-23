// src/components/shared/FileHandler/index.tsx

import React, { useState } from 'react';
import { parseFile } from '../../../utils/fileUtils';
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF } from '../../../utils/exportUtils';
import { Upload, Download, FileText, X } from 'lucide-react';

interface FileHandlerProps {
  onContentLoaded: (content: string | object) => void;
  content?: string;
  maxSizeMB?: number;
  acceptedFormats?: string;
  showExport?: boolean;
}

const FileHandler: React.FC<FileHandlerProps> = ({
  onContentLoaded,
  content,
  maxSizeMB = 5,
  acceptedFormats = ".txt,.doc,.docx,.md,.rtf,.html,.csv,.xlsx",
  showExport = true
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
      
      setUploadedFile(file);
      setIsLoading(true);
      setError('');
      
      try {
        const parsedContent = await parseFile(file);
        onContentLoaded(parsedContent);
      } catch (err) {
        console.error('Error reading file:', err);
        setError('Error reading file. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = (format: string) => {
    if (!content) {
      setError('No content to export');
      return;
    }
    
    const filename = uploadedFile 
      ? uploadedFile.name.split('.')[0] + '-processed' 
      : 'processed-content';
    
    switch (format) {
      case 'txt':
        exportToText(content, `${filename}.txt`);
        break;
      case 'md':
        exportToMarkdown(content, `${filename}.md`);
        break;
      case 'html':
        exportToHTML(content, `${filename}.html`);
        break;
      case 'pdf':
        exportToPDF(content, `${filename}.pdf`);
        break;
      default:
        setError('Unsupported export format');
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Upload a document:</p>
        <div className="flex items-center gap-2">
          <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept={acceptedFormats}
            />
          </label>
          {uploadedFile && (
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <FileText className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">{uploadedFile.name}</span>
              <button 
                onClick={handleRemoveFile}
                className="ml-2 text-gray-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {isLoading && (
            <div className="text-sm text-blue-600">Loading...</div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supports various formats including text, markdown, Word, CSV, and Excel (max {maxSizeMB}MB)
        </p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* Export Buttons */}
      {showExport && content && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Export options:</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleExport('txt')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Text
            </button>
            <button 
              onClick={() => handleExport('md')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Markdown
            </button>
            <button 
              onClick={() => handleExport('html')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              HTML
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileHandler;