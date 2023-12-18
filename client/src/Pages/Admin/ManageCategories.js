import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { createOrUpdateCategory, getCategories, deleteCategory } from '../../Functions/Auth';
import './index.css';
import Modal from '../../Components/Cards/Modal';

const ManageCategories = () => {
    const { user } = useSelector(state => ({ ...state }));
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');
    const [categories, setCategories] = useState('');

    useEffect(() => {
        if (user && user.token) {
            fetchCategories();
        }
    }, [user]);

    const fetchCategories = () => {
        getCategories(user.email, user.token)
            .then((res) => {
                if (res.status === 200) {
                    setCategories(res.data.categories);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((error) => toast.error(error))
    }

    const handleDeleteCategory = (obj) => {
        const { product } = obj;
        deleteCategory(product.name, user.email, user.token)
            .then(res => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                    setCategories(res.data.categories);
                    dispatch({
                        type: 'CATEGORIES',
                        payload: res.data.categories
                    })
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(() => toast.error('Failed to Delete Category'))
    }

    const handleSubmit = async () => {
        setLoading(true);

        createOrUpdateCategory({ name: categoryName, slug: categoryName, description: categoryDesc, email: user.email }, user.token)
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                    setCategories(res.data.categories);
                    setCategoryName('');
                    setCategoryDesc('');
                    dispatch({
                        type: 'CATEGORIES',
                        payload: res.data.categories
                    })
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
            <div className='container-fluid my-5 px-md-5'>
                <div className='row mt-5 pt-5 mx-md-2'>
                    <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow'>
                        {loading ? <h3>Loading...</h3> :
                            <div>
                                <h3>Create Categories</h3>
                                <form onSubmit={handleSubmit} className='container-fluid'>
                                    <div className='form-group my-3 row p-0'>
                                        <label htmlFor='category-name' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Name</label>
                                        <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                            <input
                                                id='category-name'
                                                type='text'
                                                className='form-control w-100'
                                                value={categoryName}
                                                required
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                placeholder='Category Name'
                                            />
                                        </div>
                                    </div>
                                    <div className='form-group my-3 row p-0'>
                                        <label htmlFor='category-description' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Category Description</label>
                                        <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                            <textarea
                                                id='category-description'
                                                className='form-control w-100'
                                                value={categoryDesc}
                                                required
                                                onChange={(e) => setCategoryDesc(e.target.value)}
                                                placeholder='Category Description'
                                            />
                                        </div>
                                    </div>
                                    <div className='form-group row p-0'>
                                        <div className='col-md-4 col-6 offset-md-3 text-start p-0'>
                                            <button
                                                className='btn btn-raised btn-filled'
                                                type='submit'
                                                disabled={!categoryName || !categoryDesc}
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className='container-fluid my-5 px-md-5'>
                <div className='row mt-5 pt-5 mx-md-2'>
                    <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow'>
                        {loading ? <h3>Loading...</h3> :
                            <div>
                                <h3>Categories</h3>
                                <ul className='list-group text-start'>
                                    {categories && categories.map(category => <li className='list-group-item bg-light list-category-item shadow-sm m-2 rounded border-1 fw-bold' key={category._id}>
                                        <span>{category.name}</span>
                                        <div>
                                            <Link className='text-decoration-none custom-color-blue me-3' to={`/update-category/${category.slug}`}>Edit</Link>
                                            <span className='ms-3 pointer-cursor' data-bs-toggle='modal' data-bs-target={`#static-backdrop-${category._id}`}>Delete</span>
                                            <Modal
                                                title={`Do you want to delete the category ${category.name} ?`}
                                                onClickEvent={handleDeleteCategory}
                                                product={category}
                                                btnTitle={'Delete'}
                                            />
                                        </div>
                                    </li>)}
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageCategories;
