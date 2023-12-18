import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { auth } from '../../firebase';
import { signInWithEmailLink, updatePassword } from 'firebase/auth';
import { createOrUpdateUser, currentUser } from '../../Functions/Auth';
import states from '../JSON/States.json';

const RegisterComplete = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setEmail(window.localStorage.getItem('email'));
        setLoading(false);
    }, [])

    const rolebasedredirect = (role) => {
        if (role === 'admin') {
            navigate('/');
        }
        else if (role === 'crew') {
            navigate('/crew-dashboard');
        }
        else if (role === 'user') {
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            const user = auth.currentUser;
            const idTokenResult = await user.getIdTokenResult();

            if (result.user.emailVerified) {
                updatePassword(user, password);
                const userDetails = { firstName, lastName, dob, gender, contact, address, state, city, pinCode };
                await createOrUpdateUser(userDetails, idTokenResult.token)
                    .then((res) => {
                        if (res.status === 200) {
                            toast.success(res.data.message);
                        } else {
                            toast.error(res.data.message)
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                        toast.error(error);
                    });

                let options = [];
                let uaoptions = [];

                await currentUser(email, idTokenResult.token)
                    .then((res) => {
                        if (res.status === 200) {
                            const { firstName, lastName, dob, gender, email, contact, address, state, city, pinCode, role, _id } = res.data.user;
                            const { idToken } = res.config.headers;
                            switch (role) {
                                case 'admin': options = ['Dashboard', 'Manage Categories', 'Create Product', 'Manage Products', 'Manage Orders', 'Orders History', 'Manage Users', 'Profile'];
                                    break;
                                case 'crew': options = ['Dashboard', 'Current Order', 'Orders History', 'Profile'];
                                    break;
                                case 'user': options = ['Dashboard', 'Current Order', 'Orders History', 'Profile'];
                                    break;
                            }
                            dispatch({
                                type: 'LOGGED_IN_USER',
                                payload: { firstName, lastName, dob, gender, email, contact, address, state, city, pinCode, role, _id, options, uaoptions, token: idToken }
                            });
                            rolebasedredirect(role);
                        } else {
                            toast.error(res.data.message);
                        }
                    })
            }
            window.localStorage.removeItem('email');

        } catch (error) {
            toast.error(error);
            navigate('/');
        }
    }

    return (
        <div className='container-fluid my-5 px-md-5'>
            <div className='row mt-5 pt-5 mx-md-2'>
                <div className='col-lg-8 col-10 offset-lg-2 offset-1 p-md-4 p-3 text-center shadow'>
                    {loading ? <h3>Loading...</h3> :
                        <div>
                            <h3>Registration Form</h3>
                            <form onSubmit={handleSubmit} className='container-fluid'>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='email' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Email</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='email'
                                            type='email'
                                            className='form-control w-100'
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='abc@example.com'
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='password' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Password</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='password'
                                            type='password'
                                            className='form-control w-100'
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder='Password'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='confirm-password' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Confirm Password</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='confirm-password'
                                            type='password'
                                            className='form-control w-100'
                                            value={confirmPassword}
                                            required
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder='Confirm Password'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='first-name' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>First Name</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='first-name'
                                            type='text'
                                            className='form-control w-100'
                                            value={firstName}
                                            required
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder='First Name'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='last-name' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Last Name</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='last-name'
                                            type='text'
                                            className='form-control w-100'
                                            value={lastName}
                                            required
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder='Last Name'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='date-of-birth' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Date of Birth</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='date-of-birth'
                                            type='date'
                                            className='form-control w-100'
                                            value={dob}
                                            required
                                            onChange={(e) => setDob(e.target.value)}
                                            placeholder='Date of Birth'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='gender' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Gender</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <select
                                            id='gender'
                                            className='form-select w-100'
                                            value={gender}
                                            required
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option defaultValue>Select Gender</option>
                                            <option value='Male'>Male</option>
                                            <option value='Female'>Female</option>
                                            <option value='Preferred Not To Say'>Preferred Not to Say</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='contact-number' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Contact Number</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='contact-number'
                                            type='text'
                                            className='form-control'
                                            value={contact}
                                            required
                                            onChange={(e) => setContact(e.target.value)}
                                            placeholder='+1 XXX-XXX-XXXX'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='address' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Address</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='address'
                                            type='text'
                                            className='form-control w-100'
                                            value={address}
                                            required
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder='Apt No, Flat No, St Name'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='city' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>City</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='city'
                                            type='text'
                                            className='form-control w-100'
                                            value={city}
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder='City'
                                        />
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='state' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>State</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <select
                                            id='state'
                                            className='form-select w-100'
                                            value={state}
                                            required
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            <option defaultValue>Select State</option>
                                            {states.map(state => <option key={state} value={state}>{state}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className='form-group my-3 row p-0'>
                                    <label htmlFor='zip-code' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Zip Code</label>
                                    <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                        <input
                                            id='zip-code'
                                            type='text'
                                            className='form-control w-100'
                                            value={pinCode}
                                            required
                                            onChange={(e) => setPinCode(e.target.value)}
                                            placeholder='Zip Code'
                                        />
                                    </div>
                                </div>
                                <div className='form-group row p-0'>
                                    <div className='col-md-4 col-6 offset-md-3 text-start p-0'>
                                        <button
                                            className='btn btn-raised btn-filled'
                                            type='submit'
                                            disabled={!email || password.length < 6 || !(password === confirmPassword) || !firstName || !lastName || !dob || !contact || !address || !city || !state || !pinCode}
                                        >
                                            Register
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

export default RegisterComplete;
