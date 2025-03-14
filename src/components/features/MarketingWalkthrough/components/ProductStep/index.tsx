// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
import React, { useState, useEffect } from "react";
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

  const userId = "user123"; // Replace with actual user ID when authentication is added

  useEffect(() => {
    fetch(`/api/product-info?userId=${userId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProductName(data.product.name || "");
          setProductType(data.product.type || "");
          setValueProposition(data.product.valueProposition || "");
          setKeyBenefits(data.product.keyBenefits?.length ? data.product.keyBenefits : [""]);
        }
      })
      .catch((error) => {
        console.error("Error fetching product info:", error);
      });
  }, []);

  const handleGenerateValueProp = async () => {
    if (!productName || !productType || keyBenefits.filter(b => b.trim()).length === 0) {
      showNotification('warning', 'Please provide product name, type, and at least one benefit');
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
        setValueProposition(data.valueProposition || 'Our platform helps businesses create and execute effective marketing strategies with AI assistance.');
        showNotification('success', 'Generated value proposition based on your inputs');
      } else {
        throw new Error('Failed to generate value proposition');
      }
    } catch (error) {
      console.error('Error generating value proposition:', error);
      showNotification('error', 'Failed to generate. Using fallback suggestion.');
      
      // Provide a fallback value proposition
      setValueProposition(`${productName || 'Our solution'} helps ${productType || 'businesses'} achieve better results through streamlined processes and enhanced capabilities.`);
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
      
      showNotification('success', 'Product information saved successfully!');
      
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

  return (
    <div className="space-y-6 w-full"> {/* Ensure full width */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Product/Service Details */}
          <div>
            <label className="block font-medium mb-2">What's your product or service called?</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter the name of your product or service"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">What type of product/service is it?</label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., SaaS, Consulting Service, Physical Product"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Key Benefits */}
          <div>
            <label className="block font-medium mb-2">What are the key benefits?</label>
            <p className="text-sm text-gray-600 mb-4">
              List the main benefits your product/service provides to users
            </p>
            <div className="space-y-3">
              {keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const updatedBenefits = [...keyBenefits];
                      updatedBenefits[index] = e.target.value;
                      setKeyBenefits(updatedBenefits);
                    }}
                    placeholder={`Benefit ${index + 1}`}
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
                onClick={() => setKeyBenefits([...keyBenefits, ""])}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Another Benefit
              </button>
            </div>
          </div>

          {/* Value Proposition */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Value Proposition</label>
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
              What makes your solution extraordinary? What unique value do you provide?
            </p>
            <textarea
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              placeholder="Enter your value proposition"
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
                  'Save Product Information'
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