import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import './Auth.css';
import { auth } from '../../firebase';
import { checkUser } from '../../Functions/Auth';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        checkUser(email)
            .then((res) => {
                if (res.status === 200) {
                    userRedirect(res.data.role);
                } else {
                    const config = {
                        url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
                        handleCodeInApp: true,
                    };
                    sendSignInLinkToEmail(auth, email, config)
                        .then(() => {
                            toast.success(
                                `Email is sent to ${email}. Click the link to complete your registration.`
                            );
                            navigate('/');
                        })
                        .catch(error => {
                            window.alert(error);
                            navigate('/');
                        });
                }
            })
            .catch((error) => {
                toast.error(error);
                setLoading(false);
            });

        const userRedirect = (role) => {
            if (role === 'user' || role === 'admin') {
                toast.error(`You're already registered as ${role}`);
                navigate('/sign-in');
            }
            setLoading(false);
        }
        window.localStorage.setItem('email', email);
    };

    return (
        <div className='container mt-5'>
            <div className='row mt-5 pt-5'>
                <div className='col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-10 offset-1 shadow p-lg-5 p-md-4 p-3'>
                    <form onSubmit={handleSubmit} className='container-fluid'>
                        <div className='form-group mb-4 text-center'>
                            {loading ? <h3>Loading...</h3> : <h3>Registration</h3>}
                        </div>
                        <div className='form-group my-3 row'>
                            <label htmlFor='email' className='col-md-3 d-none d-md-block col-form-label text-end fw-bold fs-6'>Email</label>
                            <div className='col-md-8 col-12 mb-3 mb-md-1 p-0'>
                                <input
                                    id='email'
                                    type='email'
                                    className='form-control w-100'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='abc@example.com'
                                />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <div className='col-md-4 col-6 offset-md-3 text-start p-0'>
                                <button className='btn btn-raised btn-filled' type='submit' disabled={!email}>
                                    Register
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
