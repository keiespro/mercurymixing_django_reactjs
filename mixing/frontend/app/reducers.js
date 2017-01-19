import { combineReducers } from 'redux';

import songs from './songs/reducers';
import groups from './groups/reducers';
import tracks from './tracks/reducers';

const dummyReducer = (state={}, action) => state;

export default combineReducers({
	songs,
	groups,
	tracks,
	project: dummyReducer
});
