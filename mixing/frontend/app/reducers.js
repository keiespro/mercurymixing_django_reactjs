import songs from './songs/reducers';
import groups from './groups/reducers';
import tracks from './tracks/reducers';

const ACTIONS = {
	...songs,
	...groups,
	...tracks
};

export default function rootReducer(state, action) {
	if (action && ACTIONS[action.type]) {
		return ACTIONS[action.type](state, action)
	}
	return state;
}
