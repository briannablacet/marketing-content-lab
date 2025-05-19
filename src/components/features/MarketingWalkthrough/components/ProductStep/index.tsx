import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
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
    <div className="space-y-6 w-full">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Business Name */}
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

          {/* Tagline (optional) */}
          <div>
            <label className="block font-medium mb-2">Do you already have a tagline? (Optional)</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g., No more crappy content"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block font-medium mb-2">Share a description of your business. Don't worry if it's not perfect.</label>
            <textarea
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="Describe the services or products you offer."
              className="w-full p-2 border rounded-lg"
              rows={4}
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
                      const updated = [...keyBenefits];
                      updated[index] = e.target.value;
                      setKeyBenefits(updated);
                    }}
                    placeholder="e.g., Pain relief, Better sleep, Increased confidence"
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
        </div>
      </Card>
    </div>
  );
};

export default ProductStep;
