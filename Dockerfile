# Force node:12 to avoid issue with node:14: "Accessing non-existent property XXX of module exports inside circular dependency"
FROM node:12

# Create app directory
WORKDIR /app

# Update/upgrade packages
RUN apt-get -y update && apt-get -y upgrade

# Add test tools
RUN apt-get -y install lsof vim curl ldap-utils

# Add test servers
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install mysql-server slapd

# Copy local source to /app
COPY . .

# Get node modules
RUN npm install

# Only expose the Express app and let it interact with servers (MySQL, LDAP)
EXPOSE 5001

# Setup test servers and start Express app server
CMD /bin/bash -c ./entrypoint.sh