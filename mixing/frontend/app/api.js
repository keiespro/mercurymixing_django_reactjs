import Cookies from 'js-cookie';

const apiBase = '/api/';

/**
 * Private API client based on XMLHttpRequest.
 * Dispatches Redux actions before and after the request.
 *
 * @param  {string} url        API endpoint URL
 * @param  {string} method     GET, POST, DELETE, etc...
 * @param  {Object} obj        Payload for the server and Redux actions
 * @param  {function} dispatch Redux's `dispatch` function
 * @param  {string} ACTION     Action to be dispatched before the request
 * @param  {string} SUCCESS    Action to be dispatched if the request succeeds
 * @param  {string} FAIL       Action to be dispatched if the request fails
 *
 * The ACTION reducer will receive `obj` and `xhr` as payload . `xhr` will be the ongoing
 * XMLHttpRequest.
 *
 * The SUCCESS and FAIL reducers will receive: `obj` and `response` as payload.
 * `response` will be the server response parsed as JSON.
 */
function _api(url, method, obj, dispatch, ACTION, SUCCESS, FAIL) {
	const data = new FormData();
	const xhr = new XMLHttpRequest();

	// Create payload
	Object.keys(obj).forEach(key => data.append(key, obj[key]));

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
			dispatch({type: SUCCESS, obj, response });
		} else {
			dispatch({type: FAIL, obj, response});
		}
	};

	// Async error handler (connection error).
	xhr.onerror = function apiError() {
		const response = {details: 'Connection error'};
		dispatch({type: FAIL, obj, response});
	};

	// Dispatch the pre-request action
	dispatch({type: ACTION, obj, xhr});

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
		get: function(obj, ACTION, SUCCESS, FAIL) {
			if (!obj) obj = {};
			return dispatch => _api(url, 'GET', obj, dispatch, ACTION, SUCCESS, FAIL)
		},

		patch: function(obj, ACTION, SUCCESS, FAIL) {
			return dispatch => _api(url, 'PATCH', obj, dispatch, ACTION, SUCCESS, FAIL)
		},

		post: function(obj, ACTION, SUCCESS, FAIL) {
			return dispatch => _api(url, 'POST', obj, dispatch, ACTION, SUCCESS, FAIL)
		},

		put: function(obj, ACTION, SUCCESS, FAIL) {
			return dispatch => _api(url, 'PUT', obj, dispatch, ACTION, SUCCESS, FAIL)
		},

		delete: function(obj, ACTION, SUCCESS, FAIL) {
			return dispatch => _api(url, 'DELETE', obj, dispatch, ACTION, SUCCESS, FAIL)
		}
	}
}

