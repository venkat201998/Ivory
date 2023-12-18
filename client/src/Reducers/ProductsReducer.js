export const productsReducer = (state = null, action) => {
	switch (action.type) {
		case "PRODUCTS":
			return action.payload;
		case "LOGOUT":
			return action.payload;
		default:
			return state;
	}
};
