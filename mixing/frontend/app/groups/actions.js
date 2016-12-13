import api from '../api';

import {
	ADD_GROUP, ADD_GROUP_SUCCESS, ADD_GROUP_FAIL,
	REMOVE_GROUP, REMOVE_GROUP_SUCCESS, REMOVE_GROUP_FAIL
} from './reducers';

export function addGroup(title, song) {
	const group = {
		song: song.id,
		title
	}
	return api('groups')
		.post(group, ADD_GROUP, ADD_GROUP_SUCCESS, ADD_GROUP_FAIL);
}

export function removeGroup(group) {
	return api(`groups/${group.id}`)
		.delete(group, REMOVE_GROUP, REMOVE_GROUP_SUCCESS, REMOVE_GROUP_FAIL);
}
