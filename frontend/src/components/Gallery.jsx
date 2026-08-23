import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import Lightbox from './Lightbox';

const Gallery = () => {
  const { siteContent } = useSiteContent();
  const [selectedImage, setSelectedImage] = useState(null);
  const gallery = siteContent.gallery || [];

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm tracking-wider uppercase">Our Gallery</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy mt-2">Events We've Made Memorable</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                index === 0 ? 'col-span-2 sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                style={{ minHeight: index === 0 ? '220px' : '160px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                  <span className="text-gold text-[10px] font-medium sm:text-sm">{item.tag}</span>
                  <h3 className="text-white font-serif font-bold text-sm mt-1 sm:text-lg">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          images={gallery}
          onClose={() => setSelectedImage(null)}
          onNext={() => {
            const currentIndex = gallery.findIndex((img) => img.id === selectedImage.id);
            const nextIndex = (currentIndex + 1) % gallery.length;
            setSelectedImage(gallery[nextIndex]);
          }}
          onPrev={() => {
            const currentIndex = gallery.findIndex((img) => img.id === selectedImage.id);
            const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            setSelectedImage(gallery[prevIndex]);
          }}
        />
      )}
    </section>
  );
};

export default Gallery;
