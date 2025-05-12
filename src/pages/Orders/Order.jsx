import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import { formatPrice } from "../../utils/currencyFormatter";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  
  // State for UPI payment
  const [upiId, setUpiId] = useState('');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [showUpiForm, setShowUpiForm] = useState(false);
  
  // State for Credit Card payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  
  // Billing address state
  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingApt, setBillingApt] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [shipToBilling, setShipToBilling] = useState(true);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    // Convert INR to USD for PayPal (approximate conversion rate)
    const usdAmount = (order.totalPrice / 82.5).toFixed(2);
    return actions.order
      .create({
        purchase_units: [{ amount: { value: usdAmount } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  // Handle UPI payment submission
  const handleUpiPayment = async (e) => {
    e.preventDefault();
    try {
      // Validate UPI ID format
      if (!upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return;
      }

      // Create payment details object similar to PayPal's structure
      const paymentResult = {
        id: upiTransactionId,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payment_source: 'UPI',
        payer: {
          email_address: userInfo.email,
        },
      };

      await payOrder({ orderId, paymentResult });
      toast.success('Payment successful! Your order has been paid');
      
      // Reset form
      setUpiId('');
      setUpiTransactionId('');
      setShowUpiForm(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message || 'Payment failed. Please try again.');
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return value;
  };
  
  // Format phone number with Indian format
  const formatPhone = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 10) {
      return `+${v.substring(0, 2)} ${v.substring(2, 7)} ${v.substring(7)}`;
    } else if (v.length > 5) {
      return `+91 ${v.substring(0, 5)} ${v.substring(5)}`;
    } else if (v.length > 0) {
      return `+91 ${v}`;
    }
    return value;
  };
  
  // Handle credit card payment submission
  const handleCardPayment = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      
      if (cardExpiry.length < 5) {
        toast.error('Please enter a valid expiry date');
        return;
      }
      
      if (cardCvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }
      
      // Create payment details object
      const paymentResult = {
        id: `CC_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payment_source: 'Credit Card',
        payer: {
          email_address: billingEmail || userInfo.email,
        },
      };

      await payOrder({ orderId, paymentResult });
      toast.success('Payment successful! Your order has been paid');
      
      // Reset form
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardName('');
      setShowCardForm(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message || 'Payment failed. Please try again.');
    }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Order Details</h1>
          <p className="text-white opacity-90 text-sm">Order ID: {order._id}</p>
        </div>
        
        <div className="flex flex-col lg:flex-row">
          {/* Order Items Section */}
          <div className="lg:w-2/3 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
            
            {order.orderItems.length === 0 ? (
              <Messsage>Order is empty</Messsage>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left">Image</th>
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-center">Quantity</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/200x200?text=Nepto';
                            }}
                          />
                        </td>

                        <td className="py-4 px-4">
                          <Link 
                            to={`/product/${item.product}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {item.name}
                          </Link>
                        </td>

                        <td className="py-4 px-4 text-center">{item.qty}</td>
                        <td className="py-4 px-4 text-right">{formatPrice(item.price)}</td>
                        <td className="py-4 px-4 text-right font-medium">
                          {formatPrice(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Info Section */}
          <div className="lg:w-1/3 p-6 bg-gray-50 border-l border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Shipping</h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="ml-2 text-gray-800">{order.user.username}</span>
                </div>
                
                <div>
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="ml-2 text-gray-800">{order.user.email}</span>
                </div>
                
                <div>
                  <span className="text-gray-600 font-medium">Address:</span>
                  <span className="ml-2 text-gray-800">
                    {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 font-medium">Payment Method:</span>
                  <span className="ml-2 text-gray-800">{order.paymentMethod}</span>
                </div>
                
                <div>
                  <span className="text-gray-600 font-medium">Payment Status:</span>
                  {order.isPaid ? (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Not paid
                    </span>
                  )}
                </div>
                
                <div>
                  <span className="text-gray-600 font-medium">Delivery Status:</span>
                  {order.isDelivered ? (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Not delivered
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{formatPrice(order.itemsPrice)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">{formatPrice(order.shippingPrice)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatPrice(order.taxPrice)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-bold text-lg text-pink-600">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
            
            {!order.isPaid && (
              <div>
                {loadingPay && <Loader />}
                
                {/* Show appropriate payment option based on selected method */}
                {order.paymentMethod === 'PayPal' ? (
                  isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )
                ) : order.paymentMethod === 'CreditCard' ? (
                  <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-100">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Pay with Credit/Debit Card</h3>
                    
                    {showCardForm ? (
                      <form onSubmit={handleCardPayment} className="space-y-4">
                        {/* Card Details */}
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength="19"
                              required
                            />
                          </div>
                          
                          <div className="flex space-x-4">
                            <div className="w-1/2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                maxLength="5"
                                required
                              />
                            </div>
                            <div className="w-1/2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                maxLength="3"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Billing Address */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-800 mb-3">Billing Address</h4>
                          
                          <div className="mb-3">
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-pink-500 focus:ring-pink-500" 
                                checked={shipToBilling}
                                onChange={() => setShipToBilling(!shipToBilling)}
                              />
                              <span className="ml-2 text-sm text-gray-700">Ship to billing address</span>
                            </label>
                          </div>
                          
                          {!shipToBilling && (
                            <div className="space-y-4">
                              <div className="flex space-x-4">
                                <div className="w-1/2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    value={billingFirstName}
                                    onChange={(e) => setBillingFirstName(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="w-1/2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    value={billingLastName}
                                    onChange={(e) => setBillingLastName(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                  value={billingStreet}
                                  onChange={(e) => setBillingStreet(e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apt, Suite, Bldg (optional)</label>
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                  value={billingApt}
                                  onChange={(e) => setBillingApt(e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                  value={billingCity}
                                  onChange={(e) => setBillingCity(e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div className="flex space-x-4">
                                <div className="w-1/2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                  <select
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    value={billingState}
                                    onChange={(e) => setBillingState(e.target.value)}
                                    required
                                  >
                                    <option value="">Select State</option>
                                    <option value="AN">Andaman and Nicobar Islands</option>
                                    <option value="AP">Andhra Pradesh</option>
                                    <option value="AR">Arunachal Pradesh</option>
                                    <option value="AS">Assam</option>
                                    <option value="BR">Bihar</option>
                                    <option value="CH">Chandigarh</option>
                                    <option value="CT">Chhattisgarh</option>
                                    <option value="DN">Dadra and Nagar Haveli</option>
                                    <option value="DD">Daman and Diu</option>
                                    <option value="DL">Delhi</option>
                                    <option value="GA">Goa</option>
                                    <option value="GJ">Gujarat</option>
                                    <option value="HR">Haryana</option>
                                    <option value="HP">Himachal Pradesh</option>
                                    <option value="JK">Jammu and Kashmir</option>
                                    <option value="JH">Jharkhand</option>
                                    <option value="KA">Karnataka</option>
                                    <option value="KL">Kerala</option>
                                    <option value="LA">Ladakh</option>
                                    <option value="LD">Lakshadweep</option>
                                    <option value="MP">Madhya Pradesh</option>
                                    <option value="MH">Maharashtra</option>
                                    <option value="MN">Manipur</option>
                                    <option value="ML">Meghalaya</option>
                                    <option value="MZ">Mizoram</option>
                                    <option value="NL">Nagaland</option>
                                    <option value="OR">Odisha</option>
                                    <option value="PY">Puducherry</option>
                                    <option value="PB">Punjab</option>
                                    <option value="RJ">Rajasthan</option>
                                    <option value="SK">Sikkim</option>
                                    <option value="TN">Tamil Nadu</option>
                                    <option value="TG">Telangana</option>
                                    <option value="TR">Tripura</option>
                                    <option value="UP">Uttar Pradesh</option>
                                    <option value="UT">Uttarakhand</option>
                                    <option value="WB">West Bengal</option>
                                  </select>
                                </div>
                                <div className="w-1/2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    value={billingZip}
                                    onChange={(e) => setBillingZip(e.target.value.replace(/[^0-9]/g, ''))}
                                    maxLength="6"
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                <input
                                  type="text"
                                  placeholder="+91"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                  value={billingPhone}
                                  onChange={(e) => setBillingPhone(formatPhone(e.target.value))}
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                  value={billingEmail}
                                  onChange={(e) => setBillingEmail(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 mt-6">
                          <button
                            type="submit"
                            className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
                          >
                            Pay {formatPrice(order.totalPrice)}
                          </button>
                          <button
                            type="button"
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                            onClick={() => setShowCardForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center">
                        <p className="mb-3 text-gray-600">
                          Pay {formatPrice(order.totalPrice)} securely using your credit or debit card
                        </p>
                        <button
                          onClick={() => setShowCardForm(true)}
                          className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition-colors"
                        >
                          Enter Card Details
                        </button>
                      </div>
                    )}
                  </div>
                ) : order.paymentMethod === 'UPI' ? (
                  <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-100">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Pay via UPI</h3>
                    
                    {showUpiForm ? (
                      <form onSubmit={handleUpiPayment} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your UPI ID</label>
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                          <input
                            type="text"
                            placeholder="Enter UPI transaction ID"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            value={upiTransactionId}
                            onChange={(e) => setUpiTransactionId(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
                          >
                            Confirm Payment
                          </button>
                          <button
                            type="button"
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                            onClick={() => setShowUpiForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center">
                        <p className="mb-3 text-gray-600">
                          Pay {formatPrice(order.totalPrice)} using any UPI app like Google Pay, PhonePe, or Paytm
                        </p>
                        <button
                          onClick={() => setShowUpiForm(true)}
                          className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition-colors"
                        >
                          Enter UPI Payment Details
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700">Payment method not supported. Please contact support.</p>
                  </div>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div>
                <button
                  type="button"
                  className="bg-pink-500 text-white w-full py-2 mt-4 rounded hover:bg-pink-600 transition-colors"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
