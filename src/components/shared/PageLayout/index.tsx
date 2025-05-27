import React from 'react';

interface PageLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
    showHelpPrompt?: boolean;
    helpPromptText?: string;
    helpPromptLink?: string;
    helpPromptLinkText?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    title,
    description,
    children,
    showHelpPrompt = false,
    helpPromptText,
    helpPromptLink,
    helpPromptLinkText
}) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                    <p className="text-gray-600">{description}</p>
                </div>

                {children}
            </div>
        </div>
    );
};

export default PageLayout; 