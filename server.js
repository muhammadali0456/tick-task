const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const CHECK_INTERVAL_MS = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory storage: tasks are lost when the server restarts.
const tasks = [];

// Fire each due reminder once.
function checkReminders() {
  const now = new Date();
  for (const task of tasks) {
    if (!task.reminderSent && new Date(task.reminderTime) <= now) {
      task.reminderSent = true;
      console.log(`[REMINDER] "${task.title}" expires at ${task.expiryTime}`);
    }
  }
}

// GET /tasks - list all tasks
app.get("/tasks", (req, res) => {
  // Also check here, since on Vercel the server only runs during requests.
  checkReminders();
  res.json(tasks);
});

// POST /tasks - create a task
app.post("/tasks", (req, res) => {
  const { title, expiryTime, reminderTime } = req.body || {};

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (!expiryTime || !reminderTime) {
    return res.status(400).json({ error: "Expiry time and reminder time are required." });
  }

  const expiry = new Date(expiryTime);
  const reminder = new Date(reminderTime);
  if (isNaN(expiry) || isNaN(reminder)) {
    return res.status(400).json({ error: "Expiry and reminder must be valid dates." });
  }
  if (reminder >= expiry) {
    return res.status(400).json({ error: "Reminder time must be before expiry time." });
  }

  const task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    expiryTime: expiry.toISOString(),
    reminderTime: reminder.toISOString(),
    reminderSent: false,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// DELETE /tasks/:id - delete a task
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found." });
  }
  const [removed] = tasks.splice(index, 1);
  res.json(removed);
});

// Vercel imports the app; running `node server.js` starts it locally.
module.exports = app;

if (require.main === module) {
  // Reminder checker: every few seconds, fire each due reminder once.
  setInterval(checkReminders, CHECK_INTERVAL_MS);

  app.listen(PORT, () => {
    console.log(`TickTask running at http://localhost:${PORT}`);
  });
}
