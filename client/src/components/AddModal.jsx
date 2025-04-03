import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";

export default function AddModal({ hide }) {
    const [title, setTitle] = useState(''); // Fixed typo in state setter name
    const [tasks, setTasks] = useState([""]); // Initialize with one empty task
    const [showError, setShowError] = useState(false); // Define showError state
    const [successMessage, setSuccessMessage] = useState(""); // Define successMessage state
    const navigate = useNavigate(); 

    // Function to add a new task input field
    const addTask = () => {
        setTasks([...tasks, ""]);
    };

    // Function to remove a task input field
    const removeTask = async (index, taskId) => {
        if (taskId) {
            try {
                const response = await axios.delete(`http://localhost:3000/delete-task/${taskId}`);
                if (!response.data.success) {
                    alert("Failed to delete task. Please try again.");
                    return;
                }
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("Failed to delete task. Please try again.");
                return;
            }
        }
        setTasks(tasks.filter((_, i) => i !== index));
    };
    

    // Function to update a specific task in the state
    const updateTask = (index, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = value;
        setTasks(updatedTasks);
    };

    // Save tasks to the backend
    const saveTask = async () => {
        try {
            const username = "KURT"; // Replace with actual username logic
            const status = "false"; // Replace with actual status logic
    
            // Prepare the payload
            const payload = {
                username,
                title,
                lists: tasks.filter(task => task.trim() !== ""), // Remove empty tasks
                status,
            };
    
            // Send POST request to the backend
            const response = await axios.post('http://localhost:3000/add-to-do', payload);
    
            // Handle response based on backend logic
            if (response.data.success) { // Assuming the backend returns a `success` property
                setShowError(false); // No error
/*                 setSuccessMessage("Tasks saved successfully!"); */ // Set success message
    
                // Show success alert
                alert("Tasks saved successfully!");
                navigate("/todo");
            } else {
                setShowError(true); // Show error
                setSuccessMessage(""); // Clear success message
    
                // Show error alert
                alert("Failed to save tasks. Please try again.");
            }
        } catch (error) {
            console.error("Error saving tasks:", error);
            setShowError(true); // Show error on failure
            setSuccessMessage(""); // Clear success message
    
            // Show error alert
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-opacity-50">
            <div className="relative w-full max-w-md p-6 bg-[#FFDFEF] rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#AA60C8]">About your tool</h3>
                    <button
                        onClick={hide}
                        id="CloseModalButton"
                        className="text-[#D69ADE] hover:text-[#AA60C8]"
                    >
                        <svg
                            className="h-4 w-4 inline-block ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-[#AA60C8]">
                            Task Title
                        </label>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="w-full mt-1 p-2 border border-[#D69ADE] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EABDE6] bg-[#FFDFEF] text-[#AA60C8] placeholder-[#D69ADE]"
                        />
                    </div>

                    <div className="mt-3">
                        <label htmlFor="list" className="block text-sm font-medium text-[#AA60C8]">
                            Task List
                        </label>
                        <div className="space-y-2">
                        {tasks.map((task, index) => (
    <div key={index} className="flex items-center space-x-2">
        <input
            type="text"
            value={task.text}
            onChange={(e) => updateTask(index, e.target.value)}
            className="p-2 border border-[#D69ADE] rounded-md w-full bg-[#FFDFEF] text-[#AA60C8] placeholder-[#D69ADE]"
            placeholder={`Task ${index + 1}`}
        />
        {tasks.length > 1 && (
            <button
                onClick={() => removeTask(index, task.id)}
                className="px-3 py-2 bg-[#D69ADE] text-white rounded-lg hover:bg-[#AA60C8]"
            >
                Delete
            </button>
        )}
    </div>
))}

                        </div>
                    </div>

                    {/* Buttons Section */}
                    <div className="flex justify-between space-x-4">
                        <button
                            onClick={addTask}
                            className="px-4 py-2 bg-[#AA60C8] text-white rounded-lg hover:bg-[#8E4DA6]"
                        >
                            Add Task
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={saveTask}
                            className="px-4 py-2 bg-[#AA60C8] text-white rounded-lg hover:bg-[#8E4DA6]"
                        >
                            Save Tasks
                        </button>
                    </div>



                    {/* Error Message */}
                    {showError && (
                        <p className="text-red-500 text-sm">An error occurred while saving tasks.</p>
                    )}
                </div>
            </div>
        </div>
    );
}