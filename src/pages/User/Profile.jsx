import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaClipboardList, FaCamera, FaEdit, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";

import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const [logoutApiCall, { isLoading: loadingLogout }] = useLogoutMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  
  // Logout handler
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-500 to-blue-600 px-6 py-8 sm:px-10 sm:py-12 text-white relative">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-lg">
                  <FaUser className="text-4xl sm:text-5xl text-white/70" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white text-pink-500 rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                  <FaCamera className="text-sm" />
                </button>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">{username}</h1>
                <p className="text-white/80 flex items-center justify-center sm:justify-start mt-1">
                  <FaEnvelope className="mr-2" /> {email}
                </p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                    Member since {new Date(userInfo.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left Sidebar - Quick Links */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-pink-500" /> Account
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/my-orders" 
                      className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaClipboardList className="mr-3 text-pink-500" />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/favorites" 
                      className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaShoppingBag className="mr-3 text-pink-500" />
                      <span>My Wishlist</span>
                    </Link>
                  </li>
                  <li className="border-t mt-4 pt-4">
                    <button 
                      onClick={logoutHandler}
                      className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      disabled={loadingLogout}
                    >
                      <FaSignOutAlt className="mr-3 text-red-500" />
                      <span>{loadingLogout ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Main Content - Profile Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaEdit className="mr-2 text-pink-500" /> Edit Profile
                </h2>
                
                <form onSubmit={submitHandler} className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Change Password</h3>
                    <p className="text-sm text-gray-500 mb-4">Leave blank to keep your current password</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            placeholder="Enter new password"
                            className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 flex justify-end space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                      disabled={loadingUpdateProfile}
                    >
                      {loadingUpdateProfile ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                  
                  {loadingUpdateProfile && <Loader />}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
