# 📋 TaskFlow — Kanban Task Manager

A clean, dark-themed task management dashboard built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no dependencies.

<img width="1905" height="931" alt="todo-apps" src="https://github.com/user-attachments/assets/554f54b7-5f30-493c-a112-837b2e9fd60f" />

---

## ✨ Features

- **Kanban Board** — Drag tasks across three columns: _To Do_, _In Progress_, and _Completed_
- **Add & Edit Tasks** — Create tasks with title, description, due date, and priority level
- **Priority Badges** — Label tasks as 🔴 High, 🟡 Medium, or 🔵 Low
- **Analytics Stats** — Live stats for total tasks, completed count, productivity score, and daily progress
- **Sparkline Charts** — Mini trend charts that update as you complete tasks
- **Analytics Modal** — Click any stat card for a detailed breakdown with charts and task lists
- **localStorage Persistence** — Tasks survive page refreshes automatically
- **Responsive Modals** — Smooth add/edit modal with column picker and validation

---

## 🗂️ Project Structure

```
taskflow/
├── index.html       # Main HTML structure
├── script.js        # All app logic (tasks, modals, analytics)
└── css/
    └── style.css    # Styling & animations
```

---

## 🚀 Getting Started

No build step required. Just open the file in your browser:

```bash
# Clone the repo
git clone https://github.com/AhmadBayu1412/todo-aps-dashboard.git

# Open in browser
cd taskflow
open index.html
```

Or use a local dev server:

```bash
npx serve .
# → http://localhost:3000
```

---

## 🛠️ Tech Stack

| Layer   | Technology                              |
| ------- | --------------------------------------- |
| Markup  | HTML5                                   |
| Styling | CSS3 (custom properties, grid, flex)    |
| Logic   | Vanilla JavaScript (ES6+)               |
| Icons   | [Tabler Icons](https://tabler.io/icons) |
| Storage | Browser `localStorage`                  |

---

## 📸 Screenshot

> Dashboard with live stats, kanban board, and dark theme.

![TaskFlow Screenshot](</assets/Screenshot%20(279).png>)

---

## 📄 License

MIT — free to use and modify.
