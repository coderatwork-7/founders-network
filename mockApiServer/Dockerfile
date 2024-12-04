FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the entire application directory to the working directory
COPY . .

# Build the Next.js application
#RUN npm run build

# Expose the default Next.js port (3000)
EXPOSE 3001

# Start the Next.js application
CMD ["npm", "start"]