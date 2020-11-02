require('dotenv').config();
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env.TELEGRAM_TOKEN);

let optionalParamsGlob = {
  parse_mode: 'MarkdownV2',
};

slimbot.on('message', message => {
  // define inline keyboard to send to user
  let optionalParams = {
    parse_mode: 'MarkdownV2',
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: 'Help', callback_data: 'help' },
        { text: 'Statistic', callback_data: '/statistic' },
        { text: 'Last', callback_data: '/last' },
      ]]
    })
  };
  // reply when user sends a message, and send him our inline keyboard as well
  slimbot.sendMessage(message.chat.id, 'Message received', optionalParams);
});

slimbot.on('callback_query', query => {
  if (query.data === 'help') {
    slimbot.sendMessage(query.message.chat.id, '__bold Hext to you too__', optionalParamsGlob);
  }
});

slimbot.on('callback_query', query => {
  if (query.data === '/statistic') {
    slimbot.sendMessage(query.message.chat.id, '_Stat just for you_', optionalParamsGlob);
  }
});

slimbot.on('callback_query', query => {
  if (query.data === '/last') {
    slimbot.sendMessage(query.message.chat.id, '[you tube](http://www.youtube.com/)', optionalParamsGlob);
  }
});

slimbot.startPolling();