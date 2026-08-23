import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '231776748152'; // Liberia phone number

  const handleSend = () => {
    if (message.trim()) {
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
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 animate-pulse"
        style={{ animation: isOpen ? 'none' : 'pulse 2s infinite' }}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:bottom-24 md:right-8 w-80 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">Quality Rental Support</h4>
                <p className="text-xs text-green-100">Online - Typically replies in 5 minutes</p>
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
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
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
