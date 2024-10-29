# Strutta Tools

These Strutta tools can be used to download contest images, as well as add **image description** metadata to images.

## Getting Started

### Prerequisites

- NodeJS 20 or greater

## Usage

### Downloading files

To download files from a contest, run the following command:

```bash
npx @tripleerv/strutta-tools download --id <contest id> --dest <destination folder>
```

Options available for this command are:

- `--id` - sets the contest ID (required)
- `--dest` - to specify the output directory (defaults to `./dist`)
- `--no-emit` - setting this option does not output the results CSV file

### Updating metadata

To update the metadata of a folder of images, run the following:

```bash
npx @tripleerv/strutta-tools update --source <source folder> --csv <path/to/csv/file.csv>
```

Options:

- `--source` - path to the source folder with images to update (defaults to `./dist`)
- `--csv` - path to the CSV file with descriptions (defaults to `./dist/entries.csv`)
- `--id` - optional name of the ID column in the CSV file (defaults to `ID`)
- `--description` - optional name of the description column in the CSV file (defaults to `Description`)
