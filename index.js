#!/usr/bin/env node

import sade from 'sade'
import download from './commands/download.js'
import updateDescriptions from './commands/updateDescriptions.js'

const prog = sade('strutta-tools')

prog.version('1.0.0')

prog
  .command('download')
  .describe('Download files from Strutta API. Expects a contest ID.')
  .option('-i --id', 'Set the contest ID')
  .option('-d --dest', 'Set the destination', './dist')
  .option('-x --no-emit', 'Do not output the CSV file', false)
  .example('download --id 1129 --dest dist/')
  .example('download --id 1129 --dest dist/ --no-emit')
  .action((opts) => {
    download(opts)
  })
  .command('update')
  .describe('Update file descriptions. Expects a CSV file.')
  .option('-s --source', 'Set the image source directory', './dist')
  .option('-c --csv', 'Set the CSV file', './dist/entries.csv')
  .option('-i --id', 'The name of the ID field in the CSV file', 'ID')
  .option('-d --description', 'The name of the description field in the CSV file', 'Description')
  .example('update --source dist/ --csv dist/entries.csv')
  .action((opts) => {
    updateDescriptions(opts)
  })

prog.parse(process.argv)
