import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, Facebook, Instagram, Twitter, Search } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { useSiteContent } from '../context/SiteContentContext';
import LanguageSelector from './LanguageSelector';

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Rentals', to: '/rentals' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Events We Serve', to: '/events' },
  { label: 'Contact Us', to: '/contact' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { setIsDrawerOpen, getTotalItems } = useQuote();
  const { siteContent } = useSiteContent();
  const totalItems = getTotalItems();
  const business = siteContent.business;
  const socials = siteContent.footer.socials;

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/rentals?search=${encodeURIComponent(query)}` : '/rentals');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="hidden bg-gold text-white py-2 sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <a href={`tel:${business.phone.replace(/\s+/g, '')}`} className="flex items-center hover:text-navy transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                {business.phone}
              </a>
              <a href={`mailto:${business.email}`} className="hidden items-center hover:text-navy transition-colors sm:flex">
                <Mail className="w-4 h-4 mr-2" />
                {business.email}
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noreferrer" className="hover:text-navy transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-navy transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noreferrer" className="hover:text-navy transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-navy text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 sm:h-20 lg:gap-8">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity">
                <img
                  src={business.logo}
                  alt={business.companyName}
                  className="h-10 w-10 rounded-full object-cover border-2 border-gold sm:h-12 sm:w-12"
                />
              </Link>
              <Link to="/" className="min-w-0 text-white font-serif font-bold leading-tight hover:text-gold transition-colors">
                <div className="text-[10px] leading-tight sm:text-base lg:text-lg">{business.companyName}</div>
                <div className="hidden text-xs font-normal text-slate-200 sm:block">{business.tagline}</div>
              </Link>
            </div>

            <div className="ml-4 hidden lg:flex items-center space-x-6 lg:ml-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `whitespace-nowrap font-medium transition-colors text-sm ${isActive ? 'text-gold' : 'text-white hover:text-gold'}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Get a Quote"
                className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-sm font-medium text-white hover:bg-white hover:text-navy transition-colors"
              >
                Quote {totalItems > 0 && <span className="rounded-full bg-navy px-1.5 py-0.5 text-xs leading-none">{totalItems}</span>}
              </button>
            </div>

            <div className="ml-3 hidden md:flex lg:hidden items-center space-x-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `whitespace-nowrap font-medium transition-colors text-xs ${isActive ? 'text-gold' : 'text-white hover:text-gold'}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Get a Quote"
                className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white hover:text-navy transition-colors"
              >
                Quote {totalItems > 0 && <span className="rounded-full bg-navy px-1.5 py-0.5 text-[10px] leading-none">{totalItems}</span>}
              </button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Search rentals"
              >
                <Search className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 md:hidden">
              <a href={`tel:${business.phone.replace(/\s+/g, '')}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-navy">
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `block py-2 text-base font-medium transition-colors ${isActive ? 'text-gold' : 'text-white hover:text-gold'}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <LanguageSelector mobile />
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full bg-gold text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-navy transition-colors"
              >
                Get a Quote
              </button>
            </div>
          </div>
        )}
      </nav>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy/70 px-4 pt-24" role="dialog" aria-modal="true" aria-label="Search rentals">
          <form onSubmit={submitSearch} className="relative w-full max-w-2xl rounded-xl bg-white p-3 shadow-2xl sm:p-4">
            <label htmlFor="global-rental-search" className="sr-only">Search rentals</label>
            <div className="flex items-center gap-2">
              <Search className="ml-2 h-5 w-5 shrink-0 text-gray-500" />
              <input
                id="global-rental-search"
                autoFocus
                type="search"
                placeholder="Search all rentals, categories, and descriptions..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-w-0 flex-1 px-2 py-3 text-navy outline-none"
              />
              <button type="submit" className="rounded-lg bg-gold px-4 py-3 font-medium text-white hover:bg-navy">Search</button>
              <button type="button" onClick={() => setIsSearchOpen(false)} className="p-3 text-gray-500 hover:text-navy" aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Header;
