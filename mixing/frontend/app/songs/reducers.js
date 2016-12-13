export const ADD_SONG = 'ADD_SONG';
export const ADD_SONG_SUCCESS = 'ADD_SONG_SUCCESS';
export const ADD_SONG_FAIL = 'ADD_SONG_FAIL';

const ACTIONS = {
	[ADD_SONG]: (state, { payload }) => state,

	[ADD_SONG_FAIL]: (state, { payload, error }) => state,

	[ADD_SONG_SUCCESS]: ({ songs, ...state }, { response }) => ({
		songs: [...songs, response],
		...state
	})
};

export default ACTIONS;
