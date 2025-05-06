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
import { useAuth } from "../../../context/AuthContext";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, register, logout } = useAuth();
  const [strategicMenuOpen, setStrategicMenuOpen] = useState(false);
  const [creationMenuOpen, setCreationMenuOpen] = useState(false);
  const [enhancementMenuOpen, setEnhancementMenuOpen] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");

  const strategicMenuRef = useRef<HTMLDivElement>(null);
  const creationMenuRef = useRef<HTMLDivElement>(null);
  const enhancementMenuRef = useRef<HTMLDivElement>(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      setIsLoginOpen(false); // Close the login modal on success
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerName, registerEmail, registerPassword);
      setIsRegisterOpen(false); // Close the register modal on success
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

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/images/mcl-logo3.png"
                alt="Marketing Content Lab"
                width={300}
                height={84}
                className="h-8 w-auto"
              />
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
                    strategicMenuOpen
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Strategize
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${
                      strategicMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {strategicMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
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
                    creationMenuOpen
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Create
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${
                      creationMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {creationMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        href="/creation-hub"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setCreationMenuOpen(false)}
                      >
                        Creation Hub
                      </Link>
                      <Link
                        href="/content-creator-tools"
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
                    enhancementMenuOpen
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Enhance
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${
                      enhancementMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {enhancementMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
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

              {/* Templates */}
              <Link
                href="/templates"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                <span>Templates</span>
              </Link>

              {/* Settings */}
              <Link
                href="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center ${
                  router.pathname === "/settings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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

            {/* Login/Register */}
            {isAuthenticated ? (
              // User Profile on the right side corner add class to make it right aligned
              <div className="relative ml-6 flex items-center space-x-4">
                <button
                  onClick={() => {}}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600"
                >
                  <User className="w-6 h-6 text-gray-700" />
                  <span>{user?.name}</span>
                </button>
              </div>
            ) : (
              <div className="auth-links ml-6 flex items-center space-x-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="text-sm text-blue-600 hover:underline ml-4"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Login
              </h2>

              <div>
                <label
                  htmlFor="loginEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="loginPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Register
              </h2>

              <div>
                <label
                  htmlFor="registerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  placeholder="Enter your name"
                  id="registerName"
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="registerEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  placeholder="Enter your email"
                  id="registerEmail"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  placeholder="Enter your password"
                  id="registerPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
