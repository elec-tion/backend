# Use the official Node.js 21 image as the base image
FROM node:21

# Install pnpm
RUN npm install -g pnpm

# Git clone the repository
RUN git clone https://github.com/elec-tion/backend.git /app

# Create a new directory for logs
RUN mkdir -p /app/api/logs

# Set the working directory in the container
WORKDIR /app

# Copy whole packages directory
# COPY . .

# Set environment variables
ARG CONTRACT_COMPILE_AND_DEPLOY
ARG BUILD_PATH

# Copy .env file inside docker container
COPY setup/docker/.env /app/api/
COPY setup/docker/.env /app/chain/
COPY setup/docker/.env /app/contract/

# Install dependencies in modules
RUN pnpm install --prefix /app/api
RUN pnpm install --prefix /app/chain
RUN pnpm install --prefix /app/contract

# Compile and deploy contract if the CONTRACT_COMPILE_AND_DEPLOY environment variable is set to true
RUN if [ "$CONTRACT_COMPILE_AND_DEPLOY" = "true" ]; then \
    mkdir -p "${BUILD_PATH}"; \
    pnpm run --prefix /app/contract compile; \
    pnpm run --prefix /app/contract deploy; \
fi

# Run API server
ENTRYPOINT ["pnpm", "run", "--prefix", "/app/api", "start"]