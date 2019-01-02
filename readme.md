# hafas-fetch-track-slice

**Pass in a [trip ID](https://github.com/public-transport/hafas-client/blob/ecc26ef313b75f9bedcf4ee1b2b95aebb3478379/docs/trip.md), get a slice between stations of its track.**

[![npm version](https://img.shields.io/npm/v/hafas-fetch-track-slice.svg)](https://www.npmjs.com/package/hafas-fetch-track-slice)
[![build status](https://api.travis-ci.org/derhuerst/hafas-fetch-track-slice.svg?branch=master)](https://travis-ci.org/derhuerst/hafas-fetch-track-slice)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-fetch-track-slice.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install hafas-fetch-track-slice
```


## Usage

```js
const createHafas = require('vbb-hafas')
const fetchTrackSlice = require('hafas-fetch-track-slice')

const prevStation = {
	type: 'station',
	id: '900000016202'
	name: 'U Südstern',
	location: {
		type: 'location',
		latitude: 52.491252,
		longitude: 13.395382
	}
}
const nextStation = {
	type: 'station',
	id: '900000016153'
	name: 'U Gneisenaustr',
	location: {
		type: 'location',
		latitude: 52.490386,
		longitude: 13.400214
	}
}

const hafas = createHafas('my-awesome-program')
// get these from e.g. hafas.journeys(), hafas.departures() or hafas.radar()
const someTripId = '1|31817|10|86|16052018'

fetchTrackSlice(hafas, prevStation, nextStation, someTripId, 'U7')
.then(console.log)
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})
```

```js
{
	type: 'LineString',
	coordinates: [
		[
			13.407732293830614,
			52.4892844953395
		],
		[
			13.407732293830614,
			52.4892844953395
		]
	]
}
```


## Contributing

If you have a question or have difficulties using `hafas-fetch-track-slice`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hafas-fetch-track-slice/issues).
