import { bindActionCreators } from 'redux';

export function stateToProps(...keys) {
	return state => {
		const props = {};
		keys.forEach(key => props[key] = state[key]);
		return props;
	};
}

export function bindActions(actions) {
	return dispatch => ({
		...bindActionCreators(actions, dispatch)
	});
}
