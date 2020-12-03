#!/bin/bash
#========================================================================================
# hacktool_shell.sh: Run shell in the hacktools service.
#========================================================================================
CTR_NAME="hacktools"

docker exec -it "$CTR_NAME" /bin/bash
