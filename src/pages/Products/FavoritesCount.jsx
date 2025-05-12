import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites) || [];
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-3 top-3">
      {favoriteCount > 0 && (
        <span className="px-2 py-1 text-xs font-bold text-white bg-pink-500 rounded-full flex items-center justify-center min-w-[20px] min-h-[20px]">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
