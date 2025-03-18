// src/components/shared/Navbar/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Settings, ChevronDown, BarChart2, Edit, FileText, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [strategicMenuOpen, setStrategicMenuOpen] = useState(false);
  const [creationMenuOpen, setCreationMenuOpen] = useState(false);
  const [enhancementMenuOpen, setEnhancementMenuOpen] = useState(false);
  
  const strategicMenuRef = useRef<HTMLDivElement>(null);
  const creationMenuRef = useRef<HTMLDivElement>(null);
  const enhancementMenuRef = useRef<HTMLDivElement>(null);
  
  const isInWalkthrough = router.pathname.includes('/walkthrough/');
  
  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (strategicMenuRef.current && !strategicMenuRef.current.contains(event.target as Node)) {
        setStrategicMenuOpen(false);
      }
      if (creationMenuRef.current && !creationMenuRef.current.contains(event.target as Node)) {
        setCreationMenuOpen(false);
      }
      if (enhancementMenuRef.current && !enhancementMenuRef.current.contains(event.target as Node)) {
        setEnhancementMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
            <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {/* Strategic Tools Dropdown */}
              <div className="relative" ref={strategicMenuRef}>
                <button
                  onClick={() => {
                    setStrategicMenuOpen(!strategicMenuOpen);
                    setCreationMenuOpen(false);
                    setEnhancementMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${
                    strategicMenuOpen ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Strategic Tools
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${strategicMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {strategicMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        href="/product" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setStrategicMenuOpen(false)}
                      >
                        Product Definition
                      </Link>
                      <Link 
                        href="/key-messages" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setStrategicMenuOpen(false)}
                      >
                        Key Messaging
                      </Link>
                      <Link 
                        href="/competitive-analysis" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setStrategicMenuOpen(false)}
                      >
                        Competitive Analysis
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Content Creation Dropdown */}
              <div className="relative" ref={creationMenuRef}>
                <button
                  onClick={() => {
                    setCreationMenuOpen(!creationMenuOpen);
                    setStrategicMenuOpen(false);
                    setEnhancementMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${
                    creationMenuOpen ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Content Creation
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${creationMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {creationMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        href="/creation-hub" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setCreationMenuOpen(false)}
                      >
                        Creation Hub
                      </Link>
                      <Link 
                        href="/content-creator" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setCreationMenuOpen(false)}
                      >
                        Content Creator
                      </Link>
                      <Link 
                        href="/content-repurposer" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setCreationMenuOpen(false)}
                      >
                        Content Repurposer
                      </Link>
                      <Link 
                        href="/campaign-builder" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setCreationMenuOpen(false)}
                      >
                        Campaign Builder
                      </Link>
                      <Link 
                        href="/ab-testing" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setCreationMenuOpen(false)}
                      >
                        A/B Testing
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Content Enhancement Dropdown */}
              <div className="relative" ref={enhancementMenuRef}>
                <button
                  onClick={() => {
                    setEnhancementMenuOpen(!enhancementMenuOpen);
                    setStrategicMenuOpen(false);
                    setCreationMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${
                    enhancementMenuOpen ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Content Enhancement
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${enhancementMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {enhancementMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        href="/prose-perfector" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setEnhancementMenuOpen(false)}
                      >
                        Prose Perfector
                      </Link>
                      <Link 
                        href="/style-checker" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setEnhancementMenuOpen(false)}
                      >
                        Style Compliance Check
                      </Link>
                      <Link 
                        href="/writing-style" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setEnhancementMenuOpen(false)}
                      >
                        Writing Style
                      </Link>
                      <Link 
                        href="/brand-voice" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setEnhancementMenuOpen(false)}
                      >
                        Brand Voice
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link 
                href="/settings" 
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${
                  router.pathname === '/settings' ? 
                  'bg-blue-100 text-blue-700' : 
                  'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
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