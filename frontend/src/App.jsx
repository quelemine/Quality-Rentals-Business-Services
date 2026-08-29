import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
      {/* AdminPanel overlay — only activates when ?admin=1 is in the URL after login */}
      <AdminPanel />
    </div>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <QuoteProvider>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* Clean standalone login page — no overlapping widgets */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            {/* Redirect old /admin URL to the new login page */}
            <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </HashRouter>
      </QuoteProvider>
    </SiteContentProvider>
  );
}

export default App;
