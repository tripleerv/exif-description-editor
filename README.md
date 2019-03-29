# exif-description-editor

This tool is made specifically for adding an **Image Description** metadata tag to our UGC Photo Contest images.

## Getting Started

### Prerequisites
- NodeJS 10 or greater

First, install the tool globally using npm:

`npm i -g exif-description-editor`

Or, if you want the standalone binary, download it from the [releases page](https://github.com/tripleerv/exif-description-editor/releases)

Now run the tool:

`exif-description --source ~/Desktop/folder_of_images_without_metadata --csv ~/Desktop/csv_file_with_descriptions.csv`

The CSV file needs to be formatted as follows:

| id     | description |
|-------|---------|
| 1245845 | Photo of a Unity in the mountains. |
| 14652159 | My Wonder by the stream. |

