import reducerFactory from '../reducerFactory';

export const TRACK_POST_START = 'TRACK_POST_START';
export const TRACK_POST_SUCCESS = 'TRACK_POST_SUCCESS';
export const TRACK_POST_ERROR = 'TRACK_POST_ERROR';
export const TRACK_POST_PROGRESS = 'TRACK_POST_PROGRESS';
export const TRACK_POST_CANCEL = 'TRACK_POST_CANCEL';

export const TRACK_DELETE_START = 'TRACK_DELETE_START';
export const TRACK_DELETE_SUCCESS = 'TRACK_DELETE_SUCCESS';
export const TRACK_DELETE_ERROR = 'TRACK_DELETE_ERROR';

/**
 * Keeps count of the available track credit for the user
 * Bind to the 'profile' key when composing with `combineReducers`
 * @param  {Object} profile The current profile in the state
 * @param  {Object} action  Redux action
 * @return {Object}         New profile state
 */
export const profileReducer = (profile={}, action) => {
	switch (action.type) {

	case TRACK_POST_START:
	case TRACK_DELETE_ERROR:
		return {...profile, trackCredit: profile.trackCredit - 1};

	case TRACK_DELETE_START:
	case TRACK_POST_ERROR:
	case TRACK_POST_CANCEL:
		return {...profile, trackCredit: profile.trackCredit + 1};

	default:
		return profile;
	}
}

export default reducerFactory('TRACK');
