// src/pages/index.tsx
import React from 'react';

// This landing page deliberately avoids all contexts and client-only features
// to ensure it can be statically generated at build time

export default function SimpleLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Market Multiplier
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          AI-powered marketing program builder
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Create compelling marketing content with AI assistance
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="mb-6">Our full application is under development. Check back soon for:</p>
          
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">✨ AI-Powered Analysis</h3>
              <p className="text-gray-600">Automated competitive analysis and insights</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📝 Content Creation</h3>
              <p className="text-gray-600">Generate high-quality content with AI assistance</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🎯 Marketing Strategy</h3>
              <p className="text-gray-600">Build comprehensive marketing programs</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📊 Performance Tracking</h3>
              <p className="text-gray-600">Analyze and optimize your marketing efforts</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500">
          © {new Date().getFullYear()} Market Multiplier
        </p>
      </div>
    </div>
  );
}

// Export a static props function to ensure this page is pre-rendered
// and doesn't use any client-side features during build
export async function getStaticProps() {
  return {
    props: {}
  };
}