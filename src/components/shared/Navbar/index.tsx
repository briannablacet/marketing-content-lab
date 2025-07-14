// src/components/shared/Navbar/index.tsx
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
  Menu,
  X,
  Archive,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const LoginModal = dynamic(() => import("@/components/features/auth/login"), {
  ssr: false,
});
const RegistrationModal = dynamic(
  () => import("@/components/features/auth/register"),
  { ssr: false }
);
const LogoutConfirmModal = dynamic(
  () => import("@/components/features/auth/logout"),
  { ssr: false }
);

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, register, logout } = useAuth();

  // Desktop dropdown states
  const [strategicMenuOpen, setStrategicMenuOpen] = useState(false);
  const [creationMenuOpen, setCreationMenuOpen] = useState(false);
  const [enhancementMenuOpen, setEnhancementMenuOpen] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileStrategicOpen, setMobileStrategicOpen] = useState(false);
  const [mobileCreationOpen, setMobileCreationOpen] = useState(false);
  const [mobileEnhancementOpen, setMobileEnhancementOpen] = useState(false);

  // Auth modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Auth form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");

  const strategicMenuRef = useRef<HTMLDivElement>(null);
  const creationMenuRef = useRef<HTMLDivElement>(null);
  const enhancementMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isInWalkthrough = router.pathname.includes("/walkthrough/");

  // Close menus when clicking outside
  useEffect(() => {
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      setIsLoginOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerName, registerEmail, registerPassword);
      setIsRegisterOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  const handleExitWalkthrough = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the walkthrough? Your progress will be saved."
    );

    if (confirmExit) {
      router.push("/");
    }
  };

  // Close all mobile menus when navigating
  const navigateAndClose = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setMobileStrategicOpen(false);
    setMobileCreationOpen(false);
    setMobileEnhancementOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - logo and mobile menu button */}
          <div className="flex items-center">
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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-4 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {/* Strategic Tools Dropdown */}
            <div className="relative" ref={strategicMenuRef}>
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

              {strategicMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        router.push('/brand-compass');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🧭 Brand Compass
                    </button>
                    <button
                      onClick={() => {
                        router.push('/ideal-customer');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      👥 Ideal Customer
                    </button>
                    <button
                      onClick={() => {
                        router.push('/value-proposition');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      💎 Value Proposition
                    </button>
                    <button
                      onClick={() => {
                        router.push('/key-messages');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      💬 Messaging Framework
                    </button>
                    <button
                      onClick={() => {
                        router.push('/competitive-analysis');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🏆 Competitive Analysis
                    </button>
                    <button
                      onClick={() => {
                        router.push('/writing-style');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ✍️ Style Guide Builder
                    </button>
                    <button
                      onClick={() => {
                        router.push('/brand-voice');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🎭 Brand Personality
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Standalone Tools
                    </div>

                    <button
                      onClick={() => {
                        router.push('/mission-vision-generator');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🎯 Mission + Vision Generator
                    </button>
                    <button
                      onClick={() => {
                        router.push('/tagline-generator');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ✨ Tagline Generator
                    </button>
                    <button
                      onClick={() => {
                        router.push('/boilerplate-generator');
                        setStrategicMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📝 Boilerplate Generator
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/brandscape">
                      <button
                        onClick={() => setStrategicMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        See All Strategic Tools →
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Creation Hub Menu */}
            <div className="relative" ref={creationMenuRef}>
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
              {creationMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b">
                      Content Creation
                    </div>
                    <button
                      onClick={() => {
                        router.push('/content-creator');
                        setCreationMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📄 Content Creator
                    </button>
                    <button
                      onClick={() => {
                        router.push('/campaign-builder');
                        setCreationMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🚀 Campaign Builder
                    </button>
                    <button
                      onClick={() => {
                        router.push('/content-repurposer');
                        setCreationMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🔄 Content Repurposer
                    </button>
                    <button
                      onClick={() => {
                        router.push('/ab-test-generator');
                        setCreationMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📊 A/B Test Generator
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/creation-hub">
                      <button
                        onClick={() => setCreationMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        See All Creation Tools →
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Enhancement Studio Menu */}
            <div className="relative" ref={enhancementMenuRef}>
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
              {enhancementMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        router.push('/style-checker');
                        setEnhancementMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📋 Style Guide Compliance
                    </button>
                    <button
                      onClick={() => {
                        router.push('/prose-perfector');
                        setEnhancementMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ✨ Prose Perfector
                    </button>
                    <button
                      onClick={() => {
                        router.push('/content-humanizer');
                        setEnhancementMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🤖 Content Humanizer
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/content-enhancer-tools">
                      <button
                        onClick={() => setEnhancementMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        See All Enhancement Tools →
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* Content Library Link */}
            <Link
              href="/content-library"
              className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${router.pathname === "/content-library"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              <Archive className="w-4 h-4 mr-1" />
              Content Library
            </Link>
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

          {/* Right section - CTAs and auth */}
          <div className="flex items-center space-x-2">
            {/* Main CTA */}
            {isInWalkthrough ? (
              <button
                onClick={handleExitWalkthrough}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ✨ Exit Branding Wizard
              </button>
            ) : (
              <Link
                href="/walkthrough/1"
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ✨ Branding Wizard
              </Link>
            )}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-gray-200 text-white flex justify-center items-center rounded-full">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={() => setIsLogoutOpen(true)}
                  className="text-sm text-white bg-red-600 hover:bg-red-700 transition duration-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div
            ref={mobileMenuRef}
            className="absolute top-0 left-0 w-4/5 h-full bg-white shadow-lg overflow-y-auto"
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg">Marketing Content Lab</div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {/* Mobile Branding Wizard */}
              {isInWalkthrough ? (
                <button
                  onClick={() => {
                    handleExitWalkthrough();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mb-4"
                >
                  ✨ Exit Branding Wizard
                </button>
              ) : (
                <Link
                  href="/walkthrough/1"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mb-4"
                >
                  ✨ Branding Wizard
                </Link>
              )}

              {/* Mobile Strategic Tools Accordion */}
              <div className="border rounded-md overflow-hidden">
                <button
                  onClick={() => setMobileStrategicOpen(!mobileStrategicOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    <span>Brandscape</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileStrategicOpen ? "transform rotate-180" : ""
                      }`}
                  />
                </button>
                {mobileStrategicOpen && (
                  <div className="pl-8 pr-4 py-2 bg-gray-50 space-y-2">
                    <button
                      onClick={() => navigateAndClose('/brand-compass')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🧭 Brand Compass
                    </button>
                    <button
                      onClick={() => navigateAndClose('/ideal-customer')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      👥 Ideal Customer
                    </button>
                    <button
                      onClick={() => navigateAndClose('/value-proposition')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      💎 Value Proposition
                    </button>
                    <button
                      onClick={() => navigateAndClose('/key-messages')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      💬 Messaging Framework
                    </button>
                    <button
                      onClick={() => navigateAndClose('/competitive-analysis')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🏆 Competitive Analysis
                    </button>
                    <button
                      onClick={() => navigateAndClose('/writing-style')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      ✍️ Style Guide Builder
                    </button>
                    <button
                      onClick={() => navigateAndClose('/brand-voice')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🎭 Brand Personality
                    </button>

                    <div className="border-t border-gray-100 my-2"></div>
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Standalone Tools
                    </div>

                    <button
                      onClick={() => navigateAndClose('/mission-vision-generator')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🎯 Mission + Vision Generator
                    </button>
                    <button
                      onClick={() => navigateAndClose('/tagline-generator')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      ✨ Tagline Generator
                    </button>
                    <button
                      onClick={() => navigateAndClose('/boilerplate-generator')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      📝 Boilerplate Generator
                    </button>

                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={() => navigateAndClose('/brandscape')}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                    >
                      See All Strategic Tools →
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Creation Hub Accordion */}
              <div className="border rounded-md overflow-hidden">
                <button
                  onClick={() => setMobileCreationOpen(!mobileCreationOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    <span>Creation Hub</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileCreationOpen ? "transform rotate-180" : ""
                      }`}
                  />
                </button>
                {mobileCreationOpen && (
                  <div className="pl-8 pr-4 py-2 bg-gray-50 space-y-2">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500">
                      Content Creation
                    </div>
                    <button
                      onClick={() => navigateAndClose('/content-creator')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      📄 Content Creator
                    </button>
                    <button
                      onClick={() => navigateAndClose('/campaign-builder')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🚀 Campaign Builder
                    </button>
                    <button
                      onClick={() => navigateAndClose('/content-repurposer')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🔄 Content Repurposer
                    </button>
                    <button
                      onClick={() => navigateAndClose('/ab-test-generator')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      📊 A/B Test Generator
                    </button>

                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={() => navigateAndClose('/creation-hub')}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                    >
                      See All Creation Tools →
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Enhancement Studio Accordion */}
              <div className="border rounded-md overflow-hidden">
                <button
                  onClick={() => setMobileEnhancementOpen(!mobileEnhancementOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Enhancement Studio</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileEnhancementOpen ? "transform rotate-180" : ""
                      }`}
                  />
                </button>
                {mobileEnhancementOpen && (
                  <div className="pl-8 pr-4 py-2 bg-gray-50 space-y-2">
                    <button
                      onClick={() => navigateAndClose('/style-checker')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      📋 Style Guide Compliance
                    </button>
                    <button
                      onClick={() => navigateAndClose('/prose-perfector')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      ✨ Prose Perfector
                    </button>
                    <button
                      onClick={() => navigateAndClose('/content-humanizer')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      🤖 Content Humanizer
                    </button>

                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={() => navigateAndClose('/content-enhancer-tools')}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                    >
                      See All Enhancement Tools →
                    </button>
                  </div>
                )}
              </div>
              {/* Mobile Content Library Link */}
              <Link
                href="/content-library"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 ${router.pathname === "/content-library" ? "bg-blue-50 text-blue-700" : ""
                  }`}
              >
                <div className="flex items-center">
                  <Archive className="w-4 h-4 mr-2" />
                  <span>Content Library</span>
                </div>
              </Link>
              {/* Mobile Settings Link */}
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 ${router.pathname === "/settings" ? "bg-blue-50 text-blue-700" : ""
                  }`}
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </div>
              </Link>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 bg-gray-200 text-white flex justify-center items-center rounded-full">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsLogoutOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md text-center"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsRegisterOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isLoginOpen && (
        <LoginModal
          email={loginEmail}
          password={loginPassword}
          onEmailChange={(e) => setLoginEmail(e.target.value)}
          onPasswordChange={(e) => setLoginPassword(e.target.value)}
          onSubmit={handleLoginSubmit}
          onClose={() => setIsLoginOpen(false)}
          error={error}
        />
      )}

      {isRegisterOpen && (
        <RegistrationModal
          name={registerName}
          email={registerEmail}
          password={registerPassword}
          onNameChange={(e) => setRegisterName(e.target.value)}
          onEmailChange={(e) => setRegisterEmail(e.target.value)}
          onPasswordChange={(e) => setRegisterPassword(e.target.value)}
          onSubmit={handleRegisterSubmit}
          onClose={() => setIsRegisterOpen(false)}
          error={error}
        />
      )}
      {isLogoutOpen && (
        <LogoutConfirmModal
          isOpen={isLogoutOpen}
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={() => {
            logout();
            setIsLogoutOpen(false);
            router.push("/");
          }}
        />
      )}
    </header>
  );
};

export default Navbar;