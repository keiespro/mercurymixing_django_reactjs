import api from '../api';
import { getId } from '../util';

import {
	ADD_TRACK, ADD_TRACK_PROGRESS, ADD_TRACK_CANCEL, ADD_TRACK_SUCCESS, ADD_TRACK_FAIL,
	REMOVE_TRACK, REMOVE_TRACK_SUCCESS, REMOVE_TRACK_FAIL
} from './reducers';

const ADD_ACTIONS = [
	ADD_TRACK, ADD_TRACK_SUCCESS, ADD_TRACK_FAIL, ADD_TRACK_PROGRESS
]

const REMOVE_ACTIONS = [
	REMOVE_TRACK, REMOVE_TRACK_SUCCESS, REMOVE_TRACK_FAIL
]

export function addTrack(file, group) {
	const track = {
		key: getId(),
		group: group.id,
		file
	}
	return api('tracks').post(track, ...ADD_ACTIONS);
}

export function cancelTrack(track) {
	track.xhr.abort();
	return {type: ADD_TRACK_CANCEL, obj: track}
}

export function removeTrack(track) {
	return api(`tracks/${track.id}`).delete(track, ...REMOVE_ACTIONS);
}
