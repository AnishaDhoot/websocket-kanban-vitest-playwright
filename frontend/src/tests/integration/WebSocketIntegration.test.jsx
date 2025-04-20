import { render, screen, waitFor } from "@testing-library/react";
import KanbanBoard from "../../components/KanbanBoard";
import { io } from "socket.io-client";


jest.mock("socket.io-client");

const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
};

beforeEach(() => {
  io.mockReturnValue(mockSocket);
  mockSocket.on.mockClear();
  mockSocket.emit.mockClear();
  mockSocket.off.mockClear();
});

test("renders Kanban board with WebSocket", () => {
  render(<KanbanBoard />);
  expect(screen.getByText("Kanban Board")).toBeInTheDocument();
});

test("WebSocket receives a new task update", async () => {

  const taskData = {
    id: "123",
    title: "Real-time Task",
  };

  mockSocket.on.mockImplementation((event, cb) => {
    if (event === "task-created") {
      cb(taskData);
    }
  });

  render(<KanbanBoard />);

  await waitFor(() => {
    expect(screen.getByText("Real-time Task")).toBeInTheDocument();
  });
});

test("WebSocket updates a task column", async () => {
  const updatedTask = {
    id: "456",
    title: "Updated Task",
  };

  mockSocket.on.mockImplementation((event, cb) => {
    if (event === "task-updated") {
      cb(updatedTask);
    }
  });

  render(<KanbanBoard />);
});
