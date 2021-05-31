#!/bin/bash
set -e
server=$1

cd `dirname $0`/..

ssh $server << 'ENDSSH'
cd plom-backend
sudo git checkout .
sudo git checkout master
sudo git pull origin master
sudo npm install
sudo npm run build
pm2 restart backend

ENDSSH
