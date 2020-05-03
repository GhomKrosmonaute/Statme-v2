
const constrain = require('./constrain')

/**
 * @param {number} n
 * @param {number} start1
 * @param {number} stop1
 * @param {number} start2
 * @param {number} stop2
 * @param {boolean} [withinBounds]
 * @returns {number}
 */
function map( n, start1, stop1, start2, stop2, withinBounds = false) {
  const output = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
  if(!withinBounds) return output
  return start2 < stop2 ?
    constrain(output, start2, stop2) :
    constrain(output, stop2, start2)
}

module.exports = map