import Cookies from 'js-cookie';

export function getKey() {
	return Math.random().toString(36).substring(2);
}

const apiBase = '/api/';

/**
 * Private API client based on XMLHttpRequest.
 * Dispatches Redux actions before and after the request.
 *
 * @param  {string} url        API endpoint URL
 * @param  {string} method     GET, POST, DELETE, etc...
 * @param  {Object} payload    Payload for the server and Redux actions
 * @param  {function} dispatch Redux's `dispatch` function
 * @param  {string} [START]    Action to be dispatched before the request
 * @param  {string} [SUCCESS]  Action to be dispatched if the request succeeds
 * @param  {string} [ERROR]    Action to be dispatched if the request fails
 * @param  {string} [PROGRESS] Action to be dispatched on xhr progress
 *
 * The START reducer will receive `payload` and `xhr` as payload . `xhr` will be the
 * ongoing XMLHttpRequest.
 *
 * The SUCCESS and ERROR reducers will receive: `payload` and `response` as action args.
 * `response` will be the server response parsed as JSON.
 *
 * The PROGRESS reducer will receive `payload` and `event` as action args. `event` will
 * be the progressEvent triggered by the request.
 */
function _api(url, method, payload, dispatch, START, SUCCESS, ERROR, PROGRESS) {
	const data = new FormData();
	const xhr = new XMLHttpRequest();

	// Create a key for tracking this element in the UI (if not present already)
	if (!('key' in payload)) payload.key = getKey();

	// Create payload
	Object.keys(payload).forEach(key => data.append(key, payload[key]));

	// Remove leading slashes from the url
	if (url.indexOf('/') === 0) url = url.slice(1);

	// Prepend the base API url to all requests
	url = apiBase + url;

	// Make sure urls always have a trailing slash (required by Django)
	if (url.lastIndexOf('/') !== url.length - 1) url += '/';

	// Prepare the request. Tested against Django Rest Framework
	xhr.open(method, url, true);
	xhr.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
	xhr.setRequestHeader('Accept', 'application/json');

	// Async load handler. Determines if response was successful or failed.
	xhr.onload = function apiLoad() {
		const response = JSON.parse(xhr.responseText || null);
		if (xhr.status >= 200 && xhr.status < 300) {
			if (SUCCESS) dispatch({type: SUCCESS, payload, response});
		} else {
			if (ERROR) dispatch({type: ERROR, payload, response});
		}
	};

	// Async error handler (connection error)
	if (ERROR) xhr.onerror = function apiError() {
		const response = {details: 'Connection error'};
		dispatch({type: ERROR, payload, response});
	};

	// Async progress handler (optional)
	if (PROGRESS) xhr.upload.onprogress = function apiProgress(event) {
		dispatch({type: PROGRESS, payload, event});
	}

	// Dispatch the pre-request action
	if (START) dispatch({type: START, payload, xhr});

	// Send the request to the server
	xhr.send(data);
}

/**
 * Public API client.
 * Provides a set of convenience methods to perform requests.
 * Each method returns a thunk compatible with redux-thunk middleware.
 * @param  {string} url API endpoint URL
 * @return {Object}     Collection of request methods to be executed on the endpoint.
 */
export default function api(url) {
	return {
		// ...actions corresponds to all Redux actions accepted by _api()
		get: function apiGet(payload, ...actions) {
			if (!payload) payload = {};
			return dispatch => _api(url, 'GET', payload, dispatch, ...actions)
		},

		patch: function apiPatch(payload, ...actions) {
			return dispatch => _api(url, 'PATCH', payload, dispatch, ...actions)
		},

		post: function apiPost(payload, ...actions) {
			return dispatch => _api(url, 'POST', payload, dispatch, ...actions)
		},

		put: function apiPut(payload, ...actions) {
			return dispatch => _api(url, 'PUT', payload, dispatch, ...actions)
		},

		delete: function apiDelete(payload, ...actions) {
			return dispatch => _api(url, 'DELETE', payload, dispatch, ...actions)
		}
	}
}

