import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEye, FaClipboardList } from 'react-icons/fa';
import { useGetMyOrdersQuery } from '../../redux/api/orderApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { formatPrice } from '../../utils/currencyFormatter';

const MyOrders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch user's orders
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge based on payment and delivery status
  const getStatusBadge = (isPaid, isDelivered) => {
    if (isDelivered) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Delivered
        </span>
      );
    } else if (isPaid) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Processing
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <FaClipboardList className="text-2xl text-pink-500 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">
            {error?.data?.message || 'Error loading orders'}
          </Message>
        ) : orders?.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">You haven't placed any orders yet</div>
            <Link
              to="/shop"
              className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        {order.orderItems.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center mb-1">
                            {item.product && (
                              <>
                                <div className="w-8 h-8 flex-shrink-0 mr-2 bg-gray-100 rounded-md overflow-hidden">
                                  <img 
                                    src={item.image || 'https://placehold.co/200x200?text=Nepto'} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://placehold.co/200x200?text=Nepto';
                                    }}
                                  />
                                </div>
                                <span className="text-gray-800 truncate" style={{ maxWidth: '150px' }}>
                                  {item.name}
                                </span>
                                <span className="ml-1 text-gray-500">×{item.qty}</span>
                              </>
                            )}
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{order.orderItems.length - 2} more item(s)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(order.isPaid, order.isDelivered)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-pink-600 hover:text-pink-900 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
