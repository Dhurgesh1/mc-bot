const mineflayer = require('mineflayer')

let bot = null
let reconnecting = false

function createBot() {
  if (bot) return // 🚫 prevent duplicate bots

  bot = mineflayer.createBot({
    host: 'eu.freegamehost.xyz',
    port: 25493,
    username: 'DOOMCORE',
    version: '1.21.1',
    auth: 'offline'
  })

  bot.on('spawn', () => {
    console.log('Bot joined!')

    // ✅ Teleport to your AFK coords
    setTimeout(() => {
      bot.chat('/tp DOOMCORE 0.48 88.5 12.43')
    }, 3000)

    // ✅ Anti-AFK (safe)
    setInterval(() => {
      if (!bot) return
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 400)
    }, 30000)
  })

  bot.on('end', () => {
    console.log('Disconnected')

    bot = null

    if (!reconnecting) {
      reconnecting = true
      console.log('Reconnecting in 5s...')

      setTimeout(() => {
        reconnecting = false
        createBot()
      }, 5000)
    }
  })

  bot.on('error', err => console.log('Error:', err))
}

// ⏳ small delay prevents double start (Replit fix)
setTimeout(createBot, 2000)
