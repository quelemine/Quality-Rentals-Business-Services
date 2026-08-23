import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const { siteContent } = useSiteContent();
  const business = siteContent.business;
  const footer = siteContent.footer;

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-gold">{business.companyName}</h3>
            <p className="text-gray-300 text-sm">{footer.description}</p>
            <div className="flex space-x-4 pt-4">
              {footer.socials.facebook && (
                <a href={footer.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {footer.socials.instagram && (
                <a href={footer.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {footer.socials.twitter && (
                <a href={footer.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <button onClick={() => toggleSection('quickLinks')} className="flex items-center justify-between w-full lg:hidden mb-4">
              <h4 className="font-serif font-bold text-lg">Quick Links</h4>
              {openSection === 'quickLinks' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <h4 className="font-serif font-bold text-lg mb-4 hidden lg:block">Quick Links</h4>
            <ul className={`space-y-2 ${openSection === 'quickLinks' ? 'block' : 'hidden lg:block'}`}>
              <li><Link to="/" className="text-gray-300 hover:text-gold transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-gold transition-colors text-sm">About Us</Link></li>
              <li><Link to="/rentals" className="text-gray-300 hover:text-gold transition-colors text-sm">Our Rentals</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-gold transition-colors text-sm">Gallery</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-gold transition-colors text-sm">Events We Serve</Link></li>
            </ul>
          </div>

          <div>
            <button onClick={() => toggleSection('categories')} className="flex items-center justify-between w-full lg:hidden mb-4">
              <h4 className="font-serif font-bold text-lg">Categories</h4>
              {openSection === 'categories' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <h4 className="font-serif font-bold text-lg mb-4 hidden lg:block">Categories</h4>
            <ul className={`space-y-2 ${openSection === 'categories' ? 'block' : 'hidden lg:block'}`}>
              {(siteContent.catalog?.categories || []).slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link to="/rentals" className="text-gray-300 hover:text-gold transition-colors text-sm">{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <button onClick={() => toggleSection('contact')} className="flex items-center justify-between w-full lg:hidden mb-4">
              <h4 className="font-serif font-bold text-lg">Contact Us</h4>
              {openSection === 'contact' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <h4 className="font-serif font-bold text-lg mb-4 hidden lg:block">Contact Us</h4>
            <ul className={`space-y-3 ${openSection === 'contact' ? 'block' : 'hidden lg:block'}`}>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{business.location}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <a href={`tel:${business.phone.replace(/\s+/g, '')}`} className="text-gray-300 hover:text-gold transition-colors text-sm">{business.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a href={`mailto:${business.email}`} className="text-gray-300 hover:text-gold transition-colors text-sm">{business.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} {business.companyName}. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
