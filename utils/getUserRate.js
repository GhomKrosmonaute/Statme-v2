
const queryBuilder = require('./queryBuilder')

/**
 * @typedef {Object} Rate
 * @property {Object} period
 * @property {number} period.start
 * @property {number} period.stop
 * @property {number} period.duration
 * @property {number} rate
 */

/**
 * Rate of messages sent per `period` (by default per day)
 * @param {Connection} db
 * @param {User} user
 * @param {Object} [options]
 * @param {number} [options.by] default: 1000 * 60 * 60 * 24
 * @param {boolean} [options.total] default: false
 * @returns {Promise<Rate|Rate[]>}
 */
async function getUserRate( db, user, options = {} ){
    
  const by = options.by || 1000*60*60*24
  
  const firstMessageTimestamp = await queryBuilder( db, {
    where: { user_id: user.id },
    sortBy: ['created_timestamp'],
    select: 'created_timestamp',
    limit: 1,
    auto: true
  })
  
  if(!firstMessageTimestamp) return {
    period: {
      start: Date.now(),
      stop: Date.now(),
      duration: 0
    },
    rate: 0
  }
  
  if(options.total){
    // get total rate since first message
    
    return {
      period: {
        start: firstMessageTimestamp,
        stop: Date.now(),
        duration: Date.now() - firstMessageTimestamp
      },
      rate: await queryBuilder( db, {
        select: 'COUNT(*) AS total',
        where: { user_id: user.id },
        auto: true
      })
    }
    
  }else{
    // get all rates since first message for each `by`
  
    const fullPeriod = Date.now() - firstMessageTimestamp
    const period = fullPeriod / by
  
    /**
     * @type {Rate[]}
     */
    const results = []
    
    for(
      let timestamp = firstMessageTimestamp;
      timestamp < Date.now();
      timestamp += period
    ){
      results.push({
        period: {
          start: timestamp,
          stop: timestamp + period,
          duration: period
        },
        rate: await queryBuilder( db, {
          where: `user_id = ? AND created_timestamp > ? AND created_timestamp < ?`,
          values: [ user.id, timestamp, timestamp + period ],
          select: 'COUNT(*) AS total',
          auto: true
        })
      })
    }
  
    return results
  }
}

module.exports = getUserRate