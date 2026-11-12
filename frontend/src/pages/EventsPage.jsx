import React from 'react';
import SEO from '../components/SEO/SEO';
import EventsWeServe from '../components/EventsWeServe';

const EventsPage = () => (
  <>
  <SEO
  title="Events We Serve | Quality Rental Business Services"
  description="Quality Rental Business Services provides event rental equipment for weddings, birthday parties, corporate events, church events, family reunions, and more in Liberia."
  canonical="https://suerental.com/events"
/>
  <div className="bg-white py-16">
    <EventsWeServe />
  </div>
  </>
);

export default EventsPage;
