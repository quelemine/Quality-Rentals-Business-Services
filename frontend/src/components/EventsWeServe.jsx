import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';

const EventsWeServe = () => {
  const { siteContent } = useSiteContent();

  const events = [
    {
      id: 1,
      name: 'Weddings',
      description: 'Elegant rentals for your special day',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600'
    },
    {
      id: 2,
      name: 'Birthday Parties',
      description: 'Celebrate in style',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'
    },
    {
      id: 3,
      name: 'Corporate Events',
      description: 'Professional equipment for business',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600'
    },
    {
      id: 4,
      name: 'Church Events',
      description: 'Religious gathering supplies',
      image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600'
    },
    {
      id: 5,
      name: 'Family Reunions',
      description: 'Bring families together',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600'
    },
    {
      id: 6,
      name: 'And More',
      description: 'Any event, any size',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600'
    }
  ];

  return (
    <section id="events" className="py-16 bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm tracking-wider uppercase">Events We Serve</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy mt-2">Perfect Equipment for Every Occasion</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif font-bold text-white text-xl">{event.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsWeServe;
