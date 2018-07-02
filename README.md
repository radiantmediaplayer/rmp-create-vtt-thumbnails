# rmp-create-vtt-thumbnails

An helper script to easily create VTT files that works with [Radiant Media Player preview thumbnails feature](https://www.radiantmediaplayer.com/docs/latest/preview-thumbnails.html).

First you will need to create a mosaic of thumbnails with FFmpeg [as described here](https://www.radiantmediaplayer.com/docs/latest/preview-thumbnails.html#preview-thumbnails-ffmpeg).

Once this is done you can download this script to automatically create a VTT file that will work with this mosaic of thumbnails in [Radiant Media Player](https://www.radiantmediaplayer.com).

For more information on the VTT format used [see this documentation section](https://www.radiantmediaplayer.com/docs/latest/preview-thumbnails.html#preview-thumbnails-introduction).

This script (create.js) is in alpha stage and may need improvement. It has been tested for node.js 8.11+ on Windows 10.

## Usage from the command line
```
git clone https://github.com/radiantmediaplayer/rmp-create-vtt-thumbnails.git
cd rmp-create-vtt-thumbnails
node create.js 596 assets/bbb-sprite.jpg output/bbb-thumbnails.vtt 5 128 72 11
```
See assets/ folder for ready-to-use mosaic image examples. See output/ folder for examples of VTT files generated with the create.js script.

## Parameters docs

`node create.js duration spriteFileLocation outputVTTFileName gapBetweenFrames thumbnailWidth thumbnailHeight tileSize`

`duration`: content duration in seconds

`spriteFileLocation`: location for the mosaic image (a.k.a. sprite image)

`outputVTTFileName`: location to write the output VTT file related to the input `spriteFileLocation`

`gapBetweenFrames`: the gap in seconds between frame extraction

`thumbnailWidth`: the thumbnail width within the mosaic

`thumbnailHeight`: the thumbnail height within the mosaic

`tileSize`: the tile format used to generate the mosaic (example 11 for 11x11, 6 for 6x6 ...) 

## Issues
Issues should be submitted in this GitHub page. We will do our best to review them.

## License
rmp-create-vtt-thumbnails is released under MIT

Radiant Media Player has its own license which can be found here: [https://www.radiantmediaplayer.com/terms-of-service.html](https://www.radiantmediaplayer.com/terms-of-service.html)
