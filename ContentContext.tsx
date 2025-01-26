// src/context/ContentContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [selectedContentTypes, setSelectedContentTypes] = useState([]);
  
  return (
    <ContentContext.Provider value={{ selectedContentTypes, setSelectedContentTypes }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);