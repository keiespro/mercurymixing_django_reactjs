/**
 * POST request 'start' reducer.
 * Inserts an object in the state and attaches the request information.
 * @param  {string} collection     Name of the collection to be modified
 * @param  {Object} state          State object (store) to be updated
 * @param  {Object} action         Redux style action
 * @param  {Object} action.payload Contains all the data for the newly inserted object
 * @param  {string} action.key     Unique identifier to keep track of the object in the
 *                                 store when other reducers run.
 * @return {Object}                Resulting state with the inserted object
 */
export function onPostStart(collection, state, action) {
	const { key, payload } = action;
	const instances = state[collection];
	const request = {posting: true, progress: 0};
	return {
		...state,
		[collection]: [...instances, {...payload, key, request}]
	}
}

/**
 * POST request 'success' reducer.
 * Updates an object in the state with the data received from the server.
 * @see    onPostStart
 * @param  {Object} action.key      Unique identifier that was passed to onPostStart
 * @param  {Object} action.response JSON response from the server
 * @return {Object}                 Resulting state with the updated object
 */
export function onPostSuccess(collection, state, action) {
	const { key, response } = action;
	const instances = state[collection];
	return {
		...state,
		[collection]: instances.map(instance => {
			if (instance.key === key) return {
				...instance,
				...response,
				request: {...instance.request, posting: false, progress: 1}
			};
			return instance;
		})
	}
}

/**
 * POST, PUT, and DELETE request 'error' reducer.
 * Updates an object in the state with the error response from the server.
 * @see    onPostStart
 * @param  {Object} action.key      Unique identifier that was passed to *Start
 * @param  {Object} action.response JSON error response from the server
 * @return {Object}                 Resulting state with the object marked with 'error'
 *                                  and the server's 'errorResponse' attached
 */
export function onPostError(collection, state, action) {
	const { key, response } = action;
	const instances = state[collection];
	return {
		...state,
		[collection]: instances.map(instance => {
			if (instance.key === key) return {
				...instance,
				request: {...instance.request, error: true, errorResponse: response}
			};
			return instance;
		})
	}
}

/**
 * POST, PUT, and DELETE request 'progress' reducer.
 * Updates an object in the state with the current request progress.
 * {@link https://developer.mozilla.org/en/docs/Web/API/ProgressEvent}
 * @see    onPostStart
 * @param  {Object} action.key      Unique identifier that was passed to *Start
 * @param  {Object} action.event    Object that implements the ProgressEvent interface
 * @return {Object}                 Resulting state with the updated progress
 */
export function onPostProgress(collection, state, action) {
	const { key, event } = action;
	const instances = state[collection];
	return {
		...state,
		[collection]: instances.map(instance => {
			if (instance.key === key) {
				let progress = null;
				if (event.lengthComputable) progress = event.loaded / event.total;
				return {...instance, request: {...instance.request, progress}}
			}
			return instance;
		})
	}
}

/**
 * POST, PUT, and DELETE request 'cancel' reducer.
 * Updates an object in the state by marking it as 'canceled'.
 * The reducer DOES NOT cancel the request. That's the job of the action creator.
 * @see    onPostStart
 * @param  {Object} action.key      Unique identifier that was passed to *Start
 * @return {Object}                 The resulting state with the updated object
 */
export function onPostCancel(collection, state, action) {
	const { key } = action;
	const instances = state[collection];
	return {
		...state,
		[collection]: instances.map(instance => {
			if (instance.key === key) return {
				...instance,
				request: {...instance.request, canceled: true}
			};
			return instance;
		})
	}
}

/**
 * DELETE request 'start' reducer.
 * Updates an object in the state by marking it as 'deleting'.
 * @see    onPostStart
 * @param  {Object} action.key  See onPostStart for description
 * @param  {string} action.key      See onPostStart for description
 * @return {Object}                 The resulting state with the updated object
 */
export function onDeleteStart(collection, state, action) {
	const { key } = action;
	const instances = state[collection];
	return {
		...state,
		[collection]: instances.map(instance => {
			if (instance.key === key) return {
				...instance,
				request: {...instance.request, deleting: true, progress: 0}
			};
			return instance;
		})
	}
}

/**
 * DELETE request 'success' reducer.
 * Drops an object from the state.
 * @see    onPostStart
 * @param  {Object} action.key  See onPostStart for description
 * @return {Object}                 The resulting state without the dropped object
 */
export function onDeleteSuccess(collection, state, action) {
	const { key } = action;
	const instances = state[collection];
	return {
		...state,
		[collection]: instances.filter(instance => instance.key !== key)
	}
}

/**
 * Reducer factory for REST API workflows.
 * Generates an object with a list of prefixed reducers.
 * The output of this function is suitable for Redux's `combineReducers`.
 * @param  {string} collection Name of the collection to be modified by all reducers
 * @param  {string} PREFIX   Will be assigned to all resulting reducers
 * @return {Object}          Dictionary of prefixed reducers
 */
export default function reducerFactory(collection, PREFIX) {
	return {
		// POST
		[`${PREFIX}_POST_START`]: function postStartReducer(state, action) {
			return onPostStart(collection, state, action)
		},

		[`${PREFIX}_POST_SUCCESS`]: function postSuccessReducer(state, action) {
			return onPostSuccess(collection, state, action)
		},

		[`${PREFIX}_POST_ERROR`]: function postErrorReducer(state, action) {
			return onPostError(collection, state, action)
		},

		[`${PREFIX}_POST_PROGRESS`]: function postProgressReducer(state, action) {
			return onPostProgress(collection, state, action)
		},

		[`${PREFIX}_POST_CANCEL`]: function postCancelReducer(state, action) {
			return onPostCancel(collection, state, action)
		},

		// DELETE
		[`${PREFIX}_DELETE_START`]: function deleteStartReducer(state, action) {
			return onDeleteStart(collection, state, action)
		},

		[`${PREFIX}_DELETE_SUCCESS`]: function deleteSuccessReducer(state, action) {
			return onDeleteSuccess(collection, state, action)
		},

		[`${PREFIX}_DELETE_ERROR`]: function deleteErrorReducer(state, action) {
			return onPostError(collection, state, action)
		},

		[`${PREFIX}_DELETE_PROGRESS`]: function deleteProgressReducer(state, action) {
			return onPostProgress(collection, state, action)
		},

		[`${PREFIX}_DELETE_CANCEL`]: function deleteCancelReducer(state, action) {
			return onPostCancel(collection, state, action)
		},
	}
}

window.factory = reducerFactory;
