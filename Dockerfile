FROM node:18-alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set the environment variables to use during the build
ARG ENV_FILE=.env.production

# Load the environment variables from the specified file
COPY $ENV_FILE .env

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]