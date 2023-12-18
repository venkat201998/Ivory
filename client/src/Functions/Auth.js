import axios from 'axios';

export const createOrUpdateUser = async (userDetails, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/create-or-update-user`,
        {
            userDetails
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const checkUser = async (email) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/check-user`,
        {
            email
        }
    )
}

export const currentUser = async (email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/current-user`,
        {
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getUsers = async (idToken) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/get-users`,
        {
            headers: {
                idToken
            }
        }
    )
}

export const createOrUpdateCategory = async (categoryDetails, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/create-or-update-category`,
        {
            categoryDetails
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getCategories = async (email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/get-categories`,
        {
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getCategory = async (slug, email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/get-category`,
        {
            slug,
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const deleteCategory = async (name, email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/delete-category`,
        {
            name,
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const createOrUpdateProduct = async (productDetails, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/create-or-update-product`,
        {
            productDetails
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getProducts = async () => {
    return await axios.post(
        `${process.env.REACT_APP_API}/get-products`
    )
}

export const getUserProducts = async (email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/get-user-products`,
        {
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getProduct = async (slug, email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/get-product`,
        {
            slug,
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const deleteProduct = async (title, email, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/delete-product`,
        {
            title,
            email
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const createOrUpdateCart = async (cart, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/create-or-update-cart`,
        {
            cart
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getCart = async (orderdBy, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/get-cart`,
        {
            orderdBy
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const createOrder = async (orderDetails, idToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/place-order`,
        {
            orderDetails
        },
        {
            headers: {
                idToken
            }
        }
    )
}

export const getOrders = async (idToken) => {
    return await axios.get(
        `${process.env.REACT_APP_API}/get-orders`,
        {
            headers: {
                idToken
            }
        }
    )
}
