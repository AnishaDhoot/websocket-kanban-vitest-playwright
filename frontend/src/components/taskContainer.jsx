import "./taskContainer.css";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import { useState, useRef, useEffect } from "react";
const TaskContainer = ({ socket }) => {
    const [tasks, setTasks] = useState({});

    useEffect(()=>{

        const getData=async()=>{
            try{
                const data= await fetch("http://localhost:5000/api");
                const json = await data.json();
                setTasks(json);
            }catch(error){
                console.log(error);
            }
        }
        getData();
    },[]
    );

    useEffect(()=>{
        socket.on("tasks",(data)=>{
            setTasks(data);
        });
    },[socket]);
    function handleDragEnd({destination, source}){
        if(!destination) return;
        if(destination.index===source.index && destination.droppableId === source.droppableId) 
            return;
         
        socket.emit('taskDragged',{
            source, destination
        })
    }
    return (

        <div className="taskcontainer">
            <DragDropContext onDragEnd={handleDragEnd}>
             
                {Object.entries(tasks).map((task)=>(
                     
                     <div key={task[0]}>
                    <h2 className="titles">{task[1].title}  Tasks</h2>
                     <div className={`${(task[1].title.toLowerCase())}container`} key={task[1].title}>
                   
                         <div className={`${(task[1].title.toLowerCase())}`}>
                            <Droppable droppableId={task[1].title}>
                                {
                                    (provided)=>(
                                         <div ref={provided.innerRef} {...provided.droppableProps}   className="droppable-area"
                                         style={{ minHeight: "100px" }}> 
                                            {
                                                task[1].items.map((item,index)=>(   
                                                    console.log("Index:", index, "Item:", item.title),
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {
                                                            (provided)=>(
                                                                <div ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps} className={`${task[1].title.toLowerCase()}task`}>
                                                                    <p>{item.title}</p>
                                                                    <p>{item.description}</p>
                                                                    <p>{item.priority}</p>
                                                                    <p>{item.category}</p>
                                                                </div>
                                                            )
                                                        }
                                                    </Draggable>

                                                ))}
                                                {provided.placeholder}                                           
                                         </div>
                                    )
                                }
                            </Droppable>
                             
                         </div>
                     </div>
                     </div>
                ))}
          
            </DragDropContext>
            
        </div>
    );
};

export default TaskContainer;
