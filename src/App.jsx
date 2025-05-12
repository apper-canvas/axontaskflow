import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Draggable from "react-draggable";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import getIcon from "./utils/iconUtils";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [currentTime, setCurrentTime] = useState(moment().format('h:mm:ss A'));
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format('h:mm:ss A'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Icon components
  const MoonIcon = getIcon("Moon");
  const ClockIcon = getIcon("Clock");
  const SunIcon = getIcon("Sun");
  const CheckCircleIcon = getIcon("CheckCircle");
  const MoveIcon = getIcon("Move");
  const GripIcon = getIcon("GripHorizontal");
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">
              Task<span className="text-primary">Flow</span>
            </h1>
          </div>

          <div className="flex items-center font-medium text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 px-3 py-1.5 rounded-full">
            <ClockIcon className="h-4 w-4 mr-1.5 text-primary" />
            <span>
              <span className="mr-1.5">Current Time:</span><span className="font-semibold">{currentTime}</span>
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: darkMode ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-surface-600" />
              )}
            </motion.div>
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Draggable
          handle=".drag-handle"
          bounds="parent"
          onStart={() => setIsDragging(true)}
          onStop={() => setIsDragging(false)}
          defaultPosition={{x: 50, y: 50}}
        >
          <div 
            className={`absolute w-64 rounded-xl ${
              isDragging ? 'z-50' : 'z-10'
            } bg-white dark:bg-surface-800 shadow-card dark:shadow-neu-dark 
            border border-surface-200 dark:border-surface-700 overflow-hidden
            transition-shadow ${isDragging ? 'shadow-xl' : ''}`}
          >
            <div className="drag-handle cursor-move p-2 bg-surface-100 dark:bg-surface-700 
                           border-b border-surface-200 dark:border-surface-600 flex items-center justify-between">
              <div className="flex items-center">
                <GripIcon className="h-4 w-4 text-surface-500 dark:text-surface-400 mr-2" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Draggable Widget</span>
              </div>
              <MoveIcon className="h-4 w-4 text-surface-500 dark:text-surface-400" />
            </div>
            <div className="p-4">
              <p className="text-sm text-surface-600 dark:text-surface-300">
                This is a draggable component. Grab the handle above to move this widget around the screen.
              </p>
            </div>
          </div>
        </Draggable>
      </main>

      <footer className="mt-auto py-4 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-sm text-surface-500 dark:text-surface-400">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;