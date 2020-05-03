
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
 * @param {Rate[]} data
 * @param {Object} options
 * @param {number} options.width
 * @param {number} options.height
 * @returns {string}
 */
function getGraphic( data, options ){
  const canvas = createCanvas( options.width, options.height )
  const context = canvas.getContext('2d')
  const maxValue = Math.max(...data.map(rate => rate.value))
  context.fillStyle = colors.black
  context.strokeStyle = ''
  context.fillRect(0,0,options.width,options.height)
  context.lineWidth = 2
  context.strokeStyle = colors.blue
  context.beginPath()
  for(let i=0; i<data.length; i++){
    const
      rate = data[0],
      x = map(i, 0, data.length, 0, options.width, true),
      y = map(rate.value, 0, maxValue, options.height, 0, true)
    if(i===0) context.moveTo(x, y)
    else context.lineTo(x, y)
    context.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI)
  }
  context.stroke()
  return canvas.toDataURL()
}

module.exports = getGraphic