
const getMessages = require('./getMessages')

/**
 * Calc speaking rate by [?] (default: by day)
 * @param db
 * @param {User} user
 * @param {Object} [options]
 * @param {number} [options.by] default: 1000 * 60 * 60 * 24
 * @returns {Promise<number>}
 */
module.exports = async function getUserRate( db, user, options = {} ){
    
  const by = options.by || 1000*60*60*24
  
  const firstMessageTimestamp = await getMessages( db, {
    where: { user_id: user.id },
    sortBy: ['created_timestamp'],
    select: 'created_timestamp',
    limit: 1
  })
  
  const count = await getMessages( db, {
    where: { user_id: user.id },
    select: 'COUNT(*) AS "count"',
    auto: true
  })
  
  if(!count) return 0
  
  const period = Date.now() - firstMessageTimestamp
  const bys = period / by
  
  return Math.min(Math.round(count/bys),count)
}