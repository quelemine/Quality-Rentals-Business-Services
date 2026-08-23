import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_SITE_CONTENT, loadSiteContent, saveSiteContent, resetSiteContent } from '../data/siteContent';

const SiteContentContext = createContext();

export const SiteContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(() => loadSiteContent());

  const updateSiteContent = (nextContent) => {
    setSiteContent(nextContent);
    saveSiteContent(nextContent);
  };

  const resetContent = () => {
    const freshContent = resetSiteContent();
    setSiteContent(freshContent);
  };

  return (
    <SiteContentContext.Provider value={{ siteContent, setSiteContent: updateSiteContent, resetContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used inside SiteContentProvider');
  }

  return context;
};

export const getDefaultSiteContent = () => DEFAULT_SITE_CONTENT;
