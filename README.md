# rmp-create-vtt-thumbnails

A helper script to easily create VTT files that works with [Radiant Media Player preview thumbnails feature](https://www.radiantmediaplayer.com/docs/latest/preview-thumbnails.html) (could work with other players that follow the same VTT-based preview thumbnails implementation). This process has been tested for node.js 8.11+ on Windows 10 and Ubuntu 16 LTS.

## Create the mosaic of images (a.k.a thumbnail sprites)

First you will need to create a mosaic of thumbnails with FFmpeg:

- install [FFmpeg](https://www.ffmpeg.org/download.html) for your platform
- get a MP4 file from the video you want to extract thumbnails from. A low quality version of that video will do
- use the below command line to create the mosaic of iamges:

```bash
ffmpeg -i input.mp4 -filter_complex "select='not(mod(n,120))',scale=128:72,tile=11x11" -frames:v 1 -qscale:v 3 -an mosaic.jpg
```
A couple of things to notice from the above commande line:

- select='not(mod(n,120))': this is where we tell FFmpeg to only extract 1 frame every 120 frames (one frame every 5 seconds for a input.mp4 which runs at 24 FPS).
- scale=128:72,tile=11x11: here we tell FFmpeg that the width of each item within the mosaic image should be 128px width and 72px height. In the above example of content has a 16:9 aspect ratio. The width of each item within the mosaic must be 128px. The height should be adjusted based on your content aspect ratio. We then need to tell FFmpeg what tile size should be used. In this case we need 11x11 because 596 (duration) / 5 (gap between each thumbnail frame) ~ 120 frames. So we need a mosaic that can hold at least 120 frames - the closest being 11x11 = 121 frames.
- qscale:v you can adjust this value to reduce or augment the size/quality of your thumbnails (the lower the qscale:v value the better quality).

## Create a VTT file that documents the mosaic of thumbnails

The WebVTT file consists of a list of cues with the following data:

- The time-range the current thumbnail represents. Note that the range needs to be in (HH:)MM:SS.MMM format. Only this exact notation will be parsed.
- The URI to the thumbnail for this time-range. The URI is relative to the WebVTT file location (not to the page). Each individual image from the mosaic of thumbnails can be located by appending its coordinates using spatial media fragment (xywh format). You can also have one specific URI for each image.

To automatically create that VTT file, install the create.js script from this repository:
```
git clone https://github.com/radiantmediaplayer/rmp-create-vtt-thumbnails.git
cd rmp-create-vtt-thumbnails
node create.js 596 assets/bbb-sprite.jpg output/bbb-thumbnails.vtt 5 128 72 11
```
See assets/ folder for ready-to-use mosaic image examples. See output/ folder for examples of VTT files generated with the create.js script.

## Parameters docs

`node create.js duration spriteFileLocation outputVTTFileName gapBetweenFrames thumbnailWidth thumbnailHeight tileSize`

All parameters are mandatory.

`duration`: content duration in seconds

`spriteFileLocation`: location for the mosaic image (a.k.a. sprite image) to reference in the resulting VTT file

`outputVTTFileName`: location for the produced output VTT file

`gapBetweenFrames`: the gap in seconds between frame extraction (value used for generating the mosaic image with FFmpeg)

`thumbnailWidth`: the width of each thumbnail within the mosaic

`thumbnailHeight`: the height of each thumbnail within the mosaic

`tileSize`: the tile format used to generate the mosaic (value used for generating the mosaic image with FFmpeg: 11 for 11x11, 6 for 6x6 ...) 

## Issues
Issues should be submitted in this GitHub page. We will do our best to review them.

## License for rmp-create-vtt-thumbnails
rmp-create-vtt-thumbnails is released under MIT.

## License for Radiant Media Player
Radiant Media Player is a commercial HTML5 media player, not covered by the above MIT license. 

Radiant Media Player license can be found here: [https://www.radiantmediaplayer.com/terms-of-service.html](https://www.radiantmediaplayer.com/terms-of-service.html). 

You may request a free trial for Radiant Media Player at: [https://www.radiantmediaplayer.com/free-trial.html](https://www.radiantmediaplayer.com/free-trial.html).
