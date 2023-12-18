import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import ProductCard from '../../Components/Cards/ProductCard';
import { getUserProducts, deleteProduct } from '../../Functions/Auth';

const ManageProducts = () => {
    const { user } = useSelector(state => ({ ...state }));
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [prods, setProds] = useState('');

    useEffect(() => {
        if (user) {
            const { email, token } = user;
            setLoading(true);
            getUserProducts(email, token)
                .then(res => {
                    if (res.status === 200) {
                        // toast.success(res.data.message);
                        setProds(res.data.products);
                        dispatch({
                            typr: 'USER_PRODUCTS',
                            payload: res.data.products
                        })
                    } else {
                        // toast.error(res.data.message);
                    }
                    setLoading(false)
                })
                .catch(error => {
                    setLoading(false);
                    toast.error(error);
                })
        }
    }, [user])

    const handleDeleteProduct = (obj) => {
        const { product: { title } } = obj;
        setLoading(true);
        deleteProduct(title, user.email, user.token)
            .then(res => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                    dispatch({
                        type: 'USER_PRODUCTS',
                        payload: res.data.products
                    })
                    setProds(res.data.products);
                } else {
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                toast.error(error);
            })
    }

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-md-12 col-10 offset-lg-2 offset-md-0 offset-1 p-md-4 p-3 text-center shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <div>
                            <h3>Manage Products</h3>
                            <div className='container-fluid mt-3'>
                                <div className='row d-flex'>
                                    {prods && prods.length > 0 && prods.map(prod =>
                                        <ProductCard
                                            key={prod._id}
                                            product={prod}
                                            handleClickEvent={handleDeleteProduct}
                                        />)
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ManageProducts;
