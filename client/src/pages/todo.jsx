import axios from "axios";
import { useState, useEffect } from "react";
import AddModal from "../components/AddModal";
import EditModal from "../components/EditModal";

function Todo() {
  const [titles, setTitles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [listModal, setListModal] = useState(null);

  const getTitles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-titles");
      setTitles(response.data.titles || []);
    } catch (error) {
      console.error("Error fetching titles:", error);
      setTitles([]);
    }
  };

  useEffect(() => {
    getTitles();
  }, []);

  const handleTitleClick = async (title) => {
    try {
      const response = await axios.post("http://localhost:3000/get-lists", { title_id: title.id });
      setListModal({ title: title.title, list: response.data.lists || [] });
    } catch (error) {
      console.error("Error fetching list:", error);
      setListModal({ title: title.title, list: [] });
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.post("http://localhost:3000/delete-to-do", { title_id: taskId });
      getTitles();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };




  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#EABDE6] to-[#FFDFEF] p-5">
      <h1 className="text-4xl font-extrabold text-[#AA60C8] mb-6 tracking-wide">To-Do List</h1>

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 flex gap-6">
        {/* To Do List */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold text-[#D69ADE] mb-3">To Do</h2>
          {titles.filter(task => !task.status).map((title) => (
            <div key={title.id} className="bg-[#EABDE6] text-white text-lg p-3 rounded-xl shadow-md mb-3 transition hover:scale-105 cursor-pointer">
              <div onClick={() => handleTitleClick(title)}>{title.title}</div>
              <div className="flex justify-end gap-2 mt-2">
                <button className="bg-[#D69ADE] text-white px-4 py-1 rounded-lg shadow-md hover:bg-[#AA60C8]" onClick={() => setEditModal(title)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-lg shadow-md hover:bg-red-600" onClick={() => handleDelete(title.id)}>Delete</button>
              </div>
            </div>
          ))}
          <button className="w-full bg-[#AA60C8] text-white py-3 rounded-xl mt-4 text-lg font-semibold shadow-md hover:bg-[#8E4EA8] transition" onClick={() => setShowModal(true)}>Add Task</button>
        </div>

        {/* Done List */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold text-[#D69ADE] mb-3">Done</h2>
          {titles.filter(task => task.status).map((task) => (
            <div key={task.id} className="bg-[#EABDE6] text-[#AA60C8] text-lg p-3 rounded-xl shadow-md mb-3 transition hover:scale-105 cursor-pointer">
              <div onClick={() => handleTitleClick(task)}>{task.title}</div>
              <div className="flex justify-end gap-2 mt-2">
                <button className="bg-[#D69ADE] text-white px-4 py-1 rounded-lg shadow-md hover:bg-[#AA60C8]" onClick={() => setEditModal(task)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-lg shadow-md hover:bg-red-600" onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <AddModal hide={() => setShowModal(false)} />}
      {editModal && <EditModal task={editModal} hide={() => setEditModal(null)} refresh={getTitles} />}

      {listModal && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
            <h2 className="text-2xl font-bold text-[#AA60C8] mb-4">List for "{listModal.title}"</h2>
            <ul className="space-y-3">
              {listModal.list.length > 0 ? (
                listModal.list.map((item) => (
                  <li key={item.id} className="flex justify-between items-center bg-[#FFDFEF] px-4 py-2 rounded-lg shadow">
                    <span className="text-[#AA60C8]">{item.list_desc}</span>
                    {/* <button className="bg-[#D69ADE] text-white px-3 py-1 rounded-lg hover:bg-[#AA60C8] transition" onClick={() => handleDelete(item.id)}>Delete</button> */}
                  </li>
                ))
              ) : (
                <li className="text-red-500 font-semibold">No lists available</li>
              )}
            </ul>
            <button className="mt-4 w-full bg-[#AA60C8] text-white py-3 rounded-lg hover:bg-[#8E4EA8] transition text-lg font-semibold" onClick={() => setListModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todo;
