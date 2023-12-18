import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { auth } from './firebase';
import { currentUser, getCategories, getUsers, getCart, getProducts, getOrders } from './Functions/Auth';
import Nav from './Components/Nav';
import Home from './Components/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import RegisterComplete from './Pages/Auth/RegisterComplete';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import AdminHome from './Pages/Admin';
import ManageProducts from './Pages/Admin/ManageProducts';
import ManageCategories from './Pages/Admin/ManageCategories';
import ManageUsers from './Pages/Admin/ManageUsers';
import ManageOrders from './Pages/Admin/ManageOrders';
import Profile from './Pages/Admin/Profile';
import UpdateCategory from './Pages/Admin/UpdateCategory';
import CreateProduct from './Pages/Admin/CreateProduct';
import Cart from './Pages/Common/Cart';
import ManageOrder from './Pages/Admin/ManageOrder';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                let options = [];
                let uaoptions = [];

                currentUser(user.email, idTokenResult.token)
                    .then((res) => {
                        if (res.status === 200) {
                            const { firstName, lastName, dob, gender, email, contact, address, state, city, pinCode, role, _id } = res.data.user;
                            const { idToken } = res.config.headers;
                            switch (role) {
                                case 'admin': options = ['Dashboard', 'Manage Categories', 'Create Product', 'Manage Products', 'Manage Orders', 'Orders History', 'Manage Users', 'Profile'];
                                    break;
                                case 'crew': options = ['Dashboard', 'Current Order', 'Orders History', 'Profile'];
                                    break;
                                case 'user': options = ['Dashboard', 'Current Order', 'Orders History', 'Profile'];
                                    break;
                            };
                            dispatch({
                                type: 'LOGGED_IN_USER',
                                payload: { firstName, lastName, dob, gender, email, contact, address, state, city, pinCode, role, _id, options, uaoptions, token: idToken }
                            });

                            getCart(email, idTokenResult.token)
                                .then(res => {
                                    if (res.status === 200) {
                                        dispatch({
                                            type: 'CART',
                                            payload: res.data.cart
                                        });
                                    }
                                })
                                .catch((error) => toast.error(error))

                            if (role === 'crew') {
                                navigate('/crew-dashboard');
                            }
                            else if (role === 'admin') {
                                getUsers(idTokenResult.token)
                                    .then((res) => {
                                        if (res.status === 200) {
                                            dispatch({
                                                type: 'REGISTERED_USERS',
                                                payload: res.data.users
                                            })
                                        }
                                    })
                                    .catch((error) => toast.error(error))
                                getOrders(idTokenResult.token)
                                    .then((res) => {
                                        if (res.status === 200) {
                                            dispatch({
                                                type: 'ACTIVE_ORDERS',
                                                payload: res.data.orders
                                            })
                                        }
                                    })
                                    .catch((error) => toast.error(error))
                                getCategories(email, idTokenResult.token)
                                    .then((res) => {
                                        if (res.status === 200) {
                                            dispatch({
                                                type: 'CATEGORIES',
                                                payload: res.data.categories
                                            });
                                        } else {
                                            toast.error(res.data.message);
                                        }
                                    })
                                    .catch((error) => toast.error(error))
                            }
                            else if (role === 'user') { }
                        } else {
                            toast.error(res.data.message);
                        }
                    })
                    .catch((error) => toast.error(error))
            }
            else {
                dispatch({
                    type: 'LOGOUT',
                    payload: null
                })
            }
        })
        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        getProducts()
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: 'PRODUCTS',
                        payload: res.data.products
                    });
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((error) => toast.error(error))
    }, [])

    return (
        <div className='App'>
            <Nav />
            <ToastContainer />
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/sign-in' element={<Login />} />
                <Route exact path='/create-account' element={<Register />} />
                <Route exact path='/register-complete' element={<RegisterComplete />} />
                <Route exact path='/forgot-password' element={<ForgotPassword />} />
                <Route exact path='/dashboard' element={<AdminHome />} />
                <Route exact path='/create-product' element={<CreateProduct />} />
                <Route exact path='/update-product/:slug' element={<CreateProduct />} />
                <Route exact path='/manage-products' element={<ManageProducts />} />
                <Route exact path='/manage-categories' element={<ManageCategories />} />
                <Route exact path='/manage-users' element={<ManageUsers />} />
                <Route exact path='/manage-orders' element={<ManageOrders />} />
                <Route exact path='/profile' element={<Profile />} />
                <Route exact path='/update-category/:slug' element={<UpdateCategory />} />
                <Route exact path='/manage-order/:slug' element={<ManageOrder />} />
                <Route exact path='/cart' element={<Cart />} />
            </Routes>
        </div>
    );
}

export default App;
