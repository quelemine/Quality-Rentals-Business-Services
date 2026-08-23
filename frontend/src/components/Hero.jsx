import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Clock, Shield } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { useSiteContent } from '../context/SiteContentContext';

const Hero = () => {
  const { setIsDrawerOpen } = useQuote();
  const { siteContent } = useSiteContent();
  const hero = siteContent.hero;

  const heroSlides = useMemo(() => {
    const slides = Array.isArray(hero?.slides) && hero.slides.length > 0 ? hero.slides : [{ id: 1, image: hero.backgroundImage, badge: hero.badge, title: hero.title, description: hero.description }];
    return slides.map((slide, index) => ({
      ...slide,
      image: slide.image || slide.backgroundImage || hero.backgroundImage,
      badge: slide.badge || hero.badge,
      title: slide.title || hero.title,
      description: slide.description || hero.description,
      id: slide.id || index + 1,
    }));
  }, [hero]);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  const currentSlide = heroSlides[activeSlide] || heroSlides[0];

  return (
    <section className="relative overflow-hidden bg-light-grey py-16 lg:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url(${currentSlide.image})`,
          transform: 'scale(1.05)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-gold text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                {currentSlide.badge}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg">
              {currentSlide.title}
            </h1>

            <p className="text-lg text-slate-100 max-w-xl drop-shadow-md">
              {currentSlide.description}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4">
              <a
                href={hero.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 text-white px-3 py-3 text-sm rounded-full font-medium hover:bg-green-600 transition-colors sm:px-8 sm:py-4 sm:text-base"
              >
                <MessageCircle className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                WhatsApp
              </a>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center justify-center bg-gold text-white px-3 py-3 text-sm rounded-full font-medium hover:bg-navy transition-colors sm:px-8 sm:py-4 sm:text-base"
              >
                Get a Quote
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide ? 'w-10 bg-gold' : 'w-2.5 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3 sm:gap-6">
              <div className="text-center text-white/90">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/10 rounded-full mb-3">
                  <CheckCircle className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-medium text-white">Quality Equipment</h3>
                <p className="text-sm text-slate-200 mt-1">Premium rentals</p>
              </div>
              <div className="text-center text-white/90">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/10 rounded-full mb-3">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-medium text-white">On-Time Delivery</h3>
                <p className="text-sm text-slate-200 mt-1">Reliable service</p>
              </div>
              <div className="text-center text-white/90">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/10 rounded-full mb-3">
                  <Shield className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-medium text-white">Fully Insured</h3>
                <p className="text-sm text-slate-200 mt-1">Peace of mind</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 opacity-0 pointer-events-none">
              <div className="transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-navy/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
