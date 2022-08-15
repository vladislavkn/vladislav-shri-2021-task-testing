#!/bin/bash

function log {
  local BLUE='\033[1;36m'
  local NC='\033[0m'
  echo -e "${BLUE}[SETUP STEP $1]: $2${NC}"
}

log 1 "Setup & link ping-server package"
cd ./packages/ping-server
npm i
npm link
log 1 "Done"

log 2 "Setup & link hermione-auto-start-selenium package"
cd ../hermione-auto-start-selenium
npm link ping-server
npm i
npm link
log 2 "Done"

log 3 "Setup & link hermione-auto-start-project package"
cd ../hermione-auto-start-project
npm link ping-server
npm i
npm link
log 3 "Done"

log 4 "Setup the whole project"
cd ../../
npm i
npm link hermione-auto-start-selenium hermione-auto-start-project ping-server
nvm use

NODE_VERSION = $(cat ./.nvmrc)
if [ $? -ne 0 ]; then
 log 4 "Error while setting node version. Please, set node version $NODE_VERSION manually"
 else 
 log 4 "Successful set node version $NODE_VERSION"
fi

log 5 "With love, Vladislav"