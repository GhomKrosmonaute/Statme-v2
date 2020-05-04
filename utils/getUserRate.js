
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
  return {
    from,
    to,
    value: await queryBuilder( db, {
      where: [
        { user_id: user.id },
        { column: 'created_timestamp', operator: ">", value: from },
        { column: 'created_timestamp', operator: "<", value: to }
      ],
      select: 'count(id)',
      auto: true
    })
  }
}
module.exports = getUserRate