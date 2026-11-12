import React from 'react';
import SEO from '../components/SEO/SEO';
import ProductCatalog from '../components/ProductCatalog';

const RentalsPage = () => (
  <>
    <SEO
      title="Event Rentals in Liberia | Quality Rental Business Services"
      description="Explore premium event rentals in Liberia, including tents, chairs, tables, water tanks, sound equipment, and other event supplies."
      canonical="https://suerental.com/rentals"
    />

    <main>
      <section className="bg-white pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-navy">
            Event Rentals in Liberia
          </h1>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Quality Rental Business Services provides premium event rental
            equipment in Liberia for weddings, birthday parties, corporate
            events, church gatherings, family celebrations, and other special
            occasions. Our rental inventory includes tents, chairs, tables,
            water tanks, sound equipment, and other essential event supplies.
          </p>
        </div>
      </section>

      <div className="bg-white pb-16">
        <ProductCatalog />
      </div>
    </main>
  </>
);

export default RentalsPage;