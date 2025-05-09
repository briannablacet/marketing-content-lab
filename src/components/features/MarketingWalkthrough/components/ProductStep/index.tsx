// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Sparkles, Plus, X } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

// A simple ProductStep component with NO navigation elements
const ProductStep = () => {
  const { showNotification } = useNotification();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing data if available
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('marketingProduct');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.name) setProductName(data.name);
        if (data.type) setProductType(data.type);
        if (data.valueProposition) setValueProposition(data.valueProposition);
        if (data.keyBenefits && Array.isArray(data.keyBenefits) && data.keyBenefits.length > 0) {
          setKeyBenefits(data.keyBenefits);
        }
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  // Auto-save data whenever it changes
  useEffect(() => {
    // Skip initial render
    if (!productName && !productType && !valueProposition && keyBenefits.length === 1 && !keyBenefits[0]) {
      return;
    }

    // Save data to localStorage
    try {
      const productData = {
        name: productName,
        type: productType,
        valueProposition: valueProposition,
        keyBenefits: keyBenefits.filter(b => b.trim())
      };

      localStorage.setItem('marketingProduct', JSON.stringify(productData));
      console.log("Auto-saved product data:", productData);
    } catch (error) {
      console.error("Error auto-saving:", error);
    }
  }, [productName, productType, valueProposition, keyBenefits]);

  const handleGenerateValueProp = async () => {
    if (!productName || !productType || keyBenefits.filter(b => b.trim()).length === 0) {
      showNotification('warning', 'Please provide your business name, what you offer, and at least one benefit');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/value-proposition`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          data: {
            productInfo: {
              name: productName,
              description: productType,
              benefits: keyBenefits.filter(b => b.trim()),
              targetAudience: ["Business customers"]
            },
            competitors: [],
            industry: 'technology',
            tone: 'professional'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate value proposition');
      }

      const data = await response.json();
      if (data.valueProposition) {
        setValueProposition(data.valueProposition);
        showNotification('success', 'Generated value proposition based on your inputs');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Failed to generate value proposition');
    } finally {
      setIsGenerating(false);
    }
  };

  const addBenefit = () => {
    setKeyBenefits([...keyBenefits, ""]);
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Business Name Input */}
          <div>
            <label className="block font-medium mb-2">What's the name of your business?</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter your business or brand name"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Product Type Input */}
          <div>
            <label className="block font-medium mb-2">What services or products do you offer?</label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., Massage Therapy, Hair Salon, Coaching, Retail Store"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Key Benefits */}
          <div>
            <label className="block font-medium mb-2">What are the main benefits for your clients?</label>
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
                      const updatedBenefits = [...keyBenefits];
                      updatedBenefits[index] = e.target.value;
                      setKeyBenefits(updatedBenefits);
                    }}
                    placeholder={`e.g., Pain relief, Better sleep, Increased confidence`}
                    className="flex-1 p-2 border rounded-lg"
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

          {/* Value Proposition */}
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
              className="w-full p-2 border rounded-lg"
              rows={4}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductStep;