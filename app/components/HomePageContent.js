'use client';

import emailjs from '@emailjs/browser';

// Import original CRA homepage - but we'll need a version without the Medium section
// For now, let's create a wrapper that renders the HomePage but hides the Medium section via CSS
// or we can modify the approach

// Initialize EmailJS with security features
emailjs.init({
  publicKey: 'HfqzXzg24u4VT7IwB',
  blockHeadless: true,
  limitRate: {
    id: 'contact-form',
    throttle: 60000,
  },
});

// Import the original HomePage
import HomePage from '@/src/components/HomePage';

export default function HomePageContent() {
  return <HomePage />;
}
