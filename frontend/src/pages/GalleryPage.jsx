import React from 'react';
import SEO from '../components/SEO/SEO';
import Gallery from '../components/Gallery';

const GalleryPage = () => (
  <>
  <SEO
  title="Event Rental Gallery | Quality Rental Business Services"
  description="View our event rental setups, wedding decorations, tents, seating, stages, and other event services in Liberia."
  canonical="https://suerental.com/gallery"
/>
  <div className="bg-slate-50 py-16">
    <Gallery />
  </div>
  </>
);

export default GalleryPage;
