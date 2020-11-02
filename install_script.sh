#! /bin/bash

npm i

sqlite3 my_db.db < create_db.sql

cd /home/
mkdir telegram_bot_expenses
cd telegram_bot_expenses

pm2 start my_bot