const express = require('express');

const router = express.Router();

const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { createOrUpdateUser, currentUser, checkUser, getUsers, createOrUpdateCategory, getCategories, getCategory, uploadImage, deleteCategory, removeImage, createOrUpdateProduct, getProducts, getProduct, deleteProduct, createOrUpdateCart, getCart, createOrder, getOrders, getUserProducts } = require('../controllers/auth');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/check-user', checkUser);
router.post('/current-user', authCheck, currentUser);
router.get('/get-users', authCheck, adminCheck, getUsers);
router.post('/create-or-update-category', authCheck, adminCheck, createOrUpdateCategory);
router.post('/get-categories', authCheck, adminCheck, getCategories);
router.post('/get-category', authCheck, adminCheck, getCategory);
router.post('/delete-category', authCheck, adminCheck, deleteCategory);
router.post('/uploadimages', authCheck, adminCheck, uploadImage);
router.post('/removeimage', authCheck, adminCheck, removeImage)
router.post('/create-or-update-product', authCheck, adminCheck, createOrUpdateProduct);
router.post('/get-user-products', authCheck, adminCheck, getUserProducts);
router.post('/get-products', getProducts);
router.post('/get-product', authCheck, adminCheck, getProduct)
router.post('/delete-product', authCheck, adminCheck, deleteProduct);
router.post('/create-or-update-cart', authCheck, createOrUpdateCart);
router.post('/get-cart', authCheck, getCart);
router.post('/place-order', authCheck, createOrder);
router.get('/get-orders', authCheck, adminCheck, getOrders);

module.exports = router;
