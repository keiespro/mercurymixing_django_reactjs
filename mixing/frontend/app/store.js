import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { getKey } from './api';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const ENHANCERS = composeEnhancers(applyMiddleware(thunk))

const EMPTY = {
	project: {},
	songs: [],
	groups: [],
	tracks: []
};

// window.initialState is populated by Django in mixing/project_detail.html
const INITIAL = window.initialState || EMPTY;

// All initial elements should have a 'key' property to keep track of them in the UI
// Yes, we're mutating the initial state because we havent initialized the store yet
['songs', 'groups', 'tracks'].forEach(key => {
	INITIAL[key] = INITIAL[key].map(obj => {
		if (!('key' in obj)) obj.key = getKey();
		return obj;
	});
});

export default function configureStore() {
	const store = createStore(rootReducer, INITIAL, ENHANCERS);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextRootReducer = require('./reducers').default;
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}
