import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {

	return (
		<div className='col-12 p-lg-4 my-4'>
			<form className='container-fluid p-0'>
				<div className='card shadow w-100 border-0'>
					<div className='card-body row'>
						<div className='col-lg-5 col-md-6 col-12'>
							<ul className='list-group p-0 m-0 flex-column'>
								<li className='list-group-item text-start border-0 p-1 bg-transparent'>
									<span className='fw-bold'>{user.firstName} {user.lastName}</span>
								</li>
								<li className='list-group-item text-start border-0 p-1 bg-transparent'>
									<label className='fw-bold me-2'>Phone</label>
									<span>{user.contact}</span>
								</li>
								<li className='list-group-item text-start border-0 p-1 bg-transparent'>
									<label className='fw-bold me-2'>Email</label>
									<span>{user.email}</span>
								</li>
							</ul>
						</div>
						<div className='col-lg-5 col-md-6 col-12'>
							<ul className='list-group p-0 m-0 flex-column'>
								<li className='list-group-item row text-start border-0 p-1 bg-transparent'>
									<label className='fw-bold'>Address</label>
									<label>{user.address}</label>
									<label>{user.city}, {user.state}, {user.pinCode}</label>
								</li>
								<li className='list-group-item text-start border-0 p-1 bg-transparent'>
									<label className='fw-bold me-2'>Role</label>
									<span>{user.role}</span>
								</li>
							</ul>
						</div>
						<div className='col-lg-2 col-12 d-flex align-items-center justify-content-center'>
							<ul className='list-group d-flex flex-row'>
								<li className='list-group-item text-start border-0 p-1 bg-transparent'>
									<button className='btn btn-filled' type='submit'>
										<Link className='text-dark custom-text-color text-decoration-none' to={`manage-users/${user._id}`}>View</Link>
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default UserCard;
