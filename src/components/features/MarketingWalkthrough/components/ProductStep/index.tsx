// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
// DB-COMPATIBLE VERSION - Uses StrategicDataService for persistence

import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Plus, X, Package, Lightbulb } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import StrategicDataService from '../../../../../services/StrategicDataService';

const ProductStep = () => {
  const { showNotification } = useNotification();
  const [productName, setProductName] = useState("");
  const [tagline, setTagline] = useState("");
  const [productType, setProductType] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get all strategic data from the database
        const {
          productName: savedProductName,
          productDescription: savedProductType,
          tagline: savedTagline,
          keyBenefits: savedKeyBenefits
        } = StrategicDataService.getAllStrategicDataFromStorage();

        // Set the values if they exist
        if (savedProductName) setProductName(savedProductName);
        if (savedProductType) setProductType(savedProductType);
        if (savedTagline) setTagline(savedTagline);
        if (savedKeyBenefits && Array.isArray(savedKeyBenefits) && savedKeyBenefits.length > 0) {
          setKeyBenefits(savedKeyBenefits);
        }

        // Also check localStorage as a fallback for any legacy data
        try {
          const localData = localStorage.getItem('marketingProduct');
          if (localData) {
            const data = JSON.parse(localData);
            // Only use localStorage data if we don't have DB data
            if (!savedProductName && data.name) setProductName(data.name);
            if (!savedTagline && data.tagline) setTagline(data.tagline);
            if (!savedProductType && data.type) setProductType(data.type);
            if ((!savedKeyBenefits || savedKeyBenefits.length === 0) && data.keyBenefits?.length > 0) {
              setKeyBenefits(data.keyBenefits);
            }
          }

          // Check for tagline from tagline generator
          if (!savedTagline) {
            const brandTagline = localStorage.getItem('brandTagline');
            if (brandTagline) {
              setTagline(brandTagline);
            }
          }
        } catch (localStorageError) {
          console.error("Error reading localStorage fallback:", localStorageError);
        }

      } catch (error) {
        console.error("Error loading data from database:", error);
        showNotification?.("Error loading saved data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showNotification]);

  // Auto-save to database with debouncing
  useEffect(() => {
    if (isLoading) return; // Don't auto-save during initial load

    const timeoutId = setTimeout(async () => {
      try {
        // Save each field to the database
        if (productName.trim()) {
          await StrategicDataService.setStrategicDataValue('productName', productName);
        }

        if (tagline.trim()) {
          await StrategicDataService.setStrategicDataValue('tagline', tagline);
        }

        if (productType.trim()) {
          await StrategicDataService.setStrategicDataValue('productDescription', productType);
        }

        const filteredBenefits = keyBenefits.filter(b => b.trim());
        if (filteredBenefits.length > 0) {
          await StrategicDataService.setStrategicDataValue('keyBenefits', filteredBenefits);
        }

        // Also save to localStorage for immediate access by other components
        const productData = {
          name: productName,
          tagline: tagline,
          type: productType,
          keyBenefits: filteredBenefits
        };
        localStorage.setItem('marketingProduct', JSON.stringify(productData));

        if (tagline.trim()) {
          localStorage.setItem('brandTagline', tagline);
        }

      } catch (error) {
        console.error("Error auto-saving to database:", error);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [productName, tagline, productType, keyBenefits, isLoading]);

  const addBenefit = () => {
    setKeyBenefits([...keyBenefits, ""]);
  };

  // Handle tagline changes with immediate sync
  const handleTaglineChange = async (newTagline: string) => {
    setTagline(newTagline);

    // Immediately save to localStorage for cross-component compatibility
    if (newTagline.trim()) {
      localStorage.setItem('brandTagline', newTagline);
    }
  };

  // Manual save function (if you want a save button later)
  const handleManualSave = async () => {
    try {
      await Promise.all([
        StrategicDataService.setStrategicDataValue('productName', productName),
        StrategicDataService.setStrategicDataValue('tagline', tagline),
        StrategicDataService.setStrategicDataValue('productDescription', productType),
        StrategicDataService.setStrategicDataValue('keyBenefits', keyBenefits.filter(b => b.trim()))
      ]);

      showNotification?.("Product information saved successfully!", "success");
    } catch (error) {
      console.error("Error saving to database:", error);
      showNotification?.("Error saving product information", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
          <p className="text-gray-600">Loading your product information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-8">
        <div className="space-y-6 w-full">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
              <p className="text-sm text-gray-500 mt-1">Changes are automatically saved to your account</p>
            </div>
            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's the name of your business?</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter your business or brand name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tagline (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you already have a tagline? (Optional)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => handleTaglineChange(e.target.value)}
                  placeholder="e.g., No more crappy content"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* ENHANCED DESCRIPTION GUIDANCE */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Write Better Descriptions for Better AI Results</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Avoid marketing speak - describe what you actually do for customers:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-medium text-red-600 mb-2">❌ Avoid buzzword soup:</div>
                        <div className="space-y-1 text-red-700">
                          <div>"Leverage cutting-edge solutions to empower..."</div>
                          <div>"Transform your business with innovative..."</div>
                          <div>"Unlock potential through disruptive..."</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600 mb-2">✅ Use simple, clear language:</div>
                        <div className="space-y-1 text-green-700">
                          <div>"Accounting software for restaurants"</div>
                          <div>"CRM that helps sales teams track leads"</div>
                          <div>"App that schedules employee shifts"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share a description of your business. Don't worry if it's not perfect.</label>
                <textarea
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="Example: We make project management software for marketing teams. Our tool helps marketers plan campaigns, track deadlines, and collaborate with designers without endless email chains."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Explain what you do like you're talking to a friend, not writing a press release.
                </p>
              </div>

              {/* Key Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What are the main benefits for your clients?</label>
                <p className="text-sm text-gray-600 mb-4">
                  List the top benefits your clients or customers receive
                </p>
                <div className="space-y-3">
                  {keyBenefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const updated = [...keyBenefits];
                          updated[index] = e.target.value;
                          setKeyBenefits(updated);
                        }}
                        placeholder="e.g., Pain relief, Better sleep, Increased confidence"
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {keyBenefits.length > 1 && (
                        <button
                          onClick={() => setKeyBenefits(keyBenefits.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addBenefit}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Benefit
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductStep;