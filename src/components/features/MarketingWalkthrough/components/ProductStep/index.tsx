// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx

import React, { useState, useEffect } from "react";
import { Card } from '../../../../ui/card';
import { Sparkles, Plus, X, Loader } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import { useRouter } from 'next/router';

interface ProductStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

const ProductStep: React.FC<ProductStepProps> = ({ onNext, onBack }) => {
  const { showNotification } = useNotification();
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if we're in the walkthrough based on the route
  const isWalkthrough = router.pathname.includes('/walkthrough');
  
  const userId = "user123"; // Replace with actual user ID when authentication is added

  useEffect(() => {
    // Try to load from localStorage first
    const savedInfo = localStorage.getItem('marketingProductInfo');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setProductName(parsedInfo.name || "");
        setProductType(parsedInfo.type || "");
        setValueProposition(parsedInfo.valueProposition || "");
        setKeyBenefits(parsedInfo.keyBenefits?.length ? parsedInfo.keyBenefits : [""]);
        return; // Skip API call if we have local data
      } catch (error) {
        console.error("Error parsing local product info:", error);
      }
    }

    // Fallback to API if no local data
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

  // Save to localStorage whenever values change
  useEffect(() => {
    if (productName || productType || valueProposition || keyBenefits.some(b => b.trim())) {
      const productInfo = {
        name: productName,
        type: productType,
        valueProposition,
        keyBenefits: keyBenefits.filter(b => b.trim()),
      };
      localStorage.setItem('marketingProductInfo', JSON.stringify(productInfo));
    }
  }, [productName, productType, valueProposition, keyBenefits]);

  const handleGenerateValueProp = async () => {
    // Don't run if we don't have enough info
    if (!productName.trim() && !productType.trim() && !keyBenefits.some(b => b.trim())) {
      showNotification('warning', 'Please add at least a product name, type or key benefit first');
      return;
    }

    setIsGenerating(true);
    try {
      const requestBody = {
        endpoint: 'value-proposition-generator',
        data: {
          productName,
          productType,
          keyBenefits: keyBenefits.filter(b => b.trim())
        }
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      if (data.valueProposition) {
        setValueProposition(data.valueProposition);
        showNotification('success', 'Generated value proposition based on your inputs');
      } else {
        throw new Error('API returned an invalid response');
      }
    } catch (error) {
      console.error('Error generating value proposition:', error);
      showNotification('error', 'Could not generate value proposition. Please try again.');
      
      // Fallback for testing purposes
      if (productName && productType) {
        setValueProposition(`${productName} is a ${productType} that helps you achieve better results with less effort. Our solution empowers you to overcome challenges and reach your goals faster.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProductInfo = async () => {
    // Basic validation
    if (!productName.trim()) {
      showNotification('error', 'Please provide a product name');
      return;
    }
    
    if (!productType.trim()) {
      showNotification('error', 'Please provide a product type');
      return;
    }
    
    if (!keyBenefits.some(b => b.trim())) {
      showNotification('error', 'Please provide at least one key benefit');
      return;
    }
    
    try {
      await fetch("/api/product-info", {
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
      
      showNotification('success', 'Product information saved successfully');
      if (onNext) onNext();
    } catch (error) {
      console.error('Error saving product info:', error);
      showNotification('error', 'Failed to save product information. Continuing anyway.');
      if (onNext) onNext(); // Still proceed to the next step
    }
  };

  return (
    <div className="space-y-6 w-full">
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
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get AI Help
                  </>
                )}
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
          
          {/* Only show Continue button in walkthrough mode */}
          {isWalkthrough && (
            <div className="flex justify-end pt-4">
              <button
                onClick={saveProductInfo}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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