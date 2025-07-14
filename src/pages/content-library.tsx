// src/pages/content-library.tsx
// Main content library page - where users browse and manage their saved content

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Search,
    Filter,
    Star,
    Trash2,
    Copy,
    Eye,
    Download,
    Upload,
    Grid,
    List,
    Calendar,
    FileText,
    Heart,
    Sparkles,
    MoreVertical,
    Edit,
    Tag
} from 'lucide-react';
import { useContentLibrary, ContentItem, ContentSearchFilters } from '../context/ContentLibraryContext';
import { NotificationProvider } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { exportToPDF, exportToDocx } from '../utils/exportUtils';

// Content type display configurations
const CONTENT_TYPE_CONFIG = {
    'blog-post': { label: 'Blog Post', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    'Blog Post': { label: 'Blog Post', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    'Blog Posts': { label: 'Blog Post', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    'email': { label: 'Email', icon: FileText, color: 'text-green-600 bg-green-50' },
    'Email': { label: 'Email', icon: FileText, color: 'text-green-600 bg-green-50' },
    'social-post': { label: 'Social Post', icon: Heart, color: 'text-pink-600 bg-pink-50' },
    'Social Posts': { label: 'Social Post', icon: Heart, color: 'text-pink-600 bg-pink-50' },
    'landing-page': { label: 'Landing Page', icon: FileText, color: 'text-purple-600 bg-purple-50' },
    'Landing Page': { label: 'Landing Page', icon: FileText, color: 'text-purple-600 bg-purple-50' },
    'case-study': { label: 'Case Study', icon: FileText, color: 'text-orange-600 bg-orange-50' },
    'Case Study': { label: 'Case Study', icon: FileText, color: 'text-orange-600 bg-orange-50' },
    'press-release': { label: 'Press Release', icon: FileText, color: 'text-red-600 bg-red-50' },
    'Press Release': { label: 'Press Release', icon: FileText, color: 'text-red-600 bg-red-50' },
    'other': { label: 'Other', icon: FileText, color: 'text-gray-600 bg-gray-50' }
};

// Function to render content beautifully (no markdown symbols)
const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let currentParagraph = [];
    let currentList = [];
    let isInList = false;

    // Helper function to clean markdown formatting from text
    const cleanMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
            .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
            .replace(/`(.*?)`/g, '$1')       // Remove inline code `text`
            .trim();
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            // Empty line - finish current paragraph or list
            if (currentList.length > 0) {
                elements.push(
                    <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                        {currentList.map((item, idx) => (
                            <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
                isInList = false;
            }
            if (currentParagraph.length > 0) {
                elements.push(
                    <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                        {cleanMarkdown(currentParagraph.join(' '))}
                    </p>
                );
                currentParagraph = [];
            }
            continue;
        }

        // Handle bullet points (- or * at start of line)
        if (line.match(/^[-*]\s+/)) {
            // Finish current paragraph first
            if (currentParagraph.length > 0) {
                elements.push(
                    <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                        {cleanMarkdown(currentParagraph.join(' '))}
                    </p>
                );
                currentParagraph = [];
            }

            const bulletText = cleanMarkdown(line.replace(/^[-*]\s+/, '').trim());
            currentList.push(bulletText);
            isInList = true;
            continue;
        }

        // Handle numbered lists (1. 2. etc.)
        if (line.match(/^\d+\.\s+/)) {
            // Finish current paragraph first
            if (currentParagraph.length > 0) {
                elements.push(
                    <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                        {cleanMarkdown(currentParagraph.join(' '))}
                    </p>
                );
                currentParagraph = [];
            }

            // Finish current bullet list if we're switching to numbered
            if (currentList.length > 0) {
                elements.push(
                    <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                        {currentList.map((item, idx) => (
                            <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
            }

            const numberText = cleanMarkdown(line.replace(/^\d+\.\s+/, '').trim());
            currentList.push(numberText);
            isInList = true;
            continue;
        }

        // If we were in a list but this line isn't a list item, finish the list
        if (isInList && !line.match(/^[-*]\s+/) && !line.match(/^\d+\.\s+/)) {
            if (currentList.length > 0) {
                // Determine if it was a numbered list by checking the previous line
                const isNumberedList = lines[i - 1] && lines[i - 1].match(/^\d+\.\s+/);

                if (isNumberedList) {
                    elements.push(
                        <ol key={elements.length} className="mb-4 ml-6 space-y-1">
                            {currentList.map((item, idx) => (
                                <li key={idx} className="text-gray-700 leading-relaxed list-decimal">
                                    {item}
                                </li>
                            ))}
                        </ol>
                    );
                } else {
                    elements.push(
                        <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                            {currentList.map((item, idx) => (
                                <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    );
                }
                currentList = [];
                isInList = false;
            }
        }

        // Handle headings
        if (line.startsWith('# ')) {
            // Finish current paragraph or list first
            if (currentList.length > 0) {
                elements.push(
                    <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                        {currentList.map((item, idx) => (
                            <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
                isInList = false;
            }
            if (currentParagraph.length > 0) {
                elements.push(
                    <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                        {cleanMarkdown(currentParagraph.join(' '))}
                    </p>
                );
                currentParagraph = [];
            }

            const headingText = cleanMarkdown(line.substring(2).trim());
            elements.push(
                <h1 key={elements.length} className="text-2xl font-bold mb-4 mt-6 text-gray-900 leading-tight">
                    {headingText}
                </h1>
            );
            continue;
        }

        if (line.startsWith('## ')) {
            // Finish current paragraph or list first
            if (currentList.length > 0) {
                elements.push(
                    <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                        {currentList.map((item, idx) => (
                            <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
                isInList = false;
            }
            if (currentParagraph.length > 0) {
                elements.push(
                    <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                        {cleanMarkdown(currentParagraph.join(' '))}
                    </p>
                );
                currentParagraph = [];
            }

            const headingText = cleanMarkdown(line.substring(3).trim());
            elements.push(
                <h2 key={elements.length} className="text-xl font-semibold mb-3 mt-5 text-gray-900 leading-tight">
                    {headingText}
                </h2>
            );
            continue;
        }

        if (line.startsWith('### ')) {
            // Finish current paragraph or list first
            if (currentList.length > 0) {
                elements.push(
                    <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                        {currentList.map((item, idx) => (
                            <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
                isInList = false;
            }
            if (currentParagraph.length > 0) {
                elements.push(
                    <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                        {cleanMarkdown(currentParagraph.join(' '))}
                    </p>
                );
                currentParagraph = [];
            }

            const headingText = cleanMarkdown(line.substring(4).trim());
            elements.push(
                <h3 key={elements.length} className="text-lg font-medium mb-2 mt-4 text-gray-900 leading-tight">
                    {headingText}
                </h3>
            );
            continue;
        }

        // Regular text - add to current paragraph (only if not in a list)
        if (!isInList) {
            currentParagraph.push(line);
        }
    }

    // Don't forget the last paragraph or list
    if (currentList.length > 0) {
        elements.push(
            <ul key={elements.length} className="mb-4 ml-6 space-y-1">
                {currentList.map((item, idx) => (
                    <li key={idx} className="text-gray-700 leading-relaxed list-disc">
                        {item}
                    </li>
                ))}
            </ul>
        );
    }
    if (currentParagraph.length > 0) {
        elements.push(
            <p key={elements.length} className="mb-4 leading-relaxed text-gray-700">
                {cleanMarkdown(currentParagraph.join(' '))}
            </p>
        );
    }

    return <div className="prose max-w-none">{elements}</div>;
};

const ContentLibraryPage: React.FC = () => {
    const {
        items,
        stats,
        isLoading,
        deleteContent,
        toggleFavorite,
        searchContent,
        exportLibrary,
        importLibrary
    } = useContentLibrary();

    // Local state for UI
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<ContentSearchFilters>({});
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    // Update filtered items when search/filters change
    useEffect(() => {
        const results = searchContent(searchQuery, filters);
        setFilteredItems(results);
    }, [searchQuery, filters, items, searchContent]);

    // Copy content to clipboard
    const copyToClipboard = async (content: string, title: string) => {
        try {
            await navigator.clipboard.writeText(content);
            console.log(`📋 Copied "${title}" to clipboard`);
        } catch (error) {
            console.error('Failed to copy content:', error);
        }
    };

    // Handle file import
    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await importLibrary(file);
        } catch (error) {
            console.error('Import failed:', error);
        }

        // Reset input
        event.target.value = '';
    };

    // Handle individual content export
    const handleExportContent = (item: ContentItem, format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
        try {
            const fileName = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}`;

            switch (format) {
                case 'txt':
                    const cleanText = item.content.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/^\s*[-*]\s+/gm, '• ');
                    const blob = new Blob([cleanText], { type: 'text/plain' });
                    downloadFile(blob, `${fileName}.txt`);
                    break;

                case 'markdown':
                    const mdBlob = new Blob([item.content], { type: 'text/markdown' });
                    downloadFile(mdBlob, `${fileName}.md`);
                    break;

                case 'html':
                    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${item.title}</title>
    <style>
        body { 
            font-family: Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        h1 { color: #1f2937; margin-top: 2rem; }
        h2 { color: #374151; margin-top: 1.5rem; }
        h3 { color: #4b5563; margin-top: 1rem; }
        ul, ol { margin-left: 2rem; }
        li { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <h1>${item.title}</h1>
    <p><small>Created: ${new Date(item.createdAt).toLocaleDateString()} | ${item.wordCount} words</small></p>
    ${convertMarkdownToHtml(item.content)}
</body>
</html>`;
                    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
                    downloadFile(htmlBlob, `${fileName}.html`);
                    break;

                case 'pdf':
                    // Use your existing PDF export function
                    const cleanPdfContent = item.content.replace(/^#+\s*/gm, '').replace(/\*\*/g, '');
                    exportToPDF(cleanPdfContent, `${fileName}.pdf`);
                    break;

                case 'docx':
                    // Use your existing DOCX export function
                    const cleanDocxContent = item.content.replace(/^#+\s*/gm, '').replace(/\*\*/g, '');
                    exportToDocx(cleanDocxContent, `${fileName}.docx`);
                    break;
            }

            setShowExportDropdown(false);
            console.log(`✅ Exported "${item.title}" as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    // Helper function to download files
    const downloadFile = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Helper function to convert basic markdown to HTML
    const convertMarkdownToHtml = (markdown: string) => {
        return markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/<\/ul>\s*<ul>/g, '')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><h/g, '<h')
            .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
    };

    // Render content card (grid view)
    const renderContentCard = (item: ContentItem) => {
        // Safety checks
        if (!item.contentType) {
            console.error("❌ ERROR: item.contentType is missing!", item);
            return null;
        }

        const typeConfig = CONTENT_TYPE_CONFIG[item.contentType];

        if (!typeConfig) {
            console.error("❌ ERROR: No config found for contentType:", item.contentType);
            return null;
        }

        const IconComponent = typeConfig.icon;

        return (
            <Card
                key={item.id}
                className="relative group hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedItem(item)}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className={`p-1.5 rounded-lg ${typeConfig.color}`}>
                                <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="text-sm font-medium line-clamp-2 text-gray-900">
                                    {item.title}
                                </CardTitle>
                                <p className="text-xs text-gray-500 mt-1">
                                    {typeConfig.label} • {item.wordCount} words
                                </p>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(item.id);
                                }}
                                className={`p-1 rounded ${item.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            >
                                <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(item.content, item.title);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-500 rounded"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(item.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {/* Clean preview - remove markdown and show first 150 chars */}
                        {item.content.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                                <Tag className="w-3 h-3" />
                                <span>{item.tags.length}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Render content row (list view)
    const renderContentRow = (item: ContentItem) => {
        // Same safety checks for list view
        if (!item.contentType) {
            console.error("❌ LIST ERROR: item.contentType is missing!", item);
            return null;
        }

        const typeConfig = CONTENT_TYPE_CONFIG[item.contentType];

        if (!typeConfig) {
            console.error("❌ LIST ERROR: No config found for contentType:", item.contentType);
            return null;
        }

        const IconComponent = typeConfig.icon;

        return (
            <div
                key={item.id}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer group"
                onClick={() => setSelectedItem(item)}
            >
                <div className={`p-2 rounded-lg ${typeConfig.color} mr-4`}>
                    <IconComponent className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {typeConfig.label} • {item.wordCount} words • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.content, item.title);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 rounded"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteContent(item.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
                        <p className="text-gray-600 mt-2">Manage and organize your saved content</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileImport}
                                className="hidden"
                            />
                            <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">Import</span>
                            </div>
                        </label>

                        <button
                            onClick={exportLibrary}
                            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Export</span>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4">
                        <div className="flex items-center">
                            <FileText className="w-8 h-8 text-blue-500 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-600">Total Items</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <Star className="w-8 h-8 text-yellow-500 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                                <p className="text-sm text-gray-600">Favorites</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-green-500 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.recentlyAdded}</p>
                                <p className="text-sm text-gray-600">This Week</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center">
                            <Sparkles className="w-8 h-8 text-purple-500 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalWords.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Total Words</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search your content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center space-x-2 px-3 py-2 border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">Filters</span>
                    </button>

                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <Card className="p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                                <select
                                    value={filters.contentType || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, contentType: e.target.value || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {Object.entries(CONTENT_TYPE_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    <option value="general">General</option>
                                    <option value="campaign">Campaign</option>
                                    <option value="template">Template</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.favoritesOnly || false}
                                        onChange={(e) => setFilters(prev => ({ ...prev, favoritesOnly: e.target.checked || undefined }))}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Favorites Only</span>
                                </label>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Content Grid/List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading your content...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {items.length === 0 ? 'No content saved yet' : 'No content matches your search'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {items.length === 0
                            ? 'Start creating content and save it to your library to see it here.'
                            : 'Try adjusting your search terms or filters.'
                        }
                    </p>
                    {items.length === 0 && (
                        <Link href="/content-creator">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Create Content
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'bg-white rounded-lg border border-gray-200'
                }>
                    {filteredItems.map(item =>
                        viewMode === 'grid' ? renderContentCard(item) : renderContentRow(item)
                    )}
                </div>
            )}

            {/* Content Preview Modal - WITH EXPORT BUTTONS */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{selectedItem.title}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {CONTENT_TYPE_CONFIG[selectedItem.contentType]?.label || 'Unknown Type'} • {selectedItem.wordCount} words •
                                    Created {formatDistanceToNow(new Date(selectedItem.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {/* Export Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="text-sm">Export</span>
                                    </button>
                                    {showExportDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                                            <button
                                                onClick={() => handleExportContent(selectedItem, 'txt')}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Plain Text (.txt)
                                            </button>
                                            <button
                                                onClick={() => handleExportContent(selectedItem, 'markdown')}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Markdown (.md)
                                            </button>
                                            <button
                                                onClick={() => handleExportContent(selectedItem, 'html')}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                HTML (.html)
                                            </button>
                                            <button
                                                onClick={() => handleExportContent(selectedItem, 'pdf')}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                PDF (.pdf)
                                            </button>
                                            <button
                                                onClick={() => handleExportContent(selectedItem, 'docx')}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Word (.docx)
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* BEAUTIFUL FORMATTED CONTENT - NO MORE UGLY MARKDOWN! */}
                            <div className="bg-white" style={{
                                fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                                lineHeight: '1.6',
                                fontSize: '11pt'
                            }}>
                                {renderFormattedContent(selectedItem.content)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => toggleFavorite(selectedItem.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${selectedItem.isFavorite
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Star className={`w-4 h-4 ${selectedItem.isFavorite ? 'fill-current' : ''}`} />
                                    <span className="text-sm">{selectedItem.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => copyToClipboard(selectedItem.content, selectedItem.title)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span className="text-sm">Copy Content</span>
                                </button>

                                <button
                                    onClick={() => {
                                        deleteContent(selectedItem.id);
                                        setSelectedItem(null);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Wrap with providers
const ContentLibraryPageWithProviders: React.FC = () => {
    return (
        <NotificationProvider>
            {/* Note: ContentLibraryProvider should be added at app level */}
            <ContentLibraryPage />
        </NotificationProvider>
    );
};

export default ContentLibraryPageWithProviders;