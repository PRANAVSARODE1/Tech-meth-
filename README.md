# TECH-METH — Interactive Learning Platform

**TECH-METH** is a full-stack interactive platform designed to bridge the gap between theoretical learning and practical application in electronics and technology. It features a student-college ecosystem with a virtual electronics simulator.

---

## 🚀 Quick Start

### 1. Installation
Ensure you have [Node.js](https://nodejs.org/) installed.
```bash
npm install
```

### 2. Run the Project
```bash
npm start
```
The server will start at: **[http://localhost:5000](http://localhost:5000)**

---

## 🔐 Login & Credentials

> [!IMPORTANT]
> This project is currently in **Prototype Mode**. Data is managed via `localStorage`, so logins are simulated.

### Default Login Rules
Since there is no persistent backend database yet, you can log in or register with any credentials that meet these criteria:
- **Email:** Must contain an `@` symbol (e.g., `admin@tech.com`).
- **Password:** Must be at least **6 characters long**.
- **Roles:** Choose between **Student** or **College**.

### Accessing Pages Directly
If you need to bypass the login for testing, you can navigate to:
- **Student Dashboard:** `/learn.html`
- **College Dashboard:** `/college_home.html`
- **Electronics Simulator:** `/simulator.html`

---

## 🛠️ Key Features

### 1. Student Portal (`/learn.html`)
- View practicals assigned by your college.
- Access the **Electronics Simulator** to complete tasks.
- Track individual progress.

### 2. College Portal (`/college_home.html`)
- **Dashboard:** Overview of connected students and completion rates.
- **Practical Management:** Create and assign project ideas to students.
- **Student Tracking:** Real-time monitoring of student progress across the institution.

### 3. Virtual Simulator (`/simulator.html`)
- Drag-and-drop electronics components.
- Interactive circuit building (Battery, LEDs, Resistors, etc.).
- Auto-validation of circuits based on assigned tasks.

---

## 📂 Project Architecture

### File Structure
- `server.js`: Express server serving static frontend files.
- `public/`: Contains all UI assets (HTML, CSS, JS).
  - `index.html`: Entry point (Login/Register).
  - `college_home.html`: College Admin landing page.
  - `learn.html`: Student landing page.
  - `simulator.html`: Interactive circuit builder.
  - `js/app.js`: Core logic for auth and platform state.
- `db.js` & `schema.sql`: (Reference only) Templates for future MySQL integration.

### Data Storage
Currently, all data is stored in the browser's `localStorage` using the following keys:
- `tech_meth_user_email`: Logged-in user's identity.
- `tech_meth_assignments`: List of practicals assigned to students.
- `tech_meth_system_students`: Database of students linked to colleges.
- `tech_meth_all_colleges`: List of registered institutions.

---

## 📝 Roadmap
- [x] Frontend Prototype & Simulator
- [x] Local Storage Data Persistence
- [ ] Backend MySQL Integration
- [ ] Real-time Peer-to-Peer Collaboration
- [ ] Advanced Circuit Validation Logic
