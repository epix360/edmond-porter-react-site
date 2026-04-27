import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-amber-500 py-12 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto space-y-8 md:space-y-0">
                <div className="text-center md:text-left">
                    <Link className="text-xl font-headline italic text-white mb-2 block" href="/">Edmond A Porter</Link>
                    <p className="text-slate-400 font-body text-sm tracking-wide">© {currentYear} Edmond A Porter. All rights reserved.</p>
                </div>
                <div className="flex items-center space-x-4 opacity-80 hover:opacity-100 duration-300">
                    <a className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" href="https://www.goodreads.com/author/show/60996287.Edmond_A_Porter" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-white">book_2</span></a>
                    <a className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" href="https://medium.com/feed/@eporter609" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-white">rss_feed</span></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
