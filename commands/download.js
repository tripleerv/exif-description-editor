import { resolve } from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { createObjectCsvWriter } from 'csv-writer'
const writeFilePromise = promisify(writeFile)

export default async (options) => {
  const contestId = options.id || 1129
  const dest = resolve(options.dest)
  let page = 1
  let signature = await getSignature()
  let totalEntries = 0
  let fetchedEntries = 0
  let downloadPromises = []

  const csvWriter = createObjectCsvWriter({
    path: `${dest}/entries.csv`,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'submitter_first_name', title: 'Submitter First Name' },
      { id: 'submitter_last_name', title: 'Submitter Last Name' },
      { id: 'submitter_email', title: 'Submitter Email' },
      { id: 'title', title: 'Title' },
      { id: 'description', title: 'Description' },
      { id: 'image_url', title: 'Image URL' },
    ],
  })

  let csvRecords = []

  do {
    const url = `https://developerplatform.strutta.com/entries/getAllEntries/page:${page}/sort:random/direction:desc.json?signature=${signature}&contest_id=${contestId}`
    const response = await fetch(url)
    const data = await response.json()
    if (data.error === 'Invalid Signature') {
      signature = await getSignature()
      continue
    }
    totalEntries = data.total_count

    const pageDownloads = data.Entries.map((entry) => {
      console.info(`Downloading entry with ID ${entry.Entry.entry_id}...`)
      csvRecords.push({
        id: entry.Entry.entry_id,
        submitter_first_name: entry.Entry.User.first_name,
        submitter_last_name: entry.Entry.User.last_name,
        submitter_email: entry.Entry.User.email,
        title: entry.Entry.entryname ?? '',
        description: entry.Entry.Photo.description ?? '',
        image_url: entry.Entry.Photo.image_src_url,
      })
      return downloadFile(
        entry.Entry.Photo.image_src_url,
        `${dest}/${entry.Entry.entry_id}.${entry.Entry.Photo.image_extension}`
      ).catch((err) => console.error(`Failed to download entry ${entry.Entry.entry_id}:`, err))
    })
    downloadPromises.push(...pageDownloads)

    fetchedEntries += data.Entries.length
    page++
  } while (fetchedEntries < totalEntries)

  await Promise.allSettled(downloadPromises)

  await csvWriter.writeRecords(csvRecords)
  console.info('✔ CSV file created.')
  console.info('✔ Download complete.')
}

const downloadFile = async (url, path) => {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => writeFilePromise(path, Buffer.from(buf)))
}

const getSignature = async () => {
  return fetch('https://platform.strutta.com/fbcontests/getSignature/')
    .then((res) => res.json())
    .then((x) => x.signature)
}
