import songs from './songs/reducers';
import groups from './groups/reducers';

const ACTIONS = {
	...songs,
	...groups
};

export default function rootReducer(state, action) {
	if (action && ACTIONS[action.type]) {
		return ACTIONS[action.type](state, action)
	}
	return state;
}
