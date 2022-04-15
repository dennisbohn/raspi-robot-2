#!/bin/sh

# disable serial console and enable serial hardware (/dev/serial0)
sudo raspi-config nonint do_serial 2

# add repository for nodejs
curl -sSL https://deb.nodesource.com/setup_16.x | sudo bash -

# install python, git and nodejs
sudo apt install -y python3 python3-pip git nodejs

# install buildhat library
export PATH="$HOME/.local/bin:$PATH"
pip3 install buildhat

# copy hotfix for buildhat library (see https://github.com/RaspberryPiFoundation/python-build-hat/pull/125)
wget https://raw.githubusercontent.com/RaspberryPiFoundation/python-build-hat/a4edde74e051aa03fe4e91122000115cb6b36919/buildhat/motors.py -O ~/.local/lib/python3.9/site-packages/buildhat/motors.py

# install pm2
sudo npm install pm2 -g

# clone repository
cd $HOME
git clone https://github.com/dennisbohn/raspi-robot-2.git

# install packages
cd $HOME/raspi-robot-2
npm update

# create authtoken file
echo $1 > .authToken

# run pm2 on startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp $HOME

# start robot
pm2 start robot.js

# save pm2 configuration
pm2 save

# output
clear
echo "Die Installation wurde abgeschlossen."
echo "Das Fenster kann geschlossen werden."

# reboot system
sudo reboot