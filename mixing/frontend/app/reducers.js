import { combineReducers } from 'redux';

import groups from './groups/reducers';
import songs from './songs/reducers';
import { default as tracks, profileReducer } from './tracks/reducers';

const dummyReducer = (state={}, action) => state;

export default combineReducers({
	songs,
	groups,
	tracks,
	profile: profileReducer,
	project: dummyReducer
});
