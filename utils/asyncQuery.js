/**
 * Query promisify
 * @param db
 * @param {string} sql
 * @param {Array} values
 * @param {Object} [options]
 * @param {boolean} [options.auto]
 * @returns {Promise<any>}
 */
module.exports = function asyncQuery( db, sql, values, options = {} ){
  return new Promise((res,rej) => {
    this.execute( sql, values, (error, output) => {
      if(error) rej(error)
      if(options.auto && output.length === 1)
        res(output[0])
      else res(output)
    })
  })
}