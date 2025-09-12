# MySong for Managing Songs

This web App aims to upload, delete, edit, play, search songs and get them by artists and albums and get other infos about each songs, albums and artists.

This module contains two main directories "server" and "client"

## 💻 Runnig the client side

To run the client side change your working directory to "client" folder first

### npm run build

Compile the TypeScript files
Outpust optimized assets to the dist/ folder

### npm run preview

Serves production build at https://localhost:4173/

## 🖧 Running the server side

To run the server side working directory should be at the root directory (i.e. MySongs/)

### npx tsc

Compiles the TypeScript code of the server side using the TypeScript compiler (tsc) via npx based on the configuration defined in tsconfig.json. It transpiles .ts files to .js

### npm start

Runs the server side of the app in the production mode.
Open http://localhost:1316 to view it in your browser.
