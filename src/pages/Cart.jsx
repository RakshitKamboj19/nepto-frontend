import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { formatPrice } from "../utils/currencyFormatter";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    if (qty > product.countInStock) {
      toast.error("Sorry, product is out of stock", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-center items-center mb-10 mt-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent inline-block">
              My Shopping Cart
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <Link
                to="/shop"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go To Shop
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 flex flex-col md:flex-row items-center gap-6"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <p className="text-blue-600 font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-4">
                        <select
                          className="form-select rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          value={item.qty}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          title="Remove item"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                    <span className="font-semibold">
                      {formatPrice(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-semibold">
                      {formatPrice(cart.shippingPrice || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">
                      {formatPrice(cart.taxPrice || 0)}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>{formatPrice(cart.totalPrice || cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={checkoutHandler}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    to="/shop"
                    className="block text-center w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
