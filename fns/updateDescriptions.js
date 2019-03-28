const { spawn } = require('child_process')

const updateDescriptions = async (basePath, images, csvData) => {
  images.forEach(async image => {
    // console.log(`${basePath}/${image}`)
    let imageId = image.split(' ')[0]
    let rowMatch = await csvData.find(row => row.id === imageId)
    if (!rowMatch) return
    await spawn('exiftool', [`-ImageDescription=${rowMatch.description}`, `${basePath}/${image}`])
  })
}

module.exports = updateDescriptions
