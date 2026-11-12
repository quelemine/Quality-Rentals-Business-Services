import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QuoteProvider } from './context/QuoteContext';
import { SiteContentProvider } from './context/SiteContentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import QuoteDrawer from './components/QuoteDrawer';
import WhatsAppWidget from './components/WhatsAppWidget';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import AIChat from './components/AIChat';
import AdminPanel from './components/AdminPanel';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RentalsPage from './pages/RentalsPage';
import GalleryPage from './pages/GalleryPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';

function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
      <QuoteDrawer />
      <WhatsAppWidget />
      <AIChat />
      <MobileNav />
      <Toast />
      <AdminPanel />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <SiteContentProvider>
        <QuoteProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </BrowserRouter>
        </QuoteProvider>
      </SiteContentProvider>
    </HelmetProvider>
  );
}

export default App;