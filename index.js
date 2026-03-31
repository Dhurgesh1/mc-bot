const mineflayer = require('mineflayer')

let bot = null
let reconnecting = false
let afkInterval = null

function createBot() {
  if (bot) return

  bot = mineflayer.createBot({
    host: 'eu.freegamehost.xyz',
    port: 25493,
    username: 'DOOMCORE',
    version: '1.21.1',
    auth: 'offline'
  })

  bot.once('spawn', () => {
    console.log('Bot joined!')

    // ✅ WAIT LONGER (important for Paper servers)
    setTimeout(() => {

      // ✅ teleport safely
      bot.chat('/tp DOOMCORE 0.48 88.5 12.43')

      // ✅ start anti-AFK AFTER full stabilization
      setTimeout(() => {

        if (afkInterval) clearInterval(afkInterval)

        afkInterval = setInterval(() => {
          if (!bot || !bot.entity) return

          // VERY SAFE movement (tiny head movement)
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.2
          const pitch = bot.entity.pitch + (Math.random() - 0.5) * 0.1

          bot.look(yaw, pitch, true)
        }, 30000)

      }, 10000) // increased delay

    }, 8000) // increased delay
  })

  bot.on('end', () => {
    console.log('Disconnected')

    bot = null

    if (afkInterval) {
      clearInterval(afkInterval)
      afkInterval = null
    }

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
setTimeout(createBot, 3000)
