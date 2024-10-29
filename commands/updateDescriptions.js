import { exiftool } from 'exiftool-vendored'
import yoctoSpinner from 'yocto-spinner'
import { getCsvData } from '../fns/getCsvData.js'
import { getImages } from '../fns/getFiles.js'

export default async (options) => {
  const spinner = yoctoSpinner({ text: 'Updating EXIF descriptions...' }).start()
  spinner.text = 'Loading data...'
  const [csvData, images] = await Promise.all([getCsvData(options.csv), getImages(options.source)])

  spinner.text = 'Updating EXIF descriptions...'
  await Promise.all(
    images.map(async (image) => {
      let imageId = image.split('.')[0]
      let rowMatch = await csvData.find((row) => row[options.id] === imageId)
      if (rowMatch) {
        const caption = String(rowMatch[options.description]).replace(/\n/g, '\r')
        await exiftool.write(
          `${options.source}/${image}`,
          {
            Description: caption,
            Caption: caption,
            LocalCaption: caption,
          },
          {
            writeArgs: ['-overwrite_original', '-codedcharacterset=utf8', '-charset=UTF8', '-E'],
          }
        )
      } else {
        console.error(`No match found for ${imageId}`)
      }
    })
  )
    .then(() => {
      spinner.success('EXIF descriptions updated.')
    })
    .finally(() => {
      exiftool.end()
    })
}
