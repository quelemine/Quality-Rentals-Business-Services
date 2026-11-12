import React from 'react';
import SEO from '../components/SEO/SEO';
import Hero from '../components/Hero';
import About from '../components/About';
import ProductCatalog from '../components/ProductCatalog';
import EventsWeServe from '../components/EventsWeServe';
import Gallery from '../components/Gallery';

const HomePage = () => (
  <>
  <SEO
  title="Quality Rental Business Services | Event Rentals in Liberia"
  description="Quality Rental Business Services provides premium event rentals in Liberia, including tents, chairs, tables, event equipment, and more."
  canonical="https://suerental.com/"
/>
    <Hero />
    <About />
    <ProductCatalog />
    <EventsWeServe />
    <Gallery />
  </>
);

export default HomePage;
