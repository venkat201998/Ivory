import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import OrderCard from '../../Components/Cards/OrderCard';

const ManageOrders = () => {
    const { orders } = useSelector((state) => ({ ...state }));

    const [firstName, setFirstName] = useState('');

    const handleSearchUser = (e) => {
        e.preventDefault();
        setFirstName(e.target.value);
    }

    const capitalize = (s) => {
        return s.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
    };

    const handleAcceptOrder = () => {

    }

    const handleDeclineOrder = () => {
        
    }

    // const searchUser = (firstName) => (c) => c && c.firstName.includes(capitalize(firstName));

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow-sm'>
                    <h3>Manage Orders</h3>
                    <div className='col-md-6 col-12 offset-md-6 p-3'>
                        {/* <input type='search' placeholder='User First Name' value={firstName} onChange={handleSearchUser} className='form-control' /> */}
                    </div>
                    {orders && orders.map((order) =>
                        <OrderCard
                            key={order._id}
                            order={order}
                            handleAcceptOrder={handleAcceptOrder}
                            handleDeclineOrder={handleDeclineOrder}
                        />
                    )}
                </div>
            </div>
        </div>

    )
}

export default ManageOrders;
