import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Tent, Armchair, Container, Layers } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { fetchCategories, fetchProducts } from '../services/api';

// Simple skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
      <div className="h-10 bg-slate-200 rounded-lg mt-4" />
    </div>
  </div>
);

const CACHE_KEY = 'qrs-catalog-cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const ProductCatalog = () => {
  const { siteContent } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState(null);
  const [apiCategories, setApiCategories] = useState(() => {
    // Show cached data instantly on first render
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      if (cached.ts && Date.now() - cached.ts < CACHE_TTL) {
        return cached.categories || [];
      }
    } catch {}
    return siteContent.catalog?.categories || [];
  });
  const [apiProducts, setApiProducts] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      if (cached.ts && Date.now() - cached.ts < CACHE_TTL) {
        return cached.products || [];
      }
    } catch {}
    return siteContent.catalog?.products || [];
  });
  const [loading, setLoading] = useState(() => {
    // Skip spinner if we have valid cache
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      return !(cached.ts && Date.now() - cached.ts < CACHE_TTL);
    } catch {}
    return true;
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const updateSearchQuery = useCallback((value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('search', value);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // Check if cache is still fresh — skip fetch if so
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      if (cached.ts && Date.now() - cached.ts < CACHE_TTL) {
        return;
      }
    } catch {}

    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);

        const cats = Array.isArray(categoriesData) ? categoriesData : [];
        const prods = Array.isArray(productsData) ? productsData : [];

        setApiCategories(cats);
        setApiProducts(prods);

        // Cache results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          ts: Date.now(),
          categories: cats,
          products: prods
        }));
      } catch (error) {
        console.error('Error loading catalog data:', error);
        setApiCategories(siteContent.catalog?.categories || []);
        setApiProducts(siteContent.catalog?.products || []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categories = apiCategories.length > 0 ? apiCategories : siteContent.catalog?.categories || [];
  const products = apiProducts.length > 0 ? apiProducts : siteContent.catalog?.products || [];

  const visibleProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (activeCategory !== null) {
      filtered = filtered.filter((product) => product.category_id === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => 
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        String(product.price || '').toLowerCase().includes(query) ||
        categories.find((category) => String(category.id) === String(product.category_id))?.name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, categories, products, searchQuery]);

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

  if (loading) {
    return (
      <section id="rentals" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-4 bg-slate-200 rounded w-24 mx-auto mb-3 animate-pulse" />
            <div className="h-8 bg-slate-200 rounded w-80 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rentals" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm tracking-wider uppercase">{siteContent.catalog?.badge || 'What We Rent'}</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy mt-2">{siteContent.catalog?.title || 'Everything You Need for a Successful Event'}</h2>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
          />
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
          <button 
            onClick={() => {
              setActiveCategory(null);
              document.getElementById('rentals').scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-navy transition-colors"
          >
            View Full Catalog
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
