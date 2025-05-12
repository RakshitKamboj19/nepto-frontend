import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSubscribeNewsletterMutation } from '../redux/api/newsletterApiSlice';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const res = await subscribeNewsletter({ email }).unwrap();
      toast.success(res.message || 'Successfully subscribed to the newsletter!');
      setEmail(''); // Clear the input field
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-8">Stay updated with our latest products and exclusive offers</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
