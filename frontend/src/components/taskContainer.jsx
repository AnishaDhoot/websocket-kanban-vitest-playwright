import "./taskContainer.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";

const TaskContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetch("http://localhost:5000/api");
        const json = await data.json();
        setTasks(json);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    socket.on("tasks", (data) => {
      setTasks(data);
    });
  }, [socket]);

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    socket.emit("taskDragged", {
      source,
      destination,
    });
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsEdit(true);
  };

  const handleDelete = (taskId) => {
    socket.emit("deleteTask", taskId);
  };

  const handleUpdateTask = (updatedTask) => {
    socket.emit("editTask", updatedTask);
    setIsEdit(false);
    setEditTask(null);
  };

  return (
    <div className="taskcontainer">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map((task) => (
          <div key={task[0]}>
            <h2 className="titles">{task[1].title} Tasks</h2>
            <div className={`${task[1].title.toLowerCase()}container`}>
              <div className={`${task[1].title.toLowerCase()}`}>
                <Droppable droppableId={task[1].title.toLowerCase()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="droppable-area"
                      style={{ minHeight: "100px" }}
                    >
                      {task[1].items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${task[1].title.toLowerCase()}task`}
                            >
                              <h4 className="tasktitle">{item.title}</h4>
                              <h4 className="taskdesc">{item.description}</h4>
                              <div className="priorityandcat">
                                <h4
                                  className={`taskpriority ${item.priority.toLowerCase()}`}
                                >
                                  {item.priority}
                                </h4>
                                <h4 className="taskcat">{item.category}</h4>
                              </div>
                              <div className="button-container">
                              <button
                                onClick={() => handleEdit(item)}
                                className="editBtn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="deleteBtn"
                              >
                                Delete
                              </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        ))}
      </DragDropContext>

      {isEdit && editTask && (
        <div className="overlay">
          <div className="modal">
            <h2 className="modalTitle">Edit Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTask(editTask);
              }}
              className="form"
            >
              <input
                type="text"
                name="name"
                placeholder="Task Name"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                className="input"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                className="textarea"
              />
              <input
                type="file"
                name="attachments"
                onChange={(e) =>
                  setEditTask({ ...editTask, attachments: e.target.files[0] })
                }
                className="fileInput"
              />
              <select
                name="priority"
                value={editTask.priority}
                onChange={(e) =>
                  setEditTask({ ...editTask, priority: e.target.value })
                }
                className="select"
              >
                <option value="">Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                name="category"
                value={editTask.category}
                onChange={(e) =>
                  setEditTask({ ...editTask, category: e.target.value })
                }
                className="select"
              >
                <option value="">Category</option>
                <option value="bug">Bug</option>
                <option value="enhancement">Enhancement</option>
                <option value="feature">Feature</option>
              </select>
              <div className="actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEdit(false);
                    setEditTask(null);
                  }}
                  className="cancelBtn"
                >
                  Cancel
                </button>
                <button type="submit" className="submitBtn">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskContainer;
