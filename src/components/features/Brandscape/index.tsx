// src/components/features/Brandscape/index.tsx
// Functional Brandscape hub with real working links to all existing tools

import React from 'react';
import Link from 'next/link';
import { BarChart2, Users, Target, MessageSquare, Trophy, FileText, Palette, Sparkles, Zap } from 'lucide-react';

const BrandscapeHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - no double navbar styling */}
            <div className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <BarChart2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Brandscape Hub
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Build your strategic brand foundation with AI-powered tools
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Tools Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Guided Experience */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Guided Experience</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/walkthrough/1" className="block">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-white">
                                <Sparkles className="w-8 h-8 mb-3" />
                                <h3 className="text-lg font-semibold mb-2">🧙‍♀️ Branding Wizard</h3>
                                <p className="text-blue-100 text-sm">Complete guided walkthrough to build your entire brand strategy step-by-step</p>
                            </div>
                        </Link>

                        <Link href="/brand-compass" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <Target className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">🧭 Brand Compass</h3>
                                <p className="text-gray-600 text-sm">Navigate your brand strategy with interactive guidance</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Core Strategy Tools */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Strategy Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <Link href="/product" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                                    <Zap className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">📦 Product Information</h3>
                                <p className="text-gray-600 text-sm">Define your product details and core value proposition</p>
                            </div>
                        </Link>

                        <Link href="/ideal-customer" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <Users className="w-8 h-8 text-purple-600 mr-3" />
                                    <Zap className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">👥 Ideal Customer</h3>
                                <p className="text-gray-600 text-sm">Create detailed customer profiles with AI assistance</p>
                            </div>
                        </Link>

                        <Link href="/value-proposition" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <Target className="w-8 h-8 text-green-600 mr-3" />
                                    <Zap className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">💎 Value Proposition</h3>
                                <p className="text-gray-600 text-sm">Craft compelling value propositions that resonate</p>
                            </div>
                        </Link>

                        <Link href="/key-messages" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <MessageSquare className="w-8 h-8 text-orange-600 mr-3" />
                                    <Zap className="w-4 h-4 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Messaging Framework</h3>
                                <p className="text-gray-600 text-sm">Develop consistent messaging across all channels</p>
                            </div>
                        </Link>

                        <Link href="/competitive-analysis" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
                                    <Zap className="w-4 h-4 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">🏆 Competitive Analysis</h3>
                                <p className="text-gray-600 text-sm">Understand your competitive landscape</p>
                            </div>
                        </Link>

                        <Link href="/writing-style" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <FileText className="w-8 h-8 text-red-600 mr-3" />
                                    <Zap className="w-4 h-4 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">✍️ Style Guide Builder</h3>
                                <p className="text-gray-600 text-sm">Create comprehensive brand style guidelines</p>
                            </div>
                        </Link>

                        <Link href="/brand-voice" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-center mb-3">
                                    <Palette className="w-8 h-8 text-indigo-600 mr-3" />
                                    <Zap className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎭 Brand Personality</h3>
                                <p className="text-gray-600 text-sm">Define your brand's voice and personality</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Quick Generators */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Generators</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <Link href="/mission-vision-generator" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <Target className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Mission + Vision</h3>
                                <p className="text-gray-600 text-sm">Generate mission and vision statements</p>
                            </div>
                        </Link>

                        <Link href="/tagline-generator" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">✨ Tagline Generator</h3>
                                <p className="text-gray-600 text-sm">Create memorable taglines and slogans</p>
                            </div>
                        </Link>

                        <Link href="/boilerplate-generator" className="block">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <FileText className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Boilerplate Generator</h3>
                                <p className="text-gray-600 text-sm">Generate company boilerplate text</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandscapeHub;