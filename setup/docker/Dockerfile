# Use the official Node.js 21 image as the base image
FROM node:21

# Install pnpm
RUN npm install -g pnpm

# Create a new directory for logs
RUN mkdir -p /app/api/logs

# Set the working directory in the container
WORKDIR /app

# Copy whole packages directory
COPY . .

# Set environment variables
ARG CONTRACT_COMPILE_AND_DEPLOY
ARG ADMIN_KEY
ENV ADMIN_KEY=${ADMIN_KEY}
ARG BUILD_PATH
ENV BUILD_PATH=${BUILD_PATH}
ARG CHAIN_RPC
ENV CHAIN_RPC=${CHAIN_RPC}
ARG CONTRACT_SOURCE_PATH
ENV CONTRACT_SOURCE_PATH=${CONTRACT_SOURCE_PATH}
ARG CONTRACT_ABI_PATH
ENV CONTRACT_ABI_PATH=${CONTRACT_ABI_PATH}
ARG CONTRACT_ADDRESS_PATH
ENV CONTRACT_ADDRESS_PATH=${CONTRACT_ADDRESS_PATH}
ARG CONTRACT_FILENAME
ENV CONTRACT_FILENAME=${CONTRACT_FILENAME}
ARG CONTRACT_NAME
ENV CONTRACT_NAME=${CONTRACT_NAME}
ARG PORT
ENV PORT=${PORT}
ARG IP
ENV IP=${IP}

# Copy .env file inside docker container
COPY setup/docker/.env /app/api/
COPY setup/docker/.env /app/chain/
COPY setup/docker/.env /app/contract/

# Install dependencies in modules
RUN pnpm install --prefix /app/api
RUN pnpm install --prefix /app/chain
RUN pnpm install --prefix /app/contract

# Compile and deploy contract if the CONTRACT_COMPILE_AND_DEPLOY environment variable is set to true
RUN if [ "$CONTRACT_COMPILE_AND_DEPLOY" == "true" ]; then \
    pnpm run --prefix /app/contract compile && \
    pnpm run --prefix /app/contract deploy; \
fi

# Run API server
CMD ["pnpm", "run", "--prefix", "/app/api", "start"]