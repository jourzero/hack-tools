# Force node:12 to avoid issue with node:14: "Accessing non-existent property XXX of module exports inside circular dependency"
FROM node:12

# Create app directory
WORKDIR /app

# Copy local source to /app
COPY . .

# Get node modules
RUN npm install

# Add troubleshooting/tweaking stuff
RUN apt-get update && apt-get -y install lsof vim curl

EXPOSE 5001
CMD npm start
