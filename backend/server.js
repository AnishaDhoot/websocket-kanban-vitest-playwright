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
    title: "ToDo",
    items: [
    ],

  },
  inprogress: {
    title: "InProgress",
    items: [
      
    ],

  },
  done: {
    title: "Done",
    items: [
     
    ],
  },
}

app.get("/api", (req, res) => {
  res.json(tasks);
})

io.on("connection", (socket) => {
  console.log(`${socket.id} a user is connected`);
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


  socket.on("editTask", (updatedTask) => {
    for (let taskCategory of Object.values(tasks)) {
      for (let item of taskCategory.items) {
        if (item.id === updatedTask.id) {
          item.title = updatedTask.title;
          item.description = updatedTask.description;
          item.priority = updatedTask.priority;
          item.category = updatedTask.category;
          item.attachments = updatedTask.attachments;
        }
      }
    }
    io.sockets.emit("tasks", tasks);
  });
  
  socket.on("deleteTask", (taskId) => {
    for (let taskCategory of Object.values(tasks)) {
      taskCategory.items = taskCategory.items.filter((item) => item.id !== taskId);
    }
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
