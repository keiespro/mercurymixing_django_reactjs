import { h } from 'preact';
import { bindActionCreators } from 'redux';

/**
 * Map state to props.
 * Picks state collections to be injected as props.
 * Can be used as the first argument of Redux's connect()
 * @param  {...[string]} keys The name of the state collections to be mapped to props
 * @return {function}         Function to be consumed by connect()
 */
export function stateToProps(...keys) {
	return state => {
		const props = {};
		keys.forEach(key => props[key] = state[key]);
		return props;
	};
}

/**
 * Bind action creators to dispatch
 * Allows dispatching actions just by calling the action creator
 * Can be used as the second argument of Redux's connect()
 * @param  {function} actions Action creators that should be bound to dispatch
 * @return {function}         Function to be consumed by connect()
 */
export function bindActions(actions) {
	return dispatch => ({
		...bindActionCreators(actions, dispatch)
	});
}

/**
 * Return a human-readable file size
 * @param  {Number} bytes File size in bytes
 * @return {string}       Human-readable file size with units
 * {@link http://stackoverflow.com/a/14919494}
 */
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

/**
 * Creates a class name based on the current request status
 * @param  {Object} obj.request A dictionary with the current request status
 * @param  {string} base        The base class name that will be extended
 * @return {string}             The resulting class based on the request status
 */
export function getClassName (obj, base) {
	if (!obj.request) return base || '';
	const classes = [base];
	['posting', 'deleting', 'canceled', 'error'].forEach(state => {
		if (obj.request[state]) classes.push(state);
	});
	return classes.join(' ');
}

/**
 * Returns a string with a status message regarding the current request
 * @param  {Object} obj.request A dictionary with the current request status
 * @return {string}             The resulting message based on the request status
 */
export function getStatus (obj) {
	if (!obj.request) return null;
	if (obj.request.error) return 'An error occurred';
	if (obj.request.canceled) return 'Canceled';
	if (obj.request.deleting) return 'Deleting...';
	if (obj.request.posting) return 'Creating...';
	return null;
}

/**
 * Conditionally renders a delete button to fire a delete
 * @param  {Object} obj          The obj that will be removed when the button is clicked
 * @param  {Object} obj.request  A dictionary with the current request status
 * @param  {function} removeFunc A function that will dispath the remove action
 * @return {jsx}                 The button that will fire the remove action
 */
export function deleteButton (obj, removeFunc) {
	const { request } = obj;
	if (typeof request !== 'undefined') {
		if (request.canceled || request.error || request.deleting) return null;
	}
	return (
		<button className="delete" onClick={() => removeFunc(obj)}>
			<span>Delete</span>
		</button>
	)
}
