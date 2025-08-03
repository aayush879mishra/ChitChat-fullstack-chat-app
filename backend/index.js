// import express from 'express'
// import dotenv from 'dotenv'
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// import authRoutes from './routes/auth.route.js'
// import messageRoutes from './routes/message.route.js'

// import path from 'path'
// import {connectDB} from './lib/db.js'
// import { server, app } from './lib/socket.js';

// dotenv.config()


// const port = process.env.PORT || 5000
// const __dirname = path.resolve();

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" })); // to parse form data
// app.use(cookieParser())
// app.use(cors(
//     {origin: "http://localhost:5173",
//     credentials: true}
// ))

// app.use("/api/auth", authRoutes)
// app.use("/api/messages", messageRoutes)

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "../frontend", "dist" , "index.html"));
//     });
// }


// server.listen(port, () => {
//     console.log(`App running on PORT ${port}`);
//     connectDB();
// });

// export default app;


import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { server, app } from './lib/socket.js';

dotenv.config();

const port = process.env.PORT || 5000;

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', // Update this to your frontend domain on Render
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Optional: handle unknown API routes with 404
app.all('/api/*splat', (req, res) => {
    // The 'splat' parameter will contain the rest of the URL path
    // For example, if the path is '/api/users/123', req.params.splat would be 'users/123'
    console.log(`Unmatched API path: ${req.params.splat}`);
    res.status(404).json({ message: 'API route not found' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // This handles SPA routes properly (not malformed)
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Start the server
server.listen(port, () => {
  console.log(`App running on PORT ${port}`);
  connectDB();
});

export default app;
