import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import getIcon from "../utils/iconUtils";

export default function NotFound() {
  const HomeIcon = getIcon("Home");
  const AlertTriangleIcon = getIcon("AlertTriangle");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mx-auto w-24 h-24 mb-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <AlertTriangleIcon className="w-12 h-12 text-amber-500" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-surface-700 dark:text-surface-200">
          Page Not Found
        </h2>
        
        <p className="text-lg max-w-md mx-auto mb-8 text-surface-600 dark:text-surface-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}