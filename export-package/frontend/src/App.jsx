import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QuoteProvider } from './context/QuoteContext';
import { SiteContentProvider } from './context/SiteContentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import QuoteDrawer from './components/QuoteDrawer';
import WhatsAppWidget from './components/WhatsAppWidget';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RentalsPage from './pages/RentalsPage';
import GalleryPage from './pages/GalleryPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';

function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
      <QuoteDrawer />
      <WhatsAppWidget />
      <MobileNav />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <QuoteProvider>
        <HashRouter>
          <AppLayout />
        </HashRouter>
      </QuoteProvider>
    </SiteContentProvider>
  );
}

export default App;
