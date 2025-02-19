// src/components/shared/Navbar/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  
  // Updated navigation items
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Define Product', path: '/product' },
    { label: 'Content Strategy', path: '/content-strategy' },
    { label: 'Key Messages', path: '/key-messages' },
    { label: 'SEO Keywords', path: '/seo-keywords' }
  ];

  // Check if we're in the walkthrough
  const isInWalkthrough = router.pathname.startsWith('/walkthrough') || 
                         router.pathname === '/walkthrough/complete';

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Navigation Links */}
          <div className="flex overflow-x-auto hide-scrollbar">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                  router.pathname === item.path
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Start Walkthrough Button - only show when not in walkthrough */}
          {!isInWalkthrough && (
            <div className="flex items-center">
              <button
                onClick={() => router.push('/walkthrough/1')}
                className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
              >
                Start Walkthrough
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;