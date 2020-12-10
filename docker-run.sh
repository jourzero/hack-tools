#!/bin/bash
HOST_SHARE="$PWD"
CTR_SHARE="/app" 
PUB="-p 127.0.0.1:5001:5001 -p 127.0.0.1:9229:9229" 
OPTS="$*" 
# Run container, remove it when completed, mount local dir to /app, name it with the directory name
set -x
docker run -it --rm $PUB --mount "type=bind,source=${HOST_SHARE},target=${CTR_SHARE}" $OPTS --name hack-tools hack-tools 2>&1
#docker run -it --rm $PUB $OPTS --name hack-tools hack-tools 2>&1
