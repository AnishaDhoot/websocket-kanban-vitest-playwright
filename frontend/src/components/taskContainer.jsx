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

  const renderFilePreview = (file) => {
    if (!file) return null;

    if (typeof file === "string") {
      return (
        <div className="file-preview">
          <a href={file} target="_blank" rel="noopener noreferrer">
            View Attachment
          </a>
        </div>
      );
    }

    return (
      <div className="file-preview">
        <span>{file.name}</span>
      </div>
    );
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
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`droppable-area ${
                        snapshot.isDraggingOver ? "dragging-over" : ""
                      }`}
                      style={{ minHeight: "100px" }}
                    >
                      {task[1].items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${task[1].title.toLowerCase()}task ${
                                snapshot.isDragging ? "dragging" : ""
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                transform:
                                  provided.draggableProps.style?.transform, // Remove rotation
                              }}
                            >
                              <div className="task-content">
                                <h4 className="tasktitle">{item.title}</h4>
                                <h4 className="taskdesc">{item.description}</h4>

                                {/* {item.attachments && (
                                  <div className="attachment-container">
                                    {typeof item.attachments === "string" ? (
                                      <a
                                        href={item.attachments}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-link"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (
                                            !item.attachments.startsWith("http")
                                          ) {
                                            e.preventDefault();
                                            alert("Invalid attachment URL");
                                          }
                                        }}
                                      >
                                        <span className="attachment-icon">
                                          📎
                                        </span>
                                        <span className="attachment-name">
                                          {item.attachments.split("/").pop() ||
                                            "Attachment"}
                                        </span>
                                      </a>
                                    ) : (
                                      <button
                                        className="attachment-button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const url = URL.createObjectURL(
                                            item.attachments
                                          );
                                          window.open(url, "_blank");
                                          // Note: You should revoke this URL when component unmounts
                                        }}
                                      >
                                        <span className="attachment-icon">
                                          📄
                                        </span>
                                        <span className="attachment-name">
                                          {item.attachments.name ||
                                            "Uploaded File"}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                )} */}

                                <div className="priorityandcat">
                                  <h4
                                    className={`taskpriority ${item.priority.toLowerCase()}`}
                                  >
                                    {item.priority}
                                  </h4>
                                  <h4 className="taskcat">{item.category}</h4>
                                </div>
                              </div>

                              <div className="button-container">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item);
                                  }}
                                  className="editBtn"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                  }}
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

              {/* {editTask.attachments && (
  <div className="current-attachment">
    {typeof editTask.attachments === 'string' ? (
      <a
        href={editTask.attachments}
        target="_blank"
        rel="noopener noreferrer"
        className="attachment-link"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="attachment-icon">📎</span>
        <span className="attachment-name">
          {editTask.attachments.split('/').pop()}
        </span>
      </a>
    ) : (
      <button
        className="attachment-button"
        onClick={(e) => {
          e.stopPropagation();
          const url = URL.createObjectURL(editTask.attachments);
          window.open(url, '_blank');
        }}
      >
        <span className="attachment-icon">📄</span>
        <span className="attachment-name">
          {editTask.attachments.name}
        </span>
      </button>
    )}
  </div>
)} */}
              <div className="priorityCategory">
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
              </div>
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
