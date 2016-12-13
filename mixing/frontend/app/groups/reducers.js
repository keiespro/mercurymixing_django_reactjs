export const ADD_GROUP = 'ADD_GROUP';
export const ADD_GROUP_SUCCESS = 'ADD_GROUP_SUCCESS';
export const ADD_GROUP_FAIL = 'ADD_GROUP_FAIL';

export const REMOVE_GROUP = 'REMOVE_GROUP';
export const REMOVE_GROUP_SUCCESS = 'REMOVE_GROUP_SUCCESS';
export const REMOVE_GROUP_FAIL = 'REMOVE_GROUP_FAIL';

const ACTIONS = {
	[ADD_GROUP]: (state, { obj }) => state,

	[ADD_GROUP_FAIL]: (state, { obj, response }) => state,

	[ADD_GROUP_SUCCESS]: ({ groups, ...state }, { obj, response }) => ({
		groups: [...groups, response],
		...state
	}),

	[REMOVE_GROUP]: (state, { group }) => state,

	[REMOVE_GROUP_FAIL]: (state, { obj, response }) => state,

	[REMOVE_GROUP_SUCCESS]: ({ groups, ...state }, { obj, response }) => ({
		groups: groups.filter(g => g.id !== obj.id),
		...state
	})
};

export default ACTIONS;
