# SmartNotes

SmartNotes is a simple, production-friendly full‑stack note-taking application that demonstrates a complete MERN-style workflow (React frontend + Express backend + MongoDB). It supports creating, updating, listing, and deleting notes with optional image and file attachments. Uploaded files are served by the backend from an `uploads/` folder.

**Highlights**
- Add notes with title, content and folder/category
- Upload images and file attachments (multiple files supported)
- Filter notes by folder
- RESTful API with file upload support (multipart/form-data)

---

**Tech stack**
- Frontend: React (Create React App)
- Backend: Node.js, Express, Multer
- Database: MongoDB (mongoose)
- Dev tools: nodemon for backend development

---

**Repository layout**
- `backend/` — Express API, Mongoose models, uploads folder
- `frontend/` — React single-page app (Create React App)

---

Getting started
---------------

Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- MongoDB running locally or a MongoDB connection string

Quick start (development)

1. Start the backend

```bash
cd backend
npm install
# runs the server on http://localhost:5000
npm run dev
```

2. Start the frontend

```bash
cd frontend
npm install
npm start
# opens React app on http://localhost:3000
```

Configuration

- The backend connects to MongoDB at `mongodb://localhost:27017/notesapp` by default. To change this, set the `MONGODB_URI` environment variable and update `backend/server.js` to read from it.
- Backend port: `5000` (see `backend/server.js`) — you can change this value there or override with an env var if you add support.

API
---

Base URL (development): `http://localhost:5000/api/notes`


File uploads

- When using `multipart/form-data` the backend accepts up to 3 image files under field name `images` and up to 3 arbitrary files under field name `files`.
- Uploaded files are stored in `backend/uploads/` with generated filenames. The API returns `url` values for attachments, e.g. `http://localhost:5000/uploads/<generated-filename>`.

Example: create a note

```bash
curl -X POST http://localhost:5000/api/notes \
	-F "title=Hello" \
	-F "content=This is a note with an image" \
	-F "folder=General" \
	-F "images=@/path/to/image.jpg"
```
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/39b81466-73b2-46df-8ca1-460fe0a04963" />


Persistence

- Mongoose model: `backend/models/Note.js`

Deployment notes
----------------

- For production you should:
	- Use a managed MongoDB instance (Atlas) or a production-ready DB server
	- Serve the React build (`frontend/build`) from a static host or from the backend Express app
	- Protect uploads and enforce file-type/size limits if exposing to untrusted users
	- Add environment configuration for `MONGODB_URI` and `PORT`

Tests
-----

- There are no automated tests in this starter. The frontend contains the default CRA test scaffold.

Contributing
------------

- Fork, create a branch, and open a pull request. Keep changes focused and add tests when appropriate.

License
-------

This project is licensed under the Apache License 2.0 — see the `LICENSE` file for details.

---

If you'd like, I can also:
- Add a sample `.env.example` and update the backend to read `MONGODB_URI` and `PORT` from env
- Add a simple Dockerfile/docker-compose for quick local dev
- Generate API docs (OpenAPI) from the routes

Happy to make any of those changes — tell me which one you want next.
