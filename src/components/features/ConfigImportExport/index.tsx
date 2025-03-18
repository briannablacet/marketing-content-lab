// src/components/features/ConfigImportExport/index.tsx
import React, { useState, useRef } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { useMessaging } from '../../../context/MessagingContext';
import { useContent } from '../../../context/ContentContext';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';

interface ConfigImportExportProps {
  title?: string;
  configType: 'writing-style' | 'brand-voice' | 'messaging' | 'content';
}

const ConfigImportExport: React.FC<ConfigImportExportProps> = ({ 
  title = 'Configuration',
  configType = 'writing-style'
}) => {
  const writingStyle = useWritingStyle();
  const brandVoice = useBrandVoice();
  const messaging = useMessaging();
  const content = useContent();
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Choose the appropriate context based on the configType
  const getExportData = (): string => {
    switch (configType) {
      case 'writing-style':
        return writingStyle.exportStyleSettings();
      case 'brand-voice':
        return brandVoice.exportBrandVoice();
      case 'messaging':
        return messaging.exportMessaging();
      case 'content':
        return content.exportContentSettings();
      default:
        return '{}';
    }
  };

  // Choose the appropriate import function based on the configType
  const importData = (jsonData: string): boolean => {
    switch (configType) {
      case 'writing-style':
        return writingStyle.importStyleSettings(jsonData);
      case 'brand-voice':
        return brandVoice.importBrandVoice(jsonData);
      case 'messaging':
        return messaging.importMessaging(jsonData);
      case 'content':
        return content.importContentSettings(jsonData);
      default:
        return false;
    }
  };

  // Generate a filename based on the configuration type
  const getFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    return `marketing-content-lab-${configType}-${date}.json`;
  };

  // Handle export button click
  const handleExport = () => {
    try {
      // Get the configuration data as a JSON string
      const jsonData = getExportData();
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = getFilename();
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ text: 'Configuration exported successfully', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to export configuration', type: 'error' });
    }
  };

  // Handle file selection for import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = importData(text);
      
      if (success) {
        setMessage({ text: 'Configuration imported successfully', type: 'success' });
      } else {
        setMessage({ text: 'Failed to import configuration: Invalid format', type: 'error' });
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ text: 'Error reading file', type: 'error' });
    }
  };

  // Trigger file input click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-3">{title} Import/Export</h3>
      
      {message && (
        <div className={`mb-3 p-2 rounded flex items-center ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          {message.text}
        </div>
      )}
      
      <div className="flex space-x-3">
        <button
          onClick={handleExport}
          className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
        
        <button
          onClick={handleImportClick}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Export your settings to back them up or share them. Import to restore from a backup.
      </p>
    </div>
  );
};

export default ConfigImportExport;