#! /bin/bash

echo "Start installation of telegram_expenses_bot"
cd $HOME
echo "Cloning telegram_expenses_bot from GitHub"
git clone https://github.com/superfrost/telegram_expenses_bot.git
cd telegram_expenses_bot
npm install

read -p 'Enter your Telegram Token: ' telegram_token
echo "TELEGRAM_TOKEN=$telegram_token" > .env

echo "Creating database"
sqlite3 my_db.db < create_db.sql

# if you have installed pm2
pm2 start beter_bot.js
pm2 save