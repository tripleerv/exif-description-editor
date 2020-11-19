const mri = require('mri')
const ora = require('ora')
const chalk = require('chalk')
const { resolve } = require('path')
const getCsvData = require('./fns/getCsvData')
const { getImages, } = require('./fns/getFiles')
const updateDescriptions = require('./fns/updateDescriptions')

module.exports = async () => {
  const spinner = ora('Processing images').start()
  const args = mri(process.argv.slice(2))

  let sourceDir = args.source ? resolve(args.source) : null
  if (!sourceDir) {
    console.error(chalk.red(`\nNo source provided. Provide one with ${chalk.bold('--source')}`))
    process.exit()
  }
  let csvFile = args.csv ? resolve(args.csv) : null
  if (!csvFile) {
    console.error(chalk.red(`\nNo CSV provided. Provide one with ${chalk.bold('--csv')}`))
    process.exit()
  }

  spinner.text = 'Getting images from directory...'
  const [data, images] = await Promise.all([getCsvData(csvFile), getImages(sourceDir)])
  spinner.text = 'Updating image metadata...'
  await updateDescriptions(sourceDir, images, data)

  spinner.succeed('Image metadata has been updated')
  process.exit()
}