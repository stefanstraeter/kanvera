# KANVERA

A modern productivity workspace built with Vanilla JavaScript, modular architecture, and multi-page UI flows.

Plan, organize, and execute work across Board, Inbox, Team, and Pulse views with responsive interactions and clean component structure.

🔗 **Live Demo:** https://stefanstraeter.github.io/kanvera/

---

## Preview

> Add your app screenshot or GIF here (recommended: board + mobile modal flow)
>
> Example path: `assets/img/kanvera-preview.gif`

---

## Features

- Kanban-style board with drag-and-drop task management (desktop)
- Mobile-friendly task moving via modal action sheet (touch devices)
- Task detail modal with inline editing, subtasks, assignees, and priority controls
- Dedicated Inbox page for personal assigned tasks with filtering
- Pulse dashboard with overview metrics and time-based greetings
- Team management with member add/edit/delete flows
- Auth flow with sign-in, sign-up, guest access, and route guarding
- Light/Dark theme switching with persistent preference
- Toast feedback system and tactile mobile feedback (`navigator.vibrate`)
- Resilient storage layer for environments with blocked Web Storage

---

## Purpose

This project was developed as part of a frontend training program at the Developer Akademie.

It demonstrates how to build a scalable project management application from scratch using only Vanilla JavaScript and modular ES6 architecture.

Focus areas include:

- modular feature architecture (manager/service/template separation)
- reusable shared components and utility layers
- robust state handling with cache and fallback strategies
- responsive UX patterns for desktop and mobile interactions

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/stefanstraeter/kanvera.git
cd kanvera
```

Run the project with a local development server (for example VS Code Live Server).

Open `index.html` to start the auth flow.

---

## Tech Stack

- HTML5
- CSS3 (modular architecture + theme variables)
- Vanilla JavaScript (ES6 Modules)
- Firebase Realtime Database (data backend)
- Web Storage APIs (session/local storage with safe fallbacks)

---

## Project Structure

```text
src/
  core/
    firebase.config.js
    state.js
  features/
    auth/
    board/
    inbox/
    member/
    pulse/
    task/
    team/
  shared/
    components/
    utils/
styles/
  core/
  features/
  shared/
templates/
```

- **src/core** – State initialization, backend connectivity, global data flow
- **src/features** – Domain-specific modules (auth, board, task, team, inbox, pulse)
- **src/shared/components** – Shared UI components (header, navbar, modal)
- **src/shared/utils** – Shared helpers (theme, validation, UI utilities, constants)
- **styles/** – Layered CSS architecture by core, feature, and shared concerns
- **templates/** – Shared static HTML fragments for layout composition

---

## Architecture Highlights

- **Feature-Driven ES6 Modules**  
  Every domain is split into focused files (`*.manager.js`, `*.service.js`, `*.template.js`) for clear responsibilities.

- **Route-Aware Bootstrapping**  
  A single app entry initializes only the managers required for the active page.

- **State + Cache Strategy**  
  Centralized in-memory state with synchronized session cache and change notifications.

- **Cross-Device Interaction Design**  
  Desktop uses drag-and-drop, while mobile uses tap-first modal movement for better usability.

---

## Technical Challenges

### Multi-Page App With Shared Logic

Coordinating common UI systems (header, sidebar, theme, auth guard) across several standalone HTML pages.

### Mobile-Friendly Board Interactions

Replacing native touch drag limitations with a robust modal-based move flow while preserving desktop DnD.

### Storage Reliability Across Browsers

Handling Safari Private Mode and restricted storage environments without breaking app behavior.

### Theming and Visual Consistency

Applying a unified token-based color system across pages, components, and dynamic UI feedback.

---

## Main Views

- **Board** – Task pipeline with categories: Up Next, In Progress, Review, Done
- **Inbox** – Personal task list focused on assigned work
- **Team** – Member directory and profile management
- **Pulse** – KPI-style overview and daily momentum dashboard

---

## Author

**Stefan Straeter**

GitHub: https://github.com/stefanstraeter/
