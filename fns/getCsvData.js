import { createReadStream } from 'fs'
import csv from 'csv-parser'
import iconv from 'iconv-lite'

export const getCsvData = async (csvFile) => {
  let results = new Array()
  return new Promise((resolve) => {
    createReadStream(csvFile)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(iconv.encodeStream('utf8'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .once('end', () => resolve(results))
  })
}
