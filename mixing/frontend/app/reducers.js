import project from './project/reducers';

const ACTIONS = {
	...project
};

export default function rootReducer(state, action) {
	if (action && ACTIONS[action.type]) {
		return ACTIONS[action.type](state, action)
	}
	return state;
}
