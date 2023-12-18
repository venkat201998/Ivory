export const usersReducer = (state = null, action) => {
	switch (action.type) {
		case "REGISTERED_USERS":
			return action.payload;
		case "LOGOUT":
			return action.payload;
		default:
			return state;
	}
};
