import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { formatPrice } from "../../utils/currencyFormatter";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4 mb-8">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left align-top font-semibold">Image</th>
                  <th className="px-4 py-3 text-left font-semibold">Product</th>
                  <th className="px-4 py-3 text-center font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 border-t">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="p-4 border-t">
                      <Link to={`/product/${item.product}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-4 border-t text-center">{item.qty}</td>
                    <td className="p-4 border-t text-right">
                      {formatPrice(item.price)}
                    </td>
                    <td className="p-4 border-t text-right font-semibold">
                      {formatPrice(item.qty * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5 bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent inline-block">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-lg shadow-md">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Price Details</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{formatPrice(cart.itemsPrice)}</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">{formatPrice(cart.shippingPrice)}</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatPrice(cart.taxPrice)}</span>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-bold text-lg text-pink-600">{formatPrice(cart.totalPrice)}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Shipping</h3>
                <p className="text-gray-700">
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Payment Method</h3>
                <p className="text-gray-700">
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </div>
            
            {error && <div className="col-span-2"><Message variant="danger">{error.data.message}</Message></div>}
          </div>

          <button
            type="button"
            className="bg-gradient-to-r from-pink-500 to-blue-600 text-white py-3 px-6 rounded-lg text-lg w-full mt-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            <span>Place Order</span>
            <span className="ml-2 font-bold">{formatPrice(cart.totalPrice)}</span>
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
