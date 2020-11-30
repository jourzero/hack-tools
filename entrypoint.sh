#!/bin/bash
cd /app/utils

# Setup MySQL Server
./setup-mysql-server.sh

# Setup LDAP Server
./setup-ldap-server.sh

# Start Express Server with nodemon
npm run dev
