// src/components/shared/Navbar/index.tsx
// Fixed navbar with proper hub links and removed standalone Brand Compass button

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Settings,
  ChevronDown,
  BarChart2,
  Edit,
  FileText,
  Sparkles,
  User,
} from "lucide-react";

const Navbar: React.FC = () => {
  const router = useRouter();
  // Simplified auth for now - you can add back proper auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [strategicMenuOpen, setStrategicMenuOpen] = useState(false);
  const [creationMenuOpen, setCreationMenuOpen] = useState(false);
  const [enhancementMenuOpen, setEnhancementMenuOpen] = useState(false);

  const strategicMenuRef = useRef<HTMLDivElement>(null);
  const creationMenuRef = useRef<HTMLDivElement>(null);
  const enhancementMenuRef = useRef<HTMLDivElement>(null);

  const isInWalkthrough = router.pathname.includes("/walkthrough/");

  useEffect(() => {
    // Simple auth check
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: "User" });
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        strategicMenuRef.current &&
        !strategicMenuRef.current.contains(event.target as Node)
      ) {
        setStrategicMenuOpen(false);
      }
      if (
        creationMenuRef.current &&
        !creationMenuRef.current.contains(event.target as Node)
      ) {
        setCreationMenuOpen(false);
      }
      if (
        enhancementMenuRef.current &&
        !enhancementMenuRef.current.contains(event.target as Node)
      ) {
        setEnhancementMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/");
  };

  const handleExitWalkthrough = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the walkthrough? Your progress will be saved."
    );
    if (confirmExit) {
      router.push("/");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/navbar-beaker2.png"
                  alt="Marketing Content Lab"
                  width={50}
                  height={50}
                  className="cursor-pointer"
                />
              </div>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">

              {/* Brandscape Menu - FIXED: Now links to /brandscape when clicked */}
              <div className="relative" ref={strategicMenuRef}>
                <Link href="/brandscape">
                  <button
                    onClick={() => {
                      setStrategicMenuOpen(!strategicMenuOpen);
                      setCreationMenuOpen(false);
                      setEnhancementMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${strategicMenuOpen
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <BarChart2 className="w-4 h-4 mr-1" />
                    Brandscape
                    <ChevronDown
                      className={`ml-1 w-4 h-4 transition-transform ${strategicMenuOpen ? "transform rotate-180" : ""
                        }`}
                    />
                  </button>
                </Link>
                {strategicMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {/* Main Branding Wizard */}
                      <Link
                        href="/walkthrough/1"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                      >
                        🧙‍♀️ Branding Wizard (Complete Flow)
                      </Link>
                      <Link
                        href="/brand-compass"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                      >
                        🧭 Brand Compass
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Individual Steps
                      </div>

                      {/* Walkthrough steps in order - FIXED: Now point to standalone pages */}
                      <Link
                        href="/product"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📦 Product Information
                      </Link>
                      <Link
                        href="/ideal-customer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        👥 Ideal Customer
                      </Link>
                      <Link
                        href="/value-proposition"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        💎 Value Proposition
                      </Link>
                      <Link
                        href="/key-messages"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        💬 Messaging Framework
                      </Link>
                      <Link
                        href="/competitive-analysis"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🏆 Competitive Analysis
                      </Link>
                      <Link
                        href="/writing-style"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ✍️ Style Guide Builder
                      </Link>
                      <Link
                        href="/brand-voice"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🎭 Brand Personality
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Standalone Tools
                      </div>

                      {/* Standalone brand tools */}
                      <Link
                        href="/mission-vision-generator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🎯 Mission + Vision Generator
                      </Link>
                      <Link
                        href="/tagline-generator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ✨ Tagline Generator
                      </Link>
                      <Link
                        href="/boilerplate-generator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📝 Boilerplate Generator
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Creation Hub Menu - FIXED: Now links to /creation-hub when clicked */}
              <div className="relative" ref={creationMenuRef}>
                <Link href="/creation-hub">
                  <button
                    onClick={() => {
                      setCreationMenuOpen(!creationMenuOpen);
                      setStrategicMenuOpen(false);
                      setEnhancementMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${creationMenuOpen
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Creation Hub
                    <ChevronDown
                      className={`ml-1 w-4 h-4 transition-transform ${creationMenuOpen ? "transform rotate-180" : ""
                        }`}
                    />
                  </button>
                </Link>
                {creationMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        href="/content-creator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📄 Standalone Content Creator
                      </Link>
                      <Link
                        href="/campaign-builder"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🚀 Campaign Builder
                      </Link>
                      <Link
                        href="/content-repurposer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🔄 Content Repurposer
                      </Link>
                      <Link
                        href="/ab-testing"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🧪 A/B Test Generator
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhancement Studio Menu - FIXED: Now links to /content-enhancer-tools when clicked */}
              <div className="relative" ref={enhancementMenuRef}>
                <Link href="/content-enhancer-tools">
                  <button
                    onClick={() => {
                      setEnhancementMenuOpen(!enhancementMenuOpen);
                      setStrategicMenuOpen(false);
                      setCreationMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${enhancementMenuOpen
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhancement Studio
                    <ChevronDown
                      className={`ml-1 w-4 h-4 transition-transform ${enhancementMenuOpen ? "transform rotate-180" : ""
                        }`}
                    />
                  </button>
                </Link>
                {enhancementMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        href="/prose-perfector"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ✨ Prose Perfector
                      </Link>
                      <Link
                        href="/style-checker"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📋 Style Guide Compliance
                      </Link>
                      <Link
                        href="/content-humanizer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🤖➡️👤 Humanizer
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Link */}
              <Link
                href="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${router.pathname === "/settings"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Right side - CTA and Auth */}
          <div className="flex items-center space-x-4">
            {/* REMOVED: Standalone Brand Compass button as requested */}

            {/* Main CTA */}
            {isInWalkthrough ? (
              <button
                onClick={handleExitWalkthrough}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ✨ Exit Branding Wizard
              </button>
            ) : (
              <Link
                href="/walkthrough/1"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ✨ Branding Wizard
              </Link>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>{user?.name || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu would go here if needed */}
    </header>
  );
};

export default Navbar;