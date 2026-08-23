import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Image, MessageSquare } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

const MobileNav = () => {
  const { getTotalItems, setIsDrawerOpen } = useQuote();
  const totalItems = getTotalItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 md:hidden">
      <div className="flex justify-around items-center py-3">
        <Link to="/" className="flex flex-col items-center space-y-1 text-navy hover:text-gold transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center space-y-1 text-navy hover:text-gold transition-colors relative"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs font-medium">Rentals</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>

        <Link to="/gallery" className="flex flex-col items-center space-y-1 text-navy hover:text-gold transition-colors">
          <Image className="w-6 h-6" />
          <span className="text-xs font-medium">Gallery</span>
        </Link>

        <Link to="/contact" className="flex flex-col items-center space-y-1 text-navy hover:text-gold transition-colors">
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs font-medium">Contact</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
