import { filter } from '../util';

import { GROUP_DELETE_START, GROUP_DELETE_ERROR } from '../groups/reducers';

import {
	TRACK_POST_START, TRACK_POST_ERROR, TRACK_POST_CANCEL,
	TRACK_DELETE_START, TRACK_DELETE_ERROR
} from '../tracks/reducers';

/**
 * Keeps count of the available track credit for the user
 * @param  {Object} state   The current state (Redux store)
 * @param  {Object} action  Redux action
 * @return {Object}         New state with updated profile
 */
export default function profileReducer (state={}, action) {
	const { tracks, profile } = state
	let credit = profile.trackCredit;
	let groupId;

	switch (action.type) {

	case GROUP_DELETE_ERROR:
		groupId = action.payload.id;
		credit -= filter(tracks, 'group', groupId).length;
		break;

	case GROUP_DELETE_START:
		groupId = action.payload.id;
		credit += filter(tracks, 'group', groupId).length;
		break;

	case TRACK_POST_START:
	case TRACK_DELETE_ERROR:
		credit -= 1; break;

	case TRACK_DELETE_START:
	case TRACK_POST_ERROR:
	case TRACK_POST_CANCEL:
		credit += 1; break;

	default:
		return state;
	}

	return {
		...state,
		profile: {
			...profile,
			trackCredit: credit
		}
	}
}
