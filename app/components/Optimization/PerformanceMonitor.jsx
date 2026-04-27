import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ onMetricUpdate }) => {
  const [metrics, setMetrics] = useState({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null
  });

  useEffect(() => {
    // Defer performance monitoring to reduce main thread blocking
    const startMonitoring = () => {
      // Use requestIdleCallback for non-blocking execution
      const scheduleMonitoring = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(measureWebVitals);
        } else {
          setTimeout(measureWebVitals, 100);
        }
      };

      const measureWebVitals = () => {
        try {
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

          // Measure First Input Delay (FID) - only if supported
          if ('PerformanceObserver' in window && 'first-input' in PerformanceObserver.supportedEntryTypes) {
            new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries();
              const firstEntry = entries[0];
              
              if (firstEntry) {
                setMetrics(prev => ({
                  ...prev,
                  fid: firstEntry.processingStart - firstEntry.startTime
                }));
                
                onMetricUpdate?.('FID', firstEntry.processingStart - firstEntry.startTime);
              }
            }).observe({ entryTypes: ['first-input'] });
          }

          // Measure Cumulative Layout Shift (CLS)
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            
            setMetrics(prev => ({
              ...prev,
              cls: clsValue
            }));
            
            onMetricUpdate?.('CLS', clsValue);
          }).observe({ entryTypes: ['layout-shift'] });

          // Measure First Contentful Paint (FCP)
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            
            if (fcpEntry) {
              setMetrics(prev => ({
                ...prev,
                fcp: fcpEntry.startTime
              }));
              
              onMetricUpdate?.('FCP', fcpEntry.startTime);
            }
          }).observe({ entryTypes: ['paint'] });
        } catch (error) {
          // Silently fail to avoid blocking main thread
          console.warn('Performance monitoring disabled:', error);
        }
      };

      scheduleMonitoring();
    };

    // Delay monitoring to not block initial render
    if (typeof window !== 'undefined') {
      const timer = setTimeout(startMonitoring, 1000);
      return () => clearTimeout(timer);
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
