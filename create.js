#!/usr/bin/env node

/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * rmp-create-vtt-thumbnails 0.1.2 | https://github.com/radiantmediaplayer/rmp-create-vtt-thumbnails
 */

'use strict';

const fs = require('fs');
const eol = require('os').EOL;

// function to append data to our output VTT file
const _appendFileSync = function (file, data) {
  try {
    fs.appendFileSync(file, data);
  } catch (err) {
    console.log(err);
  }
};

// function to convert second-based time to HH:MM:SS.xxxx format required for VTT compliance
// see https://www.w3.org/TR/webvtt1/#webvtt-timestamp
const _secondsToHRTime = function (time) {
  if (typeof time === 'number' && time >= 0) {
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time * 1.0 / 60);
    let hours = 0;
    if (minutes > 59) {
      hours = Math.floor(time * 1.0 / 3600);
      minutes = Math.floor(((time * 1.0 / 3600) % 1) * 60);
      seconds = Math.floor(time % 60);
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (hours > 0) {
      hours = hours + ':';
    } else if (hours === 0) {
      hours = '';
    }
    return hours + minutes + ':' + seconds + '.000';
  } else {
    return '';
  }
};


// parsing input from our command line 
// input params are: duration spriteFileLocation outputVTTFileName gapBetweenFrames thumbnailWidth thumbnailHeight tileSize
// example: node create.js 596 assets/bbb-sprite.jpg output/bbb-thumbnails.vtt 5 128 72 11
let duration;
let spriteFileLocation;
let outputVTTFileName;
let gapBetweenFrames;
let thumbnailWidth;
let thumbnailHeight;
let tileSize;
process.argv.forEach((value, index) => {
  switch (index) {
    case 2:
      duration = parseInt(value);
      break;
    case 3:
      spriteFileLocation = (value).toString();
      break;
    case 4:
      outputVTTFileName = (value).toString();
      break;
    case 5:
      gapBetweenFrames = parseInt(value);
      break;
    case 6:
      thumbnailWidth = parseInt(value);
      break;
    case 7:
      thumbnailHeight = parseInt(value);
      break;
    case 8:
      tileSize = parseInt(value);
      break;
    default:
      break;
  }
});


if (!duration || !spriteFileLocation || !outputVTTFileName || !gapBetweenFrames || !thumbnailWidth || !thumbnailHeight || !tileSize) {
  console.log('Error: missing or invalid parameters in the command line');
  return;
}

// delete VTT file if already exists
try {
  fs.unlinkSync(outputVTTFileName);
  console.log(outputVTTFileName + ' already exists - deleted it');
} catch (err) {
  if (err && err.code === 'ENOENT') {
    console.log(outputVTTFileName + ' does not exist - will create it');
  }
}

// append our initial VTT data for spec compliance
const initialData = 'WEBVTT' + eol + eol;
_appendFileSync(outputVTTFileName, initialData);

// initial variables values for our loop
const itemNumber = Math.floor(duration / gapBetweenFrames) + 1;
let currentTime = 0;
let xCoordinates = 0;
let yCoordinates = 0;
let thumbnailSizeString = ',' + thumbnailWidth + ',' + thumbnailHeight + eol + eol;

// for each item append VTT data
for (let i = 0, len = itemNumber; i <= len; i++) {
  if (currentTime > duration) {
    break;
  }
  let startTime = _secondsToHRTime(currentTime);
  currentTime += gapBetweenFrames;
  let endTime = _secondsToHRTime(currentTime);
  if (!startTime || !endTime) {
    console.log('Error: could not determine startTime or endTime for VTT item number ' + i + ' - exit');
    return;
  }
  let string = startTime + ' --> ' + endTime + eol;
  string += spriteFileLocation + '#xywh=' + xCoordinates + ',' + yCoordinates;
  string += thumbnailSizeString;
  xCoordinates += thumbnailWidth;
  if (xCoordinates > (thumbnailWidth * (tileSize - 1))) {
    yCoordinates += thumbnailHeight;
    xCoordinates = 0;
  }
  _appendFileSync(outputVTTFileName, string);
}

