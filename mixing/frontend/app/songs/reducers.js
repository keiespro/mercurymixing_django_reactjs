export const ADD_SONG = 'ADD_SONG';
export const ADD_SONG_SUCCESS = 'ADD_SONG_SUCCESS';
export const ADD_SONG_FAIL = 'ADD_SONG_FAIL';

export const REMOVE_SONG = 'REMOVE_SONG';
export const REMOVE_SONG_SUCCESS = 'REMOVE_SONG_SUCCESS';
export const REMOVE_SONG_FAIL = 'REMOVE_SONG_FAIL';

const ACTIONS = {
	[ADD_SONG]: (state, { obj }) => state,

	[ADD_SONG_FAIL]: (state, { obj, response }) => state,

	[ADD_SONG_SUCCESS]: ({ songs, ...state }, { obj, response }) => ({
		songs: [...songs, response],
		...state
	}),

	[REMOVE_SONG]: (state, { obj }) => state,

	[REMOVE_SONG_FAIL]: (state, { obj, response }) => state,

	[REMOVE_SONG_SUCCESS]: ({ songs, groups, ...state }, { obj, response }) => ({
		songs: songs.filter(s => s.id !== obj.id),
		groups: groups.filter(g => g.song !== obj.id),
		...state
	})
};

export default ACTIONS;
