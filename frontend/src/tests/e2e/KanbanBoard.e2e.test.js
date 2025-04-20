import { test, expect } from "@playwright/test";

test("User can add a task and see it on the board", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.getByText("Real-time Kanban Board")).toBeVisible();

  await page.getByRole("button", { name: /add task/i }).click();

  await page.getByLabel("Title").fill("Test Task");
  await page.getByLabel("Description").fill("This is a test task.");
  await page.getByLabel("Category").selectOption("Bug"); 
  await page.getByLabel("Priority").selectOption("High");

  
  await page.getByRole("button", { name: /create/i }).click();

  await expect(page.getByText("Test Task")).toBeVisible();
});
