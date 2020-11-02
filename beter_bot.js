require('dotenv').config();
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env.TELEGRAM_TOKEN);
const chalk = require('chalk')
const Database = require('better-sqlite3');
const db = new Database('my_db.db', { verbose: console.log });

let optionalParams = {
  parse_mode: 'MarkdownV2',
};

const allowed_users = get_allowed_users();
const categories = get_categories();
const help_text = `It is bot 🦾 for recording 📝 expenses 📈
You can add your expenses 💰 using this format:\n
*_100 Taxi to home_*\n
Commands:
/statistic \\- Get statistics for 1 month 📆😱\n
/last \\- To see & edit last 10 expenses 🔟\n
/categories \\- To see expenses 💰 categories 💭\n`

slimbot.on('message', message => {
  let auth = authentificate(message.from.id, allowed_users)
  if(!auth) {
    slimbot.sendMessage(message.chat.id, `You are not authorized 🎭👤🔒 (your id: ${message.from.id})`);
  }
  else {
    let message_obj = parse_income_message(message.text)
    let id_expense_for_delete = find_del_id_command(message_obj.amount)
    if(isNaN(message_obj.amount * 1)) {
      if(message_obj.amount === "help" || message_obj.amount === "Help" || message_obj.amount === "/start" ) {
        slimbot.sendMessage(message.chat.id, help_text, optionalParams);
      }
      else if(message_obj.amount === "/statistic") {
        let row = get_statistics(message.from.id.toString())
        let text = print_statistics(row)
        slimbot.sendMessage(message.chat.id, `📊Statistic for the last month: 📆\n` + text);
      }
      else if(message_obj.amount === "/last") {
        let row = get_last_expenses(message.from.id)
        let text = print_last_expenses(row)
        slimbot.sendMessage(message.chat.id, `Your last 10 expenses : 🔟\n` + text);
      }
      else if(message_obj.amount === "/categories") {
        let text = print_categories(row)
        slimbot.sendMessage(message.chat.id, `Expense 💰 categories 💭:\n` + text);
      }
      else if(id_expense_for_delete) {
        let del_info = delete_expanse(id_expense_for_delete, message.from.id.toString())
        if(del_info.changes) {
          slimbot.sendMessage(message.chat.id, `Expense deleted ${id_expense_for_delete} ❌`);
        }
        else {
          slimbot.sendMessage(message.chat.id, `⚠️Expense ${id_expense_for_delete} was NOT deleted⚠️`);
        }
      }
    }
    else {
      // let category = find_similar_category(message_obj, categories)
      insert_expenses(message_obj.amount, message_obj.expense + " " + message_obj.other, message.from.id.toString())
      slimbot.sendMessage(message.chat.id, `Add ${message_obj.amount} ${message_obj.expense} ${message_obj.other}`);
    }
  }
});

function insert_expenses(amount, info, who, category = 'other') {
  const row = db.prepare(`INSERT INTO expenses(date, amount, info, who, category) 
  VALUES(datetime('now'), ?, ?, ?, ?)`)
  .run(amount, info, who, category)
}

function authentificate(id, allowed_users = []) {
  if(!allowed_users.length) { 
    let result = hardcode_check(id)
    return result
  }
  else {
    let result = soft_check(id, allowed_users)
    return result
  }

  function hardcode_check(id) { //function return 0 if user NOT authenticated and return 1 if user is authenticated
    if((id !== 1148338977) && (id !== 1288969133)) {
      return false
    }
    else {
      return true
    }
  }

  function soft_check(id, allowed_users) { //function return 0 if user NOT authenticated and return 1 if user is authenticated
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
  console.log(del_info);
  return del_info
}

function get_allowed_users() {
  const row = db.prepare('SELECT * FROM allowed_users').all();
  return row
}

function get_categories() {
  const row = db.prepare('SELECT * FROM category').all();
  console.log(row);
  return row
}

function find_similar_category(message_obj, categories) {
  let category = categories
  let user_caterogy = message_obj[1]
  
  return caterory
}

function get_statistics(id) {
  const row = db.prepare(`SELECT * FROM expenses WHERE date > datetime('now', '-1 month') ORDER BY date DESC`).all();
  return row
}

function print_statistics(rows) {
  let text = ''
  let summary = 0
  rows.map(r => {
    text += `${r.amount}   _${r.info}_      ${r.date.split(' ')[0]}\n`
    summary += r.amount
  })
  return text + `Summary: *${summary}* ❗️⚠️`
}

function get_last_expenses(id) {
  const row = db.prepare('SELECT * FROM expenses WHERE who = ? ORDER BY date DESC LIMIT 10').all(id);
  return row
}

function print_last_expenses(rows) {
  let text = ''
  rows.map(r => text += `${r.amount}   ${r.info}  -  ✖️Delete /del_${r.id}\n\n`)
  return text
}

slimbot.startPolling();