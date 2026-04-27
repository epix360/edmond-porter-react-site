import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Declare dataLayer for Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    
    // Get GTM ID from environment variables
    const gtmId = process.env.REACT_APP_GTM_ID;
    
    if (gtmId) {
      // Trigger page_view event when route changes
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search + location.hash,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location.pathname, location.search, location.hash]);

  // This component doesn't render anything - it's just for analytics
  return null;
};

export default Analytics;
