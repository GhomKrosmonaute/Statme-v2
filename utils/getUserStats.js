
const moment = require('moment')
const asyncQuery = require('./asyncQuery')
const { TIME } = require('../utils/enums')

/**
 * Rate of messages sent
 * @param {Connection} db
 * @param {module:"discord.js".User} user
 * @param {Object} [options]
 * @param {number} [options.from] default: last month
 * @param {number} [options.to] default: now
 * @param {TimeIndicator} [options.per] default: DAY
 * @returns {Promise<Stat>}
 */
async function getUserStats( db, user, options = {} ){
  
  const from = options.from || Date.now() - TIME.MONTH
  const to = options.to || Date.now()
  const per = options.per || 'DAY'
  
  const toDate = moment(to).format('YYYY-MM-DD')
  const fromDate = moment(from).format('YYYY-MM-DD')
  
  /**
   * @type {number}
   */
  const perTime = TIME[per]
  
  const total = await asyncQuery( db, `
    SELECT COUNT(id) as total
    FROM message
    WHERE user_id = ?
    AND created_timestamp BETWEEN ? AND ?
  `, [user.id,fromDate,toDate],
    { auto: true }
  )
  
  if(total === 0) return {
    min: 0,
    max: 0,
    average: 0,
    total: 0,
    per,
    rates: []
  }
  
  /**
   * @type {Rate[]}
   */
  const rates = []
  
  const raw = await asyncQuery( db, `
    SELECT
      ROUND(UNIX_TIMESTAMP(created_timestamp)/${perTime / 1000}) AS t,
      COUNT(id) as total
    FROM message
    WHERE user_id = ?
    AND created_timestamp BETWEEN ? AND ?
    GROUP BY t
    ORDER BY t
  `, [user.id, fromDate, toDate])
  
  let rateIndex = 0
  for(let i=from; i<to; i+=perTime) {
    if(!raw[rateIndex]) break
    rates.push({
      from: i,
      to: i + perTime,
      value: raw[rateIndex].total
    })
    rateIndex ++
  }
  
  return {
    average: Math.round(total / rates.length),
    max: Math.max(...rates.map(rate => rate.value)),
    min: Math.min(...rates.map(rate => rate.value)),
    total,
    per,
    rates
  }
}

module.exports = getUserStats