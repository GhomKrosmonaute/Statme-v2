
const count = require('./messageCount')
const resolve = require('./resolveType')
const query = require('./database/asyncQuery')
const { TIME } = require('../utils/enums')

/**
 * Rate of messages sent
 * @param {Connection} db
 * @param {*} item
 * @param {Object} [options]
 * @param {number} [options.from] default: first message
 * @param {number} [options.to] default: now
 * @param {TimeIndicator} [options.per] default: DAY
 * @returns {Promise<Statistic>}
 */
async function getStats(db, item, options = {} ){
  
  const type = resolve(item)
  const from = options.from || 0
  const to = options.to || Date.now()
  const per = options.per || 'DAY'
  const perTime = TIME[per]
  
  const { value: total } = await count( db, item, from, to )
  
  if(total === 0) return {
    type,
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
  const rates = await query( db, `
    SELECT
      ROUND(message.created_timestamp/${perTime}) AS t,
      MIN(message.created_timestamp) AS "from",
      MAX(message.created_timestamp) AS "to",
      COUNT(message.id) AS "value"
    FROM message
    LEFT JOIN ${type}
    ON ${type}.\`index\` = message.${type}_index
    WHERE ${type}.id = ?
    AND message.created_timestamp
    BETWEEN ? AND ?
    ORDER BY t GROUP BY t`,
    [ item.id, from, to ]
  )
  
  return {
    type,
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