import api from '../api';

import {
	ADD_SONG, ADD_SONG_SUCCESS, ADD_SONG_FAIL,
	REMOVE_SONG, REMOVE_SONG_SUCCESS, REMOVE_SONG_FAIL
} from './reducers';

export function addSong(title, project) {
	const song = {
		project: project.id,
		title
	}
	return api('songs')
		.post(song, ADD_SONG, ADD_SONG_SUCCESS, ADD_SONG_FAIL)
}

export function removeSong(song) {
	return api(`songs/${song.id}`)
		.delete(song, REMOVE_SONG, REMOVE_SONG_SUCCESS, REMOVE_SONG_FAIL)
}
