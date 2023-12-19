import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import FileUpload from '../../Components/Forms/FileUpload';
import { createOrUpdateProduct, getProduct } from '../../Functions/Auth';

const CreateProduct = () => {
    const { categories, user, products } = useSelector(state => ({ ...state }));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [title, setTile] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState('');
    const [productId, setProductId] = useState('');
    let checkParam = location.pathname.includes('/update-product');

    useEffect(() => {
        if (user && checkParam) {
            getProduct(handleRoute(params.slug), user.email, user.token)
                .then(res => {
                    if (res.status === 200) {
                        setProductId(res.data.product._id);
                        setTile(res.data.product.title);
                        setSlug(res.data.product.slug);
                        setDescription(res.data.product.description);
                        setPrice(res.data.product.price);
                        setQuantity(res.data.product.quantity);
                        setCategory(res.data.product.category);
                        setImages(res.data.product.images[0]);
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch((error) => toast.error(error))
        }
    }, [user, checkParam])

    const handleRoute = (option) => {
        let routes = option.split('-');
        return `${routes.length > 1 ? routes.map(route => route.toLowerCase()).join(' ') : routes[0].toLowerCase()}`;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createOrUpdateProduct({ email: user.email, title, slug: slug.toLowerCase() || title.toLowerCase(), description, price, category, quantity, images, id: productId }, user.token)
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: 'USER_PRODUCTS',
                        payload: res.data.products
                    });
                    setLoading(false);
                    toast.success(res.data.message);
                    navigate('/manage-products');
                } else {
                    setLoading(false);
                    toast.error(res.data.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            })
    }

    const handleClear = (e) => {
        e.preventDefault();
        if (checkParam) {
            navigate('/manage-products');
        } else {
            setProductId('');
            setTile('');
            setDescription('');
            setPrice('');
            setQuantity('');
            setCategory('');
            setImages('');
        }
    }

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <div>
                            <h3>{checkParam ? 'Product Updation Form' : 'Product Registration Form'}</h3>
                            <form onSubmit={handleSubmit} className='container-fluid'>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='title' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Title</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='title'
                                            type='text'
                                            className='form-control w-100'
                                            value={title}
                                            required
                                            onChange={(e) => setTile(e.target.value)}
                                            placeholder='Product Title'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='description' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Description</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='description'
                                            type='text'
                                            className='form-control w-100'
                                            value={description}
                                            required
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder='Product Description'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='product-price' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Price</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='product-price'
                                            type='text'
                                            className='form-control w-100'
                                            value={price}
                                            required
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder='Product Price'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='quantity' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Quantity</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='quantity'
                                            type='text'
                                            className='form-control w-100'
                                            value={quantity}
                                            required
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder='Product Quantity'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='category' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Category</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <select
                                            id='category'
                                            className='form-select w-100'
                                            value={category}
                                            required
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option defaultValue>Select Product Category</option>
                                            {categories && categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='formFile' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Image</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0 text-start'>
                                        <FileUpload
                                            id={'formFile'}
                                            images={images}
                                            setImages={setImages}
                                            setLoading={setLoading}
                                        />
                                    </div>
                                </div>
                                <div className='form-group row p-0'>
                                    <div className='col-md-4 col-6 offset-md-3 text-start p-0'>
                                        <button
                                            className='btn btn-raised btn-filled fw-bold me-md-3 me-1'
                                            type='submit'
                                            disabled={!title || !description || !price || !quantity || !category || (category === 'Select Product Category') || !(images && images.urls && images.urls.length)}
                                        >
                                            {checkParam ? 'Update' : 'Register'}
                                        </button>
                                        <button
                                            className='btn btn-raised btn-hollow ms-md-3 ms-1'
                                            type='clear'
                                            onClick={handleClear}
                                        >
                                            {checkParam ? 'Cancel' : 'Clear'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateProduct;
