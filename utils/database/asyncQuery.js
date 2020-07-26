/**
 * Query promisify
 * @param {Connection} db
 * @param {string} sql
 * @param {Array|Object} values
 * @param {Object} [options]
 * @param {boolean} [options.auto]
 * @returns {Promise<any>}
 */
function asyncQuery( db, sql, values, options = {} ){
  return new Promise((res,rej) => {
    db.execute( sql, values, (error, output) => {
      if(error) rej(error)
      if(!output || output.length === 0) return false
      if(options.auto) {
        if(Array.isArray(output)){
          if(output.length === 1){
            const keys = Object.keys(output[0])
            if(keys.length === 1) res(output[0][keys[0]])
            else res(output[0])
          }else{
            const keys = Object.keys(output[0])
            if(output.every(data => Object.keys(data).length === 1))
              res(output.map(data => data[keys[0]]))
            else res(output)
          }
        }else res(output)
      }else res(output)
    })
  })
}

module.exports = asyncQuery