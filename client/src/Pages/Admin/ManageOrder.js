import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

const ManageOrder = () => {

    const { orders, users, products } = useSelector(state => ({ ...state }));
    const params = useParams();
    let itemArr = '';
    let userArr = '';

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        itemArr = orders && orders.filter(order => order._id === params.slug);
        userArr = users && users.filter(user => user._id === itemArr[0].orderdBy);
        setUser(userArr && userArr[0]);
        setOrder(itemArr && itemArr[0]);
        setLoading(false);
    }, [orders])

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <div>
                            <h3>{'Manage Order'}</h3>
                            <div className="card-body row">
                                <div className="col-md-5 p-3 offset-md-1">
                                    <ul className='list-group p-0 m-0 flex-column'>
                                        <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                            <span className='fw-bold'>{user && user.firstName} {user && user.lastName}</span>
                                        </li>
                                        <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                            <label className='fw-bold me-2'>Phone</label>
                                            <span>{user && user.contact}</span>
                                        </li>
                                        <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                            <label className='fw-bold me-2'>Email</label>
                                            <span>{user && user.email}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-5 p-3">
                                    <ul className='list-group p-0 m-0 flex-column'>
                                        <li className='list-group-item row text-start border-0 p-1 bg-transparent'>
                                            <label className='fw-bold'>Address</label>
                                            <label>{user && user.address}</label>
                                            <label>{user && user.city}, {user && user.state}, {user && user.pinCode}</label>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-5 offset-md-1 p-3 text-start">
                                    <label className='fw-bold me-2 p-1'>Order Summary</label>
                                    <ol className='list-group list-group-numbered p-3 m-0 flex-column'>
                                        {order && order.products.map(product => <li key={product._id} className='list-group-item row text-start border-0 p-1 bg-transparent'>
                                            <span>{product.title}</span>
                                            <span className='mx-1'>&#xd7;</span>
                                            <span>{product.count}</span>
                                        </li>)}
                                    </ol>
                                </div>
                                <div className="col-md-5 p-3 text-start">
                                    <label className='fw-bold me-2'>Assigned To</label>
                                </div>
                            </div>
                            <div className="card-footer">
                                <ul className="list-group flex-row justify-content-center">
                                    <li className="list-group-item border-0 bg-transparent">
                                        <button className="btn btn-outline-success fw-bold" type="submit">Accept</button>
                                    </li>
                                    <li className="list-group-item border-0 bg-transparent">
                                        <button className="btn btn-outline-danger fw-bold" type="reset">Decline</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ManageOrder;
