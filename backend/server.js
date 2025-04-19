const express = require("express");
const http = require("http");
const { title } = require("process");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
app.use(cors({ origin: "http://localhost:3000" }));
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
const UID = () => Math.random().toString(36).substring(2, 10);
const tasks = {
  todo: {
    title: "todo",
    items: [
      {
        id: UID(),
        title: "Complete the task",
        description: "Complete the task",
        priority: "Low",
        category: "Bug",
        attachments: [],
      },
      {
        id: UID(),
        title: "Task B",
        description: "Second task",
        priority: "High",
        category: "Feature",
        attachments: [],
      }
    ],

  },
  inprogress: {
    title: "inprogress",
    items: [
      {
        id: UID(),
        title: "Complete the task 1",
        description: "Complete the task",
        priority: "Low",
        category: "Bug",
        attachments: [],
      },
    ],

  },
  done: {
    title: "done",
    items: [
      {
        id: UID(),
        title: "Complete the task 2 ",
        description: "Complete the task",
        priority: "Low",
        category: "Bug",
        attachments: [],
      },
    ],
  },
}

app.get("/api", (req, res) => {
  res.json(tasks);
})

io.on("connection", (socket) => {
  console.log(`${socket.id} a user is connected`);
  // TODO: Implement WebSocket events for task management
  socket.on("createTask", (data) => {
    const newTask = {
      id: UID(),
      title: data.name,
      description: data.description,
      priority: data.priority,
      category: data.category,
      attachments: data.attachments,
    };
    if (!tasks["todo"]) {
      tasks["todo"] = {
        title: "ToDo",
        items: [],
      };
    }
    tasks["todo"].items.push(newTask);

    io.sockets.emit("tasks", tasks);
  });
  socket.on("updateTask", (data) => {
    const updatedTask = {
      id: data.id,
      title: data.name,
      description: data.description,
      priority: data.priority,
      category: data.category,
      attachments: data.attachments,
    };
    io.sockets.emit("tasks", tasks);
  });

  socket.on("deleteTask", (data) => {
    tasks[data.droppableId].items.splice(data.index, 1);
    io.sockets.emit("tasks", tasks);
  });


  socket.on("taskDragged", (data) => {
    const { source, destination } = data;
    const itemMoved = {
      ...tasks[source.droppableId].items[source.index],
    };
    tasks[source.droppableId].items.splice(source.index, 1);
    tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);
    io.sockets.emit("tasks", tasks);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
