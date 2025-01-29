# Use the official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the development server.js
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
