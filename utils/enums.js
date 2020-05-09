
const DAY = 1000 * 60 * 60 * 24

/**
 * @type {Object.<TimeIndicator,number>}
 */
module.exports.TIME = {
  DAY,
  WEEK: DAY * 7,
  MONTH: DAY * 31,
  YEAR: DAY * 365
}

module.exports.COLORS = {
  BLURPLE: '#4a9eff',
  BLURPLE_HOVER: '#8fdfff',
  TRANS_LIGHT: 'rgba(255, 255, 255, 0.03)',
  TRANS_LIGHT_2: 'rgba(255, 255, 255, 0.1)',
  TRANS_BLACK: 'rgba(0, 0, 0, 0.03)',
  TRANS_BLACK_2: 'rgba(0, 0, 0, 0.1)',
  WHITE: '#d8fff3',
  BLACK: '#14171a'
}