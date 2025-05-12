import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaStore, FaHeart, FaHome, FaClipboardList, FaUser } from "react-icons/fa";
import { useAllProductsQuery } from "../redux/api/productApiSlice";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Fetch all products for suggestions
  const { data: allProducts, isLoading } = useAllProductsQuery();
  
  // Function to handle home button click
  const handleHomeClick = (e) => {
    // If we're already on the home page, prevent default navigation and just reload the page
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.location.reload();
    }
  };
  
  // Function to handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    try {
      // Ensure searchTerm is a string and sanitize it
      const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm.trim() : '';
      
      if (safeSearchTerm) {
        // Encode the search term for URL safety
        const encodedSearchTerm = encodeURIComponent(safeSearchTerm);
        navigate(`/search/${encodedSearchTerm}`);
        setShowSuggestions(false);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error in search submission:', error);
      // Fallback to home page on error
      navigate('/');
    }
  };
  
  // Function to handle input change and filter suggestions
  const handleInputChange = (e) => {
    try {
      const term = e.target.value;
      setSearchTerm(term);
      
      if (term.trim() === '') {
        setShowSuggestions(false);
        setSuggestions([]);
        return;
      }
      
      if (allProducts) {
        // Get products array from response
        let productsArray = [];
        
        if (Array.isArray(allProducts)) {
          productsArray = allProducts;
        } else if (allProducts && Array.isArray(allProducts.products)) {
          productsArray = allProducts.products;
        } else {
          console.warn('Products data is not in expected format:', allProducts);
          return;
        }
        
        // Filter products that match the search term
        const filtered = productsArray
          .filter(product => {
            return product && 
                   typeof product.name === 'string' && 
                   product.name.toLowerCase().includes(term.toLowerCase());
          })
          .slice(0, 5); // Limit to 5 suggestions
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      }
    } catch (error) {
      console.error('Error in search input handling:', error);
      // Reset suggestions to prevent rendering errors
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Function to handle suggestion click
  const handleSuggestionClick = (productId, productName) => {
    try {
      // Ensure we have valid strings
      const safeProductName = typeof productName === 'string' ? productName : '';
      const safeProductId = typeof productId === 'string' ? productId : '';
      
      setSearchTerm(safeProductName);
      setShowSuggestions(false);
      
      if (safeProductId) {
        navigate(`/product/${safeProductId}`);
      }
    } catch (error) {
      console.error('Error in suggestion click handling:', error);
      setShowSuggestions(false);
    }
  };
  
  // Close suggestions when clicking outside
  const handleClickOutside = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Don't block rendering the header while loading top products
  // Just render the header without the products data

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        {/* Navigation Bar */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={handleHomeClick} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center shadow-lg mr-2">
                <FaStore className="text-white text-xl" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">Nepto</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                <FaHome className="text-xl md:mr-1" />
                <span className="hidden md:inline">Home</span>
              </Link>
              <Link to="/shop" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                <FaStore className="text-xl md:mr-1" />
                <span className="hidden md:inline">Shop</span>
              </Link>
              <Link to="/favorites" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                <FaHeart className="text-xl md:mr-1" />
                <span className="hidden md:inline">Favorites</span>
              </Link>
              <Link to="/cart" className="text-gray-300 hover:text-pink-400 transition-colors relative flex items-center">
                <FaShoppingCart className="text-xl md:mr-1" />
                <span className="hidden md:inline">Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              {userInfo && (
                <Link to="/my-orders" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                  <FaClipboardList className="text-xl md:mr-1" />
                  <span className="hidden md:inline">Orders</span>
                </Link>
              )}
              {userInfo ? (
                <Link to="/profile" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                  <FaUser className="text-xl md:mr-1" />
                  <span className="hidden md:inline">{userInfo.username}</span>
                </Link>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                  <FaUser className="text-xl md:mr-1" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Search Bar - Fixed position below header */}
      <div className="bg-white py-3 shadow-md fixed top-16 left-0 right-0 z-40">
        <div className="container mx-auto px-4" onClick={handleClickOutside}>
          <div className="relative max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-5 py-3 rounded-full border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-sm"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => searchTerm.trim() !== '' && setShowSuggestions(true)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-600 text-white hover:shadow-lg transition-all"
              >
                <FaSearch className="text-sm" />
              </button>
            </form>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <ul>
                  {suggestions.map((product, index) => {
                    // Skip invalid products
                    if (!product || typeof product !== 'object') return null;
                    
                    // Create safe values for rendering
                    const productId = product._id ? String(product._id) : `suggestion-${index}`;
                    const productName = typeof product.name === 'string' ? product.name : 'Product';
                    const productCategory = typeof product.category === 'string' ? product.category : 'Product';
                    const productImage = typeof product.image === 'string' ? product.image : '';
                    
                    return (
                      <li 
                        key={productId} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(productId, productName)}
                      >
                        <div className="w-10 h-10 mr-3 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                          {productImage ? (
                            <img 
                              src={productImage} 
                              alt={productName} 
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/200x200?text=Nepto';
                              }}
                            />
                          ) : (
                            <FaStore className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{productName}</p>
                          <p className="text-xs text-gray-500">{productCategory}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section - Removed */}

      {/* Featured Products Section - Removed to fix overlapping issues */}
    </>
  );
};

export default Header;
