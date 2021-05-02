require('dotenv').config();
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env.TELEGRAM_TOKEN);
const Database = require('better-sqlite3');
const db = new Database('expanses_db.db', { verbose: console.log });
const updateBot = require('./updateBot');

// Init tables if not exists
initDbTables();

let optionalParams = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[
      { text: 'Help', callback_data: 'help' },
      { text: 'Statistic', callback_data: '/statistic' },
      { text: 'Last 10', callback_data: '/last' },
      { text: 'Categories', callback_data: '/categories' },
    ]]
  })
};

const allowed_users = get_allowed_users();
const categories = get_categories();
const help_text = `It is bot 🦾 for recording 📝 expenses 📈
You can add your expenses 💰 using this format:\n
100 Taxi to home\n
Commands:
/statistic - Get statistics for 1 month 📆😱\n
/last - To see & edit last 🔟 expenses\n
/categories - To see expenses 💰 categories 💭\n`

slimbot.on('message', message => {
  let auth = authenticate(message.from.id, allowed_users)
  if(!auth) {
    slimbot.sendMessage(message.chat.id, `You are not authorized 🎭👤🔒 (your id: ${message.from.id})`);
    return
  }
  else { // if user isAuth
    let message_obj = parse_income_message(message.text)
    let id_expense_for_delete = find_del_id_command(message_obj.amount)
    if(isNaN(message_obj.amount * 1)) { // if first group of symbols is text
      if(message_obj.amount === "help" || message_obj.amount === "Help" || message_obj.amount === "/start" ) {
        slimbot.sendMessage(message.chat.id, help_text, optionalParams);
      }
      else if(message_obj.amount === "/statistic") {
        let row = get_statistics(message.chat.id.toString())
        let text = print_statistics(row)
        slimbot.sendMessage(message.chat.id, `📊 Statistic for the last month: 📆\n` + text);
      }
      else if(message_obj.amount === "/last") {
        let row = get_last_expenses(message.from.id)
        let text = print_last_expenses(row)
        slimbot.sendMessage(message.chat.id, `Your last 🔟 expenses:\n` + text);
      }
      else if(message_obj.amount === "/categories") {
        let text = print_categories(categories)
        slimbot.sendMessage(message.chat.id, `Expense 💰 categories:\n` + text);
      }
      else if(message_obj.amount === "/update") {
        slimbot.sendMessage(message.chat.id, `Updating Bot\n`);
        updateBot()
      }
      else if(id_expense_for_delete) {
        let del_info = delete_expanse(id_expense_for_delete, message.from.id.toString())
        if(del_info.changes) {
          slimbot.sendMessage(message.chat.id, `Expense was deleted ${id_expense_for_delete} ✅`);
        }
        else {
          slimbot.sendMessage(message.chat.id, `⚠️Expense ${id_expense_for_delete} was NOT deleted⚠️`);
        }
      }
      else { // If user send what we don't understand (some garbage)
        slimbot.sendMessage(message.chat.id, `OK. Try this command`, optionalParams);
      }
    }
    else {
      // let category = find_similar_category(message_obj, categories)
      insert_expenses(message_obj.amount, message_obj.expense + " " + message_obj.other, message.from.id.toString())
      slimbot.sendMessage(message.chat.id, `🆗 Add ${message_obj.amount} ${message_obj.expense} ${message_obj.other}`);
    }
  }
});

// Inline_keyboard callbacks
// TODO Implement authentication
slimbot.on('callback_query', query => {
  if (query.data === 'help') {
    // console.log(query.message);
    
    let auth = authenticate(query.message.chat.id, allowed_users)
    if(!auth) {
      slimbot.sendMessage(query.message.chat.id, `You are not authorized 🎭👤🔒 (your id: ${query.message.chat.id})`);
      return
    }

    slimbot.sendMessage(query.message.chat.id, help_text, optionalParams);
  }
});

slimbot.on('callback_query', query => {
  if (query.data === '/statistic') {
    let row = get_statistics(query.message.chat.id.toString())
    let text = print_statistics(row)
    slimbot.sendMessage(query.message.chat.id, '📊 Statistic for the last month 📆:\n' + text, optionalParams);
  }
});

slimbot.on('callback_query', query => {
  if (query.data === '/last') {
    let rows = get_last_expenses(query.message.chat.id.toString())
    let text = print_last_expenses(rows)
    slimbot.sendMessage(query.message.chat.id, 'Your last 🔟 expenses:\n' + text, optionalParams);
  }
});

slimbot.on('callback_query', query => {
  if (query.data === '/categories') {
    let text = print_categories(categories)
    slimbot.sendMessage(query.message.chat.id, `Expense 💰 categories:\n` + text, optionalParams)
  }
});

function insert_expenses(amount, info, who, category = 'other') {
  const row = db.prepare(`INSERT INTO expenses(date, amount, info, who, category) 
  VALUES(datetime('now'), ?, ?, ?, ?)`)
  .run(amount, info, who, category)
}

function authenticate(id, allowed_users = []) {
  if(allowed_users.length === 0) { 
    return false
  }
  let result = user_check(id, allowed_users)
  return result

  function user_check(id, allowed_users) { //function return 0 if user NOT authenticated and return 1 if user is authenticated
    let allowed = allowed_users.filter(user => user.user_id === id)
    if(!allowed.length) {
      return false
    }
    else {
      return true
    }
  }

}

function parse_income_message(message_text) {
  let [result1, result2, ...rest] = message_text.split(' ')
  rest = rest.toString().replace(/,/g, ' ')
  return {
    amount:  result1,
    expense: result2,
    other:   rest
  }
}

function find_del_id_command(text) { // function return false if not find any matches or return id of expense which must be deleted
  let result = text.split(/^\/del_/); // if matched result = ['', 'id_number']
  if(result[0]) {
    return false
  }
  else {
    return result[1]
  }
}

function delete_expanse(expense_id, user_id) {
  console.log('expense_id:', expense_id, 'user_id:', user_id);
  const del_info = db.prepare('DELETE FROM expenses WHERE (id = ? AND who = ?)').run(expense_id, user_id);
  return del_info
}

function get_allowed_users() {
  const rows = db.prepare('SELECT * FROM allowed_users').all();
  console.log(rows);
  return rows
}

function get_categories() {
  const rows = db.prepare('SELECT * FROM category').all();
  console.log(rows);
  return rows
}

function print_categories(rows) {
  let text = ''
  rows.map(r => text += `${r.name}:   ${r.alias}\n`)
  return text
}

function find_similar_category(message_obj, categories) {
  let category = categories
  let user_caterogy = message_obj[1]
  return category
}

function get_statistics(id) { //! Add join to see who add expense
  const row = db.prepare(`SELECT * FROM expenses WHERE date > datetime('now', 'start of month') ORDER BY date DESC`).all();
  return row
}

function print_statistics(rows) {
  let text = ''
  let summary = 0
  rows.map(r => {
    text += `${r.amount}   ${r.info}      ${r.date.split(' ')[0]}\n`
    summary += r.amount
  })
  return text + `Summary: ${summary} ❗️`
}

function get_last_expenses(id) {
  const row = db.prepare('SELECT * FROM expenses WHERE who = ? ORDER BY date DESC LIMIT 10').all(id);
  return row
}

function print_last_expenses(rows) {
  let text = ''
  rows.map(r => text += `${r.amount}   ${r.info} ${r.date}  - ✖/del_${r.id}\n\n`)
  return text
}

function initDbTables() {
  db.prepare('CREATE TABLE IF NOT EXISTS amount(id INTEGER PRIMARY KEY NOT NULL, name INTEGER NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS allowed_users(user_id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS category(name TEXT PRIMARY KEY NOT NULL, important INTEGER NOT NULL, alias TEXT)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS expenses(id INTEGER PRIMARY KEY NOT NULL, date TEXT NOT NULL, amount INTEGER NOT NULL, info TEXT NOT NULL, who INTEGER NOT NULL REFERENCES allowed_users(user_id), category TEXT REFERENCES category(name))').run();
  
  db.prepare('INSERT OR IGNORE INTO amount(id, name) VALUES(0, 20000)').run();
  db.prepare("INSERT OR IGNORE INTO category (name, important, alias) VALUES('products', 1, 'prod, food, eat, eats, burger, kfc, mac, products'), ('transport', 1, 'taxi, metro, bus, train, plane, transport, travel'), ('phone', 1, 'phone, wifi, wi-fi, internet, inet'), ('clothes', 0, 'clothes, dress, boots, shoes'), ('ecomerse', 0, 'ali, aliexpres, aliexpress, eshop'), ('other', 0, 'any');").run();
  
  //Test users
  // db.prepare("INSERT OR IGNORE INTO allowed_users(user_id, name) VALUES(1148338977, 'Anton'), (1288969133, 'Lera')").run();
  //Test expenses
  // db.prepare("INSERT OR IGNORE INTO expenses(date, amount, info, who, category) VALUES('2020-10-31 20:14:41',350,'taxi to home',1148338977,'transport')").run();

  const allowed_users = get_allowed_users();

  if (allowed_users === null || allowed_users.length === 0) {
    console.log('\033[0;33m You need to add at least one user to "allowed_users" table inside expenses db ("expanses_db.db") \033[m');
  }
}

slimbot.startPolling();
