import React, { useEffect, useMemo, useState } from 'react';
import { Shield, X, LogIn, Save, RefreshCw, Plus, Trash2, LayoutGrid, Image as ImageIcon, Package, FileText, Globe, Menu, CreditCard, BarChart3, MessageSquare, Eye, EyeOff, Palette, Mail, InboxIcon, ClipboardList } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

const imageToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'general', label: 'General', icon: LayoutGrid },
  { id: 'communications', label: 'Communications', icon: Mail },
  { id: 'hero', label: 'Hero', icon: FileText },
  { id: 'about', label: 'About', icon: FileText },
  { id: 'events', label: 'Events', icon: Globe },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'rentals', label: 'Rentals', icon: Package },
  { id: 'social', label: 'Footer', icon: Globe },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'quotes', label: 'Quote Requests', icon: ClipboardList },
  { id: 'contacts', label: 'Contact Messages', icon: InboxIcon },
  { id: 'chatlogs', label: 'Chat Logs', icon: MessageSquare },
  { id: 'colors', label: 'Colors', icon: Palette },
];

const AdminPanel = () => {
  const { siteContent, setSiteContent, resetContent, resetWebsiteContent } = useSiteContent();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === '1' || window.location.hash === '#/admin';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('qrs-admin-session') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [changePasswordMessage, setChangePasswordMessage] = useState('');
  const [isSubmittingChangePassword, setIsSubmittingChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [colorSettings, setColorSettings] = useState({});
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, mode: 'create', item: null });
  const [touchStartX, setTouchStartX] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [expandedContact, setExpandedContact] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDirectLinkAccess, setIsDirectLinkAccess] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === '1';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isAdminRoute = location.pathname === '/admin' || window.location.hash === '#/admin';
    const shouldOpen = isAdminRoute || params.get('admin') === '1' || sessionStorage.getItem('qrs-admin-session') === 'true';
    setIsDirectLinkAccess(params.get('admin') === '1' || isAdminRoute);
    setIsOpen(shouldOpen);
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab === 'chatlogs' && isLoggedIn) {
      fetchChatLogs();
    }
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'quotes' && isLoggedIn) {
      fetchQuoteRequests();
    }
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'contacts' && isLoggedIn) {
      fetchContactMessages();
    }
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'rentals' && isLoggedIn) {
      fetchProductsForAdmin();
      fetchCategoriesForAdmin();
    }
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'colors' && isLoggedIn) {
      fetchColorSettings();
    }
  }, [activeTab, isLoggedIn]);

  const fetchProductsForAdmin = async () => {
    try {
      const response = await fetch('/api/products.php');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSiteContent({
          ...siteContent,
          catalog: {
            ...siteContent.catalog,
            products: data
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch products for admin:', error);
    }
  };

  const fetchCategoriesForAdmin = async () => {
    try {
      const response = await fetch('/api/categories.php');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSiteContent({
          ...siteContent,
          catalog: {
            ...siteContent.catalog,
            categories: data
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch categories for admin:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const refreshData = async () => {
    try {
      await fetchProductsForAdmin();
      await fetchCategoriesForAdmin();
      showToast('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showToast('Failed to refresh data', 'error');
    }
  };

  const fetchChatLogs = async () => {
    try {
      console.log('Fetching chat logs...');
      const response = await fetch('/api/chat-logs.php');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chat logs data:', data);
      
      if (data.success) {
        setChatLogs(data.logs);
        console.log('Chat logs updated successfully. Total logs:', data.logs.length);
      } else {
        console.error('API returned error:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch chat logs:', error);
    }
  };

  const fetchQuoteRequests = async () => {
    try {
      const response = await fetch('/api/quote-requests.php');
      const data = await response.json();
      if (data.success) {
        setQuoteRequests(data.quotes);
      }
    } catch (error) {
      console.error('Failed to fetch quote requests:', error);
    }
  };

  const updateQuoteStatus = async (id, status) => {
    try {
      const response = await fetch('/api/quote-requests.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (data.success) {
        setQuoteRequests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
        showToast('Status updated successfully!');
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const deleteQuoteRequest = async (id) => {
    if (!window.confirm('Delete this quote request?')) return;
    try {
      const response = await fetch(`/api/quote-requests.php?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setQuoteRequests(prev => prev.filter(q => q.id !== id));
        showToast('Quote request deleted.');
      }
    } catch (error) {
      showToast('Failed to delete quote request', 'error');
    }
  };

  const fetchContactMessages = async () => {
    try {
      const response = await fetch('/api/contact.php');
      const data = await response.json();
      if (data.success) {
        setContactMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      const response = await fetch('/api/contact.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (data.success) {
        setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        showToast('Status updated.');
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const deleteContactMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/contact.php?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setContactMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted.');
      }
    } catch (error) {
      showToast('Failed to delete message', 'error');
    }
  };

  const fetchColorSettings = async () => {
    try {
      const response = await fetch('/api/color-settings.php');
      const data = await response.json();
      
      if (data.success) {
        const colors = {};
        Object.keys(data.colors).forEach(key => {
          colors[key] = data.colors[key].value;
        });
        setColorSettings(colors);
        applyColorsToDOM(colors);
      }
    } catch (error) {
      console.error('Failed to fetch color settings:', error);
    }
  };

  const saveColorSettings = async () => {
    setIsSavingColors(true);
    try {
      const response = await fetch('/api/color-settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: colorSettings })
      });

      const data = await response.json();
      
      if (data.success) {
        applyColorsToDOM(colorSettings);
        alert('Color settings saved successfully!');
      } else {
        alert('Failed to save color settings.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSavingColors(false);
    }
  };

  const applyColorsToDOM = (colors) => {
    const root = document.documentElement;
    Object.keys(colors).forEach(key => {
      root.style.setProperty(`--color-${key}`, colors[key]);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('qrs-admin-session', 'true');
        sessionStorage.setItem('qrs-admin-username', data.admin.username);
        sessionStorage.setItem('qrs-admin-email', data.admin.email);
        setIsLoggedIn(true);
        setIsOpen(true);
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('qrs-admin-session');
    sessionStorage.removeItem('qrs-admin-username');
    sessionStorage.removeItem('qrs-admin-email');
    setIsLoggedIn(false);
    setIsOpen(false);
    setModal({ open: false, type: null, mode: 'create', item: null });

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmittingForgot(true);
    setForgotMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();
      
      if (data.success) {
        setForgotMessage(data.message);
        setForgotEmail('');
      } else {
        setForgotMessage(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setForgotMessage('Network error. Please try again.');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordMessage('');

    if (newPassword !== confirmNewPassword) {
      setChangePasswordMessage('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setChangePasswordMessage('New password must be at least 8 characters long.');
      return;
    }

    if (currentPassword === newPassword) {
      setChangePasswordMessage('New password must be different from current password.');
      return;
    }

    const email = sessionStorage.getItem('qrs-admin-email') || 'admin@qualityrentalservices.com';

    setIsSubmittingChangePassword(true);

    try {
      const response = await fetch('/api/auth/change-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
          newUsername: newUsername || null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setChangePasswordMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setNewUsername('');
        
        // Update session if username changed
        if (newUsername) {
          sessionStorage.setItem('qrs-admin-username', newUsername);
        }
        
        setTimeout(() => setShowChangePassword(false), 2000);
      } else {
        setChangePasswordMessage(data.message || 'Failed to change password.');
      }
    } catch (error) {
      setChangePasswordMessage('Network error. Please try again.');
    } finally {
      setIsSubmittingChangePassword(false);
    }
  };

  const closePanel = () => {
    if (isDirectLinkAccess && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.toString());
    }

    setIsOpen(false);
  };

  const handleSaveAndClose = async () => {
    try {
      // Save site content to localStorage via context
      if (typeof setSiteContent === 'function') {
        // The context should handle localStorage persistence
        // Force a save by setting the content
        localStorage.setItem('quality-rental-site-content-v1', JSON.stringify(siteContent));
      }
      
      alert('Changes saved successfully!');
      closePanel();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes: ' + error.message);
    }
  };

  const updateBusinessField = (field, value) => {
    setSiteContent({
      ...siteContent,
      business: {
        ...siteContent.business,
        [field]: value,
      },
    });
  };

  const updateCommunicationField = (field, value) => {
    setSiteContent({
      ...siteContent,
      communications: {
        ...(siteContent.communications || {}),
        [field]: value,
      },
    });
  };

  const updateHeroField = (field, value) => {
    setSiteContent({
      ...siteContent,
      hero: {
        ...siteContent.hero,
        [field]: value,
      },
    });
  };

  const updateAboutField = (field, value) => {
    setSiteContent({
      ...siteContent,
      about: {
        ...siteContent.about,
        [field]: value,
      },
    });
  };

  const updateFooterField = (field, value) => {
    setSiteContent({
      ...siteContent,
      footer: {
        ...siteContent.footer,
        [field]: value,
      },
    });
  };

  const updateSocialLink = (platform, value) => {
    setSiteContent({
      ...siteContent,
      footer: {
        ...siteContent.footer,
        socials: {
          ...siteContent.footer.socials,
          [platform]: value,
        },
      },
    });
  };

  const handleImageUpload = async (event, targetPath, targetKey) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await imageToBase64(file);

    if (targetPath === 'business') {
      updateBusinessField(targetKey, base64);
      return;
    }

    if (targetPath === 'hero') {
      updateHeroField(targetKey, base64);
      return;
    }

    if (targetPath === 'gallery') {
      const updatedGallery = siteContent.gallery.map((item) =>
        item.id === Number(targetKey) ? { ...item, image_url: base64 } : item
      );
      setSiteContent({ ...siteContent, gallery: updatedGallery });
    }

    if (targetPath === 'products') {
      const updatedProducts = siteContent.catalog.products.map((item) =>
        item.id === Number(targetKey) ? { ...item, image_url: base64 } : item
      );
      setSiteContent({
        ...siteContent,
        catalog: { ...siteContent.catalog, products: updatedProducts },
      });
    }
  };

  const handleModalImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('=== Image Upload Debug ===');
    console.log('Selected file:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);

    const base64 = await imageToBase64(file);
    console.log('Base64 length:', base64.length);
    console.log('Base64 preview:', base64.substring(0, 100) + '...');

    // Update modal state with the new image URL
    const updatedItem = { ...modal.item, image_url: base64 };
    setModal({
      ...modal,
      item: updatedItem,
    });

    console.log('Modal item image_url updated:', updatedItem.image_url ? 'Yes' : 'No');
    console.log('Updated image_url length:', updatedItem.image_url?.length || 0);
  };

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      name: 'New Event',
      description: 'Add a short description',
    };

    setSiteContent({
      ...siteContent,
      events: [...siteContent.events, newEvent],
    });
  };

  const openModal = (type, mode = 'create', item = null) => {
    const baseItem = item || {
      id: Date.now(),
      name: 'New Event',
      description: 'Add a short description',
      title: 'New Gallery Item',
      tag: 'Featured',
      image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200',
      category_id: siteContent.catalog.categories[0]?.id || 1,
      price: 'From $0',
      slug: '',
      is_available: true,
      stock_quantity: 0,
      client: 'New Client',
      amount: 0,
      method: 'Cash',
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
      notes: 'Payment recorded from the dashboard',
    };

    // When editing, use the existing item with its original ID
    // When creating, use baseItem with a new ID
    const modalItem = mode === 'edit' && item ? { ...item } : { ...baseItem };

    console.log('=== Open Modal Debug ===');
    console.log('Type:', type);
    console.log('Mode:', mode);
    console.log('Item passed:', item);
    console.log('Modal item image_url:', modalItem.image_url);
    console.log('Modal item image_url length:', modalItem.image_url?.length || 0);

    setModal({ open: true, type, mode, item: modalItem });
  };

  const closeModal = () => setModal({ open: false, type: null, mode: 'create', item: null });

  const saveModalContent = () => {
    if (!modal.type || !modal.item) return;

    switch (modal.type) {
      case 'event': {
        if (modal.mode === 'create') {
          setSiteContent({ ...siteContent, events: [...siteContent.events, { ...modal.item, id: Date.now() }] });
        } else {
          setSiteContent({
            ...siteContent,
            events: siteContent.events.map((event) =>
              event.id === modal.item.id ? { ...event, ...modal.item } : event
            ),
          });
        }
        break;
      }
      case 'gallery': {
        if (modal.mode === 'create') {
          setSiteContent({ ...siteContent, gallery: [...siteContent.gallery, { ...modal.item, id: Date.now() }] });
        } else {
          setSiteContent({
            ...siteContent,
            gallery: siteContent.gallery.map((item) =>
              item.id === modal.item.id ? { ...item, ...modal.item } : item
            ),
          });
        }
        break;
      }
      case 'product': {
        const saveProduct = async () => {
          try {
            const url = '/api/products.php';
            const method = modal.mode === 'create' ? 'POST' : 'PUT';
            
            // Ensure ID is sent as number for PUT requests
            const payload = {
              ...modal.item,
              id: modal.mode === 'edit' ? Number(modal.item.id) : undefined,
              image_url: modal.item.image_url || '',
              price_currency: modal.item.price_currency || 'USD'
            };
            
            const response = await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (response.ok) {
              showToast('Product saved successfully!');
              closeModal();
              
              // Refresh products from API
              await fetchProductsForAdmin();
            } else {
              showToast('Failed to save product: ' + (result.message || result.error || 'Unknown error'), 'error');
            }
          } catch (error) {
            console.error('Error saving product:', error);
            showToast('Network error: ' + error.message, 'error');
          }
        };
        
        saveProduct();
        return; // Don't call closeModal() - let saveProduct handle it
      }
      case 'category': {
        const saveCategory = async () => {
          try {
            const url = '/api/categories.php';
            const method = modal.mode === 'create' ? 'POST' : 'PUT';
            
            const payload = {
              ...modal.item,
              id: modal.mode === 'edit' ? Number(modal.item.id) : undefined
            };
            
            const response = await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (response.ok) {
              showToast('Category saved successfully!');
              closeModal();
              await fetchCategoriesForAdmin();
            } else {
              showToast('Failed to save category: ' + (result.message || 'Unknown error'), 'error');
            }
          } catch (error) {
            console.error('Error saving category:', error);
            showToast('Network error: ' + error.message, 'error');
          }
        };
        
        saveCategory();
        return;
      }
      case 'payment': {
        if (modal.mode === 'create') {
          setSiteContent({
            ...siteContent,
            payments: [...(siteContent.payments || []), { ...modal.item, id: Date.now() }],
          });
        } else {
          setSiteContent({
            ...siteContent,
            payments: (siteContent.payments || []).map((record) =>
              record.id === modal.item.id ? { ...record, ...modal.item } : record
            ),
          });
        }
        break;
      }
      default:
        break;
    }

    // Only close modal if it wasn't already closed by the async save operation
    if (modal.type !== 'product') {
      closeModal();
    }
  };

  const addPaymentRecord = () => {
    const newRecord = {
      id: Date.now(),
      client: 'New Client',
      amount: 0,
      method: 'Cash',
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
      notes: 'Payment recorded from the dashboard',
    };

    setSiteContent({
      ...siteContent,
      payments: [...(siteContent.payments || []), newRecord],
    });
  };

  const updatePaymentRecord = (id, field, value) => {
    const updatedPayments = (siteContent.payments || []).map((record) =>
      record.id === id ? { ...record, [field]: value } : record
    );

    setSiteContent({
      ...siteContent,
      payments: updatedPayments,
    });
  };

  const deletePaymentRecord = (id) => {
    setSiteContent({
      ...siteContent,
      payments: (siteContent.payments || []).filter((record) => record.id !== id),
    });
  };

  const updateEvent = (id, field, value) => {
    const updated = siteContent.events.map((event) =>
      event.id === id ? { ...event, [field]: value } : event
    );
    setSiteContent({ ...siteContent, events: updated });
  };

  const deleteEvent = (id) => {
    setSiteContent({
      ...siteContent,
      events: siteContent.events.filter((event) => event.id !== id),
    });
  };

  const addGalleryItem = () => {
    const newItem = {
      id: Date.now(),
      title: 'New Gallery Item',
      tag: 'Featured',
      image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200',
    };

    setSiteContent({
      ...siteContent,
      gallery: [...siteContent.gallery, newItem],
    });
  };

  const updateGalleryItem = (id, field, value) => {
    const updatedGallery = siteContent.gallery.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setSiteContent({ ...siteContent, gallery: updatedGallery });
  };

  const deleteGalleryItem = (id) => {
    setSiteContent({
      ...siteContent,
      gallery: siteContent.gallery.filter((item) => item.id !== id),
    });
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      category_id: siteContent.catalog.categories[0]?.id || 1,
      name: 'New Rental Item',
      description: 'Describe this rental item',
      price: 'From $0',
      image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200',
    };

    setSiteContent({
      ...siteContent,
      catalog: {
        ...siteContent.catalog,
        products: [...siteContent.catalog.products, newProduct],
      },
    });
  };

  const updateProduct = (id, field, value) => {
    const updatedProducts = siteContent.catalog.products.map((product) =>
      product.id === id ? { ...product, [field]: value } : product
    );
    setSiteContent({
      ...siteContent,
      catalog: { ...siteContent.catalog, products: updatedProducts },
    });
  };

  const deleteProduct = (id) => {
    setSiteContent({
      ...siteContent,
      catalog: {
        ...siteContent.catalog,
        products: siteContent.catalog.products.filter((product) => product.id !== id),
      },
    });
  };

  const addCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: 'New Category',
      icon_name: 'LayersIcon',
    };

    setSiteContent({
      ...siteContent,
      catalog: {
        ...siteContent.catalog,
        categories: [...siteContent.catalog.categories, newCategory],
      },
    });
  };

  const updateCategory = (id, field, value) => {
    const updatedCategories = siteContent.catalog.categories.map((category) =>
      category.id === id ? { ...category, [field]: value } : category
    );
    setSiteContent({
      ...siteContent,
      catalog: { ...siteContent.catalog, categories: updatedCategories },
    });
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories.php?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showToast('Category deleted successfully!');
        await fetchCategoriesForAdmin();
        await fetchProductsForAdmin();
      } else {
        showToast('Failed to delete category: ' + (result.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Network error: ' + error.message, 'error');
    }
  };

  const dashboardStats = useMemo(() => {
    const totalRevenue = (siteContent.payments || []).reduce((sum, record) => sum + Number(record.amount || 0), 0);
    const paidCount = (siteContent.payments || []).filter((record) => record.status === 'Paid').length;
    const pendingCount = (siteContent.payments || []).filter((record) => record.status === 'Pending').length;

    return [
      { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, detail: `${paidCount} paid` },
      { label: 'Events', value: String(siteContent.events?.length || 0), detail: 'active listings' },
      { label: 'Gallery', value: String(siteContent.gallery?.length || 0), detail: 'images ready' },
      { label: 'Rentals', value: String(siteContent.catalog?.products?.length || 0), detail: `${pendingCount} pending payments` },
    ];
  }, [siteContent]);

  const tabIndexById = useMemo(
    () => tabs.reduce((acc, tab, index) => ({ ...acc, [tab.id]: index }), {}),
    []
  );

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) < 60) {
      setTouchStartX(null);
      return;
    }

    const currentIndex = tabIndexById[activeTab] ?? 0;
    const nextIndex = deltaX < 0 ? Math.min(currentIndex + 1, tabs.length - 1) : Math.max(currentIndex - 1, 0);
    setActiveTab(tabs[nextIndex].id);
    setTouchStartX(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                  <h4 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">{stat.value}</h4>
                  <p className="mt-2 text-sm text-slate-600">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-800">Events</h4>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Table</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteContent.events.map((event) => (
                        <tr key={event.id} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-medium text-slate-800">{event.name}</td>
                          <td className="py-2 text-slate-600">{event.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-800">Gallery</h4>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Table</span>
                </div>
                <div className="overflow-x-auto admin-scroll">
                  <table className="min-w-[420px] w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="py-2 pr-4">Title</th>
                        <th className="py-2 pr-4">Tag</th>
                        <th className="py-2">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteContent.gallery.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-medium text-slate-800">{item.title}</td>
                          <td className="py-2 pr-4 text-slate-600">{item.tag}</td>
                          <td className="py-2">
                            <img src={item.image_url} alt={item.title} className="h-10 w-16 rounded object-cover" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-800">Rentals</h4>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Table</span>
                </div>
                <div className="overflow-x-auto admin-scroll">
                  <table className="min-w-[420px] w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="py-2 pr-4">Item</th>
                        <th className="py-2 pr-4">Category</th>
                        <th className="py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteContent.catalog.products.map((product) => {
                        const category = siteContent.catalog.categories.find((entry) => entry.id === product.category_id);
                        return (
                          <tr key={product.id} className="border-b border-slate-100">
                            <td className="py-2 pr-4 font-medium text-slate-800">{product.name}</td>
                            <td className="py-2 pr-4 text-slate-600">{category?.name || 'General'}</td>
                            <td className="py-2 text-slate-600">{product.price}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-800">Hero</h4>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Table</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="py-2 pr-4">Badge</th>
                        <th className="py-2 pr-4">Title</th>
                        <th className="py-2">WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-medium text-slate-800">{siteContent.hero.badge}</td>
                        <td className="py-2 pr-4 text-slate-600">{siteContent.hero.title}</td>
                        <td className="py-2 text-slate-600">{siteContent.hero.whatsappLink ? 'Linked' : 'Not Set'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'general':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <input value={siteContent.business.companyName} onChange={(e) => updateBusinessField('companyName', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <input value={siteContent.business.tagline} onChange={(e) => updateBusinessField('tagline', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input value={siteContent.business.phone} onChange={(e) => updateBusinessField('phone', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input value={siteContent.business.email} onChange={(e) => updateBusinessField('email', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Location</label>
              <input value={siteContent.business.location} onChange={(e) => updateBusinessField('location', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Logo</label>
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 p-3">
                <img src={siteContent.business.logo} alt="Logo preview" className="h-16 w-16 rounded-full object-cover" />
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'business', 'logo')} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'communications': {
        const communications = {
          whatsappNumber: siteContent.communications?.whatsappNumber || siteContent.business.phone.replace(/\D/g, ''),
          widgetTitle: siteContent.communications?.widgetTitle || 'Quality Rental Support',
          availabilityText: siteContent.communications?.availabilityText || 'Online - Typically replies in 5 minutes',
          whatsappGreeting: siteContent.communications?.whatsappGreeting || 'Hello! How can we help with your event rental needs?',
        };
        return (
          <div className="max-w-3xl space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold">Customer contact</p>
              <h3 className="mt-1 text-2xl font-bold text-navy">Email & WhatsApp</h3>
              <p className="mt-2 text-sm text-slate-600">These details are used across the public website, including the contact page and WhatsApp chat widget.</p>
            </div>
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Public email address</label>
                <input type="email" value={siteContent.business.email} onChange={(e) => updateBusinessField('email', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Public phone number</label>
                <input type="tel" value={siteContent.business.phone} onChange={(e) => updateBusinessField('phone', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">WhatsApp number</label>
                <input type="tel" value={communications.whatsappNumber || ''} onChange={(e) => updateCommunicationField('whatsappNumber', e.target.value)} placeholder="231776748152" className="w-full rounded-lg border border-slate-200 p-2.5" />
                <p className="text-xs text-slate-500">Include the country code; spaces and symbols are accepted.</p>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp widget title</label>
                <input value={communications.widgetTitle || ''} onChange={(e) => updateCommunicationField('widgetTitle', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability text</label>
                <input value={communications.availabilityText || ''} onChange={(e) => updateCommunicationField('availabilityText', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">WhatsApp prompt</label>
                <textarea value={communications.whatsappGreeting || ''} onChange={(e) => updateCommunicationField('whatsappGreeting', e.target.value)} rows="3" className="w-full rounded-lg border border-slate-200 p-2.5" />
              </div>
            </div>
          </div>
        );
      }
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Badge</label>
              <input value={siteContent.hero.badge} onChange={(e) => updateHeroField('badge', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Main Title</label>
              <input value={siteContent.hero.title} onChange={(e) => updateHeroField('title', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea value={siteContent.hero.description} onChange={(e) => updateHeroField('description', e.target.value)} rows="4" className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp Link</label>
              <input value={siteContent.hero.whatsappLink} onChange={(e) => updateHeroField('whatsappLink', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Banner URL</label>
              <input value={siteContent.hero.backgroundImage} onChange={(e) => updateHeroField('backgroundImage', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Banner Upload</label>
              <div className="flex items-center gap-4 rounded-lg border border-dashed border-slate-300 p-3">
                <img src={siteContent.hero.backgroundImage} alt="Hero preview" className="h-24 w-32 rounded-lg object-cover" />
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')} />
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">About Heading</label>
              <input value={siteContent.about.heading} onChange={(e) => updateAboutField('heading', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">About Description</label>
              <textarea value={siteContent.about.description} onChange={(e) => updateAboutField('description', e.target.value)} rows="4" className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mission</label>
              <textarea value={siteContent.about.mission} onChange={(e) => updateAboutField('mission', e.target.value)} rows="3" className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vision</label>
              <textarea value={siteContent.about.vision} onChange={(e) => updateAboutField('vision', e.target.value)} rows="3" className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">Events</h4>
              <button type="button" onClick={() => openModal('event', 'create')} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" />
                Add Event
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Description</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {siteContent.events.map((event) => (
                    <tr key={event.id} className="border-t border-slate-200">
                      <td className="px-3 py-3 font-medium text-slate-800">{event.name}</td>
                      <td className="px-3 py-3 text-slate-600">{event.description}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openModal('event', 'edit', event)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100">Edit</button>
                          <button type="button" onClick={() => deleteEvent(event.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">Gallery</h4>
              <button type="button" onClick={() => openModal('gallery', 'create')} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" />
                Add Image
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3">Title</th>
                    <th className="px-3 py-3">Tag</th>
                    <th className="px-3 py-3">Image</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {siteContent.gallery.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-3 py-3 font-medium text-slate-800">{item.title}</td>
                      <td className="px-3 py-3 text-slate-600">{item.tag}</td>
                      <td className="px-3 py-3">
                        <img src={item.image_url} alt={item.title} className="h-10 w-16 rounded object-cover" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openModal('gallery', 'edit', item)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100">Edit</button>
                          <button type="button" onClick={() => deleteGalleryItem(item.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'rentals':
        return (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-semibold text-slate-700 mb-4">Section Header</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Badge (Small Text)</label>
                  <input value={siteContent.catalog?.badge || ''} onChange={(e) => setSiteContent({
                    ...siteContent,
                    catalog: { ...siteContent.catalog, badge: e.target.value }
                  })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title (Large Text)</label>
                  <input value={siteContent.catalog?.title || ''} onChange={(e) => setSiteContent({
                    ...siteContent,
                    catalog: { ...siteContent.catalog, title: e.target.value }
                  })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-700">Categories</h4>
                <button type="button" onClick={() => openModal('category', 'create')} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Icon</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteContent.catalog.categories.map((category) => (
                      <tr key={category.id} className="border-t border-slate-200">
                        <td className="px-3 py-3 font-medium text-slate-800">{category.name}</td>
                        <td className="px-3 py-3 text-slate-600">{category.icon_name}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openModal('category', 'edit', category)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100">Edit</button>
                            <button type="button" onClick={() => deleteCategory(category.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-700">Products</h4>
                <button type="button" onClick={() => openModal('product', 'create')} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  Add Rental
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Price</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteContent.catalog.products.map((product) => {
                      const category = siteContent.catalog.categories.find((entry) => entry.id === product.category_id);
                      return (
                        <tr key={product.id} className="border-t border-slate-200">
                          <td className="px-3 py-3 font-medium text-slate-800">{product.name}</td>
                          <td className="px-3 py-3 text-slate-600">{category?.name || 'General'}</td>
                          <td className="px-3 py-3 text-slate-600">{product.price}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button type="button" onClick={() => openModal('product', 'edit', product)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100">Edit</button>
                              <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Footer description</label>
              <textarea value={siteContent.footer.description} onChange={(e) => updateFooterField('description', e.target.value)} rows="3" className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook link</label>
              <input value={siteContent.footer.socials.facebook} onChange={(e) => updateSocialLink('facebook', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram link</label>
              <input value={siteContent.footer.socials.instagram} onChange={(e) => updateSocialLink('instagram', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter/X link</label>
              <input value={siteContent.footer.socials.twitter} onChange={(e) => updateSocialLink('twitter', e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5" />
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">Business Payment Records</h4>
              <button type="button" onClick={() => openModal('payment', 'create')} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" />
                Record Payment
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3">Client</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Method</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Notes</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(siteContent.payments || []).map((record) => (
                    <tr key={record.id} className="border-t border-slate-200 align-top">
                      <td className="px-3 py-3 font-medium text-slate-800">{record.client}</td>
                      <td className="px-3 py-3 text-slate-600">{record.date}</td>
                      <td className="px-3 py-3 text-slate-600">${Number(record.amount || 0).toLocaleString()}</td>
                      <td className="px-3 py-3 text-slate-600">{record.method}</td>
                      <td className="px-3 py-3 text-slate-600">{record.status}</td>
                      <td className="px-3 py-3 text-slate-600">{record.notes}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openModal('payment', 'edit', record)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100">Edit</button>
                          <button type="button" onClick={() => deletePaymentRecord(record.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'quotes':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold">Incoming</p>
                <h3 className="text-2xl font-bold text-navy">Quote Requests</h3>
              </div>
              <button type="button" onClick={fetchQuoteRequests} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white hover:bg-navy transition-colors">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>

            {quoteRequests.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">No quote requests yet.</div>
            ) : (
              <div className="space-y-4">
                {quoteRequests.map((q) => (
                  <div key={q.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedQuote(expandedQuote === q.id ? null : q.id)}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          q.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          q.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                          q.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>{q.status}</span>
                        <span className="font-semibold text-slate-800">{q.first_name} {q.last_name}</span>
                        <span className="text-sm text-slate-500">{q.email}</span>
                        <span className="text-sm text-slate-500">{q.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        <span>{expandedQuote === q.id ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedQuote === q.id && (
                      <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50">
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div><span className="font-medium text-slate-700">Event Date:</span> <span className="text-slate-600">{q.event_date}</span></div>
                          <div><span className="font-medium text-slate-700">Duration:</span> <span className="text-slate-600">{q.duration_days} day(s)</span></div>
                          <div><span className="font-medium text-slate-700">Delivery:</span> <span className="text-slate-600">{q.delivery_type}</span></div>
                          <div><span className="font-medium text-slate-700">Contact via:</span> <span className="text-slate-600 capitalize">{q.contact_method}</span></div>
                          {q.delivery_address && <div className="sm:col-span-2"><span className="font-medium text-slate-700">Address:</span> <span className="text-slate-600">{q.delivery_address}</span></div>}
                          {q.special_notes && <div className="sm:col-span-2"><span className="font-medium text-slate-700">Notes:</span> <span className="text-slate-600">{q.special_notes}</span></div>}
                          {q.estimated_total && <div><span className="font-medium text-slate-700">Est. Total:</span> <span className="text-slate-600 font-semibold">${parseFloat(q.estimated_total).toFixed(2)}</span></div>}
                          {q.items_summary && <div className="sm:col-span-2"><span className="font-medium text-slate-700">Items:</span> <span className="text-slate-600">{q.items_summary}</span></div>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                          <span className="text-sm font-medium text-slate-600">Update status:</span>
                          {['Pending', 'Reviewed', 'Approved', 'Cancelled'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateQuoteStatus(q.id, s)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                q.status === s
                                  ? 'bg-navy text-white'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >{s}</button>
                          ))}
                          <button
                            type="button"
                            onClick={() => deleteQuoteRequest(q.id)}
                            className="ml-auto flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold">Inbox</p>
                <h3 className="text-2xl font-bold text-navy">Contact Messages</h3>
              </div>
              <button type="button" onClick={fetchContactMessages} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white hover:bg-navy transition-colors">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>

            {contactMessages.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">No contact messages yet.</div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((m) => (
                  <div key={m.id} className={`rounded-2xl border shadow-sm overflow-hidden ${m.status === 'Unread' ? 'border-gold/40 bg-gold/5' : 'border-slate-200 bg-white'}`}>
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => {
                        setExpandedContact(expandedContact === m.id ? null : m.id);
                        if (m.status === 'Unread') updateContactStatus(m.id, 'Read');
                      }}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          m.status === 'Unread' ? 'bg-gold/20 text-yellow-800' : 'bg-slate-100 text-slate-600'
                        }`}>{m.status}</span>
                        <span className="font-semibold text-slate-800">{m.name}</span>
                        <span className="text-sm text-slate-500">{m.email}</span>
                        {m.phone && <span className="text-sm text-slate-500">{m.phone}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="hidden sm:block font-medium text-slate-700 truncate max-w-[160px]">{m.subject}</span>
                        <span>{new Date(m.created_at).toLocaleDateString()}</span>
                        <span>{expandedContact === m.id ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedContact === m.id && (
                      <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50">
                        <div className="text-sm">
                          <span className="font-medium text-slate-700">Subject:</span>
                          <span className="ml-2 text-slate-800 font-semibold">{m.subject}</span>
                        </div>
                        <div className="rounded-lg bg-white border border-slate-200 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                          {m.message}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                          <a
                            href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                            className="flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold transition-colors"
                          >
                            <Mail className="h-3 w-3" /> Reply by Email
                          </a>
                          {['Unread', 'Read', 'Replied'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateContactStatus(m.id, s)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                m.status === s
                                  ? 'bg-navy text-white'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >{s}</button>
                          ))}
                          <button
                            type="button"
                            onClick={() => deleteContactMessage(m.id)}
                            className="ml-auto flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'chatlogs':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">AI Chat Activity Logs</h4>
              <button type="button" onClick={fetchChatLogs} className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
              {chatLogs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                  No chat logs available
                </div>
              ) : (
                chatLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          log.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {log.sender}
                        </span>
                        <span className="text-sm font-medium text-slate-800">{log.user_name || 'Anonymous'}</span>
                      </div>
                      <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-slate-600">{log.message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>
                        <span className="font-medium">Device:</span> {log.device_type || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">OS:</span> {log.device_os || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Browser:</span> {log.browser || 'Unknown'} {log.browser_version || ''}
                      </div>
                      <div>
                        <span className="font-medium">Screen:</span> {log.screen_resolution || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Language:</span> {log.language || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {log.location_city ? `${log.location_city}, ${log.location_country}` : log.location_country || 'Unknown'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3">User Name</th>
                    <th className="px-3 py-3">Message</th>
                    <th className="px-3 py-3">Sender</th>
                    <th className="px-3 py-3">Device</th>
                    <th className="px-3 py-3">OS</th>
                    <th className="px-3 py-3">Browser</th>
                    <th className="px-3 py-3">Screen</th>
                    <th className="px-3 py-3">Language</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="px-3 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {chatLogs.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-3 py-8 text-center text-slate-500">No chat logs available</td>
                    </tr>
                  ) : (
                    chatLogs.map((log) => (
                      <tr key={log.id} className="border-t border-slate-200">
                        <td className="px-3 py-3 font-medium text-slate-800">{log.user_name || 'Anonymous'}</td>
                        <td className="px-3 py-3 text-slate-600 max-w-xs truncate" title={log.message}>{log.message}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            log.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {log.sender}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{log.device_type || 'Unknown'}</td>
                        <td className="px-3 py-3 text-slate-600 text-xs">{log.device_os || 'Unknown'}</td>
                        <td className="px-3 py-3 text-slate-600 text-xs">{log.browser || 'Unknown'} {log.browser_version || ''}</td>
                        <td className="px-3 py-3 text-slate-600 text-xs">{log.screen_resolution || 'Unknown'}</td>
                        <td className="px-3 py-3 text-slate-600 text-xs">{log.language || 'Unknown'}</td>
                        <td className="px-3 py-3 text-slate-600 text-xs">{log.location_city ? `${log.location_city}, ${log.location_country}` : log.location_country || 'Unknown'}</td>
                        <td className="px-3 py-3 text-slate-600 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'colors':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">Website Color Settings</h4>
              <button 
                type="button" 
                onClick={saveColorSettings}
                disabled={isSavingColors}
                className="flex items-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-medium text-white hover:bg-navy transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSavingColors ? 'Saving...' : 'Save Colors'}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.primary || '#D4AF37' }}
                  />
                  Primary Color (Gold)
                </label>
                <input
                  type="color"
                  value={colorSettings.primary || '#D4AF37'}
                  onChange={(e) => setColorSettings({ ...colorSettings, primary: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.secondary || '#1E3A5F' }}
                  />
                  Secondary Color (Navy)
                </label>
                <input
                  type="color"
                  value={colorSettings.secondary || '#1E3A5F'}
                  onChange={(e) => setColorSettings({ ...colorSettings, secondary: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.accent || '#F5F5F5' }}
                  />
                  Accent Color
                </label>
                <input
                  type="color"
                  value={colorSettings.accent || '#F5F5F5'}
                  onChange={(e) => setColorSettings({ ...colorSettings, accent: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.text || '#1F2937' }}
                  />
                  Text Color
                </label>
                <input
                  type="color"
                  value={colorSettings.text || '#1F2937'}
                  onChange={(e) => setColorSettings({ ...colorSettings, text: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.background || '#FFFFFF' }}
                  />
                  Background Color
                </label>
                <input
                  type="color"
                  value={colorSettings.background || '#FFFFFF'}
                  onChange={(e) => setColorSettings({ ...colorSettings, background: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.success || '#10B981' }}
                  />
                  Success Color
                </label>
                <input
                  type="color"
                  value={colorSettings.success || '#10B981'}
                  onChange={(e) => setColorSettings({ ...colorSettings, success: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.error || '#EF4444' }}
                  />
                  Error Color
                </label>
                <input
                  type="color"
                  value={colorSettings.error || '#EF4444'}
                  onChange={(e) => setColorSettings({ ...colorSettings, error: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-3">
                  <div 
                    className="w-8 h-8 rounded border border-slate-300"
                    style={{ backgroundColor: colorSettings.warning || '#F59E0B' }}
                  />
                  Warning Color
                </label>
                <input
                  type="color"
                  value={colorSettings.warning || '#F59E0B'}
                  onChange={(e) => setColorSettings({ ...colorSettings, warning: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-slate-700 mb-3">Color Preview</h5>
              <div className="grid gap-3 md:grid-cols-4">
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: colorSettings.primary || '#D4AF37', color: '#FFFFFF' }}
                >
                  Primary
                </div>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: colorSettings.secondary || '#1E3A5F', color: '#FFFFFF' }}
                >
                  Secondary
                </div>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: colorSettings.accent || '#F5F5F5', color: colorSettings.text || '#1F2937' }}
                >
                  Accent
                </div>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: colorSettings.background || '#FFFFFF', color: colorSettings.text || '#1F2937', border: '1px solid #e5e7eb' }}
                >
                  Background
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen && !isLoggedIn) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold">Admin Login</p>
              <h3 className="mt-1 text-2xl font-bold text-navy">Website Control</h3>
            </div>
            <button type="button" onClick={closePanel} className="rounded-full p-2 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 focus:border-gold focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-slate-200 p-2.5 pr-10 focus:border-gold focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-white hover:bg-navy transition-colors">
              <div className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </div>
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full text-sm text-gold hover:underline"
            >
              Forgot Password?
            </button>
          </form>

          {showForgotPassword && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-navy mb-4">Reset Password</h4>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 focus:border-gold focus:outline-none"
                    required
                  />
                </div>
                {forgotMessage && (
                  <p className={`text-sm ${forgotMessage.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                    {forgotMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingForgot}
                  className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {isSubmittingForgot ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail('');
                    setForgotMessage('');
                  }}
                  className="w-full text-sm text-slate-600 hover:text-slate-800"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {modal.open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm md:items-center md:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl md:max-h-[85vh] md:w-full md:max-w-2xl md:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {modal.mode === 'create' ? 'Create' : 'Edit'} {modal.type}
              </h3>
              <button type="button" onClick={closeModal} className="rounded-full p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pb-2">
              {modal.type === 'event' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Name</label>
                    <input value={modal.item?.name || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, name: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea value={modal.item?.description || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, description: e.target.value } })} rows="4" className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                </>
              )}

              {modal.type === 'gallery' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input value={modal.item?.title || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, title: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tag</label>
                    <input value={modal.item?.tag || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, tag: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input value={modal.item?.image_url || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, image_url: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleModalImageUpload} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                </>
              )}

              {modal.type === 'category' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category Name</label>
                    <input value={modal.item?.name || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, name: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Icon Name</label>
                    <input value={modal.item?.icon_name || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, icon_name: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                </>
              )}

              {modal.type === 'product' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input value={modal.item?.name || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, name: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <div className="flex gap-2">
                      <select 
                        value={modal.item?.price_currency || 'USD'} 
                        onChange={(e) => setModal({ ...modal, item: { ...modal.item, price_currency: e.target.value } })}
                        className="w-24 rounded-lg border border-slate-200 p-2.5"
                      >
                        <option value="USD">USD</option>
                        <option value="LRD">LRD</option>
                      </select>
                      <input 
                        value={modal.item?.price || ''} 
                        onChange={(e) => setModal({ ...modal, item: { ...modal.item, price: e.target.value } })} 
                        className="flex-1 rounded-lg border border-slate-200 p-2.5" 
                        placeholder="Enter price"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      {modal.item?.price_currency === 'LRD' ? 'Price in Liberian Dollars (LRD)' : 'Price in US Dollars (USD)'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea value={modal.item?.description || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, description: e.target.value } })} rows="4" className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select value={modal.item?.category_id || siteContent.catalog.categories[0]?.id || 1} onChange={(e) => setModal({ ...modal, item: { ...modal.item, category_id: Number(e.target.value) } })} className="w-full rounded-lg border border-slate-200 p-2.5">
                      {siteContent.catalog.categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available</label>
                      <select value={modal.item?.is_available !== undefined ? modal.item.is_available : true} onChange={(e) => setModal({ ...modal, item: { ...modal.item, is_available: e.target.value === 'true' } })} className="w-full rounded-lg border border-slate-200 p-2.5">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock Quantity</label>
                      <input type="number" value={modal.item?.stock_quantity || 0} onChange={(e) => setModal({ ...modal, item: { ...modal.item, stock_quantity: Number(e.target.value) } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input value={modal.item?.image_url || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, image_url: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Preview</label>
                    {modal.item?.image_url ? (
                      <img src={modal.item.image_url} alt="Product preview" className="h-32 w-32 rounded-lg object-cover border border-slate-200" />
                    ) : (
                      <div className="h-32 w-32 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleModalImageUpload} className="w-full rounded-lg border border-slate-200 p-2.5" />
                  </div>
                </>
              )}

              {modal.type === 'payment' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Client</label>
                      <input value={modal.item?.client || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, client: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <input type="date" value={modal.item?.date || new Date().toISOString().slice(0, 10)} onChange={(e) => setModal({ ...modal, item: { ...modal.item, date: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <input type="number" value={modal.item?.amount || 0} onChange={(e) => setModal({ ...modal, item: { ...modal.item, amount: Number(e.target.value) } })} className="w-full rounded-lg border border-slate-200 p-2.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Method</label>
                      <select value={modal.item?.method || 'Cash'} onChange={(e) => setModal({ ...modal, item: { ...modal.item, method: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5">
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Mobile Money</option>
                        <option>Card</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Status</label>
                      <select value={modal.item?.status || 'Pending'} onChange={(e) => setModal({ ...modal, item: { ...modal.item, status: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2.5">
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Overdue</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Notes</label>
                      <textarea value={modal.item?.notes || ''} onChange={(e) => setModal({ ...modal, item: { ...modal.item, notes: e.target.value } })} rows="3" className="w-full rounded-lg border border-slate-200 p-2.5" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-100">Cancel</button>
              <button type="button" onClick={saveModalContent} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-navy">Save</button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold">Security</p>
                <h3 className="mt-1 text-2xl font-bold text-navy">Change Password & Username</h3>
              </div>
              <button type="button" onClick={() => {
                setShowChangePassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setNewUsername('');
                setChangePasswordMessage('');
              }} className="rounded-full p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">New Username (Optional)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Leave blank to keep current username"
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Current Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-200 p-2.5 pr-10 focus:border-gold focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">New Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-slate-200 p-2.5 pr-10 focus:border-gold focus:outline-none"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-slate-200 p-2.5 pr-10 focus:border-gold focus:outline-none"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {changePasswordMessage && (
                <p className={`text-sm ${changePasswordMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {changePasswordMessage}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setChangePasswordMessage('');
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingChangePassword}
                  className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-white hover:bg-navy transition-colors disabled:opacity-50"
                >
                  {isSubmittingChangePassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-24 right-4 md:top-8 md:right-8 px-6 py-4 rounded-lg shadow-lg z-[100] flex items-center space-x-3 animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <div>
            <h4 className="font-medium">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/70 p-0 backdrop-blur-sm">
        <div
          className="mx-auto flex min-h-screen max-w-7xl min-h-0 flex-col overflow-y-auto overflow-x-hidden bg-white shadow-2xl md:h-full md:min-h-0 md:flex-row md:rounded-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
        {/* Mobile Navigation Overlay */}
        {mobileNavOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Mobile Navigation Drawer */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-slate-200 bg-slate-950 text-white transform transition-transform duration-300 ease-in-out md:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="border-b border-slate-700 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Control</p>
              <h3 className="mt-2 text-xl font-bold">Admin Panel</h3>
            </div>
            <button 
              type="button" 
              onClick={() => setMobileNavOpen(false)}
              className="rounded-full p-2 hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="admin-scroll flex-1 space-y-2 overflow-y-auto p-4">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setMobileNavOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activeTab === id ? 'bg-gold text-slate-900' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-700 p-4 space-y-2">
            <button 
              type="button" 
              onClick={() => {
                setShowChangePassword(true);
                setMobileNavOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Shield className="h-4 w-4" />
              Change Password
            </button>
            <button type="button" onClick={() => {
              handleLogout();
              setMobileNavOpen(false);
            }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
              <LogIn className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-950 text-white md:flex">
          <div className="border-b border-slate-700 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Control</p>
            <h3 className="mt-2 text-xl font-bold">Admin Panel</h3>
          </div>

          <nav className="admin-scroll flex-1 space-y-2 overflow-y-auto p-4">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setMobileNavOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activeTab === id ? 'bg-gold text-slate-900' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-700 p-4 space-y-2">
            <button 
              type="button" 
              onClick={() => setShowChangePassword(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Shield className="h-4 w-4" />
              Change Password
            </button>
            <button type="button" onClick={() => {
              if (confirm('Reset website content? Rental products and inventory will not be affected.')) {
                resetWebsiteContent();
              }
            }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
              <RefreshCw className="h-4 w-4" />
              Reset Content
            </button>
            <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-3 py-2 text-sm font-medium text-slate-900 hover:bg-yellow-400">
              <Shield className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col bg-slate-50">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setMobileNavOpen((prev) => !prev)} className="rounded-xl border border-slate-200 p-2 md:hidden">
                <Menu className="h-5 w-5 text-slate-700" />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Dashboard</p>
                <h3 className="text-lg font-bold text-slate-900 md:text-2xl">Site Content Manager</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAndClose}
                className="flex items-center gap-2 bg-gold text-slate-900 px-3 py-2 rounded-lg font-medium hover:bg-white hover:text-slate-900 transition-colors md:px-4"
              >
                <Save className="h-4 w-4" />
                <span className="hidden md:inline">Save & Close</span>
                <span className="md:hidden">Save</span>
              </button>
              <div className="hidden items-center gap-2 md:flex">
                <button type="button" onClick={refreshData} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Shield className="h-4 w-4" />
                  Logout
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('quality-rental-site-content-v1');
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {renderContent()}
          </div>
        </main>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
