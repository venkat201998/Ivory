import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './card.css';
import Modal from './Modal';

const ProductCard = ({ product, handleClickEvent }) => {
    const { cart } = useSelector(state => ({ ...state }));
    const location = useLocation();

    const [count, setCount] = useState(1);
    const [selection, setSelection] = useState(0);

    useEffect(() => {
        fetchCountFromCart();
    }, [cart])

    const handleRoute = (option) => {
        let routes = option.split(' ');
        return `${routes.length > 1 ? routes.map(route => route.toLowerCase()).join('-') : routes[0].toLowerCase()}`;
    }

    const handleAddProduct = (obj) => {
        handleClickEvent(obj);
    }

    const handleDeleteProduct = (obj) => {
        handleClickEvent(obj);
    }

    const fetchCountFromCart = () => {
        let item = cart && cart.products.find(prod => prod.productId === product._id);
        setCount(item && item.count || 0);
        setSelection(item && item.count || 0);
    }

    return (
        <div className='card col-10 col-lg-3 my-3 mx-2 p-0'>
            <img src={product.images[0].urls[0].url} className='card-img-top' alt='...' />
            <div className='card-body text-start'>
                <h5 className='card-title'>{product.title}</h5>
                <p className='card-text'>{product.description}</p>
                <span>&#36;{product.price}</span>
            </div>
            {location.pathname === '/' ?
                <div className='card-footer text-start'>
                    <Link className='btn rounded-0 no-border w-50' to={`/view-product/${handleRoute(product.title)}`}>View</Link>
                    <button type='button' className='btn rounded-0 border-0 w-50' data-bs-toggle='modal' data-bs-target={`#static-backdrop-${product._id}`}>
                        {count > 0 ? `Edit Cart(${count})` : 'Add to Cart'}
                    </button>
                    <Modal
                        onClickEvent={handleAddProduct}
                        onClickCancel={fetchCountFromCart}
                        product={product}
                        count={count}
                        setCount={setCount}
                        setSelection={setSelection}
                        selection={selection}
                        title={`Select number of ${product.title}`}
                        btnTitle={'Add to Cart'}
                    />
                </div>
                :
                <div className='card-footer text-start'>
                    <Link className='btn rounded-0 no-border w-50' to={`/update-product/${handleRoute(product.title)}`}>Edit</Link>
                    <button type='button' className='btn rounded-0 border-0 w-50' data-bs-toggle='modal' data-bs-target={`#static-backdrop-${product._id}`}>
                        Delete
                    </button>
                    <Modal
                        onClickEvent={handleDeleteProduct}
                        product={product}
                        title={`Do yo want to delete ${product.title} ?`}
                        btnTitle={'Delete'}
                    />
                </div>}
        </div>
    )
}

export default ProductCard;
