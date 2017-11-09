const https = require('https');
const fs = require('fs');
const path = require('path');

const ProgressBar = require('progress');
const wallpaper = require('wallpaper');
const chalk = require('chalk');

const Ora = require('ora');
const Conf = require('conf');

const {
	parseExif,
	showCopy,
	checkArchivments
} = require('./utils');

const config = new Conf();
const spinner = new Ora({
	text: 'Making something awesome',
	color: 'yellow',
	spinner: 'earth'
});

const join = path.join;

// Flags, options, set as wallpaper
function download(
	flags,
	options = {custom: false},
	setAsWallpaper = true
) {

	// Increase downloads counter.
	config.set('counter', config.get('counter') + 1);

	// If no progress run the spinner
	if (!flags.progress && !flags.quiet) {
		spinner.start();
	}

	const size = config.get('pic-size');
	const extension = size === 'raw' ? 'tiff' : 'jpg';

	const photo = options.photo ? options.photo : options;
	const unlockedArchivment = checkArchivments();
	const img = options.filename ? options.filename : join(config.get('directory'), `${photo.id}.${extension}`);

	const url = options.custom ? photo.urls.custom : (photo.urls[size] ? photo.urls[size] : photo.urls.full);
	const file = fs.createWriteStream(img);

	try {
		https.get(url, response => {
			// If --progress run the progressbar
			if (flags.progress) {
				const len = parseInt(response.headers['content-length'], 10);
				const bar = new ProgressBar(chalk`{yellow ↓} {red :percent} [:bar] :elapsed s`, {
					complete: '=',
					incomplete: ' ',
					width: 20,
					total: len,
					clear: true
				});

				// On data received fill the progressbar
				response.on('data', chunk => {
					bar.tick(chunk.length, {
						passphrase: 'Making something awesome'
					});
				});
			}

			response.pipe(file).on('finish', () => {
				if (setAsWallpaper) {
					wallpaper.set(img);
				}

				if (!flags.quiet) {
					spinner.succeed();
				}

				// Get photos infos
				if (flags.infos) {
					const exif = parseExif(photo);

					console.log();

					exif.forEach(item => {
						console.log(chalk`{bold {yellow ${item.name.toUpperCase()}}}: ${item.value}`);
					});

					console.log();
				}

				// Display 'shot by ...'
				showCopy(photo);

				// Trailing space
				console.log();

				if (unlockedArchivment) {
					console.log(`Archivment Unlocked: "{yellow ${unlockedArchivment.name}}"`);
					console.log();
				}
			});
		});
	} catch (err) {
		throw new Error(err);
	}
}

module.exports = download;
