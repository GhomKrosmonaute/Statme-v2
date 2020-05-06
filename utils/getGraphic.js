
const Canvas = require('canvas')
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
 * @returns {Canvas}
 */
function getGraphic( stats, options ){
  
  const canvas = Canvas.createCanvas( options.width, options.height )
  const context = canvas.getContext('2d')
  
  const font = function(size){
    context.font = `${Math.round(size)}px Arial`
  }
  
  // background
  context.fillStyle = colors.black
  context.fillRect(0,0,options.width,options.height)
  
  // graph
  context.beginPath()
  context.moveTo(-4, options.height + 4)
  for(let i=0; i<stats.rates.length; i++){
    const
      rate = stats.rates[i],
      isMax = rate.value === stats.max,
      x = map(i, 0, stats.rates.length - 1, -4, options.width + 4),
      y = map(rate.value, 0, stats.max, options.height, options.height / 5)
    
    // graph line
    context.lineTo(x, y)
    
    // alternative rect
    if(i % 2 === 0) {
      context.fillStyle = colors.transLight
      context.fillRect(x, 0,
        options.width / (stats.rates.length - 1),
        options.height
      )
    }
  
    // text value
    if(stats.rates.length < 20){
      font( isMax ?
        (options.height / 15) :
        (options.height / 20)
      )
      context.fillStyle = colors.white
      context.textAlign = "center"
      context.fillText(
        `${rate.value}${
          stats.rates.length < 9 ? ' / ' + stats.per.toLowerCase() : ''
        }`,
        x,y - 10,
        isMax ? options.width : (options.width / stats.rates.length) * .6
      )
    }
  }
  context.lineTo(options.width + 4, options.height + 4)
  context.closePath()
  context.lineWidth = 2
  context.strokeStyle = colors.blue
  context.fillStyle = colors.transLight
  context.stroke()
  context.fill()
  
  // max zone
  context.fillStyle = colors.transLight
  context.fillRect(0, options.height / 5, options.width, options.height)
  
  return canvas
}

module.exports = getGraphic