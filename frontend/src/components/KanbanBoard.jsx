import React from 'react';
import AddTask from './AddTask';

import io from 'socket.io-client';
import TaskContainer from './taskContainer';

const socket = io("http://localhost:5000");
function KanbanBoard() {
    // TODO: Implement state and WebSocket logic
    
    return (
        <div>
            {/* TODO: Implement task rendering and interactions */}
            <AddTask socket={socket}/>
            <TaskContainer socket={socket} />
            

        </div>
    );
}

export default KanbanBoard;
