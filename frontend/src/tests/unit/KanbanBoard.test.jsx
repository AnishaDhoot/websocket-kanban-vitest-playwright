import { render, screen, fireEvent } from "@testing-library/react";
import KanbanBoard from "../../src/components/KanbanBoard.jsx";

describe("KanbanBoard", () => {
  test("renders Kanban board title", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });

  test("renders default columns", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  test("renders existing tasks", () => {
    render(<KanbanBoard />);
    expect(screen.queryByText("Test Task")).toBeInTheDocument();
  });

  test("opens task modal on clicking 'New Task'", () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByText("New Task"));
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();
  });

  test("adds a new task to the board", () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByText("New Task"));
    fireEvent.change(screen.getByPlaceholderText("Task title"), {
      target: { value: "New Test Task" },
    });
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("New Test Task")).toBeInTheDocument();
  });

  test("deletes a task", () => {
    render(<KanbanBoard />);
    const task = screen.getByText("Test Task");
    fireEvent.mouseOver(task);
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
  });
});
