#!/bin/bash
#========================================================================================
# hacktool_shell.sh: Run shell in the hacktools service.
#========================================================================================
CTR_NAME="hack-tools"

docker exec -it "$CTR_NAME" /bin/bash
