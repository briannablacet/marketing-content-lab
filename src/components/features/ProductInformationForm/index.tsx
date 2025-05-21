/**
 * File: src/components/features/ProductInformationForm/index.tsx
 * 
 * Product Information Form Component
 * This component provides a form interface for users to input and edit product information.
 * It integrates with MarketingContext for state management and NotificationContext for user feedback.
 */

import React, { useState, useEffect } from 'react';
import { useMarketing, useMarketingActions, type ProductInfo } from '../../../context/MarketingContext';
import { useNotification } from '../../../context/NotificationContext';

export default function ProductInformationForm() {
  const { state } = useMarketing();
  const { setProductInfo } = useMarketingActions();
  const { showNotification } = useNotification();
  
  // Local state for form
  const [formData, setFormData] = useState<ProductInfo>({
    name: '',
    type: '',
    valueProposition: '',
    keyBenefits: [''],
  });

  // Load existing data if available
  useEffect(() => {
    if (state.productInfo) {
      setFormData(state.productInfo);
    }
  }, [state.productInfo]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProductInfo(formData);
    showNotification('Product information saved successfully!', 'success');
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle key benefits changes
  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.keyBenefits];
    newBenefits[index] = value;
    setFormData(prev => ({
      ...prev,
      keyBenefits: newBenefits
    }));
  };

  // Add new benefit field
  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      keyBenefits: [...prev.keyBenefits, '']
    }));
  };

  // Remove benefit field
  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyBenefits: prev.keyBenefits.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Product Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Product Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Product Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Value Proposition */}
        <div>
          <label htmlFor="valueProposition" className="block text-sm font-medium text-gray-700">
            Value Proposition
          </label>
          <textarea
            id="valueProposition"
            name="valueProposition"
            value={formData.valueProposition}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Key Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Benefits
          </label>
          {formData.keyBenefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Benefit ${index + 1}`}
              />
              {formData.keyBenefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {formData.keyBenefits.length < 5 && (
            <button
              type="button"
              onClick={addBenefit}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Another Benefit
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Product Information
          </button>
        </div>
      </form>
    </div>
  );
}