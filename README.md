# TickTask

A small to-do web app with reminders. Create a task with a title, a reminder time and an expiry time. When the reminder time comes, the app shows an alert once. You can delete tasks when you're done.

## Features

- Create a task with a title, reminder time and expiry time
- Delete a task
- Reminders: the server checks every 5 seconds and sends each reminder once
- Validation: every field is required, and the reminder must be before the expiry

## Built with

- Node.js
- Express
- Plain HTML and JavaScript for the page

Built with the help of Claude, an AI coding assistant.

## How to run it

You need [Node.js](https://nodejs.org) installed.

```bash
git clone <this-repo-url>
cd TickTask
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## How to test it

1. Add a task with the reminder 1 minute from now and the expiry 5 minutes from now.
2. Wait about a minute. A reminder popup appears and the task shows "(sent)".
3. Try a reminder time after the expiry time. You'll get an error.
4. Click "Delete" to remove a task.

## API routes

| Method | Route | What it does |
|---|---|---|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Add a task (`title`, `reminderTime`, `expiryTime`) |
| DELETE | `/tasks/:id` | Delete a task by its ID |

Example task:

```json
{
  "id": "33460eba-b2a6-4f5d-b7c0-02d9096d4d4b",
  "title": "Buy milk",
  "expiryTime": "2026-10-22T15:23:50.981Z",
  "reminderTime": "2026-10-22T14:23:52.907Z",
  "reminderSent": false
}
```

## Known limitations

Tasks are stored in memory, so they're lost when the server restarts.

## Next ideas

- Edit tasks
- Save tasks in a database
- Proper notifications (for example, browser notifications or email)
