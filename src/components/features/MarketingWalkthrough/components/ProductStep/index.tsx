// src/components/features/MarketingWalkthrough/components/ProductStep/index.tsx
import React, { useState, useEffect } from "react";

const ProductStep = ({ onNext, onBack, onSkip, onExit }) => {
  console.log("🔍 ProductStep component is rendering...");

  const [productName, setProductName] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [keyBenefits, setKeyBenefits] = useState([""]);

  const userId = "user123"; // Replace with actual user ID when authentication is added

  useEffect(() => {
    console.log("🔍 Fetching product info...");
    fetch(`/api/product-info?userId=${userId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ API Response:", data);
        if (data.product) {
          setProductName(data.product.name || "");  
          setValueProposition(data.product.valueProposition || "");
          setKeyBenefits(data.product.keyBenefits?.length ? data.product.keyBenefits : [""]);
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching product info:", error);
      });
  }, []);

  const saveProductInfo = async () => {
    console.log("💾 Saving product info...");
    await fetch("/api/product-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        name: productName,
        valueProposition,
        keyBenefits,
      }),
    });

    console.log("✅ Product info saved!");
    onNext();
  };

  return (
    <div className="product-form">
      <h2 className="text-xl font-bold mb-4">Tell us about your product or service</h2>

      <div className="form-group">
        <label className="block font-medium">Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter your product name"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
      </div>

      <div className="form-group">
        <label className="block font-medium">Value Proposition:</label>
        <textarea
          value={valueProposition}
          onChange={(e) => setValueProposition(e.target.value)}
          placeholder="What makes your product unique?"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
      </div>

      <div className="form-group">
        <label className="block font-medium">Key Benefits:</label>
        {keyBenefits.map((benefit, index) => (
          <input
            key={index}
            type="text"
            value={benefit}
            onChange={(e) => {
              const updatedBenefits = [...keyBenefits];
              updatedBenefits[index] = e.target.value;
              setKeyBenefits(updatedBenefits);
            }}
            placeholder={`Benefit ${index + 1}`}
            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
          />
        ))}
        <button 
          onClick={() => setKeyBenefits([...keyBenefits, ""])} 
          className="text-blue-500 hover:underline mt-2"
        >
          + Add Benefit
        </button>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-700">← Back</button>
        <button onClick={onSkip} className="text-gray-500 hover:text-gray-700">Skip This Step</button>
        <button onClick={saveProductInfo} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Next →
        </button>
      </div>

      <div className="flex justify-center">
        <button onClick={onExit} className="mt-4 text-red-600 hover:text-red-800">
          Exit Walkthrough
        </button>
      </div>
    </div>
  );
};

export default ProductStep;
