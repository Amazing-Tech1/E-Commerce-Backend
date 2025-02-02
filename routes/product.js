const express = require('express')
const router = express.Router()
const { addProduct, updateProduct, getAllProducts, getProduct, removeProduct } = require('../controllers/productsController');
const upload = require('../middleware/multer');
const { adminAuth } = require('../middleware/adminAuth');

router.route('/')
    .get(getAllProducts)
    .post(adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct)
    .delete(adminAuth, removeProduct)

router.route('/:id')
    .get(getProduct)
    .patch(adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), updateProduct)

module.exports = router;