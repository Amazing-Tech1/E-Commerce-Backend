const cloudinary = require('cloudinary').v2;
const Product = require('../models/products')


async function addProduct(req, res) {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body

    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)


    if (!name || !description || !price || !category || !subCategory || !sizes || images.length === 0) return res.status(400).json({ 'Message': 'All credentials are required' })

    try {
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const result = await Product.create({
            name,
            description,
            price: Number(price), category,
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        })

        console.log(name, description, price, category, subCategory, sizes, bestseller)
        console.log(imagesUrl)

        res.status(201).json({ success: true })
    } catch (err) {
        console.log(err)
        res.json({ 'message': err.message })
    }
}
async function updateProduct(req, res) {
    try {

        const product = await Product.findOne({ _id: req.params.id }).exec();

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        let imagesUrl = product.image || [];

        if (req.files) {
            const uploadedImages = [];

            for (const imageField of ['image1', 'image2', 'image3', 'image4']) {
                const imageFile = req.files[imageField] && req.files[imageField][0];
                if (imageFile) {
                    const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
                    uploadedImages.push(result.secure_url);
                }
            }
            if (uploadedImages.length > 0) {
                imagesUrl = uploadedImages;
            }
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = bestseller !== undefined ? bestseller === 'true' : product.bestseller;
        product.image = imagesUrl

        const result = await product.save();

        // Return the updated product
        res.status(201).json({ success: true, result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating product", error: err.message });
    }
}
async function getAllProducts(req, res) {
    const products = await Product.find();
    if (!products) return res.status(204)
    res.status(200).json(products);

}
async function getProduct(req, res) {
    if (!req.params?.id) return res.status(400).json({ "message": 'Product ID required' })
    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) res.json({ "message": "Product does not exist" })
    res.status(201).json({ success: true, product })

}
async function removeProduct(req, res) {
    if (!req?.body?.id) return res.status(400).json({ "message": 'Product ID required' })

    const products = await Product.findOne({ _id: req.body.id }).exec();

    if (!products) return res.status(204).json({ 'message': 'No products found' })
        ;
    const result = await Product.deleteOne({ _id: req.body.id })
    res.status(201).json({ 'message': `Product with ID ${req.body.id} deleted` });

}

module.exports = { addProduct, updateProduct, getAllProducts, getProduct, removeProduct }