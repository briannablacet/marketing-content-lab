// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useNotification } from '../../../../../context/NotificationContext';

interface ProductStepProps {
  onNext?: () => void;
  onBack?: () => void;
  isWalkthrough?: boolean; // Add this prop to determine context
}

const ProductStep: React.FC<ProductStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Create a ref to track the newly added input field
  const newBenefitRef = useRef<HTMLInputElement>(null);
  // Track the index of the newly added field
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const userId = "user123"; // Replace with actual user ID when authentication is added

  useEffect(() => {
    fetch('/api/api_endpoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'product-info',
        data: { userId }
      })
    })
  }, []);

  // Effect to focus on newly added input when focusIndex changes
  useEffect(() => {
    if (focusIndex !== null && newBenefitRef.current) {
      newBenefitRef.current.focus();
      // Reset focus index after focusing
      setFocusIndex(null);
    }
  }, [focusIndex]);

  const handleGenerateValueProp = async () => {
    if (!productName || !productType || keyBenefits.filter(b => b.trim()).length === 0) {
      showNotification('warning', 'Please provide your business name, what you offer, and at least one benefit');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'generate-value-prop',
          data: {
            productName,
            productType,
            keyBenefits: keyBenefits.filter(b => b.trim())
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setValueProposition(data.valueProposition || 'Our business helps clients achieve their goals through our high-quality services and personalized approach.');
        showNotification('success', 'Generated value proposition based on your inputs');
      } else {
        throw new Error('Failed to generate value proposition');
      }
    } catch (error) {
      console.error('Error generating value proposition:', error);
      showNotification('error', 'Failed to generate. Using fallback suggestion.');

      // Provide a fallback value proposition
      setValueProposition(`${productName || 'Our business'} helps clients through ${productType || 'our services'} that deliver real results and exceptional customer experiences.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProductInfo = async () => {
    // Basic validation
    if (!productName.trim() || !productType.trim() || !valueProposition.trim()) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    if (!keyBenefits.some(benefit => benefit.trim())) {
      showNotification('error', 'Please add at least one key benefit');
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage first
      const productData = {
        name: productName,
        type: productType,
        valueProposition,
        keyBenefits: keyBenefits.filter(b => b.trim()),
      };

      localStorage.setItem('marketingProduct', JSON.stringify(productData));

      // Then try API call
      await fetch("/api/product-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...productData
        }),
      });

      showNotification('success', 'Business information saved successfully!');

      // If in walkthrough mode, proceed to next step
      if (isWalkthrough && onNext) {
        onNext();
      }
      // Otherwise just keep user on the page after saving
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving product info:", error);
      showNotification('error', 'Error saving to API, but data is stored locally');
      setIsSaving(false);
    }
  };

  // Updated to set focus index when adding a new benefit
  const addBenefit = () => {
    setKeyBenefits([...keyBenefits, ""]);
    // Set the focus index to the new last element
    setFocusIndex(keyBenefits.length);
  };

  return (
    <div className="space-y-6 w-full"> {/* Ensure full width */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Changed: Business Name Instead of Product/Service Name */}
          <div>
            <label className="block font-medium mb-2">What's the name of your business?</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter your business or brand name"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Changed: What You Offer Instead of Product Type */}
          <div>
            <label className="block font-medium mb-2">What services or products do you offer?</label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., Massage Therapy, Hair Salon, Coaching, Retail Store"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Key Benefits - Updated with auto-focus */}
          <div>
            <label className="block font-medium mb-2">What are the main benefits for your clients?</label>
            <p className="text-sm text-gray-600 mb-4">
              List the top benefits your clients or customers receive
            </p>
            <div className="space-y-3">
              {keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    // Add ref to the last element if it matches the focus index
                    ref={index === keyBenefits.length - 1 ? newBenefitRef : null}
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const updatedBenefits = [...keyBenefits];
                      updatedBenefits[index] = e.target.value;
                      setKeyBenefits(updatedBenefits);
                    }}
                    placeholder={`e.g., Pain relief, Better sleep, Increased confidence`}
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {keyBenefits.length > 1 && (
                    <button
                      onClick={() => setKeyBenefits(keyBenefits.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addBenefit}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Another Benefit
              </button>
            </div>
          </div>

          {/* Value Proposition - simplified wording */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Your Unique Value</label>
              <button
                onClick={handleGenerateValueProp}
                disabled={isGenerating}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Get AI Help'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              What makes your business special? Why should customers choose you?
            </p>
            <textarea
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              placeholder="Describe what sets your business apart from others"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          {/* Navigation controls */}
          {!isWalkthrough && (
            <div className="flex justify-between items-center pt-4 mt-6">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Dashboard
              </button>

              <button
                onClick={saveProductInfo}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  'Save Your Information'
                )}
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductStep;