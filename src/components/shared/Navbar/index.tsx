// src/components/shared/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  const isInWalkthrough = router.pathname.includes('/walkthrough/');
  
  const handleExitWalkthrough = () => {
    const confirmExit = window.confirm(
      'Are you sure you want to exit the walkthrough? Your progress will be saved.'
    );
    
    if (confirmExit) {
      router.push('/');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Marketing Content Lab</span>
            </Link>
            
            {/* Main navigation links */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/content-strategy" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  router.pathname === '/content-strategy' ? 
                  'border-blue-500 text-gray-900' : 
                  'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Content Strategy
              </Link>
              <Link 
                href="/creation-hub" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  router.pathname === '/creation-hub' ? 
                  'border-blue-500 text-gray-900' : 
                  'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Creation Hub
              </Link>
              <Link 
                href="/competitive-analysis" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  router.pathname === '/competitive-analysis' ? 
                  'border-blue-500 text-gray-900' : 
                  'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Competitive Analysis
              </Link>
            </nav>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            {isInWalkthrough ? (
              <button
                onClick={handleExitWalkthrough}
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Exit Walkthrough
              </button>
            ) : (
              <Link
                href="/walkthrough/1"
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Walkthrough
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;