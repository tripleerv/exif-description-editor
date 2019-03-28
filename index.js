const mri = require('mri')
const ora = require('ora')
const chalk = require('chalk')
const execa = require('execa')
const { resolve } = require('path')
const getCsvData = require('./fns/getCsvData')
const { getImages } = require('./fns/getFiles')
const updateDescriptions = require('./fns/updateDescriptions')

const hasExifTool = async () => {
  // const { stdout } = await execa('command -v exiftool')
  try {
    await execa.shell('command -v exiftool')
  } catch (err) {
    console.error(chalk.red(`\nexiftool is not installed. Please install it using ${chalk.bold.green('brew install exiftool')}`))
    process.exit()
  }
  // return new Promise((resolve) => {
  //   exiftool.on('close', code => {
  //     if (code !== 0) console.error(chalk.red(`exiftool is not installed. Please install it using ${chalk.bold.green('brew install exiftool')}`))
  //     resolve()
  //   })
  // })
}

module.exports = async () => {
  const spinner = ora('Checking dependencies...').start()
  const args = mri(process.argv.slice(2))
  await hasExifTool()

  let sourceDir = resolve(args.source)
  if (!sourceDir) return console.error(chalk.red(`No source provided. Provide one with ${chalk.bold('--source')}`))
  let csvFile = args.csv
  if (!csvFile) return console.error(chalk.red(`No csv provided. Provide one with ${chalk.bold('--csv')}`))

  spinner.text = 'Fetching CSV data...'
  const data = await getCsvData(csvFile)
  spinner.text = 'Getting images from directory...'
  const images = await getImages(sourceDir)
  spinner.text = 'Updating image metadata...'
  await updateDescriptions(sourceDir, images, data)

  spinner.succeed('Image metadata has been updated')
}