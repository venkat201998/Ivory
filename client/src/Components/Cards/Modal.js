import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const Modal = ({ btnTitle, title, product, count, selection, setCount, setSelection, onClickEvent, onClickCancel }) => {
    const location = useLocation();
    let range = [];

    const [productQuantity, setProductQuantity] = useState('');

    useEffect(() => {
        if (product && product.quantity) {
            createRange(product && product.quantity)
        }
    }, [product])

    const createRange = (end) => {
        range = [];
        for (let i = 0; i <= end; i++) {
            range.push(i);
        }
        setProductQuantity(range);
    }

    const handleSelection = (val) => {
        setSelection(val);
        setCount(val);
    }

    const handleClick = () => {
        onClickEvent({ product, count: selection });
    }

    const handleCancel = () => {
        onClickCancel();
    }

    return (
        <div className='modal fade' id={`static-backdrop-${product._id}`} data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h1 className='modal-title fs-5' id='staticBackdropLabel'></h1>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    {location.pathname === '/' ?
                        <div className='modal-body d-flex flex-column'>
                            <label htmlFor={`quantity-dropdown-${product._id}`} className='col-form-label'>{title}</label>
                            <div className='input-group w-50'>
                                <select
                                    className='form-select rounded'
                                    id={`quantity-dropdown-${product._id}`}
                                    aria-label='Default select example'
                                    value={selection}
                                    onChange={(e) => handleSelection(e.target.value)}
                                >
                                    {productQuantity && productQuantity.map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                                <span className='input-group-text border-0 bg-white m-0 px-1'>&#xd7;</span>
                                <span className='input-group-text border-0 bg-white m-0 px-1'>&#36;{product.price}</span>
                                <span className='input-group-text border-0 bg-white m-0 px-1'>&#61;</span>
                                <span className='input-group-text border-0 bg-white m-0 px-1'>&#36;{count * product.price}</span>
                            </div>
                        </div>
                        : <div className='modal-body'>{title}</div>}
                    <div className='modal-footer jsutify-content-center'>
                        <button type='button' className='btn btn-filled' data-bs-dismiss='modal' aria-label='Close' onClick={handleCancel}>Cancel</button>
                        <button type='button' className='btn btn-hollow' data-bs-dismiss='modal' disabled={selection == 0} onClick={handleClick}>{btnTitle}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;
