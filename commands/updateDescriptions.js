import exiftool from 'node-exiftool'
import exifToolBin from 'dist-exiftool'
import { getCsvData } from '../fns/getCsvData.js'
import { getImages } from '../fns/getFiles.js'

export default async (options) => {
  const [csvData, images] = await Promise.all([getCsvData(options.csv), getImages(options.source)])

  const ep = new exiftool.ExiftoolProcess(exifToolBin)
  await ep.open()

  for (const image of images) {
    let imageId = image.split('.')[0]
    let rowMatch = await csvData.find((row) => row[options.id] === imageId)
    if (rowMatch) {
      const caption = String(rowMatch[options.description]).replace(/\n/g, '\r')
      ep.writeMetadata(
        `${options.source}/${image}`,
        {
          Description: caption,
          Caption: caption,
          LocalCaption: caption,
        },
        ['codedcharacterset=utf8', 'charset=UTF8', 'overwrite_original', 'E']
      )
    } else {
      console.error(`No match found for ${imageId}`)
    }
  }
  await ep.close()
}
