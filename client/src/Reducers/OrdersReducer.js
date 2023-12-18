export const ordersReducer = (state = null, action) => {
	switch (action.type) {
		case "ACTIVE_ORDERS":
			return action.payload;
		case "LOGOUT":
			return action.payload;
		default:
			return state;
	}
};
