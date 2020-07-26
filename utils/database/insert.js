
const query = require('./asyncQuery')
const build = require('./queryBuilder')

/**
 * @param {Connection} db
 * @param {string} table
 * @param {Object} data
 * @param {boolean} [ignore] default: true
 * @returns {Promise<boolean|number>} last insert ID
 */
async function insert( db, table, data, ignore = true ){
  
  const dataKeys = Object.keys(data)
  const result = await query( db, `
    INSERT ${ignore ? 'IGNORE' : ''} INTO \`${table}\` ( ${dataKeys.map(k => '`'+k+'`').join(', ')} )
    VALUES ( ${'?'.repeat(dataKeys.length).split('').join(', ')} )`,
    Object.values(data),
    { auto: true }
  )
  
  if(!result || !result.insertId) return await build( db, {
    select: 'index',
    from: table,
    where: { id: data.id },
    auto: true
  })
  else return result.insertId
}

module.exports = insert