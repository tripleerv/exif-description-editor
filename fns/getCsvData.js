const { createReadStream } = require('fs')
const csv = require('csv-parser')
const iconv = require('iconv-lite')

const getCsvData = async csvFile => {
  let results = new Array()
  return new Promise((resolve) => {
    createReadStream(csvFile)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(iconv.encodeStream('utf8'))
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => resolve(results))
  })
}

module.exports = getCsvData
