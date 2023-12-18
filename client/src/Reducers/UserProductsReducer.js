export const userProductsReducer = (state = null, action) => {
	switch (action.type) {
		case "USER_PRODUCTS":
			return action.payload;
		case "LOGOUT":
			return action.payload;
		default:
			return state;
	}
};
