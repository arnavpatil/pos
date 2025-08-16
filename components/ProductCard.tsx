'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  const [selectedColor, setSelectedColor] = useState(product.defaultColor || product.colors?.[0] || '');
  const [currentImage, setCurrentImage] = useState(product.imageUrl || '');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // In a real implementation, you would fetch the image for this color
    // For now, we'll use the same image but could implement color-specific images
    setCurrentImage(product.imageUrl || '');
  };

  const getColorStyle = (color: string) => {
    // Handle hex colors
    if (color.startsWith('#')) {
      return { backgroundColor: color };
    }
    
    // Handle common color names
    const colorMap: { [key: string]: string } = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'orange': '#f97316',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'black': '#1f2937',
      'white': '#ffffff',
      'brown': '#92400e',
      'golden': '#d97706',
      'silver': '#9ca3af',
      'gold': '#f59e0b',
      'rose gold': '#f472b6',
      'clear': 'transparent',
    };
    
    return { 
      backgroundColor: colorMap[color.toLowerCase()] || '#e5e7eb',
      border: color.toLowerCase() === 'clear' || color.toLowerCase() === 'white' ? '1px solid #d1d5db' : 'none'
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={currentImage || 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=No+Image';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            product.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.status}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Product Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category:</span>
            <span className="text-gray-900">{product.category}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Stock:</span>
            <span className={`font-medium ${
              product.stock <= (product.lowStockThreshold || 5) 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {product.stock} units
            </span>
          </div>
          
          {product.size && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Size:</span>
              <span className="text-gray-900">{product.size}</span>
            </div>
          )}
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                    selectedColor === color
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={`Select ${color}`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={getColorStyle(color)}
                  ></div>
                  <span>{color}</span>
                </button>
              ))}
            </div>
            {selectedColor && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedColor}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;