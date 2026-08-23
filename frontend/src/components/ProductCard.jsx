import React, { useState } from 'react';
import { Plus, Check, Trash2, Minus, Plus as PlusIcon } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

const ProductCard = ({ product }) => {
  const { addItem, quoteItems, updateQuantity, removeItem } = useQuote();
  const [isAdded, setIsAdded] = useState(false);

  const isInQuote = quoteItems.some((item) => item.product_id === product.id);
  const quoteItem = quoteItems.find((item) => item.product_id === product.id);

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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.is_available ? (
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
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Action Button */}
        {product.is_available ? (
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
