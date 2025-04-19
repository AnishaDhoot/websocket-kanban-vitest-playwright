import React from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
   
      <div className="App">
        <h1 style={{ color: "#F6F0F0", textAlign:"center", fontSize:"3rem"  }}>Real-time Kanban Board</h1>
        <KanbanBoard />
      </div>
  );
}

export default App;
