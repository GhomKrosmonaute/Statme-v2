
const moment = require('moment')
const asyncQuery = require('./asyncQuery')
const { TIME } = require('../utils/enums')

/**
 * Rate of messages sent
 * @param {Connection} db
 * @param {DiscordItem} item
 * @param {ItemType} type
 * @param {Object} [options]
 * @param {number} [options.from] default: first message
 * @param {number} [options.to] default: now
 * @param {TimeIndicator} [options.per] default: DAY
 * @returns {Promise<Statistic>}
 */
async function getStats(db, item, type, options = {} ){
  
  const from = options.from || 0
  const to = options.to || Date.now()
  const per = options.per || 'DAY'
  
  const fromDate = moment(from).format('YYYY-MM-DD')
  const toDate = moment(to).format('YYYY-MM-DD')
  
  /**
   * @type {number}
   */
  const perTime = TIME[per]
  
  const total = await asyncQuery( db, `
    SELECT COUNT(id) as total
    FROM message
    WHERE ${type}_id = ?
    AND created_timestamp BETWEEN ? AND ?
  `, [item.id,fromDate,toDate],
    { auto: true }
  )
  
  if(total === 0) return {
    min: 0,
    max: 0,
    from,
    to,
    average: 0,
    total: 0,
    per,
    period: 0,
    rates: []
  }
  
  /**
   * @type {Rate[]}
   */
  const rates = (await asyncQuery( db, `
    SELECT
      ROUND(UNIX_TIMESTAMP(created_timestamp)/${perTime / 1000}) AS t,
      (MIN(UNIX_TIMESTAMP(created_timestamp))*1000) AS "from",
      (MAX(UNIX_TIMESTAMP(created_timestamp))*1000) AS "to",
      COUNT(id) AS "value"
    FROM message
    WHERE ${type}_id = ?
    AND created_timestamp BETWEEN ? AND ?
    GROUP BY t
    ORDER BY t
  `, [item.id, fromDate, toDate])).map( row => {
    delete row.t
    return row
  })
  
  return {
    average: Math.round(total / rates.length),
    max: Math.max(...rates.map(rate => rate.value)),
    min: Math.min(...rates.map(rate => rate.value)),
    period: to - rates[0].from,
    from: rates[0].from,
    to,
    total,
    per,
    rates
  }
}

module.exports = getStats