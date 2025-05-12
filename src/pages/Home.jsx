import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Newsletter from "../components/Newsletter";
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaArrowRight } from "react-icons/fa";
import { addToFavorites, removeFromFavorites } from "../redux/features/favorites/favoritesSlice";
import { formatPrice } from "../utils/currencyFormatter";

const Home = () => {
  const { data, isLoading, error, refetch } = useAllProductsQuery();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites || []);

  // Force a refetch when the component mounts
  useEffect(() => {
    // Refetch data to ensure we have the latest products
    refetch();
    console.log("Refetching product data...");
  }, [refetch]);

  // For debugging - remove in production
  console.log("API Response:", data);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Group products by category if data exists
  const groupProductsByCategory = (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.log("No valid products array found");
      return {};
    }
    
    // Create a Set to track products we've already added
    const addedProductIds = new Set();
    const grouped = {};
    
    products.forEach(product => {
      // Skip if we've already added this product or if it doesn't have an ID
      if (!product._id || addedProductIds.has(product._id)) return;
      
      const categoryName = product.category?.name || "Uncategorized";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      
      grouped[categoryName].push(product);
      addedProductIds.add(product._id);
    });
    
    return grouped;
  };

  // Check if data has a products array or if data itself is the array
  const productsArray = Array.isArray(data) ? data : [];

  // Process products by category first
  const categorizedProducts = groupProductsByCategory(productsArray);
  
  // Use the categorized products if available, otherwise use sample data
  const sampleCategories = {
    "Electronics": [
      { 
        _id: "sample1", 
        name: "Wireless Noise-Cancelling Headphones", 
        price: 199.99, 
        rating: 4.7, 
        numReviews: 128, 
        brand: "Sony", 
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Premium wireless headphones with industry-leading noise cancellation and up to 30 hours of battery life."
      },
      { 
        _id: "tablet1", 
        name: "Ultra-Thin Tablet Pro", 
        price: 349.99, 
        rating: 4.6, 
        numReviews: 89, 
        brand: "Samsung", 
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
        description: "Powerful tablet with stunning display, perfect for work and entertainment on the go."
      },
      { 
        _id: "smartwatch1", 
        name: "Fitness Smartwatch", 
        price: 129.99, 
        rating: 4.4, 
        numReviews: 56, 
        brand: "Fitbit", 
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
        description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS."
      }
    ],
    "Home & Kitchen": [
      { 
        _id: "coffee1", 
        name: "Smart Coffee Maker", 
        price: 79.99, 
        rating: 4.4, 
        numReviews: 7, 
        brand: "Philips", 
        image: "https://i.imgur.com/vQ4oDYL.jpg",
        description: "Brew perfect coffee with smart temperature control and scheduling features."
      },
      { 
        _id: "blender1", 
        name: "Professional Blender", 
        price: 149.99, 
        rating: 4.8, 
        numReviews: 42, 
        brand: "Vitamix", 
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "High-performance blender with variable speed control perfect for smoothies, soups, and more."
      },
      { 
        _id: "airfryer1", 
        name: "Digital Air Fryer", 
        price: 119.99, 
        rating: 4.6, 
        numReviews: 63, 
        brand: "Ninja", 
        image: "https://images.unsplash.com/photo-1648505091248-3a1d647b8c5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Cook healthier meals with this digital air fryer featuring multiple cooking presets and rapid air technology."
      }
    ],
    "Books": [
      { 
        _id: "book1", 
        name: "The Midnight Library", 
        price: 14.99, 
        rating: 4.6, 
        numReviews: 112, 
        brand: "Matt Haig", 
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        description: "Between life and death there is a library, and within that library, the shelves go on forever. A novel about all the choices that go into a life well lived."
      },
      { 
        _id: "book2", 
        name: "Atomic Habits", 
        price: 16.99, 
        rating: 4.8, 
        numReviews: 245, 
        brand: "James Clear", 
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1512&q=80",
        description: "An easy and proven way to build good habits and break bad ones. A practical guide to personal growth and improvement."
      },
      { 
        _id: "book3", 
        name: "Project Hail Mary", 
        price: 18.99, 
        rating: 4.7, 
        numReviews: 89, 
        brand: "Andy Weir", 
        image: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1390&q=80",
        description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the bestselling author of The Martian."
      }
    ],
    "Fashion": [
      { 
        _id: "jacket1", 
        name: "Premium Leather Jacket", 
        price: 199.99, 
        rating: 4.5, 
        numReviews: 37, 
        brand: "Levi's", 
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Classic leather jacket with premium quality materials and timeless design."
      },
      { 
        _id: "sneakers1", 
        name: "Ultralight Running Shoes", 
        price: 129.99, 
        rating: 4.6, 
        numReviews: 84, 
        brand: "Nike", 
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        description: "Lightweight and responsive running shoes with breathable mesh and cushioned support."
      },
      { 
        _id: "watch1", 
        name: "Luxury Automatic Watch", 
        price: 299.99, 
        rating: 4.7, 
        numReviews: 29, 
        brand: "Seiko", 
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
        description: "Elegant automatic watch with sapphire crystal and premium stainless steel construction."
      }
    ]
  };
  
  const displayCategories = Object.keys(categorizedProducts).length > 0 ? categorizedProducts : sampleCategories;

  // Featured products functionality removed

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      dispatch(removeFromFavorites(productId));
    } else {
      dispatch(addToFavorites(productId));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-8">
          <Message variant="danger">
            {error?.data?.message || error?.error || "Failed to load products"}
          </Message>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto px-4 py-8"
        >
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden mb-16"
          >
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
                Discover Amazing Products
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow">
                Explore our curated collection of premium products at unbeatable prices
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/shop"
                  className="inline-block px-8 py-4 bg-white text-blue-700 text-lg font-semibold rounded-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Shopping
                </Link>
                <Link
                  to="/favorites"
                  className="inline-block px-8 py-4 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FaHeart className="inline-block mr-2" /> My Favorites
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Shop Preview Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 relative">
                Shop Our Products
                <span className="absolute bottom-0 left-0 w-24 h-1 bg-blue-600"></span>
              </h2>
              <Link
                to="/shop"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
              >
                View All Products
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(displayCategories).slice(0, 4).map(([category, products]) => {
                // Define specific category images
                const categoryImages = {
                  "Books": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                  "Home & Kitchen": "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1635&q=80",
                  "Electronics": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1501&q=80",
                  "Fashion": "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                };
                
                // Use category-specific image or fallback to product image or placeholder
                const imageUrl = categoryImages[category] || products[0]?.image || "https://via.placeholder.com/300x200?text=Category";
                
                return (
                  <Link 
                    key={category}
                    to={`/shop?category=${category}`}
                    className="relative overflow-hidden rounded-xl group shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <img 
                        src={imageUrl} 
                        alt={category}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <h3 className="text-xl font-bold text-white drop-shadow-md">{category}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Products Section - Removed */}

          {/* Categories Section */}
          <div className="space-y-16">
            {Object.keys(displayCategories).length > 0 ? (
              Object.entries(displayCategories).map(([category, products]) => {
                // Skip categories with no products
                if (products.length === 0) return null;
                
                // Only show up to 4 products per category
                const displayProducts = products.slice(0, 4);
                
                return (
                  <motion.div
                    key={category}
                    variants={itemVariants}
                    className="category-section"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 relative">
                        {category}
                        <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-600"></span>
                      </h2>
                      <Link
                        to={`/shop?category=${category}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                      >
                        View All
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayProducts.map((product) => (
                        <motion.div
                          key={product._id}
                          variants={itemVariants}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="relative">
                            <Link to={`/product/${product._id}`} className="block">
                              <div className="relative h-64 overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                                  }}
                                />
                              </div>
                            </Link>
                            <button 
                              onClick={() => toggleFavorite(product._id)}
                              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                              {favorites.includes(product._id) ? (
                                <FaHeart className="text-red-500 text-xl" />
                              ) : (
                                <FaRegHeart className="text-gray-500 text-xl" />
                              )}
                            </button>
                            <div className="absolute top-4 left-4">
                              <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                {product.brand}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-grow">
                            <Link to={`/product/${product._id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center mt-2">
                              <div className="flex items-center">
                                <FaStar className="text-yellow-400" />
                                <span className="ml-1 text-gray-600 text-sm">
                                  {product.rating} ({product.numReviews} reviews)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-xl font-bold text-blue-600">
                                {formatPrice(product.price)}
                              </span>
                              <Link
                                to={`/product/${product._id}`}
                                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                              >
                                <FaShoppingCart className="mr-2" /> View
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products available</p>
              </div>
            )}
          </div>
          
          {/* Newsletter Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-16"
          >
            <Newsletter />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
