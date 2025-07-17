# Use the official Node.js 16.14.2 image as the base
FROM node:16.14.2

# Set the working directory inside the container
WORKDIR /workspace/zap-client

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the default command to run the development server
CMD ["npm", "run", "dev"]
