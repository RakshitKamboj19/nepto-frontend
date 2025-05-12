import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../redux/features/favorites/favoritesSlice';
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { formatPrice } from '../../utils/currencyFormatter';

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const favorites = useSelector((state) => state.favorites.favorites || []);
  const cart = useSelector((state) => state.cart);
  const isFavorite = p ? favorites.includes(p._id) : false;

  const addToCartHandler = async (product) => {
    try {
      setIsAdding(true);
      
      // Check if product is already in cart
      const existingItem = cart.cartItems.find(x => x._id === product._id);
      const qty = existingItem ? existingItem.qty + 1 : 1;
      
      if (qty > product.countInStock) {
        toast.error("Sorry, product is out of stock", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        return;
      }

      dispatch(addToCart({ ...product, qty }));
      
      toast.success("Added to cart!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to add to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!p) return;
    
    if (isFavorite) {
      dispatch(removeFromFavorites(p._id));
    } else {
      dispatch(addToFavorites(p._id));
    }
  };

  if (!p) {
    return null;
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col relative"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={p.image}
              alt={p.name}
              className="max-w-full max-h-full object-contain p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
              }}
            />
          </div>
        </Link>
        
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-400" />
          )}
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-1">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {p?.brand || "Brand"}
          </span>
        </div>
        
        <Link to={`/product/${p._id}`} className="mb-2 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
            {p?.name || "Product Name"}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm text-gray-600">
            {p?.rating || 0} ({p?.numReviews || 0} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(p?.price || 0)}
          </span>
          
          {p?.countInStock > 0 ? (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <div className="mt-3">
          <motion.button
            onClick={() => addToCartHandler(p)}
            disabled={isAdding || p?.countInStock === 0}
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors duration-300 ${
              isAdding || p?.countInStock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            whileTap={{ scale: 0.95 }}
            title={p?.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            <AiOutlineShoppingCart
              size={16}
              className={`mr-2 ${isAdding ? "animate-spin" : ""}`}
            />
            {p?.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
