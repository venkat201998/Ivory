export const cartReducer = (state = null, action) => {
    switch (action.type) {
        case "CART":
            return action.payload;
        case "LOGOUT":
            return action.payload;
        default:
            return state;
    }
};
