export const ADD_SONG = 'ADD_SONG';
export const ADD_SONG_SUCCESS = 'ADD_SONG_SUCCESS';
export const ADD_SONG_FAIL = 'ADD_SONG_FAIL';

export const REMOVE_SONG = 'REMOVE_SONG';
export const REMOVE_SONG_SUCCESS = 'REMOVE_SONG_SUCCESS';
export const REMOVE_SONG_FAIL = 'REMOVE_SONG_FAIL';

const ACTIONS = {
	[ADD_SONG]: (state, { payload }) => state,

	[ADD_SONG_FAIL]: (state, { payload, error }) => state,

	[ADD_SONG_SUCCESS]: ({ songs, ...state }, { response }) => ({
		songs: [...songs, response],
		...state
	}),

	[REMOVE_SONG]: (state, { song }) => state,

	[REMOVE_SONG_FAIL]: (state, { song, error }) => state,

	[REMOVE_SONG_SUCCESS]: ({ songs, groups, ...state }, { song }) => ({
		songs: songs.filter(s => s.id !== song.id),
		groups: groups.filter(g => g.song !== song.id),
		...state
	})
};

export default ACTIONS;
