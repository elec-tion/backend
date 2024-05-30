# Use the official Node.js 21 image as the base image
FROM node:21

# Set arguments
ARG IP
ENV IP=${IP}
ARG PORT
ENV PORT=${PORT}
ARG ADMIN_KEY
ENV ADMIN_KEY=${ADMIN_KEY}
ARG CHAIN_RPC
ENV CHAIN_RPC=${CHAIN_RPC}
ARG CONTRACT_ABI_PATH
ENV CONTRACT_ABI_PATH=${CONTRACT_ABI_PATH}
ARG CONTRACT_ADDRESS_PATH
ENV CONTRACT_ADDRESS_PATH=${CONTRACT_ADDRESS_PATH}

# Copy contract and abi files
COPY ["../" + ${CONTRACT_ABI_PATH}, ${CONTRACT_ABI_PATH}]
COPY ["../" + ${CONTRACT_ADDRESS_PATH}, ${CONTRACT_ADDRESS_PATH}]

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Set the working directory inside the container
WORKDIR /app

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY ../* .

# Mkdir for logs
RUN mkdir -p /app/logs

# Expose the port that the app will listen on
EXPOSE $PORT

# Start the app
CMD [ "npm", "start" ]