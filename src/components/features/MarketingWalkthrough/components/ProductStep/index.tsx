// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
// Fixed version with wide layout matching other pages

import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Plus, X, Package } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

const ProductStep = () => {
  const { showNotification } = useNotification();
  const [productName, setProductName] = useState("");
  const [tagline, setTagline] = useState("");
  const [productType, setProductType] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('marketingProduct');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.name) setProductName(data.name);
        if (data.tagline) setTagline(data.tagline);
        if (data.type) setProductType(data.type);
        if (data.keyBenefits && Array.isArray(data.keyBenefits) && data.keyBenefits.length > 0) {
          setKeyBenefits(data.keyBenefits);
        }
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  useEffect(() => {
    if (!productName && !tagline && !productType && keyBenefits.length === 1 && !keyBenefits[0]) {
      return;
    }

    try {
      const productData = {
        name: productName,
        tagline: tagline,
        type: productType,
        keyBenefits: keyBenefits.filter(b => b.trim())
      };

      localStorage.setItem('marketingProduct', JSON.stringify(productData));
    } catch (error) {
      console.error("Error auto-saving:", error);
    }
  }, [productName, tagline, productType, keyBenefits]);

  const addBenefit = () => {
    setKeyBenefits([...keyBenefits, ""]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-8">
        <div className="space-y-6 w-full">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
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
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g., No more crappy content"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share a description of your business. Don't worry if it's not perfect.</label>
                <textarea
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="Describe the services or products you offer."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
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