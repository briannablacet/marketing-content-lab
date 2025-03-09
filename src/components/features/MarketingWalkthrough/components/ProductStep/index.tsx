// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X, Loader } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

interface ProductStepProps {
  onNext: () => void;
  onBack: () => void;
  isWalkthrough?: boolean;
}

const ProductStep: React.FC<ProductStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const { showNotification } = useNotification();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedValueProp, setEnhancedValueProp] = useState("");
  
  // State to track if we're showing the enhanced value proposition
  const [showEnhancedValueProp, setShowEnhancedValueProp] = useState(false);
  // State to track if product info has been saved
  const [isSaved, setIsSaved] = useState(false);

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

  // When in walkthrough mode, save data and proceed automatically when values change significantly
  useEffect(() => {
    // Only auto-save if we're in walkthrough mode AND some key data has been entered
    if (isWalkthrough && isSaved && productName && valueProposition) {
      saveProductInfo(false); // Update without notifications
    }
  }, [productName, productType, valueProposition, keyBenefits]);

  const handleGenerateValueProp = async () => {
    // Check if there's enough information to generate a meaningful value proposition
    if (!productName.trim() && !productType.trim() && keyBenefits.filter(b => b.trim()).length === 0) {
      showNotification('error', 'Please provide at least your product name, type, or some key benefits first.');
      return;
    }

    setIsGenerating(true);
    setShowEnhancedValueProp(false);
    setEnhancedValueProp("");

    try {
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'value-proposition-generator',
          data: {
            productInfo: {
              name: productName,
              description: valueProposition || "A product in the " + productType + " category",
              benefits: keyBenefits.filter(b => b.trim()),
              targetAudience: []
            },
            industry: productType || "technology"
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnhancedValueProp(data.valueProposition);
        setShowEnhancedValueProp(true);
        showNotification('success', 'Value proposition enhanced with AI assistance!');
      } else {
        throw new Error('Failed to enhance value proposition');
      }
    } catch (error) {
      console.error('Error enhancing value proposition:', error);
      showNotification('error', 'Failed to enhance your value proposition. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptEnhancedValueProp = () => {
    setValueProposition(enhancedValueProp);
    setShowEnhancedValueProp(false);
    showNotification('success', 'Enhanced value proposition applied!');
  };

  const saveProductInfo = async (notify = true) => {
    try {
      const response = await fetch("/api/product-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: productName,
          type: productType,
          valueProposition,
          keyBenefits: keyBenefits.filter(b => b.trim()),
        }),
      });
      
      if (response.ok) {
        setIsSaved(true);
        if (notify) {
          showNotification('success', 'Product information saved!');
          onNext();
        }
      }
    } catch (error) {
      console.error("Error saving product info:", error);
      if (notify) {
        showNotification('error', 'Failed to save product information. Please try again.');
      }
    }
  };

  const handleContinue = () => {
    saveProductInfo(true);
  };

  const addBenefit = () => {
    setKeyBenefits([...keyBenefits, ""]);
  };

  const updateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...keyBenefits];
    updatedBenefits[index] = value;
    setKeyBenefits(updatedBenefits);
  };

  const removeBenefit = (index: number) => {
    setKeyBenefits(keyBenefits.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">What type of product/service is it?</label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., SaaS, Consulting Service, Physical Product"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {keyBenefits.length > 1 && (
                    <button
                      onClick={() => removeBenefit(index)}
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

          {/* Value Proposition */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Value Proposition</label>
              <button
                onClick={handleGenerateValueProp}
                disabled={isGenerating}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Enhance with AI
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              What makes your solution extraordinary? What unique value do you provide?
            </p>
            
            {/* Current Value Proposition Input */}
            <textarea
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              placeholder="Enter your value proposition"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              rows={4}
            />

            {/* Enhanced Value Proposition (Only shown when available) */}
            {showEnhancedValueProp && enhancedValueProp && (
              <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center mb-2">
                  <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
                  <h4 className="font-medium text-blue-800">AI-Enhanced Value Proposition</h4>
                </div>
                <p className="text-gray-800 mb-3">{enhancedValueProp}</p>
                <button
                  onClick={acceptEnhancedValueProp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Version
                </button>
              </div>
            )}
          </div>

          {/* Navigation Buttons - ONLY SHOWN WHEN NOT IN WALKTHROUGH MODE */}
          {!isWalkthrough && (
            <div className="flex justify-between pt-4">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!productName.trim() || !valueProposition.trim()}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductStep;