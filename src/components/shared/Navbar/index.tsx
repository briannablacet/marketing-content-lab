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
import { useAuth } from "@/context/AuthContext";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
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

  return (
    <header className="bg-white shadow-sm">
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
                      <Link
                        href="/walkthrough/1"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Branding Wizard
                      </Link>
                      <Link
                        href="/messaging-framework"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Build Your Messaging
                      </Link>
                      <Link
                        href="/tagline-generator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tagline Generator
                      </Link>
                      <Link
                        href="/boilerplate-generator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Boilerplate Generator
                      </Link>
                      <Link
                        href="/brand-voice"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Brand Personality
                      </Link>
                      <Link
                        href="/writing-style"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Writing Style Configuration
                      </Link>
                      <Link
                        href="/competitive-analysis"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Competitive Analysis
                      </Link>
                    </div>
                  </div>
                )}
              </div>

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
                      <Link
                        href="/creation-hub"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Single Asset Generator
                      </Link>
                      <Link
                        href="/creation-hub/campaign"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Campaign Builder
                      </Link>
                      <Link
                        href="/creation-hub/repurposer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Content Repurposer
                      </Link>
                      <Link
                        href="/creation-hub/ab-test"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        A/B Test Generator
                      </Link>
                    </div>
                  </div>
                )}
              </div>

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
                      <Link
                        href="/content-enhancer-tools/prose-perfector"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Prose Perfector
                      </Link>
                      <Link
                        href="/content-enhancer-tools/style-checker"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Style Guide Compliance Checker
                      </Link>
                      <Link
                        href="/content-enhancer-tools/humanizer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Humanizer
                      </Link>
                    </div>
                  </div>
                )}
              </div>

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

          <div className="flex items-center">
            {isInWalkthrough ? (
              <button
                onClick={handleExitWalkthrough}
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                {" "}
                ✨ Exit Branding Wizard
              </button>
            ) : (
              <Link
                href="/walkthrough/1"
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                {" "}
                ✨ Branding Wizard
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative ml-6 flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600">
                  <User className="w-6 h-6 text-gray-700" />
                  <span>{user?.name}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div
                className="auth-links ml-6 flex items-center space-x-4"
                style={{ display: "flex", alignItems: "center" }}
              >
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
    </header>
  );
};

export default Navbar; 