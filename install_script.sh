#! /bin/bash

echo "Start installation of telegram_expenses_bot"
cd $HOME
echo "Cloning telegram_expenses_bot from GitHub"
git clone https://github.com/superfrost/telegram_expenses_bot.git telegram_expenses_bot
cd telegram_expenses_bot
npm install
npm update

echo "Creating .env file for Telegram Token"
echo "TELEGRAM_TOKEN=$telegram_token" > .env
echo -e "\033[0;33mDon't forget add telegran token to \033[1;35m.env\033[0;33m file!!!\033[m"
echo -e "Type command: \033[1;35mnano $HOME/telegram_expenses_bot/.env\033[m"
