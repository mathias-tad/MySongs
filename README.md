# MySongs

This is a full-stack web App aims to upload, delete, edit, play, search songs and get them by artists and albums and get other infos about each songs, albums and artists.

## 📂 Project structure

This module contains two main directories:

- client/ - frontend (vite + TypeScript)
- server/ - backend (Node.js + TypeScript)
  - **MongoDB** is used for the database
  - **Cloudinary** is used for storing uploaded songs

## ✔️ Prerequisites

- Node.js v22.14
- npm 11.4
- Docker installed (if you prefere)
- MongoDB URI and Cloudinary credentials

## 💻 Running the client side

To run the client side change your working directory to "client" folder first

```bash
cd client
```

- Changes directory to client/

```bash
npm install
```

- Install dependencies

```bash
npm run build
```

- Compile the TypeScript files
- Outputs optimized assets to the dist/ folder

```bash
npm run preview
```

- Serves production build at http://localhost:4173/

## 🖧 Running the server side

To run the server side working directory should be at the root directory (i.e. MySongs/)

```bash
npm install
```

- Install dependencies

```bash
npx tsc
```

- Compiles the TypeScript code of the server side using the TypeScript compiler (tsc) via npx based on the configuration defined in tsconfig.json. It transpiles .ts files to .js

```bash
npm start
```

- Runs the server side of the app in the production mode.
- Open http://localhost:1316 to view it in your browser.

## 🧊 Runnig server with docker

From the root of the project (i.e. MySongs/)

```bash
docker build -t mysongs-server .
```

This will:

- Install dependencies
- Compiles the TypeScript backend
- Creates a production ready container

```bash
docker run -p 1316:1316 mysongs-server
```

This will:

- Start the server and map it to http://localhost:1316

## 🧩 Features of the App

🎶 Upload and manage songs  
🎧 Play songs directly in the browser  
🌐 Browse by artists and albums  
🔍 Search functionality  
📝 Edit and delete songs, albums and artists  
🪟 View detailed metadata about songs, albums and artists

## 🛠️ Future Improvements

- Add user authentication
- Improve mobile responsiveness

## Live Demo

Frontend: https://my-songs-six.vercel.app  
Backend: deployed on render.com
