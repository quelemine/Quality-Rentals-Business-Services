import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Minus, Plus, Calendar, Clock, MapPin, User, Mail, Phone, FileText, Loader2, Check } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

const QuoteDrawer = () => {
  const navigate = useNavigate();
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    currentStep,
    nextStep,
    prevStep,
    formData,
    updateFormData,
    quoteItems,
    removeItem,
    updateQuantity,
    submitQuote,
    isSubmitting,
    resetQuote,
  } = useQuote();

  // Currency conversion: USD to LRD (Liberian Dollar)
  // Exchange rate: 1 USD = 200 LRD (approximate, can be updated)
  const USD_TO_LRD_RATE = 200;
  const convertToLRD = (usdAmount) => {
    return usdAmount * USD_TO_LRD_RATE;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let totalUSD = 0;
    let hasContactForPrice = false;

    console.log('=== Price Calculation Debug ===');
    console.log('Quote Items:', quoteItems);

    quoteItems.forEach((item) => {
      const price = item.product_details.price;
      const priceCurrency = item.product_details.price_currency || 'USD';
      console.log('Item:', item.product_details.name);
      console.log('Raw Price:', price);
      console.log('Price Currency:', priceCurrency);
      console.log('Price Type:', typeof price);
      
      if (price && typeof price === 'string' && !price.toLowerCase().includes('contact')) {
        // Try to extract numeric value from price string (e.g., "$50/day" -> 50)
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        console.log('Numeric Price:', numericPrice);
        console.log('Quantity:', item.quantity);
        
        if (!isNaN(numericPrice)) {
          // Convert to USD if price is in LRD
          let priceInUSD = numericPrice;
          if (priceCurrency === 'LRD') {
            priceInUSD = numericPrice / USD_TO_LRD_RATE;
            console.log('Converted LRD to USD:', priceInUSD);
          }
          
          totalUSD += priceInUSD * item.quantity;
          console.log('Added to total USD:', priceInUSD * item.quantity);
        }
      } else if (!price || (typeof price === 'string' && price.toLowerCase().includes('contact'))) {
        hasContactForPrice = true;
        console.log('Contact for price item detected');
      }
    });

    console.log('Final Total USD:', totalUSD);
    console.log('Final Total LRD:', convertToLRD(totalUSD));
    console.log('Has Contact For Price:', hasContactForPrice);

    return { total: totalUSD, hasContactForPrice };
  };

  const { total, hasContactForPrice } = calculateTotalPrice();

  // Currency conversion: USD to LRD (Liberian Dollar)
  // Exchange rate: 1 USD = 200 LRD (approximate, can be updated)
  const USD_TO_LRD_RATE = 200;
  const convertToLRD = (usdAmount) => {
    return usdAmount * USD_TO_LRD_RATE;
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate >= today) {
      updateFormData('eventDate', e.target.value);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return quoteItems.length > 0;
    }
    if (currentStep === 2) {
      return formData.eventDate && 
             (formData.deliveryType === 'Self Pickup' || formData.deliveryAddress);
    }
    if (currentStep === 3) {
      return formData.firstName && 
             formData.lastName && 
             formData.email && 
             formData.phone;
    }
    return false;
  };

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-serif font-bold text-navy">Quote Request</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 hover:text-navy transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      currentStep >= step
                        ? 'bg-gold text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <span className="ml-2 text-sm font-medium text-navy">
                    {step === 1 ? 'Items' : step === 2 ? 'Schedule' : 'Contact'}
                  </span>
                </div>
                {step < 3 && (
                  <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                    <div
                      className={`h-full bg-gold transition-all ${
                        currentStep > step ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Step 1: Item Summary */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">
                  {quoteItems.length} {quoteItems.length === 1 ? 'item' : 'items'} selected
                </span>
                {quoteItems.length > 0 && (
                  <div className="text-right">
                    <span className="text-navy font-bold">
                      ${total.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      (LRD {convertToLRD(total).toFixed(2)})
                    </span>
                  </div>
                )}
              </div>

              {quoteItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items in your quote request</p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/rentals');
                    }}
                    className="mt-4 text-gold font-medium hover:underline"
                  >
                    Browse Rentals
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quoteItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center space-x-4 p-4 bg-light-grey rounded-lg"
                    >
                      <img
                        src={item.product_details.image_url}
                        alt={item.product_details.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-navy text-sm">
                          {item.product_details.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          ${item.product_details.price || 'Contact for price'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors border"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors border"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {quoteItems.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Estimated Total:</span>
                    <div className="text-right">
                      {hasContactForPrice ? (
                        <span className="text-gold font-medium">Contact for pricing</span>
                      ) : (
                        <div>
                          <span className="text-navy font-bold text-lg">${total.toFixed(2)}</span>
                          <span className="text-gray-500 text-sm ml-1">
                            (LRD {convertToLRD(total).toFixed(2)})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {hasContactForPrice && (
                    <p className="text-xs text-gray-500 mt-1">Some items require custom pricing</p>
                  )}
                </div>
              )}

              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="w-full bg-gold text-white py-3 rounded-lg font-medium hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Details
              </button>
            </div>
          )}

          {/* Step 2: Scheduling */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={handleDateChange}
                  min={getMinDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration *
                </label>
                <select
                  value={formData.durationDays}
                  onChange={(e) => updateFormData('durationDays', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>1 Week</option>
                  <option value={14}>2 Weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Delivery Type *
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateFormData('deliveryType', 'Self Pickup')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      formData.deliveryType === 'Self Pickup'
                        ? 'border-gold bg-gold/10 text-navy'
                        : 'border-gray-300 text-gray-600 hover:border-gold'
                    }`}
                  >
                    Self Pickup
                  </button>
                  <button
                    onClick={() => updateFormData('deliveryType', 'Delivery Required')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      formData.deliveryType === 'Delivery Required'
                        ? 'border-gold bg-gold/10 text-navy'
                        : 'border-gray-300 text-gray-600 hover:border-gold'
                    }`}
                  >
                    Delivery Required
                  </button>
                </div>
              </div>

              {formData.deliveryType === 'Delivery Required' && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                    placeholder="Enter your venue address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-200 text-navy py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex-1 bg-gold text-white py-3 rounded-lg font-medium hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Proceed to Contact
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Send Quote Request To *
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateFormData('contactMethod', 'email')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      formData.contactMethod === 'email'
                        ? 'border-gold bg-gold/10 text-navy'
                        : 'border-gray-300 text-gray-600 hover:border-gold'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => updateFormData('contactMethod', 'whatsapp')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      formData.contactMethod === 'whatsapp'
                        ? 'border-gold bg-gold/10 text-navy'
                        : 'border-gray-300 text-gray-600 hover:border-gold'
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Susannah"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Paye"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="paye.susanna@yahoo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+231 7767 48152"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Special Notes
                </label>
                <textarea
                  value={formData.specialNotes}
                  onChange={(e) => updateFormData('specialNotes', e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-200 text-navy py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={submitQuote}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex-1 bg-gold text-white py-3 rounded-lg font-medium hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Quote Request'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteDrawer;
