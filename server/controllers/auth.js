const user = require('../models/user');
const category = require('../models/category');
const product = require('../models/product');
const cloudinary = require('cloudinary');
const cart = require('../models/cart');
const order = require('../models/order');
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.EXPRESS_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.EXPRESS_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.EXPRESS_APP_CLOUDINARY_API_SECRET,
});

exports.createOrUpdateUser = async (req, res) => {
    try {
        const { email } = req.user;
        const { firstName, lastName, dob, gender, contact, address, state, city, pinCode, role } = req.body.userDetails;
        let existingUser = await user.findOneAndUpdate({ email }, { firstName, lastName, dob, gender, contact, address, state, city, pinCode, role }, { new: true });
        if (existingUser) {
            res.status(200).json({ user: existingUser, message: 'Existing User Updated Successfully!' });
        } else {
            let newUser = await new user({ firstName, lastName, dob, gender, email, contact, address, state, city, pinCode, role }).save();
            if (newUser) {
                res.status(200).json({ user: newUser, message: 'New User Registered Successfully!' });
            }
            else {
                res.status(202).json({ message: 'Failed To Register/Update User!' });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.checkUser = async (req, res) => {
    try {
        const { email } = req.body;
        let existingUser = await user.findOne({ email });
        if (existingUser) {
            res.status(200).json({ role: existingUser.role, message: 'Valid User' });
        }
        else {
            res.status(202).json({ message: 'No User Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.currentUser = async (req, res) => {
    try {
        const { email } = req.user;
        let existingUser = await user.findOne({ email });
        if (existingUser) {
            res.status(200).json({ user: existingUser, messgae: 'Current User Details' });
        }
        else {
            res.status(202).json({ message: 'No User Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getUsers = async (req, res) => {
    try {
        let users = await user.find({});
        if (users) {
            res.status(200).json({ users, message: 'Registered Users Details' });
        } else {
            res.status(202).json({ message: 'No User Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.createOrUpdateCategory = async (req, res) => {
    try {
        const { name, slug, description, email, id } = req.body.categoryDetails;
        let existingCreatedUser = await user.findOne({ email });
        if (existingCreatedUser) {
            let existingCategory = existingCreatedUser.categories.find(category => category._id == id);
            if (existingCategory) {
                let updatedCategory = await user.updateOne({ email, 'categories._id': id }, { $set: { 'categories.$.name': name, 'categories.$.description': description, 'categories.$.slug': slug } });
                if (updatedCategory) {
                    let userCategory = await user.findOne({ email });
                    let categories = userCategory && userCategory.categories;
                    res.status(200).json({ categories, message: 'Existing Category Updated Successfully!' });
                } else {
                    res.status(202).json({ message: 'Failed to Update a Category!' });
                }
            }
            else {
                let addCategory = await user.updateOne({ email }, { $push: { categories: { name, description, slug } } }, { new: true });
                if (addCategory) {
                    let userCategory = await user.findOne({ email });
                    let categories = userCategory && userCategory.categories;
                    res.status(200).json({ categories, message: 'New Category Created Successfully!' });
                } else {
                    res.status(202).json({ message: 'Failed to Create a Category!' });
                }
            }
        } else {
            const newCategory = await new user({ categories: { name, description, slug }, email }).save();
            if (newCategory) {
                let categories = newCategory && newCategory.categories;
                res.status(200).json({ categories, message: 'New Category List Created Successfully!' });
            }
            else {
                res.status(202).json({ message: 'Failed to Create/Update a Category!' });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getCategories = async (req, res) => {
    try {
        const { email } = req.body;
        let userCategory = await user.findOne({ email });
        let categories = userCategory && userCategory.categories;

        if (categories) {
            res.status(200).json({ categories, message: 'Registered Categories Details' });
        } else {
            res.status(202).json({ message: 'No Category Found' });
        }
    } catch {
        res.status(400).json(error);
    }
}

exports.getCategory = async (req, res) => {
    try {
        const { slug, email } = req.body;
        let userCategory = await user.findOne({ email });
        let categoryObj = userCategory && userCategory.categories.find(catg => catg.slug === slug);
        if (categoryObj) {
            res.status(200).json({ category: categoryObj, message: 'Category Details' });
        } else {
            res.status(202).json({ message: 'No Category Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userCategory = await user.findOne({ email });
        let updatedCategories = userCategory && userCategory.categories.filter(catg => catg.name !== name);
        const latestCategories = await user.findOneAndUpdate({ email }, { categories: updatedCategories }, { new: true });
        if (latestCategories) {
            let categories = latestCategories && latestCategories.categories;
            res.status(200).json({ categories, message: 'Category Deleted Successfully!' });
        } else {
            res.status(202).json({ message: 'Failed to Delete Category!' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.uploadImage = async (req, res) => {
    try {
        let result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,
            resource_type: 'auto', // jpeg, png
        });
        if (result) {
            res.status(200).json({
                public_id: result.public_id,
                url: result.secure_url,
                message: 'Image Uploaded Successfully!'
            });
        } else {
            res.status(202).json({ message: 'Failed to Upload Image!' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.removeImage = (req, res) => {
    let image_id = req.body.public_id;
    try {
        cloudinary.uploader.destroy(image_id, (err) => {
            const { result } = err;
            if (result === 'ok') {
                res.status(200).json({
                    err,
                    message: 'Image Removed Successfully!'
                });
            } else {
                res.status(202).json({
                    err,
                    message: 'Failed to Remove Image!'
                });
            }
        });
    } catch (error) {
        res.status(400).json(error);
    }
};

const newOrExistingProduct = async (productDetails) => {
    try {
        const { email, title, slug, description, price, category, quantity, images } = productDetails;
        let existingProduct = await product.findOneAndUpdate({ createdBy: email, slug: slug }, { title, slug: title.toLowerCase(), description, price, category, quantity, images }, { new: true });
        if (existingProduct) {
            return { product: existingProduct, message: 'Existing Product Updated Successfully!' };
        } else {
            let newProduct = new product({ title, slug, description, price, category, quantity, images, createdBy: email }).save();
            if (newProduct) {
                return { product: newProduct, message: 'New Product Created Successfully!' };
            } else {
                return { message: 'Failed To Create/Update New Product!' };
            }
        }
    } catch (error) {
        return error;
    }
};

exports.createOrUpdateProduct = async (req, res) => {
    try {
        const { email, title, slug, description, price, category, quantity, images, id } = req.body.productDetails;
        let existingCreatedUser = await user.findOne({ email });
        newOrExistingProduct(req.body.productDetails);
        if (existingCreatedUser) {
            let existingProduct = existingCreatedUser.products.find(product => product._id == id);
            if (existingProduct) {
                let updatedProduct = await user.updateOne({ email, 'products._id': id }, { $set: { 'products.$.title': title, 'products.$.slug': title.toLowerCase(), 'products.$.description': description, 'products.$.price': price, 'products.$.category': category, 'products.$.quantity': quantity, 'products.$.images': images } });
                if (updatedProduct) {
                    let userProd = await user.findOne({ email });
                    let products = userProd && userProd.products;
                    res.status(200).json({ products, message: 'Existing Product Updated Successfully!' });
                } else {
                    res.status(202).json({ message: 'Failed To Update Product!' });
                }
            } else {
                let addProduct = await user.updateOne({ email }, { $push: { products: { title, slug: title.toLowerCase(), description, price, category, quantity, images } } }, { new: true });
                if (addProduct) {
                    let userProd = await user.findOne({ email });
                    let products = userProd && userProd.products;
                    res.status(200).json({ products, message: 'New Product Created Successfully!' });
                } else {
                    res.status(202).json({ message: 'Failed To Create a Product!' });
                }
            }
        } else {
            let newProduct = await new user({ products: { title, slug: title.toLowerCase(), description, price, category, quantity, images }, email }).save();
            if (newProduct) {
                let products = newProduct && newProduct.products;
                res.status(200).json({ products, message: 'New Product Created Successfully!' });
            }
            else {
                res.status(202).json({ message: 'Failed To Register/Update Product!' });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getProducts = async (req, res) => {
    try {
        let products = await product.find({});
        if (products) {
            res.status(200).json({ products, message: 'Registered Products Details' });
        } else {
            res.status(202).json({ message: 'No Products Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getUserProducts = async (req, res) => {
    try {
        const { email } = req.body;
        let userProd = await user.findOne({ email });
        if (userProd && userProd.products.length) {
            res.status(200).json({ products: userProd.products, message: 'Registered Products Details' });
        } else {
            res.status(202).json({ message: 'No Products Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getProduct = async (req, res) => {
    try {
        const { slug, email } = req.body;
        let userProd = await user.findOne({ email });
        let productObj = userProd && userProd.products.find(prod => prod.slug === slug);
        if (productObj) {
            res.status(200).json({ product: productObj, message: 'Product Details' });
        } else {
            res.status(202).json({ message: 'No Product Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { title, email } = req.body;
        let userProd = await user.findOne({ email });
        let updatedProducts = userProd && userProd.products.filter(prod => prod.title !== title);
        let latestProducts = await user.findOneAndUpdate({ email }, { products: updatedProducts }, { new: true });
        if (latestProducts) {
            await product.findOneAndDelete({ createdBy: email, title });
            let products = latestProducts && latestProducts.products;
            res.status(200).json({ products, message: 'Product Deleted Successfully!' });
        } else {
            res.status(202).json({ message: 'Failed to Delete Product!' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.createOrUpdateCart = async (req, res) => {
    try {
        const { products, shipping, cartTotal, cartQuantity, totalAfterDiscount, orderdBy } = req.body.cart;
        let existingCart = await cart.findOneAndUpdate({ orderdBy }, { products, shipping, cartTotal, cartQuantity, totalAfterDiscount, orderdBy }, { new: true });
        if (existingCart) {
            let latestCart = await cart.findOne({ orderdBy });
            res.status(200).json({ cart: latestCart, message: 'Cart Updated Successfully!' });
        } else {
            let newCart = await new cart({ products, shipping, cartTotal, cartQuantity, totalAfterDiscount, orderdBy }).save();
            if (newCart) {
                let latestCart = await cart.findOne({ orderdBy });
                res.status(200).json({ cart: latestCart, message: 'Cart Update Successfuly!' });
            } else {
                res.status(202).json({ message: 'Failed to Update Cart' });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getCart = async (req, res) => {
    try {
        const { orderdBy } = req.body;
        let existingCart = await cart.findOne({ orderdBy });
        if (existingCart) {
            res.status(200).json({ cart: existingCart, message: 'Cart Details' });
        } else {
            res.status(202).json({ message: 'No Cart Found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { products, orderdBy, paymentIntent, shipping, orderTotal } = req.body.orderDetails;
        let newOrder = await new order({ orderdBy, products, paymentIntent, shipping, orderTotal }).save();
        if (newOrder) {
            res.status(200).json({ message: 'Order Placed!' });
        } else {
            res.status(202).json({ message: 'Failed to Place Order' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await order.find({});
        if (orders) {
            res.status(200).json({ orders, message: 'Orders Details' })
        } else {
            res.status(202).json({ message: 'No Order Found' })
        }
    } catch (error) {
        res.status(400).json(error)
    }
}
