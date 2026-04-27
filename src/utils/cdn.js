// jsDelivr CDN Asset Delivery Utility
// Provides environment-aware asset URLs for optimized CDN delivery

// Static repository configuration (hardcoded for browser compatibility)
const REPO_INFO = {
  user: 'epix360',
  repo: 'edmond-porter-react-site',
  version: '1.0.0',
  homepage: 'https://edmondaporter.com'
};

// Environment detection
const isDevelopment = () => {
  if (typeof window !== 'undefined') {
    // Only treat localhost and 127.0.0.1 as development
    // Custom domain should use CDN for production
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '' ||
      process.env.NODE_ENV === 'development'
    );
  }
  return process.env.NODE_ENV === 'development';
};

// Main CDN URL generation function
export const getAssetUrl = (path, options = {}) => {
  const { 
    useLocal = null, 
    version = null,
    branch = 'main',
    subdirectory = 'images'  // For local use
  } = options;
  
  // Normalize path - remove leading slash and ensure clean path
  const normalizedPath = path.replace(/^\//, '');
  
  // Determine whether to use local assets
  const shouldUseLocal = useLocal !== null ? useLocal : isDevelopment();
  
  if (shouldUseLocal) {
    // Serve from local public folder during development
    return `/${subdirectory}/${normalizedPath}`;
  }
  
  // Use jsDelivr CDN for production
  const targetVersion = version || REPO_INFO.version;
  const cdnVersion = targetVersion.startsWith('v') ? targetVersion : branch;
  
  // CDN needs to use public/images/ path
  const cdnSubdirectory = 'public/images';
  
  return `https://cdn.jsdelivr.net/gh/${REPO_INFO.user}/${REPO_INFO.repo}@${cdnVersion}/${cdnSubdirectory}/${normalizedPath}`;
};

// Legacy compatibility function to replace getImagePath
export const getImagePath = (path, options = {}) => {
  return getAssetUrl(path, options);
};

// CDN cache purging utility
export const purgeCdnCache = async (branch = 'main') => {
  try {
    const purgeUrl = `https://cdn.jsdelivr.net/gh/${REPO_INFO.user}/${REPO_INFO.repo}@${branch}/`;
    
    // In browser environment, we'll use a different approach
    if (typeof window !== 'undefined') {
      // Trigger cache invalidation by adding timestamp
      const timestamp = Date.now();
      return `${purgeUrl}?t=${timestamp}`;
    }
    
    // For server-side usage (like in GitHub Actions)
    const response = await fetch(purgeUrl, {
      method: 'PURGE',
      headers: {
        'User-Agent': 'edmond-porter-website-cdn-purge'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Failed to purge CDN cache:', error);
    return false;
  }
};

// Asset optimization utilities
export const getOptimizedImageUrl = (path, options = {}) => {
  const { 
    width, 
    height, 
    format = 'auto',
    quality = 80 
  } = options;
  
  let url = getAssetUrl(path, options);
  
  // Add jsDelivr image optimization parameters
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (format !== 'auto') params.append('f', format);
  if (quality !== 80) params.append('q', quality);
  
  if (params.toString()) {
    url += (url.includes('?') ? '&' : '?') + params.toString();
  }
  
  return url;
};

// Preload critical assets
export const preloadAsset = (path, options = {}) => {
  const url = getAssetUrl(path, options);
  
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = options.as || 'image';
    link.href = url;
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }
    
    document.head.appendChild(link);
  }
  
  return url;
};

// Export configuration for external use
export const CDN_CONFIG = {
  ...REPO_INFO,
  isDevelopment: isDevelopment(),
  baseUrl: `https://cdn.jsdelivr.net/gh/${REPO_INFO.user}/${REPO_INFO.repo}`,
  localAssetsPath: '/images'  // Fixed: removed 'public/' prefix for custom domain
};

export default {
  getAssetUrl,
  getImagePath,
  purgeCdnCache,
  getOptimizedImageUrl,
  preloadAsset,
  CDN_CONFIG
};
