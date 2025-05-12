import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { useGetProductsQuery, useAllProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "./Products/ProductCard";

const SearchResults = () => {
  // Get the keyword from URL params
  const { keyword = "" } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Get all products as a fallback
  const { data: allProductsData, isLoading: allProductsLoading } = useAllProductsQuery();
  
  // Get search results from API
  const { data, isLoading, error } = useGetProductsQuery({ 
    keyword: keyword || "", 
    pageNumber 
  });
  
  // Handle errors and set products
  useEffect(() => {
    // Reset error message
    setErrorMessage("");
    
    // Handle API errors
    if (error) {
      console.error('API Error:', error);
      if (error.data && typeof error.data.message === 'string') {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage("An error occurred while fetching products");
      }
    }
    
    try {
      // First try to use the API search results
      if (data && data.products && Array.isArray(data.products)) {
        console.log('Using API search results:', data.products.length, 'products found');
        setFilteredProducts(data.products);
        return;
      }
      
      // If no results from API or API failed, filter manually from all products
      if (allProductsData && !isLoading && keyword) {
        console.log('Manually filtering products for:', keyword);
        
        // Get the products array from the response
        let productsArray = [];
        
        if (Array.isArray(allProductsData)) {
          productsArray = allProductsData;
        } else if (allProductsData && Array.isArray(allProductsData.products)) {
          productsArray = allProductsData.products;
        }
        
        if (productsArray.length > 0) {
          const filtered = productsArray.filter(product => 
            product && typeof product.name === 'string' && 
            product.name.toLowerCase().includes(String(keyword).toLowerCase())
          );
          
          console.log('Manually filtered products:', filtered.length, 'products found');
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts([]);
        }
      }
    } catch (err) {
      console.error('Error in filtering products:', err);
      setErrorMessage("Error processing product data");
      setFilteredProducts([]);
    }
  }, [data, allProductsData, keyword, isLoading, error]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Safe string conversion helper
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Loading state
  if (isLoading && allProductsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent inline-block">
          Search Results for "{safeString(keyword)}"
        </h1>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {errorMessage && filteredProducts.length === 0 ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No products found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{safeString(keyword)}"
          </p>
          <Link
            to="/"
            className="bg-gradient-to-r from-pink-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Found {filteredProducts.length} results for "{safeString(keyword)}"
          </p>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => {
              // Skip invalid products
              if (!product) return null;
              
              // Create a safe key
              const productKey = product._id ? safeString(product._id) : `product-${index}`;
              
              return (
                <ProductCard 
                  key={productKey} 
                  p={product} 
                />
              );
            })}
          </motion.div>
          
          {/* Pagination if needed */}
          {data && data.pages && typeof data.pages === 'number' && data.pages > 1 && (
            <div className="flex justify-center mt-8">
              {[...Array(data.pages).keys()].map((page) => (
                <button
                  key={`page-${page + 1}`}
                  onClick={() => setPageNumber(page + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    pageNumber === page + 1
                      ? "bg-gradient-to-r from-pink-500 to-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
