export const categoriesReducer = (state = null, action) => {
    switch (action.type) {
        case "CATEGORIES":
            return action.payload;
        case "LOGOUT":
            return action.payload;
        default:
            return state;
    }
};
