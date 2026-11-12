import React from 'react';
import SEO from '../components/SEO/SEO';
import About from '../components/About';

const AboutPage = () => (
  <>
  <SEO
  title="About Us | Quality Rental Business Services"
  description="Learn about Quality Rental Business Services, a trusted provider of premium event rental equipment and services in Liberia."
  canonical="https://suerental.com/about"
/>
  <div className="bg-slate-50 py-16">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <About />
    </div>
  </div>
  </>
);

export default AboutPage;
