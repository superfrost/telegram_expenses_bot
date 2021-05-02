module.exports = {
  apps : [{
    name: 'tbot',
    script: 'better_bot.js',
    watch: ['better_bot.js', 'updateBot.js'],
    watch_delay: 2000,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
      "NODE_ENV": "production"
    }
  }],

};