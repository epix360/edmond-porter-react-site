'use client';

import emailjs from '@emailjs/browser';

// Import original CRA homepage
import HomePage from '@/src/components/HomePage';

// Initialize EmailJS with security features
emailjs.init({
  publicKey: 'HfqzXzg24u4VT7IwB',
  blockHeadless: true, // Prevents headless browser spam
  limitRate: {
    id: 'contact-form',
    throttle: 60000, // Users can only send 1 email every 60 seconds
  },
});

export default function HomePageClient() {
  return <HomePage />;
}
