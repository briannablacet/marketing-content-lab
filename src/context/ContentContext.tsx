import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [selectedContentTypes, setSelectedContentTypes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedContentTypes');
    if (saved) setSelectedContentTypes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedContentTypes', JSON.stringify(selectedContentTypes));
  }, [selectedContentTypes]);

  useEffect(() => {
    console.log('ContentStrategyStep useEffect:', selectedContentTypes);
  }, [selectedContentTypes]);

  return (
    <ContentContext.Provider value={{ selectedContentTypes, setSelectedContentTypes }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  console.log('useContent:', context.selectedContentTypes);
  return context;
};