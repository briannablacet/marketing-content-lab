// src/components/shared/SaveToLibraryButton.tsx
// Quick save button for adding content to library from any generation page

import React, { useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import { useContentLibrary } from '../../context/ContentLibraryContext';

interface SaveToLibraryButtonProps {
    content: string;
    title?: string;
    contentType?: 'blog-post' | 'email' | 'social-post' | 'landing-page' | 'case-study' | 'press-release' | 'other';
    metadata?: {
        audience?: string;
        tone?: string;
        platform?: string;
        campaignName?: string;
    };
    className?: string;
    variant?: 'button' | 'icon';
}

const SaveToLibraryButton: React.FC<SaveToLibraryButtonProps> = ({
    content,
    title,
    contentType = 'other',
    metadata = {},
    className = '',
    variant = 'button'
}) => {
    const { saveContent } = useContentLibrary();
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) {
            return;
        }

        try {
            setIsSaving(true);

            await saveContent({
                content: content.trim(),
                title,
                contentType,
                metadata,
                category: contentType, // Use content type as default category
                tags: [] // Can be enhanced later
            });

            // Show success state briefly
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);

        } catch (error) {
            console.error('Error saving to library:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleSave}
                disabled={isSaving || !content.trim() || justSaved}
                className={`p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 ${className}`}
                title="Save to Content Library"
            >
                {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : justSaved ? (
                    <Check className="w-4 h-4 text-green-600" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleSave}
            disabled={isSaving || !content.trim() || justSaved}
            className={`px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all ${className}`}
        >
            {isSaving ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                </>
            ) : justSaved ? (
                <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Saved!
                </>
            ) : (
                <>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Library
                </>
            )}
        </button>
    );
};

export default SaveToLibraryButton;