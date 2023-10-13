
# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files first to leverage Docker caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install eas-cli globally
RUN npm install --global eas-cli

# Copy the rest of the application code into the container
COPY . .


# Specify the command to run when the container starts
CMD [ "npx", "expo", "start" ]

