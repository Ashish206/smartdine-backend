# Use Node.js LTS version as the base image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Clean npm cache and remove any existing node_modules
RUN npm cache clean --force && \
    rm -rf node_modules

# Install dependencies
RUN npm install
RUN npm install pm2 -g

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["pm2-runtime", "start", "src/server.js"]
