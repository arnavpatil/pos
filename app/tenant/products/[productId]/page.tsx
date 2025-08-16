'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { tenantPortalService, TenantProduct } from '@/services/tenantPortalService';
import Snackbar from '@/components/Snackbar';

const ProductDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<TenantProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const productId = params.productId as string;

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    fetchProductDetails();
  }, [user, productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const products = await tenantPortalService.getTenantProducts();
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        showSnackbar('Product not found', 'error');
        router.push('/tenant');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      showSnackbar('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ isVisible: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  const handleVariantClick = (variantId: string) => {
    router.push(`/tenant/products/${productId}/variants/${variantId}`);
  };

  const handleBackClick = () => {
    router.push('/tenant');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
              <p><span className="font-medium">SKU:</span> {product.sku}</p>
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Summary</h3>
              <p><span className="font-medium">Total Variants:</span> {product.variants?.length || 0}</p>
              <p><span className="font-medium">Total Stock:</span> {product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Range</h3>
              {product.variants && product.variants.length > 0 ? (
                <p>
                  <span className="font-medium">$</span>
                  {Math.min(...product.variants.map(v => v.price || 0)).toFixed(2)} - 
                  ${Math.max(...product.variants.map(v => v.price || 0)).toFixed(2)}
                </p>
              ) : (
                <p>No variants available</p>
              )}
            </div>
          </div>
        </div>

        {/* Variants Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Product Variants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant) => (
                    <tr
                      key={variant.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => variant.id && handleVariantClick(variant.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.color}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${variant.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {variant.createdAt ? new Date(variant.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            variant.id && handleVariantClick(variant.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No variants available for this product
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default ProductDetailsPage;