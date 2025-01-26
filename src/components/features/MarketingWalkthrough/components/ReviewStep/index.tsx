// ReviewStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const ReviewStep = () => {
 const [checklist, setChecklist] = useState([
   { id: 1, label: 'Review goals and budget', completed: false },
   { id: 2, label: 'Confirm target persona', completed: false },
   { id: 3, label: 'Validate channel mix', completed: false },
   { id: 4, label: 'Check content strategy', completed: false },
   { id: 5, label: 'Approve timeline', completed: false }
 ]);

 return (
   <div className="space-y-6">
     <Card className="p-6">
       <h3 className="text-lg font-semibold mb-4">Launch Checklist</h3>
       {checklist.map((item) => (
         <div 
           key={item.id}
           onClick={() => {
             const newChecklist = checklist.map(i => 
               i.id === item.id ? {...i, completed: !i.completed} : i
             );
             setChecklist(newChecklist);
           }}
           className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50"
         >
           <input
             type="checkbox"
             checked={item.completed}
             readOnly
             className="h-4 w-4"
           />
           <span className={item.completed ? 'line-through text-gray-500' : ''}>
             {item.label}
           </span>
         </div>
       ))}
     </Card>

     <Card className="p-6">
       <h3 className="text-lg font-semibold mb-4">Summary</h3>
       <div className="space-y-4">
         <div className="flex justify-between">
           <span>Total Budget:</span>
           <span className="font-medium">$50,000</span>
         </div>
         <div className="flex justify-between">
           <span>Timeline:</span>
           <span className="font-medium">12 months</span>
         </div>
         <div className="flex justify-between">
           <span>Selected Channels:</span>
           <span className="font-medium">4</span>
         </div>
       </div>
     </Card>

     {checklist.every(item => item.completed) ? (
       <div className="p-4 bg-green-50 rounded-lg">
         <p className="text-sm text-green-800">
           ✅ Ready to launch your marketing program!
         </p>
       </div>
     ) : (
       <div className="p-4 bg-blue-50 rounded-lg">
         <p className="text-sm text-blue-800">
           Complete all checklist items to launch your program.
         </p>
       </div>
     )}
   </div>
 );
};

export default ReviewStep;