'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Product, CartItem } from '@/types';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onSearch={setSearchTerm}
      />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Sản phẩm ({products.length})
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <img
                  src={product.image_url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating} ({product.reviews} đánh giá)
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock */}
                  <p className="text-sm text-gray-600 mb-3">
                    Còn lại: {product.stock || 0} sản phẩm
                  </p>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={(product.stock || 0) === 0}
                    className={`w-full py-2 px-4 rounded transition-colors ${
                      (product.stock || 0) === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {(product.stock || 0) === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Giỏ hàng ({getTotalItems()} sản phẩm)</h3>
            {cart.length === 0 ? (
              <p>Giỏ hàng trống</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-blue-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Tổng cộng:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(cart.reduce((total, item) => total + (item.price * item.quantity), 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowCart(false)}
              className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}