import api from '../api';

import {
	ADD_GROUP, ADD_GROUP_SUCCESS, ADD_GROUP_FAIL,
	REMOVE_GROUP, REMOVE_GROUP_SUCCESS, REMOVE_GROUP_FAIL
} from './reducers';

export function addGroup(title, song) {
	return (dispatch, getState) => {

		const payload = {
			title,
			song
		}

		dispatch({type: ADD_GROUP, payload});

		api('groups/').post(payload)
			.then(response => dispatch({type: ADD_GROUP_SUCCESS, response}))
			.catch(error => dispatch({type: ADD_GROUP_FAIL, payload, error}))
	}
}

export function removeGroup(group) {
	return (dispatch, getState) => {
		dispatch({type: REMOVE_GROUP, group});

		api(`groups/${group.id}/`).delete()
			.then(response => dispatch({type: REMOVE_GROUP_SUCCESS, group}))
			.catch(error => dispatch({type: REMOVE_GROUP_FAIL, group, error}))
	}
}
