'use client';

import React, { useState } from 'react';
import Footer from '@/src/components/Footer';
import { useCMSContent, fallbackContent } from '@/src/hooks/useCMSContent';

// Google Apps Script endpoint
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyB9lKwi9FHadaQ_jrKhJdwW29B2dyEX2fqkVi8E1xNwg5TuPSbhBxBsgCt_QB4618IA/exec";

export default function HomePageBottom() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization_name: '' // Honeypot field
  });
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load CMS content with fallback
  const { content: hero, loading: heroLoading } = useCMSContent('hero');
  const heroContent = hero || fallbackContent.hero || {};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Honeypot check
    if (formData.get("organization_name")) {
      return;
    }
    
    setSubmissionStatus("sending");
    setErrorMessage('');
    
    try {
      // Import emailjs dynamically
      const emailjs = (await import('@emailjs/browser')).default;
      
      const [emailResponse, sheetResponse] = await Promise.allSettled([
        emailjs.sendForm('service_g5clgej', 'template_2flsjn5', form),
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams(formData),
        })
      ]);
      
      if (emailResponse.status === 'rejected' && emailResponse.reason.status === 429) {
        setErrorMessage("Please wait a minute before sending another message.");
        setSubmissionStatus("error");
        return;
      }
      
      if (emailResponse.status === 'rejected') {
        setErrorMessage("Failed to send email. Please try again.");
        setSubmissionStatus("error");
        return;
      }
      
      setSubmissionStatus("success");
      form.reset();
      
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      setSubmissionStatus("error");
    }
  };

  return (
    <>
      {/* Newsletter / Contact Section */}
      <section className="py-20 bg-primary" id="contact">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-on-primary-container text-lg mb-10 font-light">For media inquiries, speaking engagements, or just to say hello.</p>
          <form className="max-w-2xl mx-auto space-y-6 text-left" onSubmit={handleSubmit}>
            {/* Honeypot field */}
            <div className="absolute opacity-0 -z-10 h-0 w-0 pointer-events-none">
              <input
                type="text"
                name="organization_name"
                tabIndex="-1"
                aria-hidden="true"
                autoComplete="off"
                value={formData.organization_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 resize-none"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={submissionStatus === "sending"}
                className="inline-flex items-center bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#96643c] transition-colors shadow-lg disabled:opacity-50"
              >
                {submissionStatus === "sending" ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="material-symbols-outlined ml-2">mail</span>
                  </>
                )}
              </button>
            </div>
            
            {submissionStatus === "success" && (
              <p className="text-green-300 text-center">Message sent successfully!</p>
            )}
            {submissionStatus === "error" && (
              <p className="text-red-300 text-center">{errorMessage || "Failed to send message. Please try again."}</p>
            )}
          </form>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
