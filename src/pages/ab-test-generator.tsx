import React from 'react';
import { NotificationProvider } from '../context/NotificationContext';
import ABTestGenerator from '../components/features/ABTestGenerator';

export default function ABTestGeneratorPage() {
    return (
        <NotificationProvider>
            <ABTestGenerator />
        </NotificationProvider>
    );
} 