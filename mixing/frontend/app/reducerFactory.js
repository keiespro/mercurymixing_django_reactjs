/**
 * POST request 'start' reducer.
 * Inserts an object in the state and marks it as 'posting'.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (store) to be updated
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  Contains all the data for the newly appended object.
 *                                  Must implement a 'key' property to keep track of the
 *                                  object on other reducers.
 * @param  {request} action.xhr     The XmlHttpRequest that initiated the action
 * @return {Object}                 The resulting state with the inserted object
 */
export function onPostStart(stateKey, state, action) {
	const { payload, xhr } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: [...instances, {
			...payload,
			xhr,
			posting: true,
			progress: 0
		}]
	}
}

/**
 * POST request 'success' reducer.
 * Updates an object in the state with a successful server response.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (Redux store)
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  See onPostStart for description
 * @param  {Object} action.response The JSON response from the server
 * @return {Object}                 The resulting state with the updated object
 */
export function onPostSuccess(stateKey, state, action) {
	const { payload, response } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: instances.map(instance => {
			if (instance.key === payload.key) return {
				...instance,
				...response,
				posting: false,
				progress: 1
			};
			return instance;
		})
	}
}

/**
 * POST, PUT, and DELETE request 'error' reducer.
 * Updates an object in the state with the error response from the server.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (Redux store)
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  See onPostStart for description
 * @param  {Object} action.response The JSON response from the server
 * @return {Object}                 The resulting state with the updated object
 */
export function onPostError(stateKey, state, action) {
	const { payload, response } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: instances.map(instance => {
			if (instance.key === payload.key) return {
				...instance,
				error: true,
				errorResponse: response
			};
			return instance;
		})
	}
}

/**
 * POST, PUT, and DELETE request 'progress' reducer.
 * Updates an object in the state with the current request progress.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (Redux store)
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  See onPostStart for description
 * @param  {Object} action.event    The progress event returned by XmlHttpRequest
 * @return {Object}                 The resulting state with the updated object
 */
export function onPostProgress(stateKey, state, action) {
	const { payload, event } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: instances.map(instance => {
			if (instance.key === payload.key) {
				let progress = null;
				if (event.lengthComputable) progress = event.loaded / event.total;
				return {...instance, progress}
			}
			return instance;
		})
	}
}

/**
 * POST, PUT, and DELETE request 'cancel' reducer.
 * Updates an object in the state by marking it as 'canceled'.
 * The reducer DOES NOT cancel the request. That's the job of the action creator.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (Redux store)
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  See onPostStart for description
 * @return {Object}                 The resulting state with the updated object
 */
export function onPostCancel(stateKey, state, action) {
	const { payload } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: instances.map(instance => {
			if (instance.key === payload.key) return {
				...instance,
				canceled: true
			};
			return instance;
		})
	}
}

/**
 * DELETE request 'start' reducer.
 * Updates an object in the state by marking it as 'deleting'.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (Redux store)
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  See onPostStart for description
 * @param  {request} action.xhr     The XmlHttpRequest that initiated the action
 * @return {Object}                 The resulting state with the updated object
 */
export function onDeleteStart(stateKey, state, action) {
	const { payload, xhr } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: instances.map(instance => {
			if (instance.key === payload.key) return {
				...instance,
				xhr,
				deleting: true,
				progress: 0
			};
			return instance;
		})
	}
}

/**
 * DELETE request 'success' reducer.
 * Drops an object from the state.
 * @param  {string} stateKey        Name of the collection to be modified
 * @param  {Object} state           State object (Redux store)
 * @param  {Object} action          Redux style action
 * @param  {Object} action.payload  See onPostStart for description
 * @return {Object}                 The resulting state without the dropped object
 */
export function onDeleteSuccess(stateKey, state, action) {
	const { payload } = action;
	const instances = state[stateKey];
	return {
		...state,
		[stateKey]: instances.filter(instance => instance.key !== payload.key)
	}
}

/**
 * Reducer factory for REST API workflows.
 * Generates an object with a list of prefixed reducers.
 * The output of this function is suitable for Redux's `combineReducers`.
 * @param  {string} stateKey Name of the collection to be modified by all reducers
 * @param  {string} PREFIX   Will be assigned to all resulting reducers
 * @return {Object}          Dictionary of prefixed reducers
 */
export default function reducerFactory(stateKey, PREFIX) {
	return {
		// POST
		[`${PREFIX}_POST_START`]: function postStartReducer(state, action) {
			return onPostStart(stateKey, state, action)
		},

		[`${PREFIX}_POST_SUCCESS`]: function postSuccessReducer(state, action) {
			return onPostSuccess(stateKey, state, action)
		},

		[`${PREFIX}_POST_ERROR`]: function postErrorReducer(state, action) {
			return onPostError(stateKey, state, action)
		},

		[`${PREFIX}_POST_PROGRESS`]: function postProgressReducer(state, action) {
			return onPostProgress(stateKey, state, action)
		},

		[`${PREFIX}_POST_CANCEL`]: function postCancelReducer(state, action) {
			return onPostCancel(stateKey, state, action)
		},

		// DELETE
		[`${PREFIX}_DELETE_START`]: function deleteStartReducer(state, action) {
			return onDeleteStart(stateKey, state, action)
		},

		[`${PREFIX}_DELETE_SUCCESS`]: function deleteSuccessReducer(state, action) {
			return onDeleteSuccess(stateKey, state, action)
		},

		[`${PREFIX}_DELETE_ERROR`]: function deleteErrorReducer(state, action) {
			return onPostError(stateKey, state, action)
		},

		[`${PREFIX}_DELETE_PROGRESS`]: function deleteProgressReducer(state, action) {
			return onPostProgress(stateKey, state, action)
		},

		[`${PREFIX}_DELETE_CANCEL`]: function deleteCancelReducer(state, action) {
			return onPostCancel(stateKey, state, action)
		},
	}
}

window.factory = reducerFactory;
