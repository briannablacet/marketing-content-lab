// src/components/features/MissionVisionGenerator/index.tsx

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, UploadCloud } from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';

const MissionVisionGenerator: React.FC = () => {
    const [input, setInput] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [audience, setAudience] = useState('');
    const [differentiator, setDifferentiator] = useState('');
    const [tagline, setTagline] = useState('');
    const [boilerplate, setBoilerplate] = useState('');
    const [valueProp, setValueProp] = useState('');
    const [upload, setUpload] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');

    useEffect(() => {
        const strategicData = StrategicDataService.get();
        if (strategicData) {
            setCompanyName(strategicData.companyName || '');
            setAudience(strategicData.idealCustomer || '');
            setTagline(strategicData.tagline || '');
            setBoilerplate(strategicData.boilerplate || '');
            setValueProp(strategicData.valueProp || '');
        }
    }, []);

    const handleGenerate = async () => {
        if (!companyName && !audience && !differentiator && !input) return;
        setIsLoading(true);
        try {
            const context = `Company: ${companyName}\nAudience: ${audience}\nDifferentiator: ${differentiator}\nValue Proposition: ${valueProp}\nTagline: ${tagline}\nBoilerplate: ${boilerplate}\nNotes: ${input}`;
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: `Generate a mission and vision based on:\n${context}` }),
            });

            const result = await response.json();
            setMission(result.mission || '');
            setVision(result.vision || '');
            StrategicDataService.setMission(result.mission);
            StrategicDataService.setVision(result.vision);
        } catch (err) {
            console.error('Generation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Craft your Mission and Vision</h1>
                <p className="text-sm text-gray-600">We'll use your existing strategic inputs—or you can add more context below—to generate strong foundational statements.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Generate your Mission and Vision</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Add more detail or specific instructions to help us shape your story.
                </p>

                <div className="grid gap-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <label className="text-sm font-medium text-gray-700">Target Audience</label>
                    <input
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                    />
                    <label className="text-sm font-medium text-gray-700">Key Differentiator</label>
                    <input
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={differentiator}
                        onChange={(e) => setDifferentiator(e.target.value)}
                    />
                    <label className="text-sm font-medium text-gray-700">Value Proposition</label>
                    <input
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={valueProp}
                        onChange={(e) => setValueProp(e.target.value)}
                    />
                    <label className="text-sm font-medium text-gray-700">Tagline</label>
                    <input
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                    />
                    <label className="text-sm font-medium text-gray-700">Boilerplate</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        rows={3}
                        value={boilerplate}
                        onChange={(e) => setBoilerplate(e.target.value)}
                    />
                    <label className="text-sm font-medium text-gray-700">Strategic Notes or Additional Context</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        rows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <label className="text-sm text-gray-700 flex items-center gap-2">
                        <UploadCloud size={16} /> Upload supporting material (optional)
                        <input
                            type="file"
                            className="ml-2 text-sm"
                            onChange={(e) => setUpload(e.target.files?.[0] || null)}
                        />
                    </label>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center"
                >
                    {isLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
                    {isLoading ? 'Generating...' : 'Generate Mission and Vision'}
                </button>

                {(mission || vision) && (
                    <div className="mt-6 space-y-4">
                        {mission && (
                            <div>
                                <h3 className="font-semibold text-gray-800">Mission</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{mission}</p>
                            </div>
                        )}
                        {vision && (
                            <div>
                                <h3 className="font-semibold text-gray-800">Vision</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{vision}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionVisionGenerator;
