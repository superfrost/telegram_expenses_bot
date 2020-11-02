#! /bin/bash

cd ~
git clone https://github.com/superfrost/telegram_expenses_bot.git
cd telegram_bot_expenses
npm i
echo 'TELEGRAM_TOKEN=' > .env
echo 'Do not forget set TELEGRAM_TOKEN in .env file!!!'
sqlite3 my_db.db < create_db.sql

# if you have installed pm2
pm2 start beter_bot.js
pm2 save