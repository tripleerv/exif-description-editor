const { promisify } = require('util')
const fs = require('fs')
const { resolve, basename } = require('path')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

const getFiles = async dir => {
  const subdirs = await readdir(dir)
  const files = await Promise.all(subdirs.map(async subdir => {
    const res = resolve(dir, subdir)
    return (await stat(res)).isDirectory() ? getFiles(res) : basename(res)
  }))
  return Array.prototype.concat(...files)
}


const getImages = async dir => {
  const extensions = new RegExp(/(jpg|jpeg|JPG|JPEG|png|PNG)/)
  const files = await getFiles(dir)
  const images = await files.filter(file => extensions.test(file))
  return images
}

const getOriginals = async dir => {
  const files = await getFiles(dir)
  const originals = await files.filter(file => file.contains('_original'))
  return originals
}

module.exports = { getFiles, getImages, getOriginals }
