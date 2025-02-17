// src/pages/test-product-info.tsx
import React, { useState } from 'react';

interface ProductInfo {
  name: string;
  type: string;
  valueProposition: string;
  keyBenefits: string[];
  _id?: string;
}

const TestProductInfo: React.FC = () => {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Test creating product info
  const createProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/product-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Market Multiplier",
          type: "SaaS Platform",
          valueProposition: "AI-powered marketing program builder for SMBs",
          keyBenefits: [
            "Saves time in marketing planning",
            "AI-enhanced content creation",
            "Comprehensive program building"
          ]
        }),
      });
      const data = await response.json();
      if (data.success) {
        setProductInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to create product info');
      }
    } catch (err) {
      setError('Failed to create product info');
    } finally {
      setLoading(false);
    }
  };

  // Test getting product info
  const getProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/product-info');
      const data = await response.json();
      if (data.success) {
        setProductInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch product info');
      }
    } catch (err) {
      setError('Failed to fetch product info');
    } finally {
      setLoading(false);
    }
  };

  // Test updating product info
  const updateProduct = async () => {
    if (!productInfo?._id) return;
    try {
      setLoading(true);
      const response = await fetch('/api/product-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productInfo,
          valueProposition: productInfo.valueProposition + " (Updated!)"
        }),
      });
      const data = await response.json();
      if (data.success) {
        setProductInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to update product info');
      }
    } catch (err) {
      setError('Failed to update product info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Info API Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-x-4 mb-6">
        <button
          onClick={createProduct}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Create Product
        </button>
        
        <button
          onClick={getProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Get Product
        </button>
        
        <button
          onClick={updateProduct}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          disabled={loading || !productInfo}
        >
          Update Product (Update Value Prop)
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {productInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Product Info:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(productInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestProductInfo;