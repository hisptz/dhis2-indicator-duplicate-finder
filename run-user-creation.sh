#!/bin/bash
clear
npm run build-app
if [ "$#" -eq "0" ]; then
   node --max_old_space_size=10000 dist/index.js
else
   node --max_old_space_size=10000 dist/index.js $1 $2
fi
