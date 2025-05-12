import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressSteps step1 step2 />
        
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent inline-block">
            Shipping Details
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <form onSubmit={submitHandler} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your street address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your city"
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter postal code"
                    value={postalCode}
                    required
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your country"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-pink-500 focus:ring-pink-500"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-3">
                      <span className="block text-gray-800 font-medium">PayPal</span>
                      <span className="block text-gray-500 text-sm">Pay securely using your PayPal account</span>
                    </span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-pink-500 focus:ring-pink-500"
                      name="paymentMethod"
                      value="CreditCard"
                      checked={paymentMethod === "CreditCard"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-3">
                      <span className="block text-gray-800 font-medium">Credit/Debit Card</span>
                      <span className="block text-gray-500 text-sm">Pay securely using your credit or debit card</span>
                    </span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-pink-500 focus:ring-pink-500"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-3">
                      <span className="block text-gray-800 font-medium">UPI</span>
                      <span className="block text-gray-500 text-sm">Pay using Google Pay, PhonePe, Paytm, or other UPI apps</span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                className="bg-gradient-to-r from-pink-500 to-blue-600 text-white py-3 px-6 rounded-lg text-lg w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                type="submit"
              >
                Continue to Review Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
