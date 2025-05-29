import app from './app.js'
import { connectToDB } from './db/connection.js'
import { Server } from 'http';

declare global {
  let serverInstance: any;
}

// Start server after connecting to database
const PORT = process.env.PORT ?? 3001
let server: Server

async function startServer() {
  try {
    await connectToDB();
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (server) {
      server.close(() => {
        console.log('Server closed due to database error');
      });
    }
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
}

startServer();

async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Closing server...`);
  if (server) {
    server.close(() => {
      console.log('Server closed gracefully.');
      process.exit(0);
    });
  } else {
    process.exit(0); // If server wasn't started, exit it gracefully.
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle unhandled promise rejections.
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions.
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); 
});
