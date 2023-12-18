import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const OrderCard = ({ order, handleAcceptOrder, handleDeclineOrder }) => {
    const { users } = useSelector(state => ({ ...state }));

    const [user, setUser] = useState('');

    useEffect(() => {
        if (users) {
            fetchUserDetails();
        }
    }, [users])

    const fetchUserDetails = () => {
        let us = users && users.filter(user => user._id === order.orderdBy);
        setUser(us);
    }

    const onClickAccept = () => {
        handleAcceptOrder();
    }

    const onClickDecline = () => {
        handleDeclineOrder();
    }

    return (
        <div className='col-12 p-4'>
            <form className='container-fluid p-0'>
                <div className='card shadow w-100 border-0'>
                    <div className='card-body row'>
                        <div className='col-lg-5 col-12'>
                            <ul className='list-group p-0 m-0 flex-column'>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <span className='fw-bold'>{user && user[0].firstName} {user && user[0].lastName}</span>
                                </li>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Phone</label>
                                    <span>{user && user[0].contact}</span>
                                </li>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Email</label>
                                    <span>{user && user[0].email}</span>
                                </li>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Sub Total</label>
                                    <span>&#36;{order.orderTotal}</span>
                                </li>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Shipping</label>
                                    <span>&#36;{order.shipping}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='col-lg-5 col-12'>
                            <ul className='list-group p-0 m-0 flex-lg-column flex-sm-row'>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Status</label>
                                    <span>{order.orderStatus}</span>
                                </li>
                                <li className='list-group-item row text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Address</label>
                                    <label>{user && user[0].address}</label>
                                    <label>{user && user[0].city}, {user && user[0].state}, {user && user[0].pinCode}</label>
                                </li>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <label className='fw-bold me-2'>Assigned To</label>
                                    <span>{order.assignedTo || 'Not yet assigned'}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='col-lg-2 col-12 my-3 d-flex align-items-center justify-content-center'>
                            <ul className='list-group d-flex flex-row'>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <button className='btn btn-filled' type='submit'>
                                        <Link className='text-dark custom-text-color text-decoration-none' to={`/manage-order/${order._id}`}>View</Link>
                                    </button>
                                </li>
                            </ul>
                            {/* <ul className='list-group d-flex flex-lg-column flex-row'>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <button className='btn btn-filled' onClick={onClickAccept}>Accept</button>
                                </li>
                                <li className='list-group-item text-start border-0 p-1 bg-transparent'>
                                    <button className='btn btn-hollow' onClick={onClickDecline}>Decline</button>
                                </li>
                            </ul> */}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderCard;
