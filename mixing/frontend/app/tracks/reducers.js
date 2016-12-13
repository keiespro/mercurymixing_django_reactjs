export const ADD_TRACK = 'ADD_TRACK';
export const ADD_TRACK_SUCCESS = 'ADD_TRACK_SUCCESS';
export const ADD_TRACK_FAIL = 'ADD_TRACK_FAIL';

export const REMOVE_TRACK = 'REMOVE_TRACK';
export const REMOVE_TRACK_SUCCESS = 'REMOVE_TRACK_SUCCESS';
export const REMOVE_TRACK_FAIL = 'REMOVE_TRACK_FAIL';

const ACTIONS = {
	[ADD_TRACK]: ({ tracks, ...state }, { obj }) => ({
		tracks: [...tracks, obj],
		...state
	}),

	[ADD_TRACK_FAIL]: ({ tracks, ...state }, { obj, response }) => ({
		tracks: tracks.filter(t => t.id !== obj.id),
		...state
	}),

	[ADD_TRACK_SUCCESS]: ({ tracks, ...state }, { obj, response }) => {
		const newTracks = tracks.filter(t => t.id !== obj.id);
		return {
			tracks: [...newTracks, response],
			...state
		}
	},

	[REMOVE_TRACK]: (state, { obj }) => state,

	[REMOVE_TRACK_FAIL]: (state, { obj, response }) => state,

	[REMOVE_TRACK_SUCCESS]: ({ tracks, ...state }, { obj, response }) => ({
		tracks: tracks.filter(t => t.id !== obj.id),
		...state
	})
};

export default ACTIONS;
