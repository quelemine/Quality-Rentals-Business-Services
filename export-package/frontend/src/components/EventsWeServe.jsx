import React from 'react';
import { Heart, Building2, Church, Users, MoreHorizontal, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const iconMap = {
  weddings: Heart,
  birthday: Sparkles,
  corporate: Building2,
  church: Church,
  reunion: Users,
  more: MoreHorizontal,
};

const EventsWeServe = () => {
  const { siteContent } = useSiteContent();
  const events = siteContent.events || [];

  return (
    <section id="events" className="py-16 bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm tracking-wider uppercase">Events We Serve</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy mt-2">Perfect Equipment for Every Occasion</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {events.map((event, index) => {
            const Icon = iconMap[event.name?.toLowerCase().replace(/[^a-z]/g, '')] || MoreHorizontal;
            return (
              <div
                key={event.id || index}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center cursor-pointer hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon className="w-8 h-8 text-gold group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-serif font-bold text-navy text-lg mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsWeServe;
