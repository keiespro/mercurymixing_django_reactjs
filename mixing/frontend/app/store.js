import { createStore } from 'redux';
import rootReducer from './reducers';

const INITIAL = {
	todos: []
};

const ENHANCERS = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default createStore(rootReducer, INITIAL, ENHANCERS);
