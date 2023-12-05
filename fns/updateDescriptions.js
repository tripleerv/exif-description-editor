import exiftool from 'node-exiftool'

export const updateDescriptions = async (basePath, images, csvData) => {
  const ep = new exiftool.ExiftoolProcess('/opt/homebrew/bin/exiftool')
  await ep.open()

  for (const image of images) {
    let imageId = image.split('.')[0]
    let rowMatch = await csvData.find((row) => row.id === imageId)
    if (rowMatch) {
      ep.writeMetadata(
        `${basePath}/${image}`,
        {
          Description: String(rowMatch.description).replace(/\n/g, '\r'),
          Caption: String(rowMatch.description).replace(/\n/g, '\r'),
        },
        ['charset=UTF8', 'overwrite_original', 'E']
      )
    }
  }
  await ep.close()
}
