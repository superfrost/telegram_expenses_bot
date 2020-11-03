# Simple telegram expenses bot

This bot 🦾 can record 📝 your expenses 📈 to database.

So You can add your expenses 💰 to database using this format:

`100 Taxi to home`

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
sqlite3 my_db.db < create_db.sql
echo 'TELEGRAM_TOKEN=' > .env
nano .env
```

### Warning

You need to have installed `sqlite3` and `pm2`

To install `sqlite3` type this command (in Debian, Ubuntu):

```bash
apt install sqlite3
```

To install `pm2` type this command (in Debian, Ubuntu) from telegram_expenses_bot directory:

```bash
npm install -g pm2
```

## Don't forget 

Add telegram bot token to `.env` file 

## Bot commands:

#### Use inlinekeyboard or push or print this commands:

`/start`, `help`, `Help` - To get help

`/statistic` - Get statistics for 1 month 📆

`/last` - To see & edit last 🔟 expenses

`/categories` - To see expenses 💰 categories

# License

[MIT](./LICENSE)
