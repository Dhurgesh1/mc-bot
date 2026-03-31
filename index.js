const mineflayer = require('mineflayer')

let bot = null
let reconnecting = false

function createBot() {
  if (bot) return

  bot = mineflayer.createBot({
    host: 'eu.freegamehost.xyz',
    port: 25493,
    username: 'DOOMCORE',
    version: '1.21.1',
    auth: 'offline'
  })

  bot.on('spawn', () => {
    console.log('Bot joined!')

    // ⏳ wait for full load (VERY IMPORTANT)
    setTimeout(() => {

      // ✅ teleport AFTER loading
      bot.chat('/tp DOOMCORE 0.48 88.5 12.43')

      // ⏳ wait again before actions
      setTimeout(() => {

        // ✅ SAFE anti-AFK (look around instead of jumping)
        setInterval(() => {
          if (!bot) return

          const yaw = Math.random() * Math.PI * 2
          const pitch = (Math.random() - 0.5) * Math.PI / 2

          bot.look(yaw, pitch, true)
        }, 30000)

      }, 5000)

    }, 5000)
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

// prevent double start (Replit fix)
setTimeout(createBot, 2000)
