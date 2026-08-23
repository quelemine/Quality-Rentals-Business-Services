import React, { useState } from 'react';
import { Plus, Check, Trash2, Minus, Plus as PlusIcon } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

const ProductCard = ({ product }) => {
  const { addItem, quoteItems, updateQuantity, removeItem } = useQuote();
  const [isAdded, setIsAdded] = useState(false);

  const isInQuote = quoteItems.some((item) => item.product_id === product.id);
  const quoteItem = quoteItems.find((item) => item.product_id === product.id);

  // Debug image URL
  console.log('=== ProductCard Image Debug ===');
  console.log('Product ID:', product.id);
  console.log('Product Name:', product.name);
  console.log('Image URL:', product.image_url);
  console.log('Image URL length:', product.image_url?.length || 0);
  console.log('Image URL starts with data:image:', product.image_url?.startsWith('data:image') || false);

  const handleAddToQuote = () => {
    addItem(product, 1);
    setIsAdded(true);
  };

  const handleQuantityChange = (delta) => {
    if (quoteItem) {
      const newQuantity = quoteItem.quantity + delta;
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
    setIsAdded(false);
  };

  const isAvailable = Number(product.stock_quantity) > 0 && Boolean(Number(product.is_available));

  // Specific debugging as requested
  console.log("Product availability debug:", {
    id: product.id,
    name: product.name,
    stock_quantity: product.stock_quantity,
    is_available: product.is_available,
    type_stock: typeof product.stock_quantity,
    type_available: typeof product.is_available
  });

  // Additional debugging
  console.log('=== Availability Logic Debug ===');
  console.log('Product:', product.name);
  console.log('stock_quantity:', product.stock_quantity);
  console.log('stock_quantity type:', typeof product.stock_quantity);
  console.log('Number(stock_quantity || 0):', Number(product.stock_quantity || 0));
  console.log('Number(stock_quantity || 0) > 0:', Number(product.stock_quantity || 0) > 0);
  console.log('is_available:', product.is_available);
  console.log('is_available type:', typeof product.is_available);
  console.log('Boolean(product.is_available):', Boolean(product.is_available));
  console.log('Final isAvailable:', isAvailable);

  const handleImageError = (e) => {
    console.error('=== Image Load Error ===');
    console.error('Product ID:', product.id);
    console.error('Product Name:', product.name);
    console.error('Image URL:', product.image_url);
    console.error('Error:', e);
    // Set fallback image
    e.target.src = 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200';
  };

  const handleImageLoad = () => {
    console.log('=== Image Load Success ===');
    console.log('Product ID:', product.id);
    console.log('Product Name:', product.name);
    console.log('Image URL length:', product.image_url?.length || 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        {isAvailable ? (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Available
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Unavailable
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif font-bold text-navy text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Stock Info */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">
            {Number(product.stock_quantity) > 0 ? `${Number(product.stock_quantity)} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Action Button */}
        {isAvailable ? (
          isInQuote ? (
            <div className="flex items-center justify-between bg-gold/10 rounded-lg p-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4 text-navy" />
              </button>
              <span className="font-medium text-navy">{quoteItem?.quantity || 1}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <PlusIcon className="w-4 h-4 text-navy" />
              </button>
              <button
                onClick={handleRemove}
                className="ml-2 w-8 h-8 flex items-center justify-center bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToQuote}
              className="w-full bg-gold text-white py-3 rounded-lg font-medium hover:bg-navy transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Quote Request</span>
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
