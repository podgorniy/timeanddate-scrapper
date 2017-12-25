const moment = require('moment')

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * converts "Mar 20" to momentjs date object
 * @param string
 * @param year
 */
exports.parseDate = function(string, year) {
    let [month, date] = string.split(' ')
    let monthNum = MONTH.indexOf(month)
    if (monthNum === -1) {
        throw Error(`Unknown month "${month}"`)
    }
    let dateNum = parseInt(date, 10)
    return moment([year, monthNum, dateNum])
}
