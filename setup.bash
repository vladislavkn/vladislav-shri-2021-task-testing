#!/bin/bash

function log {
  local RED='\033[1;36m'
  local NC='\033[0m'
  echo -e "\n${RED}[SETUP SCRIPT]: $1${NC}"
}

log "Setup & link ping-server package"
cd ./packages/ping-server
npm i
npm link

log "Setup & link hermione-auto-start-selenium package"
cd ../hermione-auto-start-selenium
npm link ping-server
npm i
npm link

log "Setup & link hermione-auto-start-project package"
cd ../hermione-auto-start-project
npm link ping-server
npm i
npm link

log "Setup the whole project"
cd ../../
npm i
npm link hermione-auto-start-selenium hermione-auto-start-project ping-server
nvm use

log "Make sure you use node version specified in .nvmrc"
log "With love, Vladislav"