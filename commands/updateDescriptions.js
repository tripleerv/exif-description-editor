import exiftool from 'node-exiftool'
import yoctoSpinner from 'yocto-spinner'
import { getCsvData } from '../fns/getCsvData.js'
import { getImages } from '../fns/getFiles.js'

export default async (options) => {
  const spinner = yoctoSpinner({ text: 'Updating EXIF descriptions...' }).start()
  spinner.text = 'Loading data...'
  const [csvData, images] = await Promise.all([getCsvData(options.csv), getImages(options.source)])

  spinner.text = 'Updating EXIF descriptions...'
  await Promise.all(
}
