import React, { createContext, useState, useContext, useEffect } from 'react';

const ExportContext = createContext();

const getInitialData = () => {
  const saved = localStorage.getItem("exportData");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return {
      url : null,
      urlHeading: null
    };
  }
};

export const ExportProvider = ({ children }) => {
  const [exportData, setExportData] = useState(getInitialData);

  useEffect(() => {
    localStorage.setItem("exportData", JSON.stringify(exportData));
    }, [exportData]);

  return (
    <ExportContext.Provider value={{ exportData, setExportData }}>
      {children}
    </ExportContext.Provider>
  );
};

export const useExportData = () => useContext(ExportContext);