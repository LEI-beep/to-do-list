import { useState, useEffect } from "react";
import axios from "axios";

function EditModal({ task, hide, refresh }) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.post("http://localhost:3000/get-lists", { title_id: task.id });
        setListItems(response.data.lists || []);
      } catch (error) {
        console.error("Error fetching list details:", error);
      }
    };

    fetchDetails();
  }, [task.id]);

  const handleUpdate = async () => {
    try {
      console.log("Updating Title:", { id: task.id, title, status });
  
      const formattedStatus = status ? 1 : 0;
  
      // Update title
      await axios.post("http://localhost:3000/update-title", {
        id: task.id,
        title,
        status: formattedStatus,
      });
  
      // Update existing list items & add new ones
      await Promise.all(
        listItems.map(async (item) => {
          if (item.id.toString().startsWith("new-")) {
            // If the ID starts with "new-", it means it's a new task
            console.log("Creating new list item:", item);
            await axios.post("http://localhost:3000/create-list", {
              title_id: task.id,
              list_desc: item.list_desc,
              status: item.status ? 1 : 0,
            });
          } else {
            console.log("Updating existing list item:", item);
            await axios.post("http://localhost:3000/update-list", {
              id: item.id,
              list_desc: item.list_desc,
              status: item.status ? 1 : 0,
            });
          }
        })
      );
  
      refresh();
      hide();
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
    }
  };
  

  const addTask = () => {
    setListItems([...listItems, { id: `new-${Date.now()}`, list_desc: "", status: false }]);
  };
  
  
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-[#FFDFEF] p-6 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-[#AA60C8] mb-4">Edit Task</h2>
        <input
          type="text"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#AA60C8] bg-[#EABDE6]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <label className="block mb-4">
          <span className="text-lg font-semibold text-[#D69ADE]">Status:</span>
          <select
            className="w-full border border-gray-300 p-3 rounded-lg mt-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#AA60C8] bg-[#EABDE6]"
            value={status}
            onChange={(e) => setStatus(e.target.value === "true")}
          >
            <option value="false">To Do</option>
            <option value="true">Done</option>
          </select>
        </label>

        <h3 className="text-lg font-semibold text-[#D69ADE] mb-3">Edit List Items</h3>
        {listItems.map((item, index) => (
  <div key={item.id} className="flex space-x-2">
    <input
      type="text"
      className="w-full border border-gray-300 p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#AA60C8] bg-[#EABDE6]"
      value={item.list_desc}
      onChange={(e) =>
        setListItems((prev) => {
          const updatedList = [...prev];
          updatedList[index].list_desc = e.target.value;
          return updatedList;
        })
      }
    />
    <select
      className="border border-gray-300 p-2 rounded-lg bg-[#EABDE6]"
      value={item.status}
      onChange={(e) =>
        setListItems((prev) => {
          const updatedList = [...prev];
          updatedList[index].status = e.target.value === "true";
          return updatedList;
        })
      }
    >
      <option value="false">To Do</option>
      <option value="true">Done</option>
    </select>
  </div>
))}

<div className="flex justify-between space-x-4 mt-4">
  <button
    onClick={addTask}
    className="px-4 py-2 bg-[#AA60C8] text-white rounded-lg hover:bg-[#8E4DA6]"
  >
    Add Task
  </button>
</div>

<div className="flex justify-between mt-6">
  <button 
    className="bg-gray-500 text-white px-5 py-2 rounded-lg text-lg shadow-md hover:bg-gray-600 transition" 
    onClick={hide}
  >
    Cancel
  </button>
  <button 
    className="bg-[#AA60C8] text-white px-5 py-2 rounded-lg text-lg shadow-md hover:bg-[#8E4EA8] transition" 
    onClick={handleUpdate}
  >
    Save
  </button>
</div>

      </div>
    </div>
  );
}

export default EditModal;
