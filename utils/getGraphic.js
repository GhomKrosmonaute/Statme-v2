

let Canvas = require('canvas')
const tims = require('tims')
const map = require('./map')
const constrain = require('./constrain')
const {COLORS} = require('./enums')

/**
 * Return a graph as string uri
 * @param {Statistic} stats
 * @param {Object} [options] default: {width: 1366, height: 768}
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @returns {Canvas}
 */
function getGraphic( stats, options = {} ){
  
  const width = options.width || 1366
  const height = options.height || 768
  
  Canvas.registerFont('public/fonts/unicode.impact.ttf', { family: 'Impact' })
  
  const baseCanvas = Canvas.createCanvas( width, height )
  const baseContext = baseCanvas.getContext('2d')
  
  const graph = Canvas.createCanvas( width, height * .9 )
  const context = graph.getContext('2d')
  
  // séparer par zones (heures, jours, semaines, mois, années) le header du graph
  
  // background
  context.fillStyle = COLORS.BLACK
  context.fillRect( 0, 0, width, height)
  
  // graph
  context.beginPath()
  context.moveTo(-4, graph.height + 4)
  for(let i=0; i<stats.rates.length; i++){
    const
      rate = stats.rates[i],
      isMax = rate.value === stats.max,
      isMin = rate.value === stats.min
    let
      x = map(i, 0, stats.rates.length - 1, -4, graph.width + 4),
      y = map(rate.value, 0, stats.max, graph.height, graph.height / 5)
  
    if(i === 0) x += 5
    else if(i === stats.rates.length - 1) x -= 5
  
    // graph line
    context.lineTo(x, y)
    
    // alternative rect
    if(i % 2 === 0) {
      context.fillStyle = COLORS.TRANS_LIGHT
      context.fillRect(x, 0,
        graph.width / (stats.rates.length - 1),
        graph.height
      )
    }
  
    // text value
    if(stats.rates.length < 20){
  
      const text = `${rate.value}${
        stats.rates.length < 9 ? ' / ' + stats.per.toLowerCase() : ''
      }`
      
      context.font = `${
        Math.round( isMax ?
          (graph.height / 15) :
          (graph.height / 20)
        )
      }px Arial`
      
      switch (i) {
        case 0:                       context.textAlign = "left";   break
        case stats.rates.length - 1:  context.textAlign = "right";  break
        default:                      context.textAlign = "center"
      }
      
      context.fillStyle = isMax ? COLORS.BLURPLE_HOVER : COLORS.WHITE
      context.fillText( text,
        x, y - graph.height * .01,
        isMax ? graph.width : (graph.width / stats.rates.length) * .6
      )
    }
  }
  context.lineTo(graph.width + 4, graph.height + 4)
  context.closePath()
  context.lineWidth = 2
  context.strokeStyle = COLORS.BLURPLE
  context.fillStyle = COLORS.TRANS_LIGHT
  context.stroke()
  context.fill()
  
  // zones
  const averageY = map(stats.average, 0, stats.max, graph.height, graph.height / 5)
  context.fillStyle = COLORS.TRANS_LIGHT
  context.fillRect(0, graph.height / 5, graph.width, graph.height)
  context.fillRect(0, averageY, graph.width, graph.height)
  
  // max, min and average
  context.font = `${constrain(graph.height/5, 0, averageY - (graph.height * .2))}px Impact`
  context.textAlign = 'left'
  context.fillStyle = COLORS.TRANS_LIGHT_2
  context.textBaseline = 'top'
  context.fillText(`Max: ${stats.max}`, graph.height * .01, graph.height * .015)
  context.fillText(`Average: ${stats.average}`, graph.height * .01, graph.height * .215)
  context.fillText(`Min: ${stats.min}`, graph.height * .01, graph.height * .415)
  
  // draw graph on base canvas
  baseContext.drawImage( graph, 0, 0 )
  
  // draw period
  baseContext.font = `${Math.round((height - graph.height) * .7)}px Impact`
  baseContext.fillStyle = COLORS.BLURPLE
  baseContext.textAlign = 'center'
  baseContext.textBaseline = 'middle'
  baseContext.fillText(
    `Period: ${tims.since(stats.from,stats.to,{format: 'day'})}, ${stats.rates.length} rated ${stats.per.toLowerCase()}s.`,
    graph.width * .5, graph.height + (height - graph.height) * .5, graph.width * .95
  )
  
  return baseCanvas
}

module.exports = getGraphic