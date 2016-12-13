import api from '../api';
import { getId } from '../util';

import {
	ADD_TRACK, ADD_TRACK_SUCCESS, ADD_TRACK_FAIL,
	REMOVE_TRACK, REMOVE_TRACK_SUCCESS, REMOVE_TRACK_FAIL
} from './reducers';

export function addTrack(file, group) {
	const track = {
		id: getId(),
		uploading: true,
		group: group.id,
		file
	}
	return api('tracks')
		.post(track, ADD_TRACK, ADD_TRACK_SUCCESS, ADD_TRACK_FAIL);
}

export function removeTrack(track) {
	return api(`tracks/${track.id}`)
		.delete(track, REMOVE_TRACK, REMOVE_TRACK_SUCCESS, REMOVE_TRACK_FAIL);
}
