import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DateTimePicker from 'react-datetime-picker'

import ProductCheckoutCard from "../../Components/Cards/ProductCheckoutCard";
import { createOrUpdateCart, createOrder } from "../../Functions/Auth";

const Cart = () => {
    const { cart, user } = useSelector(state => ({ ...state }));
    const dispatch = useDispatch();
    let date = new Date();

    const [products, setProducts] = useState('');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(date.getDate());
    const [endDate, setEndDate] = useState(date.getDate());
    let items = '';
    let filteredItems = '';

    useEffect(() => {
        if (cart && cart.products) {
            setProducts(cart.products);
        } else {
            setProducts('');
        }
    }, [cart])

    const deleteProductFromCart = product => {
        setLoading(true);
        items = cart && cart.products;
        filteredItems = items.filter(item => item._id !== product._id);
        let cartTotal = 0;
        let cartQuantity = 0;
        for (let i = 0; i < filteredItems.length; i++) {
            cartTotal = cartTotal + filteredItems[i].price * filteredItems[i].count;
            cartQuantity = cartQuantity + filteredItems[i].count;
        }
        let shipping = (cartTotal * 0.05).toFixed(2);
        createOrUpdateCart({ products: filteredItems, shipping, cartTotal, cartQuantity, totalAfterDiscount: 100, orderdBy: user.email }, user.token)
            .then(res => {
                if (res.status === 200) {
                    items = res.data.cart.products;
                    dispatch({
                        type: 'CART',
                        payload: res.data.cart
                    });
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            })
    }

    const updateQuantity = (obj) => {
        const { product, count } = obj;
        let cartTotal = 0;
        let cartQuantity = 0;
        let items = cart && cart.products;
        let index = items && items.findIndex(item => item._id === product._id);
        items[index].count = count;
        for (let i = 0; i < items.length; i++) {
            cartTotal = cartTotal + items[i].price * items[i].count;
            cartQuantity = cartQuantity + items[i].count;
        }
        let shipping = (cartTotal * 0.05).toFixed(2);
        createOrUpdateCart({ products: items, shipping, cartTotal, cartQuantity, totalAfterDiscount: 100, orderdBy: user.email }, user.token)
            .then(res => {
                if (res.status === 200) {
                    items = res.data.cart.products;
                    dispatch({
                        type: 'CART',
                        payload: res.data.cart
                    });
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            })
    }

    const handleCheckout = () => {
        setLoading(true);
        const { products, orderdBy, cartTotal, shipping } = cart;
        createOrder({ orderdBy, products, paymentIntent: {}, shipping, orderTotal: cartTotal }, user.token)
            .then(res => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            })
        createOrUpdateCart({ products: [], shipping, cartTotal: 0, cartQuantity: 0, totalAfterDiscount: 0, orderdBy: user.email }, user.token)
            .then(res => {
                if (res.status === 200) {
                    setProducts('');
                    dispatch({
                        type: 'CART',
                        payload: res.data.cart
                    });
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            })
    }

    return (
        <>
            {products && products.length ? <div className='container-fluid row my-5 p-0 m-0 justify-content-center'>
                <div className='col-10 col-md-7 mt-5 mx-md-2 p-3 shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <div>
                            <h3 className='text-start'>Items</h3>
                            <div className='container-fluid mt-3'>
                                <div className='row'>
                                    {products && products.map(prod =>
                                        <ProductCheckoutCard
                                            key={prod.productId}
                                            product={prod}
                                            handleUpdateQuantity={updateQuantity}
                                            deleteProductFromCart={deleteProductFromCart}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className='col-10 col-md-4 mt-5 mx-md-2 p-3 shadow container-height'>
                    <h3 className='text-start'>Checkout</h3>
                    <div className='container-fluid'>
                        <ul className='list-group'>
                            <li className='list-group-item border-0 text-start px-4'>
                                <label className='col-6 col-md-8 fw-semibold'>Sub Total</label>
                                <span className='col-6 col-md-4 fw-semibold'>&#36;{cart && cart.cartTotal}</span>
                            </li>
                            <li className='list-group-item border-0 text-start px-4'>
                                <label className='col-6 col-md-8 fw-semibold'>Shipping</label>
                                <span className='col-6 col-md-4 fw-semibold'>&#36;{cart && cart.shipping}</span>
                            </li>
                            <li className='list-group-item border-0 text-start px-4'>
                                <label className='col-6 col-md-8 fw-semibold'>Estimated Tax</label>
                                <span className='col-6 col-md-4 fw-semibold'>&#36;{0}</span>
                            </li>
                            <li className='list-group-item border-0 text-start px-4'>
                                <label className='col-6 col-md-8 fw-semibold'>Total</label>
                                <span className='col-6 col-md-4 fw-semibold'>&#36;{cart && (cart.cartTotal + cart.shipping)}</span>
                            </li>
                            <li className='list-group-item border-0 mt-3'>
                                <button type='button' className='btn btn-filled' onClick={handleCheckout}>Proceed To Checkout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> : <div className='container-fluid my-5 px-md-5'>
                <div className='row mt-5 pt-5 mx-md-2'>
                    <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow-sm'>
                        <h3>Empty Cart</h3>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Cart;
