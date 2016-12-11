import { createStore } from 'redux';
import rootReducer from './reducers';

const INITIAL = {
	todos: []
};

export default createStore(rootReducer, INITIAL, window.devToolsExtension && window.devToolsExtension());
