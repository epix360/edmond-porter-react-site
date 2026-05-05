"use client";

import { useState, useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import Link from 'next/link';

export default function CookieConsent({ gaId }) {
  const [consentStatus, setConsentStatus] = useState('loading');

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie_consent');
    if (storedConsent) {
      setConsentStatus(storedConsent);
    } else {
      setConsentStatus('undecided');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setConsentStatus('granted');
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setConsentStatus('denied');
  };

  if (consentStatus === 'loading') return null;

  return (
    <>
      {consentStatus === 'granted' && <GoogleAnalytics gaId={gaId} />}

      {consentStatus === 'undecided' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-700 shadow-2xl">
          <div className="text-sm text-gray-300">
            We use cookies to analyze site traffic and improve your reading experience. 
            Read the <Link href="/privacy-policy" className="text-orange-400 hover:text-orange-300 underline">Privacy Policy</Link> for details.
          </div>
          <div className="flex gap-4 shrink-0">
            <button 
              onClick={declineCookies}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={acceptCookies}
              className="px-4 py-2 text-sm bg-orange-700 hover:bg-orange-600 text-white rounded transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
