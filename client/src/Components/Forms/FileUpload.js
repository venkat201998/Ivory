import React from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';
import { toast } from 'react-toastify';

import './FileUpload.css';

const FileUpload = ({ id, images, setImages, setLoading }) => {
	const { user } = useSelector((state) => ({ ...state }));
	// const uploadedImages = localStorage.getItem('uploadedImages');

	// useEffect(() => {
	// 	console.log('Check-->uploadedImages: ', uploadedImages);
	// 	setImages(uploadedImages);
	// }, [])

	const fileUploadAndResize = (e) => {
		e.preventDefault();
		let files = e.target.files; // 3
		let allUploadedFiles = images.urls || [];
		let idToken = user ? user.token : '';

		if (files) {
			setLoading(true);
			for (let i = 0; i < files.length; i++) {
				Resizer.imageFileResizer(
					files[i],
					720,
					720,
					'JPEG',
					100,
					0,
					(uri) => {
						axios
							.post(
								`${process.env.REACT_APP_API}/uploadimages`,
								{ image: uri },
								{
									headers: {
										idToken
									},
								}
							)
							.then((res) => {
								if (res.status === 200) {
									const { public_id, url, message } = res.data;
									toast.success(message);
									allUploadedFiles.push({ public_id, url });
									setImages({ ...images, urls: allUploadedFiles });
									// localStorage.setItem('uploadedImages', { ...images, urls: allUploadedFiles });
								} else {
									toast.error(res.data.message);
								}
								setLoading(false);
							})
							.catch((error) => {
								setLoading(false);
								toast.error(error);
							});
					},
					'base64'
				);
			}
		}
		// send back to server to upload to cloudinary
		// set url to images[] in the parent component state - ProductCreate
	};

	const handleImageRemove = (public_id) => {
		let idToken = user ? user.token : '';
		setLoading(true);
		axios
			.post(
				`${process.env.REACT_APP_API}/removeimage`,
				{ public_id },
				{
					headers: {
						idToken
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					toast.success(res.data.message);
					const { urls } = images;
					let filteredImages = urls.filter((item) => {
						return item.public_id !== public_id;
					});
					setImages({ ...images, urls: filteredImages });
					// localStorage.setItem('uploadedImages', { ...images, urls: filteredImages });
				} else {
					toast.error(res.data.message);
				}
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				toast.error(error);

			});
	};

	return (
		<>
			<label htmlFor={id} className='btn btn-filled btn-raised'>
				Choose File
				<input
					id={id}
					type='file'
					multiple
					hidden
					accept='images/*'
					onChange={fileUploadAndResize}
				/>
			</label>
			<div className='mt-3'>
				{images && images.urls &&
					images.urls.map((image) => (
						<>
							<Badge
								count='X'
								key={image.public_id}
								onClick={() => handleImageRemove(image.public_id)}
								style={{ cursor: 'pointer' }}
							>
								<Avatar
									src={image.url}
									size={100}
									shape='square'
									className='ml-3'
								/>
							</Badge>
						</>
					))}
			</div>
		</>
	);
};

export default FileUpload;
