'use strict'

const test = require('tape')
const hafas = require('vbb-hafas')

const fetchTrackSlice = require('.')

const findVehicle = (around) => {
	return hafas.radar({
		north: around.latitude + .01,
		west: around.longitude - .01,
		south: around.latitude - .01,
		east: around.longitude + .01
	}, {
		results: 1,
		duration: 1,
		frames: 2
	})
	.then((vehicles) => vehicles[0])
}

test('works i guess', (t) => {
	t.plan(5)

	findVehicle({
		latitude: 52.496633,
		longitude: 13.390944
	})
	.then((vehicle) => {
		const frame = vehicle.frames && vehicle.frames[0] && vehicle.frames[0]
		const prev = frame && frame.origin
		const next = frame && frame.destination
		const lineName = vehicle.line && vehicle.line.name

		return fetchTrackSlice(hafas, prev, next, vehicle.journeyId, lineName)
	})
	.then((slice) => {
		t.ok(slice)
		t.equal(slice.type, 'LineString')
		t.ok(Array.isArray(slice.coordinates))
		t.ok(slice.coordinates.length > 0)
		t.ok(slice.coordinates.every(crd => Array.isArray(crd)))
		// todo: make sure the shape actually makes sense
	})
	.catch(t.ifError)
})
