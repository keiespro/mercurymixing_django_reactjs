import { createStore } from 'redux';
import rootReducer from './reducers';

const EMPTY = {
	project: {},
	songs: [],
	groups: [],
	tracks: []
};

// window.initialState is populated by Django in mixing/project_detail.html
const INITIAL = window.initialState || EMPTY;

const ENHANCERS = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default createStore(rootReducer, INITIAL, ENHANCERS);
