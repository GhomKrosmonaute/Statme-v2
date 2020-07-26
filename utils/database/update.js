
const query = require('./asyncQuery')

/**
 * @param {Connection} db
 * @param {string} table
 * @param {Object.<string,*>} data
 * @returns {Promise<void>}
 */
async function update( db, table, data ){
  const dataKeys = Object.keys(data)
  await query( db,
    'UPDATE IGNORE `' + table + '` SET ' + dataKeys
      .map(k => '`'+k+'` = ?')
      .join(', '),
    Object.values(data)
  )
}

module.exports = update