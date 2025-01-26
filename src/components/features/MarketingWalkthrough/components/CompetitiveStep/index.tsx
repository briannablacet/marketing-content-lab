// CompetitiveStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const CompetitiveStep = () => {
 const [competitors, setCompetitors] = useState([
   { name: '', strengths: '', weaknesses: '' }
 ]);

 const addCompetitor = () => {
   setCompetitors([...competitors, { name: '', strengths: '', weaknesses: '' }]);
 };

 return (
   <div className="space-y-6">
     {competitors.map((competitor, index) => (
       <Card key={index} className="p-6">
         <h3 className="text-lg font-semibold mb-4">Competitor {index + 1}</h3>
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium mb-1">Name</label>
             <input
               type="text"
               value={competitor.name}
               onChange={(e) => {
                 const newCompetitors = [...competitors];
                 newCompetitors[index].name = e.target.value;
                 setCompetitors(newCompetitors);
               }}
               className="w-full p-2 border rounded"
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Strengths</label>
             <textarea
               value={competitor.strengths}
               onChange={(e) => {
                 const newCompetitors = [...competitors];
                 newCompetitors[index].strengths = e.target.value;
                 setCompetitors(newCompetitors);
               }}
               className="w-full p-2 border rounded"
               rows={3}
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Weaknesses</label>
             <textarea
               value={competitor.weaknesses}
               onChange={(e) => {
                 const newCompetitors = [...competitors];
                 newCompetitors[index].weaknesses = e.target.value;
                 setCompetitors(newCompetitors);
               }}
               className="w-full p-2 border rounded"
               rows={3}
             />
           </div>
         </div>
       </Card>
     ))}
     <button
       onClick={addCompetitor}
       className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
     >
       + Add Another Competitor
     </button>
   </div>
 );
};

export default CompetitiveStep;