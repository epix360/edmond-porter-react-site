import React from 'react';
import Link from 'next/link';
import FullWidthText from 'app/components/FullWidthText.js';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-amber-500 pt-6 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-3">
                    <div className="order-2 md:order-1 pt-3">
                        <img src="/images/Redwood-Vail-Press-Logo.webp" alt="Redwood Vail Press Logo" className="rounded-xl" />
                        <div className="w-full max-w-sm text-slate-300 pt-3"> 
                            <FullWidthText text="Redwood Vail Press" />
                        </div>
                    </div>
                    <div className="text-center md:text-left order-1 md:order-2">
                        <Link className="text-3xl font-headline italic text-slate-300 block" href="/">Edmond A Porter</Link>
                        <p className="text-slate-300 font-body text-md tracking-wide">© {currentYear} Edmond A Porter. All rights reserved.</p>
                    </div>
                    <div className="flex flex-col text-center md:text-left mt-3 mb-4 order-3">
                        <a href="https://www.leagueofutahwriters.com/" target="_blank" rel="noopener noreferrer">League of Utah Writers</a>
                        <a href="http://www.writerscache.org/" target="_blank" rel="noopener noreferrer">The Writer's Cache</a>
                    </div>
                    <div className="flex items-center space-x-4 opacity-80 hover:opacity-100 duration-300 order-4">
                        <a className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" title="Goodreads" href="https://www.goodreads.com/author/show/60996287.Edmond_A_Porter" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-white text-xl">book_2</span></a>
                        <a className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" title="RSS Feed" href="https://medium.com/feed/@eporter609" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-white text-xl">rss_feed</span></a>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-700 pt-3 pb-3">
                    <div>
                        <Link className="font-light text-slate-300 mr-4" href="/privacy-policy">Privacy Policy</Link>
                        <Link className="font-light text-slate-300" href="/terms-of-use">Terms of Use</Link>
                    </div>
                    <small className="font-light text-slate-300">As an Amazon Associate I earn from qualifying purchases.</small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
