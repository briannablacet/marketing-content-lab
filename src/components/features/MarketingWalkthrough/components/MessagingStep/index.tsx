// MessagingStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const MessagingStep = () => {
 const [messages, setMessages] = useState({
   valueProposition: '',
   differentiators: ['', '', ''],
   keyBenefits: ['', '', '']
 });

 return (
   <div className="space-y-6">
     <Card className="p-6">
       <h3 className="text-lg font-semibold mb-4">Value Proposition</h3>
       <textarea
         value={messages.valueProposition}
         onChange={(e) => setMessages({...messages, valueProposition: e.target.value})}
         className="w-full p-2 border rounded"
         rows={4}
         placeholder="What makes your solution extraordinary?"
       />
     </Card>

     <Card className="p-6">
       <h3 className="text-lg font-semibold mb-4">Key Differentiators</h3>
       {messages.differentiators.map((diff, index) => (
         <div key={index} className="mb-4">
           <input
             value={diff}
             onChange={(e) => {
               const newDiffs = [...messages.differentiators];
               newDiffs[index] = e.target.value;
               setMessages({...messages, differentiators: newDiffs});
             }}
             className="w-full p-2 border rounded"
             placeholder={`Differentiator ${index + 1}`}
           />
         </div>
       ))}
     </Card>

     <Card className="p-6">
       <h3 className="text-lg font-semibold mb-4">Key Benefits</h3>
       {messages.keyBenefits.map((benefit, index) => (
         <div key={index} className="mb-4">
           <input
             value={benefit}
             onChange={(e) => {
               const newBenefits = [...messages.keyBenefits];
               newBenefits[index] = e.target.value;
               setMessages({...messages, keyBenefits: newBenefits});
             }}
             className="w-full p-2 border rounded"
             placeholder={`Benefit ${index + 1}`}
           />
         </div>
       ))}
     </Card>
   </div>
 );
};

export default MessagingStep;