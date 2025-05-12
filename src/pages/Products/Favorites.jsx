import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.favorites || []);
  const { data: products, isLoading, error } = useAllProductsQuery();
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    if (products && favorites.length > 0) {
      // Filter products to only include favorites
      const filteredProducts = products.filter((product) =>
        favorites.includes(product._id)
      );
      setFavoriteProducts(filteredProducts);
    } else {
      setFavoriteProducts([]);
    }
  }, [products, favorites]);

  return (
    <div className="bg-green-100 min-h-screen p-10 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-2xl font-bold text-green-800 mt-10 mb-10">
        ❤️ FAVORITE PRODUCTS ❤️
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error || "Failed to load products"}
        </Message>
      ) : favoriteProducts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No favorite products yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {favoriteProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
