
const { createCanvas } = require('canvas')
const map = require('./map')
const colors = {
  blue: '#4a9eff',
  blueHover: '#8fdfff',
  transLight: 'rgba(255, 255, 255, 0.03)',
  white: '#d8fff3',
  black: '#14171a'
}

/**
 * Return a graph as string uri
 * @param {Stat} stats
 * @param {Object} options
 * @param {number} options.width
 * @param {number} options.height
 * @returns {string}
 */
function getGraphic( stats, options ){
  
  const canvas = createCanvas( options.width, options.height )
  const context = canvas.getContext('2d')
  const maxValue = Math.max(...stats.rates.map(rate => rate.value))
  
  context.lineWidth = 2
  context.fillStyle = colors.transLight
  context.beginPath()
  context.moveTo(-4, options.height + 4)
  for(let i=0; i<stats.rates.length; i++){
    const
      rate = stats.rates[i],
      x = map(i, 0, stats.rates.length - 1, -4, options.width + 4),
      y = map(rate.value, 0, maxValue, options.height + 4, -4)
    
    context.lineTo(x, y)
    if(i % 2 === 0)
      context.fillRect( x, 0,
        options.width / (stats.rates.length - 1),
        options.height
      )
  }
  context.lineTo(options.width + 4, options.height + 4)
  context.closePath()
  context.strokeStyle = colors.blue
  context.stroke()
  context.fill()
  
  return canvas.toDataURL()
}

module.exports = getGraphic