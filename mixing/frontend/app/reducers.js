import songs from './songs/reducers';

const ACTIONS = {
	...songs
};

export default function rootReducer(state, action) {
	if (action && ACTIONS[action.type]) {
		return ACTIONS[action.type](state, action)
	}
	return state;
}
