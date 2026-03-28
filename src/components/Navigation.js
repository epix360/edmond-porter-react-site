import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeAnchor, setActiveAnchor] = useState(null);

    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveAnchor(null);
        }
    }, [location.pathname]);

    const handleAnchorClick = (e, id) => {
        e.preventDefault();
        setActiveAnchor(id);
        
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id.replace('#', ''));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id.replace('#', ''));
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
                {/* Main Flex Container */}
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    
                    {/* 1. Logo Section (Fixed duplicate tags) */}
                    <Link to="/" className="text-xl md:text-2xl font-headline font-bold text-primary uppercase tracking-widest italic">
                        Edmond A Porter
                    </Link>

                    {/* 2. Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8 font-label text-base tracking-tight">
                        <Link className={`${location.pathname === '/' && !activeAnchor ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-slate-600 hover:text-secondary'} transition-all py-1`} to="/" onClick={() => {setActiveAnchor(null); if (location.pathname === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }) }}}>Home</Link>
                        <a className={`${activeAnchor === '#published-works' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-slate-600 hover:text-secondary'} transition-all py-1`} href="#published-works" onClick={(e) => handleAnchorClick(e, '#published-works')}>Books</a>
                        <a className={`${activeAnchor === '#medium' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-slate-600 hover:text-secondary'} transition-all py-1`} href="#medium" onClick={(e) => handleAnchorClick(e, '#medium')}>Medium</a>
                        <a className={`${activeAnchor === '#contact' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-slate-600 hover:text-secondary'} transition-all py-1`} href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}>Contact</a>
                        <Link className={`${location.pathname === '/about' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-slate-600 hover:text-secondary'} transition-all py-1`} to="/about" onClick={() => setActiveAnchor(null)}>About</Link>
                    </div>

                    {/* 3. Action Buttons (Moved inside the flex container) */}
                    <div className="flex items-center space-x-4">
                        <a className="hidden sm:inline-flex bg-primary text-white px-6 py-2 rounded-lg font-label font-semibold tracking-wide hover:bg-primary/90 transition-all" href="https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y" target="_blank" rel="noopener noreferrer">
                            Amazon Store
                        </a>
                        <button className="md:hidden text-primary p-2 z-[10001] relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <span className="material-symbols-outlined text-3xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div> 
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/50 z-[99999] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className={`fixed top-0 h-full w-80 bg-white shadow-2xl transition-all duration-300 ease-in-out z-[100000] ${mobileMenuOpen ? 'right-0' : 'right-[-100%]'}`}>
                    <button className="absolute top-4 right-4 text-primary p-2 z-[100001]" onClick={() => setMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                    <div className="flex flex-col p-8 gap-8 text-2xl font-headline text-primary">
                        <Link to="/" onClick={() => { setMobileMenuOpen(false); setActiveAnchor(null); if (location.pathname === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }} className={location.pathname === '/' && !activeAnchor ? 'text-secondary' : ''}>Home</Link>
                        <a href="#published-works" onClick={(e) => handleAnchorClick(e, '#published-works')} className={activeAnchor === '#published-works' ? 'text-secondary' : ''}>Books</a>
                        <a href="#medium" onClick={(e) => handleAnchorClick(e, '#medium')} className={activeAnchor === '#medium' ? 'text-secondary' : ''}>Medium</a>
                        <a href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')} className={activeAnchor === '#contact' ? 'text-secondary' : ''}>Contact</a>
                        <Link to="/about" onClick={() => { setMobileMenuOpen(false); setActiveAnchor(null); }} className={location.pathname === '/about' ? 'text-secondary' : ''}>About</Link>
                        <hr className="border-slate-300/30 shadow-sm" />
                        <a className="bg-secondary text-white text-center py-4 rounded-xl text-lg font-label shadow-xl hover:shadow-2xl transition-shadow" href="https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y" target="_blank" rel="noopener noreferrer">
                            Amazon Store
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navigation;