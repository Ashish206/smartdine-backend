require('dotenv').config();
const http = require('http');
const logger = require('./config/logger');
const { ENV } = require('./constants');
const { initializeApp } = require('./app');
const { fetchSecretConfig } = require('./utils/secretManager');

const requiredEnvVars = ['NODE_ENV', 'PORT', 'PROJECT_ID'];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}
// Initialize environment variables from GCP Secret Manager
const initializeEnvironment = async () => {
  try {
    await fetchSecretConfig();
    logger.info('Successfully loaded environment variables from GCP Secret Manager');
  } catch (error) {
    logger.error('Failed to load environment variables from GCP Secret Manager:', error);
    process.exit(1);
  }
};

// Event listener for HTTP server "error" event
const onError = (error) => {
  const port = process.env.PORT || 3000; // Default port if not set
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      logger.error(`server exited without known issue`);
      throw error;
  }
};

// Initialize app and start server
const startServer = async () => {
  try {
    const port = process.env.PORT || 3000;

    // Initialize the app first
    const initializedApp = await initializeApp();

    // Create HTTP server
    const server = http.createServer(initializedApp);

    // Set server timeout
    server.timeout = 30000; // 30 seconds

    // Store port in Express
    initializedApp.set('port', port);

    // Event listener for HTTP server "listening" event -
    const onListening = () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

      logger.info(`Server running in ${process.env.NODE_ENV} mode`);
      logger.info(`Server listening on ${bind}`);

      if (process.env.NODE_ENV === ENV.DEVELOPMENT) {
        logger.info('Available Routes:');
        const routes = [];

        const extractRoutes = (stack, basePath = '') => {
          stack.forEach((middleware) => {
            if (middleware.route) {
              // Direct route
              const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
              routes.push(`${methods} ${basePath}${middleware.route.path}`);
            } else if (middleware.name === 'router') {
              // Nested router
              let path = basePath;
              if (middleware.regexp) {
                const match = middleware.regexp.toString().match(/^\^((?:[^/]*)*)/);
                if (match) {
                  path += match[1].replace(/\//, '/');
                }
              }
              extractRoutes(middleware.handle.stack, path);
            }
          });
        };

        extractRoutes(initializedApp._router.stack);
        routes.sort().forEach((route) => logger.info(`- ${route}`));
      }
    };

    // Start listening
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    // Handle server shutdown
    const shutdownServer = async () => {
      logger.info('Shutting down server...');

      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      // Force close server after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', shutdownServer);
    process.on('SIGINT', shutdownServer);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize environment and start the server
initializeEnvironment()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    logger.error('Failed to initialize environment:', error);
    process.exit(1);
  });
