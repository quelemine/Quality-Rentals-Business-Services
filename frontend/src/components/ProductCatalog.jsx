import React, { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { Tent, Armchair, Container, Layers } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const ProductCatalog = () => {
  const { siteContent } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = siteContent.catalog?.categories || [];
  const products = siteContent.catalog?.products || [];

  const visibleProducts = useMemo(() => {
    if (activeCategory === null) return products;
    return products.filter((product) => product.category_id === activeCategory);
  }, [activeCategory, products]);

  const getCategoryIcon = (iconName) => {
    const icons = {
      TentIcon: Tent,
      ArmchairIcon: Armchair,
      ContainerIcon: Container,
      LayersIcon: Layers,
    };
    const IconComponent = icons[iconName] || Layers;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <section id="rentals" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm tracking-wider uppercase">What We Rent</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy mt-2">Everything You Need for a Successful Event</h2>
        </div>

        <div className="flex overflow-x-auto space-x-2 mb-12 pb-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
              activeCategory === null ? 'bg-gold text-white shadow-lg' : 'bg-gray-100 text-navy hover:bg-gray-200'
            }`}
          >
            <span>All</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                activeCategory === category.id ? 'bg-gold text-white shadow-lg' : 'bg-gray-100 text-navy hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category.icon_name)}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-navy transition-colors">
            View Full Catalog
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
