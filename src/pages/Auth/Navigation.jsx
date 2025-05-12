import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import "./Navigation.css";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-black text-white flex justify-between items-center py-4 px-6 z-50"
    >
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold">
          Nepto
        </Link>
      </div>

      {/* Center - Navigation Links */}
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-gray-400 flex items-center">
          <AiOutlineHome size={22} className="mr-1" /> Home
        </Link>

        <Link to="/shop" className="hover:text-gray-400 flex items-center">
          <AiOutlineShopping size={22} className="mr-1" /> Shop
        </Link>

        <Link to="/cart" className="relative hover:text-gray-400 flex items-center">
          <AiOutlineShoppingCart size={22} className="mr-1" /> Cart
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 px-2 py-1 text-xs text-white bg-pink-500 rounded-full">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        <Link to="/favorite" className="hover:text-gray-400 flex items-center">
          <FaHeart size={20} className="mr-1" /> Favorites
          <FavoritesCount />
        </Link>
      </div>

      {/* Right Side - User Menu */}
      <div className="relative">
        {userInfo ? (
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <span className="mr-2">{userInfo.username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-gray-400 flex items-center"
            >
              <AiOutlineLogin size={22} className="mr-1" /> Login
            </Link>
            <Link
              to="/register"
              className="hover:text-gray-400 flex items-center ml-4"
            >
              <AiOutlineUserAdd size={22} className="mr-1" /> Register
            </Link>
          </>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && userInfo && (
          <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-md rounded-lg overflow-hidden">
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-200">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-200">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-200">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-200">
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-200"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
