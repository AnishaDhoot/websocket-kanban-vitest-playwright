import { useState } from "react";
import "./AddTask.css";

const AddTask = ({ socket }) => {
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "",
    category: "",
    attachments: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachments") {
      setTask({ ...task, attachments: files[0] });
    } else {
      setTask({ ...task, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.name.trim()) return;

    socket.emit("createTask", task);

    setTask({
      name: "",
      description: "",
      priority: "",
      category: "",
      attachments: null,
    });
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="addBtn">
        Add Task
      </button>

      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                name="name"
                placeholder="Task Name"
                value={task.name}
                onChange={handleChange}
                className="input"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={task.description}
                onChange={handleChange}
                className="textarea"
              />
              <input
                type="file"
                name="attachments"
                onChange={handleChange}
                className="fileInput"
              />
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="select"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                name="category"
                value={task.category}
                onChange={handleChange}
                className="select"
              >
                <option value="bug">Bug</option>
                <option value="enhancement">Enhancement</option>
                <option value="feature">Feature</option>
              </select>
              <div className="actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancelBtn"
                >
                  Cancel
                </button>
                <button type="submit" className="submitBtn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;
