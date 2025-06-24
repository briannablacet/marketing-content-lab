import React from 'react';
import TaglineGenerator from '../components/features/TaglineGenerator';
import { NotificationProvider } from '../context/NotificationContext';
import { MessagingProvider } from '../context/MessagingContext';

const TaglineGeneratorPage: React.FC = () => {
    return (
        <NotificationProvider>
            <MessagingProvider>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <TaglineGenerator />
                </div>
            </MessagingProvider>
        </NotificationProvider>
    );
};

export default TaglineGeneratorPage; 