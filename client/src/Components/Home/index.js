import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import './index.css';
import ProductCard from '../Cards/ProductCard';
import banner from '../../Assets/KelliAvilaPhoto-632.jpg';
import { createOrUpdateCart, getProducts, getCart } from '../../Functions/Auth';

const Home = () => {
    const { user } = useSelector(state => ({ ...state }));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [prods, setProds] = useState('');
    const [cartProducts, setCartProducts] = useState('');

    let items = '';
    let index = '';

    useEffect(() => {
        if (user) {
            const { email, token } = user;
            getCart(email, token)
                .then(res => {
                    if (res.status === 200) {
                        setCartProducts(res.data.cart.products);
                        dispatch({
                            type: 'CART',
                            payload: res.data.cart
                        });
                    } else {
                        setCartProducts([]);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(error);
                })
        }
    }, [user])

    useEffect(() => {
        getProducts()
            .then(res => {
                if (res.status === 200) {
                    setProds(res.data.products);
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

    const handleAddProduct = (obj) => {
        setLoading(true);
        if (user) {
            const { product, count } = obj;
            items = items || cartProducts;
            let arr = {
                productId: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                count: count,
                images: product.images
            };
            index = items && items.findIndex(item => item.productId === arr.productId);
            if (index !== -1) {
                if (items[index].count === arr.count) {
                    toast.error('Product exist in the cart');
                    setLoading(false);
                } else {
                    items[index].count = arr.count;
                    handleCommon();
                }
            } else {
                items.push(arr);
                handleCommon();
            }
        } else {
            setLoading(false);
            toast.error('Please login/resgister to add items to the cart');
            navigate('/sign-in');
        }
    }

    const handleCommon = () => {
        let cartTotal = 0;
        let cartQuantity = 0;
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

    return (
        <div className='home'>
            <img src={banner} className='img-banner' alt='ivory events' />
            <div className='container-fluid my-5 px-md-5'>
                <div className='row mt-5 pt-5 mx-md-2'>
                    <div className='col-lg-8 col-md-12 col-10 offset-lg-2 offset-md-0 offset-1 p-md-4 p-3 text-center shadow'>
                        {loading ? <h3>Loading...</h3> :
                            <div>
                                <h3>Our Products</h3>
                                <div className='container-fluid mt-3'>
                                    <div className='row d-flex'>
                                        {prods && prods.length > 0 && prods.map(prod =>
                                            <ProductCard
                                                key={prod._id}
                                                product={prod}
                                                handleClickEvent={handleAddProduct}
                                            />)
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
