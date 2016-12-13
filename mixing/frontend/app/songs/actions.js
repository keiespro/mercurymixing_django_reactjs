import api from '../api';

import {
	ADD_SONG, ADD_SONG_SUCCESS, ADD_SONG_FAIL
} from './reducers';

export function addSong(title) {
	return (dispatch, getState) => {

		const payload = {
			project: getState().project.id,
			title
		}

		dispatch({type: ADD_SONG, payload});

		api('songs/').post(payload)
			.then(response => dispatch({type: ADD_SONG_SUCCESS, response}))
			.catch(error => dispatch({type: ADD_SONG_FAIL, payload, error}))
	}
}
