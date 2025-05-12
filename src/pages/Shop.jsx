import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { FaFilter, FaSearch, FaTimes, FaSortAmountDown, FaSortAmountUpAlt, FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Get query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");
    const sortParam = params.get("sort");
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (sortParam) {
      setSortOption(sortParam);
    }
    
    if (minPrice) {
      setPriceRange(prev => ({ ...prev, min: minPrice }));
    }
    
    if (maxPrice) {
      setPriceRange(prev => ({ ...prev, max: maxPrice }));
    }
  }, [location.search]);

  // Fetch categories and products
  const { data: categories, isLoading: categoriesLoading } = useFetchCategoriesQuery();
  const { data: products, isLoading: productsLoading, error } = useAllProductsQuery();

  // Filter and sort products
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) => {
        if (product.category && product.category._id) {
          return selectedCategories.includes(product.category._id);
        } else if (product.category && product.category.name) {
          return selectedCategories.includes(product.category.name);
        }
        return false;
      });
    }

    // Filter by price range
    if (priceRange.min !== "") {
      result = result.filter((product) => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== "") {
      result = result.filter((product) => product.price <= parseFloat(priceRange.max));
    }

    // Sort products
    switch (sortOption) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - no specific sort
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategories, priceRange, sortOption]);

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0]);
    }
    
    if (sortOption !== "featured") {
      params.set("sort", sortOption);
    }
    
    if (priceRange.min) {
      params.set("minPrice", priceRange.min);
    }
    
    if (priceRange.max) {
      params.set("maxPrice", priceRange.max);
    }
    
    const queryString = params.toString();
    navigate(queryString ? `?${queryString}` : "", { replace: true });
  }, [searchQuery, selectedCategories, sortOption, priceRange, navigate]);

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceChange = (e, type) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setSortOption("featured");
    setCurrentPage(1);
    navigate("/shop");
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading state
  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors md:hidden"
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-gray-700">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial={false}
            animate={{
              width: isFilterOpen ? "100%" : "auto",
              opacity: 1,
            }}
            className={`${
              isFilterOpen ? "fixed inset-0 z-50 p-4" : "hidden lg:block"
            } lg:w-80`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 h-full overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FaSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                  >
                    Go
                  </button>
                </form>
              </div>
              
              {/* Categories Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                {categoriesLoading ? (
                  <div className="flex justify-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories?.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryChange(category._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Sort Options (Mobile Only) */}
              <div className="mb-8 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <button
                onClick={resetFilters}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(searchQuery || selectedCategories.length > 0 || priceRange.min || priceRange.max) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    <span className="mr-2">Search: {searchQuery}</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {selectedCategories.map((categoryId) => {
                  const category = categories?.find((c) => c._id === categoryId);
                  return (
                    <div key={categoryId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      <span className="mr-2">Category: {category?.name}</span>
                      <button
                        onClick={() => handleCategoryChange(categoryId)}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                
                {priceRange.min && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    <span className="mr-2">Min Price: ${priceRange.min}</span>
                    <button
                      onClick={() => setPriceRange((prev) => ({ ...prev, min: "" }))}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {priceRange.max && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    <span className="mr-2">Max Price: ${priceRange.max}</span>
                    <button
                      onClick={() => setPriceRange((prev) => ({ ...prev, max: "" }))}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={resetFilters}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span>Clear All</span>
                </button>
              </div>
            )}
            
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredProducts.length} Products Found
              </h2>
              <p className="text-gray-600 mt-1">
                Browse through our collection of amazing products
              </p>
            </div>
            
            {/* Products */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader />
              </div>
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error?.error || "Failed to load products"}
              </Message>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">No products found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <ProductCard p={product} />
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === number + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
