#!/bin/sh

# stop robot
pm2 stop robot

# goto home directory
cd $HOME

# backup config file
mv ./raspi-robot-2/config.json ./

# delete old version
sudo rm -R ./raspi-robot-2

# clone new version from repo
git clone https://github.com/dennisbohn/raspi-robot-2.git

# move config file back to raspi-robot-2 folder
mv ./config.json ./raspi-robot-2

# install packages
cd ./raspi-robot-2
echo 'NPM UPDATE'
npm update

# start robot
pm2 start robot