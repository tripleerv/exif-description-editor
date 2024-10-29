import { resolve, basename } from 'path'
import { readdir, stat } from 'fs/promises'

export const getFiles = async (dir) => {
  const subdirs = await readdir(dir)
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? getFiles(res) : basename(res)
    })
  )
  return Array.prototype.concat(...files)
}

export const getImages = async (dir) => {
  const extensions = new RegExp(/(jpg|jpeg|JPG|JPEG|png|PNG)/)
  const files = await getFiles(dir)
  const images = await files.filter((file) => extensions.test(file))
  return images
}

export const getOriginals = async (dir) => {
  const files = await getFiles(dir)
  const originals = await files.filter((file) => file.includes('_original'))
  return originals
}
