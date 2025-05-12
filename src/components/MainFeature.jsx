import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import getIcon from "../utils/iconUtils";

export default function MainFeature({ onTasksChange }) {
  // Define icons
  const PlusIcon = getIcon("Plus");
  const CheckCircleIcon = getIcon("CheckCircle");
  const ClockIcon = getIcon("Clock");
  const CircleDashedIcon = getIcon("CircleDashed");
  const TrashIcon = getIcon("Trash");
  const EditIcon = getIcon("Edit");
  const XIcon = getIcon("X");
  const SearchIcon = getIcon("Search");
  const FilterIcon = getIcon("Filter");
  const AlertCircleIcon = getIcon("AlertCircle");
  const ArrowUpCircleIcon = getIcon("ArrowUpCircle");
  const CalendarIcon = getIcon("Calendar");
  const TagIcon = getIcon("Tag");
  
  // Initialize tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  // Manage task form
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    labels: []
  });
  
  // Filter and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [availableLabels, setAvailableLabels] = useState([
    "Work", "Personal", "Health", "Finance", "Learning"
  ]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  
  // Validation errors
  const [errors, setErrors] = useState({});

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      const matchesLabel = !selectedLabel || (task.labels && task.labels.includes(selectedLabel));
      
      return matchesSearch && matchesStatus && matchesPriority && matchesLabel;
    })
    .sort((a, b) => {
      if (selectedSort === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (selectedSort === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (selectedSort === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (selectedSort === "priority") {
        const priorityOrder = { "Urgent": 0, "High": 1, "Medium": 2, "Low": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "Not Started",
      priority: "Medium",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      labels: []
    });
    setEditingTask(null);
    setErrors({});
  };
  
  // Open the form
  const openForm = () => {
    resetForm();
    setFormOpen(true);
  };
  
  // Close the form
  const closeForm = () => {
    setFormOpen(false);
    resetForm();
  };
  
  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      labels: task.labels || []
    });
    setFormOpen(true);
  };
  
  // Delete task
  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    toast.success("Task deleted successfully");
  };
  
  // Toggle task status
  const toggleStatus = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "Completed" ? "Not Started" : "Completed";
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    const task = tasks.find(t => t.id === taskId);
    const newStatus = task.status === "Completed" ? "Not Started" : "Completed";
    toast.info(`Task marked as ${newStatus}`);
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Toggle label selection
  const toggleLabel = (label) => {
    setFormData(prev => {
      const labels = prev.labels || [];
      if (labels.includes(label)) {
        return { ...prev, labels: labels.filter(l => l !== label) };
      } else {
        return { ...prev, labels: [...labels, label] };
      }
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...formData, updatedAt: new Date().toISOString() } : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
    } else {
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      toast.success("Task added successfully");
    }
    
    closeForm();
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "In Progress":
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <CircleDashedIcon className="w-5 h-5 text-amber-500" />;
    }
  };
  
  // Get priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-primary" />
          Task Manager
        </h2>
        
        <button
          onClick={openForm}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Task
        </button>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
          <h3 className="font-semibold text-surface-700 dark:text-surface-300">Filters & Search</h3>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          
          {/* Label Filter */}
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
              Labels
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLabel("")}
                className={`px-3 py-1 rounded-full text-sm ${!selectedLabel ? 'bg-primary text-white' : 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300'}`}
              >
                All
              </button>
              {availableLabels.map(label => (
                <button
                  key={label}
                  onClick={() => setSelectedLabel(label === selectedLabel ? "" : label)}
                  className={`px-3 py-1 rounded-full text-sm ${label === selectedLabel ? 'bg-primary text-white' : 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'} 
          {statusFilter !== 'All' && ` • ${statusFilter}`}
          {priorityFilter !== 'All' && ` • ${priorityFilter} Priority`}
          {selectedLabel && ` • Label: ${selectedLabel}`}
        </h3>
      </div>
      
      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <ClipboardIcon className="w-16 h-16 text-surface-400 dark:text-surface-600" />
          </div>
          <h3 className="text-xl font-medium text-surface-700 dark:text-surface-300 mb-2">
            No tasks found
          </h3>
          <p className="text-surface-500 dark:text-surface-400">
            {tasks.length === 0 
              ? "Start by creating your first task!" 
              : "Try adjusting your filters to see more tasks."}
          </p>
          {tasks.length === 0 && (
            <button
              onClick={openForm}
              className="mt-4 btn btn-primary inline-flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`card overflow-hidden ${task.status === "Completed" ? "border-l-4 border-l-green-500" : ""}`}
              >
                <div className="p-4 flex items-start gap-3">
                  <button 
                    onClick={() => toggleStatus(task.id)}
                    className="mt-1 transition-transform hover:scale-110"
                    aria-label={task.status === "Completed" ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`font-medium text-surface-800 dark:text-surface-100 break-words ${task.status === "Completed" ? "line-through text-surface-500 dark:text-surface-400" : ""}`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex shrink-0 gap-1 -mt-1 -mr-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1.5 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                          aria-label="Edit task"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 break-words">
                        {task.description.length > 120
                          ? `${task.description.substring(0, 120)}...`
                          : task.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      
                      <span className="text-xs flex items-center gap-1 text-surface-500 dark:text-surface-400">
                        <CalendarIcon className="w-3 h-3" />
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.labels.map(label => (
                          <span 
                            key={label} 
                            className="text-xs px-2 py-0.5 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-full flex items-center gap-1"
                          >
                            <TagIcon className="w-3 h-3" />
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Task Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-surface-900 bg-opacity-75 transition-opacity"
                onClick={closeForm}
              ></motion.div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                    {editingTask ? "Edit Task" : "Add New Task"}
                  </h3>
                  <button 
                    onClick={closeForm}
                    className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                  >
                    <XIcon className="w-6 h-6 text-surface-500 dark:text-surface-400" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`input ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Enter task title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircleIcon className="w-4 h-4" /> {errors.title}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="input resize-none"
                      placeholder="Enter task description (optional)"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className={`input ${errors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircleIcon className="w-4 h-4" /> {errors.dueDate}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Labels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableLabels.map(label => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleLabel(label)}
                          className={`px-3 py-1 rounded-full text-sm ${formData.labels?.includes(label) ? 'bg-primary text-white' : 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {editingTask ? "Update Task" : "Add Task"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Clipboard icon for empty state
function ClipboardIcon(props) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M12 11h4"></path>
      <path d="M12 16h4"></path>
      <path d="M8 11h.01"></path>
      <path d="M8 16h.01"></path>
    </svg>
  );
}