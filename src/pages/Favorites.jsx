import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { FaHeart, FaShoppingCart, FaStar, FaArrowRight } from "react-icons/fa";
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { removeFromFavorites } from "../redux/features/favorites/favoritesSlice";

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const { data: products, isLoading, error } = useAllProductsQuery();
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    if (products && favorites?.length > 0) {
      // Filter products to only include favorites
      const filteredProducts = products.filter((product) =>
        favorites.includes(product._id)
      );
      setFavoriteProducts(filteredProducts);
    } else {
      setFavoriteProducts([]);
    }
  }, [products, favorites]);

  const handleRemoveFromFavorites = (productId) => {
    dispatch(removeFromFavorites(productId));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            ❤️ FAVORITE PRODUCTS ❤️
          </h1>
          <div className="w-24 h-1 bg-red-500 mx-auto mt-2"></div>
        </motion.div>

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
        ) : favoriteProducts?.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <svg className="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No favorite products yet.
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add some products to your favorites to see them here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Browse Products
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {favoriteProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="relative">
                  <Link to={`/product/${product._id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Image+Not+Available";
                        }}
                      />
                    </div>
                  </Link>

                  <button
                    onClick={() => handleRemoveFromFavorites(product._id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart className="text-red-500 text-lg" />
                  </button>

                  {product.brand && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.brand}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
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
                    <span className="text-xl font-semibold text-blue-600">
                      ${product.price?.toFixed(2)}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors text-sm"
                    >
                      <FaShoppingCart className="mr-1" /> View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Favorites;
