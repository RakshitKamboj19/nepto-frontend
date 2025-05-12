import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/features/favorites/favoritesSlice";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites || []);
  const isFavorite = Array.isArray(favorites) && favorites.includes(product._id);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
    } else {
      dispatch(addToFavorites(product._id));
    }
  };

  return (
    <div
      className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 text-xl" />
      )}
    </div>
  );
};

export default HeartIcon;
