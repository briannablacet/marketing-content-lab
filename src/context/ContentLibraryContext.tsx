// src/context/ContentLibraryContext.tsx
// React Context for Content Library - manages state and provides hooks

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import contentLibraryService from '../services/ContentLibraryService';
import { useNotification } from './NotificationContext';

// TypeScript interfaces for our content
export interface ContentItem {
    id: string;
    title: string;
    content: string;
    contentType: 'blog-post' | 'email' | 'social-post' | 'landing-page' | 'case-study' | 'press-release' | 'other';
    createdAt: string;
    updatedAt: string;
    tags: string[];
    category: string;
    isFavorite: boolean;
    wordCount: number;
    metadata: {
        audience?: string;
        tone?: string;
        platform?: string;
        campaignName?: string;
    };
}

export interface ContentLibraryStats {
    total: number;
    favorites: number;
    byType: Record<string, number>;
    totalWords: number;
    recentlyAdded: number;
}

export interface ContentSearchFilters {
    contentType?: string;
    category?: string;
    favoritesOnly?: boolean;
}

// Context interface
interface ContentLibraryContextType {
    // Data
    items: ContentItem[];
    stats: ContentLibraryStats;
    isLoading: boolean;

    // Actions
    saveContent: (contentData: Partial<ContentItem>) => Promise<ContentItem>;
    updateContent: (id: string, updates: Partial<ContentItem>) => Promise<ContentItem>;
    deleteContent: (id: string) => Promise<void>;
    toggleFavorite: (id: string) => Promise<void>;
    searchContent: (query: string, filters?: ContentSearchFilters) => ContentItem[];
    refreshLibrary: () => void;
    exportLibrary: () => void;
    importLibrary: (file: File) => Promise<number>;
}

// Create the context
const ContentLibraryContext = createContext<ContentLibraryContextType | undefined>(undefined);

// Provider component
export const ContentLibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [stats, setStats] = useState<ContentLibraryStats>({
        total: 0,
        favorites: 0,
        byType: {},
        totalWords: 0,
        recentlyAdded: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const { showNotification } = useNotification();

    // Load initial data
    useEffect(() => {
        refreshLibrary();
    }, []);

    // Refresh library data from localStorage
    const refreshLibrary = () => {
        try {
            setIsLoading(true);
            const allContent = contentLibraryService.getAllContent();
            const libraryStats = contentLibraryService.getStats();

            setItems(allContent);
            setStats(libraryStats);

            console.log('📚 Content library loaded:', allContent.length, 'items');
        } catch (error) {
            console.error('Error loading content library:', error);
            showNotification('Failed to load content library', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Save new content
    const saveContent = async (contentData: Partial<ContentItem>): Promise<ContentItem> => {
        try {
            setIsLoading(true);

            const savedItem = contentLibraryService.saveContent(contentData);

            // Update local state
            setItems(prev => [savedItem, ...prev]);
            setStats(contentLibraryService.getStats());

            showNotification(`"${savedItem.title}" saved to library`, 'success');
            console.log('💾 Content saved:', savedItem.title);

            return savedItem;
        } catch (error) {
            console.error('Error saving content:', error);
            showNotification('Failed to save content to library', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Update existing content
    const updateContent = async (id: string, updates: Partial<ContentItem>): Promise<ContentItem> => {
        try {
            const updatedItem = contentLibraryService.updateContent(id, updates);

            // Update local state
            setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
            setStats(contentLibraryService.getStats());

            showNotification('Content updated successfully', 'success');
            return updatedItem;
        } catch (error) {
            console.error('Error updating content:', error);
            showNotification('Failed to update content', 'error');
            throw error;
        }
    };

    // Delete content
    const deleteContent = async (id: string): Promise<void> => {
        try {
            const itemToDelete = items.find(item => item.id === id);

            contentLibraryService.deleteContent(id);

            // Update local state
            setItems(prev => prev.filter(item => item.id !== id));
            setStats(contentLibraryService.getStats());

            showNotification(`"${itemToDelete?.title || 'Content'}" deleted from library`, 'success');
        } catch (error) {
            console.error('Error deleting content:', error);
            showNotification('Failed to delete content', 'error');
            throw error;
        }
    };

    // Toggle favorite status
    const toggleFavorite = async (id: string): Promise<void> => {
        try {
            const updatedItem = contentLibraryService.toggleFavorite(id);

            // Update local state
            setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
            setStats(contentLibraryService.getStats());

            const action = updatedItem.isFavorite ? 'added to' : 'removed from';
            showNotification(`Content ${action} favorites`, 'success');
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showNotification('Failed to update favorite status', 'error');
            throw error;
        }
    };

    // Search content
    const searchContent = (query: string, filters?: ContentSearchFilters): ContentItem[] => {
        return contentLibraryService.searchContent(query, filters);
    };

    // Export library
    const exportLibrary = () => {
        try {
            contentLibraryService.exportLibrary();
            showNotification('Content library exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting library:', error);
            showNotification('Failed to export content library', 'error');
        }
    };

    // Import library
    const importLibrary = async (file: File): Promise<number> => {
        try {
            const importedCount = await contentLibraryService.importLibrary(file);

            // Refresh data after import
            refreshLibrary();

            showNotification(`Successfully imported ${importedCount} content items`, 'success');
            return importedCount;
        } catch (error) {
            console.error('Error importing library:', error);
            showNotification('Failed to import content library', 'error');
            throw error;
        }
    };

    const value: ContentLibraryContextType = {
        items,
        stats,
        isLoading,
        saveContent,
        updateContent,
        deleteContent,
        toggleFavorite,
        searchContent,
        refreshLibrary,
        exportLibrary,
        importLibrary
    };

    return (
        <ContentLibraryContext.Provider value={value}>
            {children}
        </ContentLibraryContext.Provider>
    );
};

// Custom hook to use the content library
export const useContentLibrary = (): ContentLibraryContextType => {
    const context = useContext(ContentLibraryContext);
    if (!context) {
        throw new Error('useContentLibrary must be used within a ContentLibraryProvider');
    }
    return context;
};

export default ContentLibraryContext;