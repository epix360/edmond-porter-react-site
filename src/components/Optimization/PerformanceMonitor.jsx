import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ onMetricUpdate }) => {
  const [metrics, setMetrics] = useState({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null
  });

  useEffect(() => {
    const measureWebVitals = () => {
      // Measure Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          setMetrics(prev => ({
            ...prev,
            lcp: lastEntry.startTime
          }));
          
          onMetricUpdate?.('LCP', lastEntry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            
            setMetrics(prev => ({
              ...prev,
              fid
            }));
            
            onMetricUpdate?.('FID', fid);
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Measure Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        setMetrics(prev => ({
          ...prev,
          cls: clsValue
        }));
        
        onMetricUpdate?.('CLS', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });

      // Measure First Contentful Paint (FCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstPaint = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (firstPaint) {
          setMetrics(prev => ({
            ...prev,
            fcp: firstPaint.startTime
          }));
          
          onMetricUpdate?.('FCP', firstPaint.startTime);
        }
      }).observe({ entryTypes: ['paint'] });
    };

    // Start measuring after page loads
    if (typeof window !== 'undefined' && 'performance' in window) {
      setTimeout(measureWebVitals, 1000);
    }
  }, [onMetricUpdate]);

  // Log performance warnings
  useEffect(() => {
    if (metrics.lcp && metrics.lcp > 2500) {
      console.warn('⚠️ Slow LCP detected:', metrics.lcp, 'ms (target: <2500ms)');
    }
    
    if (metrics.fid && metrics.fid > 100) {
      console.warn('⚠️ High FID detected:', metrics.fid, 'ms (target: <100ms)');
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      console.warn('⚠️ High CLS detected:', metrics.cls, ' (target: <0.1)');
    }
  }, [metrics]);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
