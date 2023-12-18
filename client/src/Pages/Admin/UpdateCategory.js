import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { getCategory, createOrUpdateCategory } from '../../Functions/Auth';

const UpdateCategory = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => ({ ...state }));

    const [loading, setLoading] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');
    const [categoryId, setCategoryId] = useState('');


    useEffect(() => {
        setLoading(true)
        if (user && user.token) {
            getCategory(params.slug, user.email, user.token)
                .then(res => {
                    if (res.status === 200) {
                        const { category } = res.data;
                        setCategoryName(category.name);
                        setCategoryDesc(category.description);
                        setCategoryId(category._id);
                    } else {
                        toast.error(res.data.message);
                    }
                    setLoading(false);
                })
                .catch((error) => toast.error(error))
        }
    }, [user])

    const handleUpdateCategory = (e) => {
        e.preventDefault();
        setLoading(true);
        createOrUpdateCategory({ name: categoryName, slug: categoryName, description: categoryDesc, email: user.email, id: categoryId }, user.token)
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                    toast.success(res.data.message);
                    navigate('/manage-categories');
                    dispatch({
                        type: 'CATEGORIES',
                        payload: res.data.categories
                    })
                } else {
                    toast.error(res.data.message);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            })
    }

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <div>
                            <h3>Update Category</h3>
                            <form onSubmit={handleUpdateCategory} className='container-fluid'>
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
                                            className='btn btn-raised btn-filled fw-bold'
                                            type='submit'
                                            disabled={!categoryName || !categoryDesc}
                                        >
                                            Update
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

export default UpdateCategory;
