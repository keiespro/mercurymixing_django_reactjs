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

// http://stackoverflow.com/a/14919494
export function fileSize(bytes) {
	const thresh = 1000;
	const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
	let u = -1;

	if (Math.abs(bytes) < thresh) return `${bytes} B`;

	do {
		bytes /= thresh;
		++u;
	} while (Math.abs(bytes) >= thresh && u < units.length - 1);

	return `${bytes.toFixed(1)} ${units[u]}`;
}
