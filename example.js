'use strict'

const createHafas = require('vbb-hafas')

const fetchTrackSlice = require('.')

const latitude = 52.496633
const longitude = 13.390944

const hafas = createHafas('hafas-fetch-track-slice example')

hafas.radar({
	north: latitude + .006,
	west: longitude - .006,
	south: latitude - .006,
	east: longitude + .006
}, {
	results: 1,
	duration: 1,
	frames: 2
})
.then(async ([vehicle]) => {
	const frame = vehicle.frames && vehicle.frames[0] && vehicle.frames[0]
	const prev = frame && frame.origin
	const next = frame && frame.destination
	const lineName = vehicle.line && vehicle.line.name

	const slice = await fetchTrackSlice(hafas, prev, next, vehicle.tripId, lineName)
	const feat = {
		type: 'Feature',
		properties: {
			tripId: vehicle.tripId,
			lineName,
			prev, next,
		},
		geometry: slice,
	}

	console.error('paste this into geojson.io:')
	process.stdout.write(JSON.stringify(feat) + '\n')
})
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})

