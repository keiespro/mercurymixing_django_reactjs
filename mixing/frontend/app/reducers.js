
const ACTIONS = {
	ADD_TODO: ({ todos, ...state }, { text }) => ({
		todos: [...todos, {
			id: Math.random().toString(36).substring(2),
			text
		}],
		...state
	}),

	REMOVE_TODO: ({ todos, ...state }, { todo }) => ({
		todos: todos.filter( i => i!==todo ),
		...state
	})
};

export default (state, action) => {
	if (action && ACTIONS[action.type]) {
		return ACTIONS[action.type](state, action)
	}
	return state;
}
