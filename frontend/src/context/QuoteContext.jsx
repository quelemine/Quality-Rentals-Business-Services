import React, { createContext, useContext, useState, useCallback } from 'react';

const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
  const [quoteItems, setQuoteItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventDate: '',
    durationDays: 1,
    deliveryType: 'Self Pickup',
    deliveryAddress: '',
    specialNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const addItem = useCallback((product, quantity = 1) => {
    setQuoteItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          product_id: product.id,
          quantity,
          product_details: product,
        },
      ];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((productId) => {
    setQuoteItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setQuoteItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetQuote = useCallback(() => {
    setQuoteItems([]);
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      eventDate: '',
      durationDays: 1,
      deliveryType: 'Self Pickup',
      deliveryAddress: '',
      specialNotes: '',
    });
    setIsDrawerOpen(false);
  }, []);

  const submitQuote = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const { submitQuoteRequest } = await import('../services/api');
      const quoteData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        event_date: formData.eventDate,
        duration_days: formData.durationDays,
        delivery_type: formData.deliveryType,
        delivery_address: formData.deliveryType === 'Delivery Required' ? formData.deliveryAddress : null,
        special_notes: formData.specialNotes,
        items: quoteItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      await submitQuoteRequest(quoteData);
      resetQuote();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, quoteItems, resetQuote]);

  const getTotalItems = useCallback(() => {
    return quoteItems.reduce((total, item) => total + item.quantity, 0);
  }, [quoteItems]);

  const value = {
    quoteItems,
    isDrawerOpen,
    setIsDrawerOpen,
    currentStep,
    nextStep,
    prevStep,
    formData,
    updateFormData,
    addItem,
    removeItem,
    updateQuantity,
    submitQuote,
    resetQuote,
    isSubmitting,
    showToast,
    getTotalItems,
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
