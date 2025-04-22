// src/components/Debug/LocalStorageViewer.jsx
import React, { useState, useEffect } from 'react';

const LocalStorageViewer = () => {
    const [storageItems, setStorageItems] = useState({});

    useEffect(() => {
        const items = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                items[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                items[key] = localStorage.getItem(key);
            }
        }
        setStorageItems(items);
    }, []);

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold mb-4">LocalStorage Contents</h3>
            {Object.keys(storageItems).length > 0 ? (
                Object.keys(storageItems).map(key => (
                    <div key={key} className="mb-4">
                        <div className="font-medium text-blue-600">{key}</div>
                        <pre className="bg-white p-2 rounded text-xs mt-1 overflow-auto max-h-40">
                            {JSON.stringify(storageItems[key], null, 2)}
                        </pre>
                    </div>
                ))
            ) : (
                <p>No items in localStorage</p>
            )}
        </div>
    );
};

export default LocalStorageViewer;