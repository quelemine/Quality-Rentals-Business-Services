import React from 'react';
import { useQuote } from '../context/QuoteContext';
import { CheckCircle } from 'lucide-react';

const Toast = () => {
  const { showToast } = useQuote();

  if (!showToast) return null;

  return (
    <div className="fixed top-24 right-4 md:top-8 md:right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 animate-slide-in">
      <CheckCircle className="w-6 h-6" />
      <div>
        <h4 className="font-medium">Quote Request Sent!</h4>
        <p className="text-sm text-green-100">We will contact you within 2 hours.</p>
      </div>
    </div>
  );
};

export default Toast;
