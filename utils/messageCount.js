
const query = require('./database/asyncQuery')
const resolve = require('./resolveType')

/**
 * @param {Connection} db
 * @param {*} item
 * @param {number} from
 * @param {number} to
 * @returns {Promise<number>}
 */
function messageCount( db, item, from, to ){
  const type = resolve(item)
  return query( db, `
    SELECT COUNT(message.id)
    FROM message
    LEFT JOIN ${type}
    ON message.${type}_index = ${type}.\`index\`
    WHERE ${type}.id = ?
    AND message.created_timestamp
    BETWEEN ? AND ?
  `, [ item.id, from, to ], { auto: true })
}

module.exports = messageCount