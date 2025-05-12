import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import MainFeature from "../components/MainFeature";
import getIcon from "../utils/iconUtils";

export default function Home() {
  // Initialize icons
  const CheckCircleIcon = getIcon("CheckCircle");
  const ClipboardListIcon = getIcon("ClipboardList");
  const ChartIcon = getIcon("BarChart3");
  const ClockIcon = getIcon("Clock");
  
  // Track active tab
  const [activeTab, setActiveTab] = useState("tasks");
  
  // Task statistics
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });

  // Update stats when tasks change
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    
    const newStats = {
      total: savedTasks.length,
      completed: savedTasks.filter(task => task.status === "Completed").length,
      inProgress: savedTasks.filter(task => task.status === "In Progress").length,
      notStarted: savedTasks.filter(task => task.status === "Not Started").length
    };
    
    setStats(newStats);
  }, []);

  // Handle task changes from MainFeature
  const handleTasksChange = (tasks) => {
    setStats({
      total: tasks.length,
      completed: tasks.filter(task => task.status === "Completed").length,
      inProgress: tasks.filter(task => task.status === "In Progress").length,
      notStarted: tasks.filter(task => task.status === "Not Started").length
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Manage Your Tasks with Ease
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay organized, focused, and productive with TaskFlow
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-surface-700 dark:text-surface-200">Total Tasks</h3>
              <ClipboardListIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
          
          <div className="card p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-surface-700 dark:text-surface-200">Completed</h3>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          </div>
          
          <div className="card p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-surface-700 dark:text-surface-200">In Progress</h3>
              <ChartIcon className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
          </div>
          
          <div className="card p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-surface-700 dark:text-surface-200">Not Started</h3>
              <ClockIcon className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-500">{stats.notStarted}</p>
          </div>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <MainFeature onTasksChange={handleTasksChange} />
      </motion.div>
    </div>
  );
}