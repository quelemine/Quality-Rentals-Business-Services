import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { siteContent } = useSiteContent();
  const communications = siteContent.communications || {};
  const phoneNumber = (communications.whatsappNumber || siteContent.business.phone || '').replace(/\D/g, '');

  const handleSend = () => {
    if (message.trim() && phoneNumber) {
      const currentPageUrl = encodeURIComponent(window.location.href);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A%0APage:%20${currentPageUrl}`;
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 hidden rounded-full bg-green-500 p-4 text-white shadow-lg transition-all hover:bg-green-600 md:block animate-pulse"
        style={{ animation: isOpen ? 'none' : 'pulse 2s infinite' }}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 hidden w-80 overflow-hidden rounded-xl bg-white shadow-2xl md:block z-50">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">{communications.widgetTitle || 'Quality Rental Support'}</h4>
                <p className="text-xs text-green-100">{communications.availabilityText || 'Online - Typically replies in 5 minutes'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Input */}
          <div className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={communications.whatsappGreeting || 'Type your message here...'}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || !phoneNumber}
              className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send to WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
