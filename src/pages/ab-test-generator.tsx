import React from 'react';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';
import ABTestGenerator from '../components/features/ABTestGenerator';

export default function ABTestGeneratorPage() {
    return (
        <NotificationProvider>
            <WritingStyleProvider>
                <ABTestGenerator />
            </WritingStyleProvider>
        </NotificationProvider>
    );
} 