import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-tertiary rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-4 border-tertiary rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-white font-medium text-lg tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 