// src/components/shared/SuccessModal.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItems: {
    type: string;
    title: string;
    format: string;
  }[];
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, contentItems }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = () => {
    // Here you'd integrate with your email service
    console.log('Sending email to:', email);
    setEmailSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl p-6 bg-white">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Content is Ready!</h2>
          <p className="text-slate-600">Choose how you'd like to receive your content:</p>
        </div>

        <div className="space-y-6 mb-6">
          {/* Download ZIP Option */}
          <div className="p-4 border rounded-lg hover:bg-slate-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Download Everything</h3>
                <p className="text-sm text-slate-600">Get all content in a single ZIP file</p>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <span>Download ZIP</span>
              </button>
            </div>
          </div>

          {/* Email Option */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Email Content Package</h3>
            {!emailSent ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">We'll send you everything by email</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>Email sent! Check your inbox.</span>
              </div>
            )}
          </div>

          {/* Individual Files List */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Individual Files</h3>
              <p className="text-sm text-slate-600">Download specific content pieces</p>
            </div>
            <div className="divide-y">
              {contentItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.format}</p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 hover:text-blue-700">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SuccessModal;