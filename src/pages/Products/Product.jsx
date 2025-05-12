import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetProductByIdQuery } from '../../redux/api/productApiSlice';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../redux/features/favorites/favoritesSlice';
import { formatPrice } from '../../utils/currencyFormatter';
import Rating from './Ratings';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [isSampleProduct, setIsSampleProduct] = useState(false);
  const favorites = useSelector((state) => state.favorites.favorites || []);

  // Check if this is a sample product
  useEffect(() => {
    if (id === 'sample1' || id === 'coffee1') {
      setIsSampleProduct(true);
    }
  }, [id]);

  const { data: product, isLoading, error } = useGetProductByIdQuery(id, {
    skip: isSampleProduct // Skip the API call if it's a sample product
  });

  // Sample product data for demo purposes
  const sampleProducts = {
    'sample1': {
      _id: 'sample1',
      name: 'Sample Product',
      image: 'https://via.placeholder.com/600x400?text=Sample+Product',
      description: 'This is a sample product for demonstration purposes. Add real products to your database to see actual product details.',
      brand: 'Sample Brand',
      category: { name: 'Electronics' },
      price: 99.99,
      countInStock: 10,
      rating: 4.5,
      numReviews: 5
    },
    'coffee1': {
      _id: 'coffee1',
      name: 'Smart Coffee Maker',
      image: 'https://i.imgur.com/vQ4oDYL.jpg',
      description: 'Programmable coffee maker with smartphone control and multiple brewing options. Features temperature control, scheduling, and customizable brew strength settings.',
      brand: 'Philips',
      category: { name: 'Home & Kitchen' },
      price: 79.99,
      countInStock: 15,
      rating: 4.4,
      numReviews: 7
    }
  };

  // Use sample product if it's a sample, otherwise use the API data
  const displayProduct = isSampleProduct ? sampleProducts[id] : product;

  const addToCartHandler = () => {
    if (isSampleProduct) {
      // For sample products, just show a message
      alert('This is a sample product. Add real products to your database to enable cart functionality.');
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!displayProduct) return;
    
    const productId = displayProduct._id;
    if (favorites.includes(productId)) {
      dispatch(removeFromFavorites(productId));
    } else {
      dispatch(addToFavorites(productId));
    }
  };

  const isFavorite = displayProduct ? favorites.includes(displayProduct._id) : false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        Go Back
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error || 'An error occurred'}
        </Message>
      ) : !displayProduct ? (
        <Message variant="danger">Product not found</Message>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg mt-6 overflow-hidden"
        >
          {/* Product Header - Mobile Only */}
          <div className="block md:hidden p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{displayProduct.name}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Rating value={displayProduct.rating} text={`${displayProduct.numReviews} reviews`} />
              </div>
              <button 
                onClick={toggleFavorite}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="w-full md:w-1/2 md:border-r border-gray-200">
              <div className="p-6 bg-white flex items-center justify-center">
                <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-gray-50">
                  {displayProduct.image ? (
                    <>
                      <img
                        src={displayProduct.image}
                        alt={displayProduct.name}
                        className="max-w-full max-h-full object-contain z-10"
                        onError={(e) => {
                          console.log('Image failed to load:', displayProduct.image);
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Available";
                        }}
                        style={{ display: 'block' }}
                      />
                      {/* Fallback image that appears if the main image fails to load */}
                      <img 
                        src="https://via.placeholder.com/400x400?text=Loading+Image"
                        alt="Loading"
                        className="absolute inset-0 w-full h-full object-contain opacity-0"
                        style={{ zIndex: 5 }}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2">
              <div className="p-6">
                {/* Product Header - Desktop Only */}
                <div className="hidden md:block mb-4">
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-gray-900">{displayProduct.name}</h1>
                    <button 
                      onClick={toggleFavorite}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {isFavorite ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center mt-2">
                    <Rating value={displayProduct.rating} text={`${displayProduct.numReviews} reviews`} />
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-600">{formatPrice(displayProduct.price)}</p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 text-sm">{displayProduct.description}</p>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 border-t border-b border-gray-200 py-4">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Brand</h3>
                    <p className="font-semibold">{displayProduct.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Category</h3>
                    <p className="font-semibold">{displayProduct.category?.name || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Availability</h3>
                    <p className={`font-semibold ${displayProduct.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {displayProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">SKU</h3>
                    <p className="font-semibold">{displayProduct._id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                {displayProduct.countInStock > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center">
                      <span className="mr-4 font-medium">Quantity:</span>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(Math.min(10, displayProduct.countInStock)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  className={`w-full px-6 py-3 rounded-lg font-semibold text-white ${
                    displayProduct.countInStock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                  }`}
                  onClick={addToCartHandler}
                  disabled={displayProduct.countInStock === 0}
                >
                  {displayProduct.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Product;
