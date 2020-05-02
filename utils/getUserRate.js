
const getMessages = require('./getMessages')

/**
 * Rate of messages sent per `period` (by default per day)
 * @param db
 * @param {User} user
 * @param {Object} [options]
 * @param {number} [options.by] default: 1000 * 60 * 60 * 24
 * @param {boolean} [options.forPeriod] default: false
 * @returns {Promise<number>}
 */
module.exports = async function getUserRate( db, user, options = {} ){
    
  const by = options.by || 1000*60*60*24
  
  if(options.forPeriod){
    return await queryBuilder( db, {
      select: 'COUNT(*) AS total'
    })
  }else{
    const firstMessageTimestamp = await queryBuilder( db, {
      where: { user_id: user.id },
      sortBy: ['created_timestamp'],
      select: 'created_timestamp',
      limit: 1
    })
  
    const total = await queryBuilder( db, {
      where: { user_id: user.id },
      select: 'COUNT(*) AS total',
      auto: true
    })
  
    if(!total) return 0
  
    const fullPeriod = Date.now() - firstMessageTimestamp
    const period = fullPeriod / by
  
    return Math.min(Math.round(total/period),total)
  }
}