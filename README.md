# Simple telegram expenses bot

This bot 🦾 can record 📝 your expenses 📈 to database.

So You can add your expenses 💰 to database using this format:

`100 Taxi to home` or `250 burger`

## Install:

To **install** telegram_expenses_bot, you should run the [install script](./install_script.sh). To do that, you may either download and run the script manually, or use the following cURL or Wget command:

```sh
curl -o- https://raw.githubusercontent.com/superfrost/telegram_expenses_bot/master/install_script.sh | bash
```
```sh
wget -qO- https://raw.githubusercontent.com/superfrost/telegram_expenses_bot/master/install_script.sh | bash
```
### Manual Install:

For a fully manual install, execute the following lines to first clone the telegram_expenses_bot repository

clone repository to your directory:
```bash
cd $HOME
git clone https://github.com/superfrost/telegram_expenses_bot.git
cd telegram_expenses_bot
npm install
npm update
echo 'TELEGRAM_TOKEN=' > .env
nano .env
```

### Warning

You need to have installed `pm2`

To install `pm2` type this command (in Debian, Ubuntu) from telegram_expenses_bot directory:

```bash
npm install -g pm2
```

## Don't forget 

Add telegram bot token to `.env` file: `echo 'TELEGRAM_TOKEN=YOUR_TOKEN_HERE' > .env`

## Bot commands:

#### Use inlinekeyboard or push or print this commands:

`/start`, `help`, `Help` - To get help

`/statistic` - Get statistics for 1 month 📆

`/last` - To see & edit last 🔟 expenses

`/categories` - To see expenses 💰 categories

`/update` - To update bot from this repository

## Starting bot by PM2:

to start server use this command: `pm2 start ecosystem.config.js`

to stop use this command: `pm2 stop tbot --watch`

# License

[MIT](./LICENSE)
