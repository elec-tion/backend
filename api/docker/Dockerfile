# Use the official Node.js 21 image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY ../* .

# Mkdir for logs
RUN mkdir -p /app/logs

# Expose the port that the app will listen on
ARG PORT
EXPOSE $PORT

# Start the app
CMD [ "npm", "start" ]