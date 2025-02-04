// src/components/features/ContentEngine/screens/KeyMessages.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KeyMessagesProps {
  onMessagesUpdate: (messages: Record<string, string>) => void;
}

const KeyMessages: React.FC<KeyMessagesProps> = ({ onMessagesUpdate }) => {
  const [messages, setMessages] = useState({
    primary: '',
    supporting1: '',
    supporting2: '',
    supporting3: '',
    cta: ''
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Define Key Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Message</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={messages.primary}
                onChange={(e) => {
                  const newMessages = { ...messages, primary: e.target.value };
                  setMessages(newMessages);
                  onMessagesUpdate(newMessages);
                }}
                placeholder="What's the main message you want to convey?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Supporting Points</label>
              <div className="space-y-4">
                {['supporting1', 'supporting2', 'supporting3'].map((field, index) => (
                  <textarea
                    key={field}
                    className="w-full p-2 border rounded"
                    rows={2}
                    value={messages[field]}
                    onChange={(e) => {
                      const newMessages = { ...messages, [field]: e.target.value };
                      setMessages(newMessages);
                      onMessagesUpdate(newMessages);
                    }}
                    placeholder={`Supporting point ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Call to Action</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={messages.cta}
                onChange={(e) => {
                  const newMessages = { ...messages, cta: e.target.value };
                  setMessages(newMessages);
                  onMessagesUpdate(newMessages);
                }}
                placeholder="What action should readers take?"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMessages;