/**
 * File: src/pages/_app.js
 * 
 * Super simplified App component without any contexts
 */

import React from 'react';
import '../styles/globals.css';

// Create a simple navbar that doesn't depend on any contexts
const SimpleNavbar = () => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" className="text-xl font-bold text-blue-600">Market Multiplier</a>
    </div>
  </header>
);

function MyApp({ Component, pageProps }) {
  // Render without any contexts for the initial deployment
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavbar />
      <main className="container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;