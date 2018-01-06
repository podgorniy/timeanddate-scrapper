const parseDate = require('./utils').parseDate
const fs = require('fs')
const enqueue = require('./data-extractor').enqueue
const onComplete = require('./data-extractor').onComplete

const entryPointUrl = 'https://www.timeanddate.com/holidays/'
let resultHolidays = []
const years = [2018, 2017, 2016, 2015]

onComplete(function () {
    fs.writeFileSync('holidays.json', JSON.stringify(resultHolidays), 'utf-8')
})

enqueue({
    uri: entryPointUrl,
    callback: (error, res, done) => {
        if (error) throw error
        const $ = res.$
        years.forEach((year) => {
            $('.mgt0').each((index, elem) => {
                const worldPart = $(elem).text()
                const countriesLinks = $(elem).next().find('a').map((index, node) => {
                    return {
                        uri: "https://www.timeanddate.com" + $(node).attr('href') + year,
                        country: $(node).text()
                    }
                }).get()
                countriesLinks.forEach(({uri, country}) => {
                    enqueue({
                        uri,
                        callback: function (error, res, done) {
                            console.log(`processing "${country}", ${uri}`)
                            if (error) throw error
                            const $ = res.$
                            $('.zebra.fw.tb-cl.tb-hover tbody tr').each((index, trNode) => {
                                const date = parseDate($(trNode).find('>*').eq(0).text(), year)
                                const day = $(trNode).find('>*').eq(1).text()
                                const holidayName = $(trNode).find('>*').eq(2).text()
                                const holidayType = $(trNode).find('>*').eq(3).text()
                                resultHolidays.push({
                                    date: date.toString(),
                                    holidayName,
                                    holidayType,
                                    country,
                                    worldPart
                                })
                            })
                            done()
                        }
                    })
                })
            })
        })
        done()
    }
})
