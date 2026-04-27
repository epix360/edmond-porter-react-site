'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Declare dataLayer for Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    
    // Get GTM ID from environment variables
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    
    if (gtmId) {
      // Build the full path
      const search = searchParams ? searchParams.toString() : '';
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const pagePath = pathname + (search ? `?${search}` : '') + hash;
      
      // Trigger page_view event when route changes
      window.dataLayer.push({
        event: 'page_view',
        page_path: pagePath,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything - it's just for analytics
  return null;
};

export default Analytics;
