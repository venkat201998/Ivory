import { combineReducers } from "redux";
import { userReducer } from "./LoggedInUserReducer";
import { usersReducer } from './UsersReducer';
import { categoriesReducer } from "./CategoriesReducer";
import { productsReducer } from "./ProductsReducer";
import { cartReducer } from "./CartReducer";
import { ordersReducer } from "./OrdersReducer";
import { userProductsReducer } from "./UserProductsReducer";

const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  categories: categoriesReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  userProducts: userProductsReducer
});

export default rootReducer;
