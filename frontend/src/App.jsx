import React from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <body  style={{ backgroundColor: "#1a1a1c" }}>
    <div >
      <h1 style={{ textAlign: "center", paddingTop: "20px", color: "white" , fontSize: "xxx-large" }}>
        Real-time Kanban Board
      </h1>
      <KanbanBoard />
    </div>
    </body>
  );
}

export default App;
