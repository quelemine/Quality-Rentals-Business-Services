import React, { useMemo, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Tent, Armchair, Container, Layers } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { fetchCategories, fetchProducts } from '../services/api';

const ProductCatalog = () => {
  const { siteContent } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        console.log('=== ProductCatalog API Debug ===');
        console.log('Products Data:', productsData);
        console.log('Products Data type:', typeof productsData);
        console.log('Is Array:', Array.isArray(productsData));
        
        if (Array.isArray(productsData) && productsData.length > 0) {
          console.log('First product:', productsData[0]);
          console.log('First product image_url:', productsData[0].image_url);
          console.log('First product image_url length:', productsData[0].image_url?.length || 0);
          console.log('First product image_url starts with data:image:', productsData[0].image_url?.startsWith('data:image') || false);
        }
        
        setApiCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setApiProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Error loading catalog data:', error);
        // Fallback to localStorage data if API fails
        console.log('=== Fallback to localStorage ===');
        console.log('localStorage products:', siteContent.catalog?.products || []);
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
        product.price?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, products, searchQuery]);

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
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Loading rentals...</p>
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
