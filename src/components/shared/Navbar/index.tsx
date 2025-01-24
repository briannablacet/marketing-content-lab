// src/components/shared/Navbar/index.tsx
import React from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Lead Scoring', path: '/lead-scoring' },
    { label: 'Content Strategy', path: '/content-strategy' },
    { label: 'Channel Mix', path: '/channel-selection' },
    { label: 'Timeline', path: '/timeline' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {navItems.map((item) => (
              
                key={item.path}
                href={item.path}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium ${
                  router.pathname === item.path
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => router.push('/walkthrough/1')}
              className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
            >
              Start Walkthrough
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;