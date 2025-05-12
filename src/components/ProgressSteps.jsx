import { FaCheck, FaUser, FaTruck, FaFileAlt } from 'react-icons/fa';

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="w-full max-w-3xl mx-auto pt-16 pb-8 px-4">
      <div className="relative flex items-center justify-between">
        {/* Connector Lines - Background */}
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200"></div>
        
        {/* Connector Lines - Active */}
        <div 
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-pink-500 to-blue-600 transition-all duration-300 ease-in-out`}
          style={{ 
            width: step3 ? '100%' : step2 ? '50%' : step1 ? '25%' : '0%' 
          }}
        ></div>
        
        {/* Step 1: Login */}
        <div className="relative flex flex-col items-center z-10">
          <div 
            className={`w-14 h-14 rounded-full flex items-center justify-center ${step1 
              ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white shadow-md' 
              : 'bg-gray-200 text-gray-400'} transition-all duration-300`}
          >
            <FaUser className="text-xl" />
          </div>
          <span className={`mt-2 text-sm font-medium ${step1 ? 'text-gray-800' : 'text-gray-400'} transition-all duration-300`}>
            Login
          </span>
        </div>

        {/* Step 2: Shipping */}
        <div className="relative flex flex-col items-center z-10">
          <div 
            className={`w-14 h-14 rounded-full flex items-center justify-center ${step2 
              ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white shadow-md' 
              : 'bg-gray-200 text-gray-400'} transition-all duration-300`}
          >
            <FaTruck className="text-xl" />
          </div>
          <span className={`mt-2 text-sm font-medium ${step2 ? 'text-gray-800' : 'text-gray-400'} transition-all duration-300`}>
            Shipping
          </span>
        </div>

        {/* Step 3: Summary */}
        <div className="relative flex flex-col items-center z-10">
          <div 
            className={`w-14 h-14 rounded-full flex items-center justify-center ${step3 
              ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white shadow-md' 
              : 'bg-gray-200 text-gray-400'} transition-all duration-300`}
          >
            <FaFileAlt className="text-xl" />
          </div>
          <span className={`mt-2 text-sm font-medium ${step3 ? 'text-gray-800' : 'text-gray-400'} transition-all duration-300`}>
            Summary
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
