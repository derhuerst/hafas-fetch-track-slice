'use strict'

const lineSlice = require('@turf/line-slice')

const nonEmptyStr = str => 'string' === typeof str && str.length > 0
const assertValidStation = (s, name) => {
	if (!s) throw new Error('missing ' + name)
	if (!nonEmptyStr(s.name)) throw new Error(`invalid ${name}.name`)
	if (!s.location) throw new Error(`missing ${name}.location`)
	if ('number' !== typeof s.location.latitude) {
		throw new Error(`missing ${name}.location.latitude`)
	}
	if ('number' !== typeof s.location.longitude) {
		throw new Error(`missing ${name}.location.longitude`)
	}
}

// To find the "track slice" the vehicle has travelled and will travel, we
// - query the whole journey (leg), including the track shape
// - compute the slice of the track between previous station and next station
const fetchTrackSlice = (hafas, prevStation, nextStation, tripId, lineName) => {
	assertValidStation(prevStation, 'prevStation')
	assertValidStation(nextStation, 'nextStation')
	if (!nonEmptyStr(tripId)) {
		throw new Error('tripId must be a non-empty string')
	}
	if (!nonEmptyStr(lineName)) {
		throw new Error('lineName must be a non-empty string')
	}

	return hafas.trip(tripId, lineName, {
		polyline: true,
		stopovers: true,
		remarks: false
	})
	.then((leg) => {
		const findPassed = (id) => {
			return leg.stopovers.some((p) => {
				const s = p.stop || {}
				if (!s) return false
				return s.station && s.station.id === id || s.id === id
			})
		}
		if (!findPassed(prevStation.id)) {
			throw new Error(prevStation.id + ' is not among the passed stations')
		}
		if (!findPassed(nextStation.id)) {
			throw new Error(nextStation.id + ' is not among the passed stations')
		}

		const track = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				// todo: flatten leg.polyline to just `Point`s
				coordinates: leg.polyline.features.map(f => f.geometry.coordinates)
			}
		}

		const slice = lineSlice([
			prevStation.location.longitude,
			prevStation.location.latitude
		], [
			nextStation.location.longitude,
			nextStation.location.latitude
		], track)
		return slice && slice.geometry
	})
}

module.exports = fetchTrackSlice
