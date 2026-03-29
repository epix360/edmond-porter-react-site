import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MediumFeed from '../components/MediumFeed';
import Head from '../components/Head';
import StructuredData from '../components/SEO/StructuredData';
import LazyImage from '../components/Optimization/LazyImage';
import AccessibleImage from '../components/Accessibility/AccessibleImage';
import { getImagePath as getAssetPath, CDN_CONFIG } from '../utils/cdn';
import emailjs from '@emailjs/browser';
import { useCMSContent, fallbackContent } from '../hooks/useCMSContent';

// Preload hero image for LCP optimization
const preloadHeroImage = (imagePath) => {
  if (typeof window !== 'undefined' && imagePath) {
    // Use mobile image for mobile devices
    const isMobile = window.innerWidth <= 768;
    const heroImage = isMobile && heroContent?.mobileCover ? heroContent.mobileCover : imagePath;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = heroImage;
    link.as = 'image';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }
};

// Helper function for consistent image paths (now using CDN)
const getImagePath = (path) => getAssetPath(path);

// Status template configurations
const getStatusTemplate = (status, showSpecificDate, releaseDate, customDateText) => {
  const templates = {
    "coming-soon": { 
      icon: "calendar_today", 
      text: getComingSoonText(showSpecificDate, releaseDate, customDateText), 
      color: "text-secondary-fixed-dim",
      label: "Coming Soon"
    },
    "new-release": { 
      icon: "auto_awesome", 
      text: "New Release!", 
      color: "text-secondary",
      label: "Just Released"
    },
    "bestseller": { 
      icon: "military_tech", 
      text: "Bestseller", 
      color: "text-amber-600",
      label: "Bestselling Book"
    },
    "available": { 
      icon: "check_circle", 
      text: "Available Now", 
      color: "text-green-600",
      label: "Available Now"
    }
  };
  return templates[status] || null;
};

// Helper function to format coming soon text
const getComingSoonText = (showSpecificDate, releaseDate, customDateText) => {
  if (!showSpecificDate || !releaseDate) {
    return "Coming Soon";
  }
  
  // Use custom text if provided
  if (customDateText && customDateText.trim()) {
    return customDateText.trim();
  }
  
  // Default date formatting
  try {
    // Parse the date string to avoid timezone issues
    const date = new Date(releaseDate + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return "Coming Soon";
    }
    
    // Validate that date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date <= today) {
      return "Available Now";
    }
    
    // Format as "Month Day, Year" without timezone conversion
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `Available ${month} ${day}, ${year}`;
  } catch (error) {
    return "Coming Soon";
  }
};

const HomePage = () => {
    // Load CMS content
    const { content: hero, loading: heroLoading, error: heroError } = useCMSContent('hero');
    const { content: books, loading: booksLoading, error: booksError } = useCMSContent('books');
    const { content: homeBio, loading: homeBioLoading, error: homeBioError } = useCMSContent('home-bio');
    const { content: mediumSection, loading: mediumLoading, error: mediumError } = useCMSContent('medium-section');
    
    // Use fallback content if CMS fails
    const heroContent = hero || fallbackContent.hero;
    const booksContent = books || fallbackContent.books;
    const homeBioContent = homeBio || fallbackContent.homeBio;
    const mediumContent = mediumSection || fallbackContent.mediumSection;
    
    // Get status template
    const statusTemplate = getStatusTemplate(
        heroContent.bookStatus, 
        heroContent.showSpecificDate, 
        heroContent.releaseDate, 
        heroContent.customDateText
    );
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Preload hero image for LCP optimization
    useEffect(() => {
        if (heroContent?.cover) {
            // Use mobile image for mobile devices
            const isMobile = window.innerWidth <= 768;
            const heroImage = isMobile && heroContent.mobileCover ? heroContent.mobileCover : heroContent.cover;
            
            const link = document.createElement('link');
            link.rel = 'preload';
            // Use correct path for mobile vs desktop
            link.href = getImagePath(heroImage);
            link.as = 'image';
            link.fetchPriority = 'high';
            document.head.appendChild(link);
            
            // Only preload if it's the mobile version being used
            if (isMobile && heroContent.mobileCover) {
                // Mobile image preloaded silently
            }
        }
    }, [heroContent]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            // You'll need to configure these values with your EmailJS account
            const result = await emailjs.send(
                'service_g5clgej', // Replace with your EmailJS service ID
                'template_2flsjn5', // Replace with your EmailJS template ID
                {
                    user_name: formData.name,
                    user_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: 'eporter609@hotmail.com' // Replace with your email
                },
                'HfqzXzg24u4VT7IwB' // Replace with your EmailJS public key
            );

            if (result.status === 200) {
                setSubmitStatus('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            setSubmitStatus('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div className="bg-background">
        <Head 
          title="Home"
          description="Edmond A Porter - Contemporary author exploring human experience through compelling narratives and thoughtful prose. Discover essays, poetry, and novels."
          canonicalUrl="/"
          ogImage="/images/Edmond_Headshot.webp"
          structuredData={{ type: 'website', data: { books: homeBioContent?.books || fallbackContent.books } }}
        />
        <Navigation />
        <main className="pt-16 md:pt-20">
            {/* Hero Section */}
            <section className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[800px] flex items-center overflow-hidden bg-primary-container">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 20% 50%, #805533 0%, transparent 50%)"}}></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center relative z-10 py-12 md:py-20">
                    <div className="order-2 md:order-1 text-center md:text-left">
                        {statusTemplate && (
                            <span className={`inline-block font-label uppercase tracking-[0.2em] font-bold mb-1 sm:mb-4 text-sm ${statusTemplate.color}`}>
                                {statusTemplate.label}
                            </span>
                        )}
                        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            {heroContent.title.split(' ').map((word, i) => 
                                i === 0 ? word : <><br key={i} className="hidden sm:block" /><span key={i} className="italic text-[#B8C8DB] sm:inline">{' '}{word}</span></>
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-on-primary-container mb-3 sm:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                            {heroContent.blurb}
                        </p>
                        <div className="flex flex-col sm:flex-row-reverse md:justify-start gap-4">
                            {statusTemplate && (
                                <div className={`flex items-center justify-center space-x-2 font-label ${statusTemplate.color}`}>
                                    <span className="material-symbols-outlined">{statusTemplate.icon}</span>
                                    <span>{statusTemplate.text}</span>
                                </div>
                            )}
                            <a className="bg-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-center hover:bg-[#96643c] transition-colors shadow-lg shadow-black/20" href={heroContent.link} target="_blank" rel="noopener noreferrer">
                                {heroContent.buttonText}
                            </a>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 relative group px-6 sm:px-6 md:px-6">
                        <div className="absolute -inset-4 bg-secondary/10 rounded-xl blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>
                        <AccessibleImage 
                            src={getImagePath(heroContent.cover)}
                            mobileSrc={heroContent.mobileCover ? getImagePath(heroContent.mobileCover) : null}
                            alt={heroContent.title}
                            className="relative z-10 w-full max-w-[215px] sm:max-w-[200px] md:max-w-[450px] mx-auto rounded-lg shadow-2xl transform md:rotate-3 transition-transform duration-500 hover:rotate-0"
                            width={450}
                            height={550}
                            priority={true}
                        />
                    </div>
                </div>
            </section>

            {/* Quick About Link */}
            <section className="py-12 bg-surface-bright" id="about-teaser">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-12 gap-10 items-center">
                        <div className="md:col-span-5 relative">
                            <AccessibleImage 
                            src={getImagePath(homeBioContent.teaserImage)}
                            alt="Portrait"
                            className="relative z-10 rounded-lg shadow-xl w-full aspect-[4/5] object-cover"
                        />
                        </div>
                        <div className="md:col-span-7">
                            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-8">{homeBioContent.teaserHeadline}</h2>
                            <p className="text-on-surface-variant text-lg max-w-2xl mb-6" dangerouslySetInnerHTML={{ __html: homeBioContent.teaserBody }} />
                            <Link to="/about" className="text-secondary font-bold inline-flex items-center group">
                                {homeBioContent.readMoreLink} 
                                <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Books Section */}
            <section className="py-12 bg-surface-container-low" id="published-works">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="font-label text-secondary uppercase tracking-widest text-sm font-bold mb-4 block">The Bibliography</span>
                            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Published Works</h2>
                        </div>
                        <a className="flex items-center space-x-2 text-secondary font-bold hover:translate-x-2 transition-transform" href="https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y" target="_blank" rel="noopener noreferrer">
                            <span>Visit Amazon Author Page</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {booksContent.map((book, i) => (
                            <div key={i} className="flex flex-col space-y-6">
                                <a href={book.buyLink} target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                                        <LazyImage
                                        src={getImagePath(book.cover)}
                                        alt={book.title}
                                        className="w-full h-auto rounded shadow-lg -mt-12 transform group-hover:-translate-y-2 transition-transform duration-300"
                                        width={300}
                                        height={450}
                                        priority={i === 0} // Prioritize first book
                                    />
                                        <div className="mt-8">
                                            <h3 className="font-headline text-2xl font-bold text-primary mb-2">{book.title}</h3>
                                            <p className="text-on-surface-variant font-label text-sm uppercase tracking-wider mb-4">{book.type}</p>
                                            <p className="text-on-surface-variant line-clamp-3 mb-6">{book.description}</p>
                                            <span className="text-secondary font-bold inline-flex items-center group/link">
                                                Buy now <span className="material-symbols-outlined ml-1 text-sm group-hover/link:translate-x-1 transition-transform">open_in_new</span>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Medium Feed Section */}
            <MediumFeed mediumContent={mediumContent} />

            {/* Newsletter / Contact Section */}
            <section className="py-20 bg-primary" id="contact">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-6">Get in Touch</h2>
                    <p className="text-on-primary-container text-lg mb-10 font-light">For media inquiries, speaking engagements, or just to say hello.</p>
                    <form className="max-w-2xl mx-auto space-y-6 text-left" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input 
                                className="bg-white/10 border-0 border-b-2 border-outline-variant text-white p-3 rounded-t-lg focus:border-secondary focus:ring-0" 
                                placeholder="Name" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required 
                                type="text" 
                            />
                            <input 
                                className="bg-white/10 border-0 border-b-2 border-outline-variant text-white p-3 rounded-t-lg focus:border-secondary focus:ring-0" 
                                placeholder="Email Address" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                                type="email" 
                            />
                        </div>
                        <input 
                            className="w-full bg-white/10 border-0 border-b-2 border-outline-variant text-white p-3 rounded-t-lg focus:border-secondary focus:ring-0" 
                            placeholder="Subject" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required 
                            type="text" 
                        />
                        <textarea 
                            className="w-full bg-white/10 border-0 border-b-2 border-outline-variant text-white p-3 rounded-t-lg focus:border-secondary focus:ring-0 resize-none" 
                            placeholder="Your message..." 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required 
                            rows="4"
                        ></textarea>
                        {submitStatus && (
                            <div className={`text-center p-3 rounded-lg ${submitStatus.includes('successfully') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {submitStatus}
                            </div>
                        )}
                        <div className="text-center">
                            <button 
                                className="bg-secondary text-white px-12 py-4 rounded-lg font-bold hover:bg-[#96643c] transition-colors shadow-lg shadow-black/20 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
        <Footer />
    </div>
    );
};

export default HomePage;
