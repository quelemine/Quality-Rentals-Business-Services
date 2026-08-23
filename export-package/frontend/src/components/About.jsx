import React from 'react';
import { Award, Users, Calendar, Shield, Heart, Star } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const About = () => {
  const { siteContent } = useSiteContent();
  const about = siteContent.about;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">
            {about.heading}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {about.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-serif font-bold text-navy mb-4">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded with a passion for excellence, {about.heading} has been serving the event industry with dedication and professionalism. We understand that every event is unique, and we're committed to providing the right equipment to make your vision come to life.
            </p>
            <p className="text-gray-600 mb-4">
              From intimate gatherings to grand celebrations, our extensive inventory includes premium tents, elegant chairs, sturdy tables, water tanks, and essential event equipment. We take pride in maintaining our equipment to the highest standards, ensuring reliability and safety for your special occasions.
            </p>
            <p className="text-gray-600">
              Our team of experienced professionals is dedicated to providing personalized service, timely delivery, and setup assistance to make your event planning seamless and stress-free.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-gold/20 to-navy/10 rounded-2xl p-8">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"
                alt="Event Setup"
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-light-grey rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-gold mr-3" />
              <h3 className="text-xl font-serif font-bold text-navy">Our Mission</h3>
            </div>
            <p className="text-gray-600">{about.mission}</p>
          </div>
          <div className="bg-light-grey rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Star className="w-8 h-8 text-gold mr-3" />
              <h3 className="text-xl font-serif font-bold text-navy">Our Vision</h3>
            </div>
            <p className="text-gray-600">{about.vision}</p>
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-serif font-bold text-navy text-center mb-12">Our Core Values</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-semibold text-navy mb-2">Quality Excellence</h4>
              <p className="text-gray-600 text-sm">We maintain the highest standards for all our equipment and services.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Users className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-semibold text-navy mb-2">Customer First</h4>
              <p className="text-gray-600 text-sm">Your satisfaction is our priority. We listen and deliver beyond expectations.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Calendar className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-semibold text-navy mb-2">Reliability</h4>
              <p className="text-gray-600 text-sm">On-time delivery and dependable equipment you can count on.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Shield className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-semibold text-navy mb-2">Integrity</h4>
              <p className="text-gray-600 text-sm">Honest pricing, transparent communication, and ethical business practices.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Heart className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-semibold text-navy mb-2">Passion</h4>
              <p className="text-gray-600 text-sm">We love what we do and pour our heart into every event we serve.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Star className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-semibold text-navy mb-2">Innovation</h4>
              <p className="text-gray-600 text-sm">Continuously improving our services and expanding our inventory.</p>
            </div>
          </div>
        </div>

        <div className="bg-navy rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl font-serif font-bold mb-8 text-center">Why Choose Us?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.stats.map((stat) => (
              <div className="text-center" key={stat.label}>
                <div className="text-4xl font-bold text-gold mb-2">{stat.value}</div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
