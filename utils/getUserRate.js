
const queryBuilder = require('./queryBuilder')

/**
 * Get
 * @param {Connection} db
 * @param {module:"discord.js".User} user
 * @param {number} from
 * @param {number} to
 * @returns {Promise<Rate>}
 */
async function getUserRate( db, user, from, to ){
  
  const fromDate = new Date(from).toISOString()
  const toDate = new Date(to).toISOString()
  
  return {
    from,
    to,
    value: await queryBuilder( db, {
      where: [
        { user_id: user.id },
        { column: 'created_timestamp', values: [fromDate,toDate] }
      ],
      select: 'count(id)',
      auto: true
    })
  }
}
module.exports = getUserRate