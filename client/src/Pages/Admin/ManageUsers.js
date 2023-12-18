import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserCard from '../../Components/Cards/UserCard';

const ManageUsers = () => {
    const { users } = useSelector((state) => ({ ...state }));

    const [firstName, setFirstName] = useState('');

    const handleSearchUser = (e) => {
        e.preventDefault();
        setFirstName(e.target.value);
    }

    const capitalize = (s) => {
        return s.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
    };

    const searchUser = (firstName) => (c) => c && c.firstName.includes(capitalize(firstName));

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow-sm'>
                    <h3>Manage Users</h3>
                    <div className='col-md-6 col-12 offset-md-6 p-3'>
                        <input type='search' placeholder='User First Name' value={firstName} onChange={handleSearchUser} className='form-control' />
                    </div>
                    {users && users.filter(searchUser(firstName)).map((user) => <UserCard key={user._id} user={user} />)}
                </div>
            </div>
        </div>

    )
}

export default ManageUsers;
