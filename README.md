# Campus Help Desk - Mini Project (Assignment 4)

A full-stack web application designed for students to submit and manage campus-related problems or requests.

---

## 🎯 Features & Requirements Covered

### 1. Frontend Form
A modern, intuitive form with real-time validation containing:
- **Student Name**
- **Email**
- **Category** (Academic Support, IT & Campus Wi-Fi, Hostel & Accommodation, Maintenance, Library, Examinations, etc.)
- **Problem Description**
- **Priority** (Low, Medium, High, Urgent)

### 2. Live Request Management Feed
Displayed right below the submission form:
- Visual priority badges (Color-coded: Urgent, High, Medium, Low)
- Visual status badges (Pending, In Progress, Resolved)
- Inline quick-status dropdown (Instantly updates backend status)
- Dedicated Edit modal for complete ticket updates
- One-click Delete with confirmation dialog
- Search bar (by student name, email, keyword, or category)
- Filter dropdowns (by Priority and Status)
- Live summary counters (Total, Pending, In Progress, Resolved)

### 3. Backend Express Server (`ES Modules` with `import`)
Built using modern ES Module syntax (`import` instead of `require`):
- `GET /api/requests` - Retrieve all requests from `requests.json`
- `GET /api/requests/:id` - Retrieve a single request by ID
- `POST /api/requests` - Create a new request and persist in `requests.json`
- `PUT /api/requests/:id` - Update existing request in `requests.json`
- `DELETE /api/requests/:id` - Remove request from `requests.json`
- File persistence implemented with Node.js `fs/promises` module.

### 4. Native JavaScript `fetch()` API
All communication between frontend and backend uses native `fetch()`:
- `fetch('/api/requests')` to load tickets
- `fetch('/api/requests', { method: 'POST', body: ... })` to submit requests
- `fetch('/api/requests/:id', { method: 'PUT', body: ... })` to update requests
- `fetch('/api/requests/:id', { method: 'DELETE' })` to delete requests

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Run the Server
1. In the project directory:
```bash
npm start
```
*(Or `npm run dev` for auto-reloading during development)*

2. Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
assignment 4/
├── package.json          # Configured with "type": "module"
├── server.js             # Express backend with ES Module imports & REST API
├── requests.json         # Data file handled via Node.js fs module
├── public/               # Frontend static assets
│   ├── index.html        # Clean, accessible HTML layout
│   ├── style.css         # Modern, responsive CSS design
│   └── app.js            # JavaScript client handling fetch() API
└── README.md             # Project documentation
```
