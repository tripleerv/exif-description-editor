const { createReadStream } = require('fs')
const csv = require('csv-parser')

const getCsvData = async csvFile => {
  let results = new Array()
  return new Promise((resolve) => {
    createReadStream(csvFile)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => resolve(results))
  })
}

module.exports = getCsvData
