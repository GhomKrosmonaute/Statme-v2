
const queryBuilder = require('./queryBuilder')
const getUserRate = require('./getUserRate')
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
  
  const fromDate = new Date(from).toISOString()
  const toDate = new Date(to).toISOString()
  
  /**
   * @type {number}
   */
  const perTime = TIME[per]
  
  const total = await queryBuilder( db, {
    where: [
      { user_id: user.id },
      { column: 'created_timestamp', values: [fromDate,toDate] }
    ],
    order: ['created_timestamp'],
    select: 'count(id)',
    auto: true
  })
  
  if(total === 0) return {
    total: 0,
    per,
    rates: []
  }
  
  /**
   * @type {Rate[]}
   */
  const rates = []
  
  for(let i=from; i<to; i+=perTime)
    rates.push(await getUserRate( db, user, i, i + perTime ))
  
  return {
    total,
    per,
    rates
  }
}

module.exports = getUserStats