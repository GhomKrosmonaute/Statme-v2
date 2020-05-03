/**
 * @param {number} n
 * @param {number} low
 * @param {number} high
 * @returns {number}
 */
function constrain( n, low, high ) {
  return Math.max(Math.min(n, high), low);
}

module.exports = constrain