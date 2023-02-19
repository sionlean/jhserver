#!/bin/bash 

# Load environment variables from .env files
source .env

# Transfer files to remote server
scp -r ./build .env package.json "$SSH_ADDRESS:$REMOTE_DIRECTORY"

# Not necessary as pm2 will watch files and update when changes is detected
# Connect to remote server using ssh command and run npm command
# ssh "$SSH_ADDRESS" "cd $REMOTE_DIRECTORY && npm install && npm run build"